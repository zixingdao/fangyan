import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SystemConfig } from './system-config.entity';
import { User } from '../users/user.entity';
import { Recording } from '../recordings/recording.entity';
import { Topic } from '../topics/topic.entity';
import { LogsService } from '../logs/logs.service';
import { LogType, LogLevel, UserRole, UserStatus } from '@changsha/shared';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class SystemService implements OnModuleInit {
  constructor(
    @InjectRepository(SystemConfig)
    private configRepository: Repository<SystemConfig>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Recording)
    private recordingsRepository: Repository<Recording>,
    @InjectRepository(Topic)
    private topicsRepository: Repository<Topic>,
    private logsService: LogsService,
  ) {}

  async onModuleInit() {
    // guideData 仅作为初始化参考，实际数据将从 topics 表读取
    const guideData = {
      // ... (保留结构用于参考或 fallback)
    };

    // 初始化默认配置
    const defaults = [
      // { key: 'guide_content', value: JSON.stringify(guideData) }, // 不再强制依赖此配置
      { key: 'announcement', value: '欢迎来到长沙方言守护计划！' },
      { key: 'hourly_rate_min', value: '80' },
      { key: 'hourly_rate_max', value: '120' },
    ];

    for (const item of defaults) {
      let config = await this.configRepository.findOne({ where: { key: item.key } });
      if (!config) {
        await this.configRepository.save(item);
      }
    }

    // 初始化默认管理员
    const adminStudentId = '2041105052';
    const admin = await this.usersRepository.findOne({ where: { student_id: adminStudentId } });
    
    if (!admin) {
      const hashedPassword = await bcrypt.hash('xianglong1', 10);
      const newAdmin = this.usersRepository.create({
        student_id: adminStudentId,
        password: hashedPassword,
        name: '超级管理员',
        phone: '19999999999', // 占位手机号
        school: '邵阳学院',
        role: UserRole.ADMIN,
        status: UserStatus.TRIAL_PASSED, // 使用试音通过状态作为激活状态
      });
      await this.usersRepository.save(newAdmin);
      console.log('默认管理员账户已创建: 2041105052');
    }
  }

  async getPublicStats() {
    const totalUsers = await this.usersRepository.count();
    
    const { sum } = await this.usersRepository
      .createQueryBuilder('user')
      .select('SUM(user.total_duration)', 'sum')
      .getRawOne();
      
    const totalDuration = Number(sum || 0); // in seconds
    const totalDurationHours = Math.round(totalDuration / 3600);
    
    // 分别获取最小和最大奖励金配置
    const [
      minRateStr, maxRateStr,
      dr1, dr23, dr410,
      qr1, qr23, qr410
    ] = await Promise.all([
      this.getValue('hourly_rate_min'),
      this.getValue('hourly_rate_max'),
      this.getValue('duration_rank_1'),
      this.getValue('duration_rank_2_3'),
      this.getValue('duration_rank_4_10'),
      this.getValue('quality_rank_1'),
      this.getValue('quality_rank_2_3'),
      this.getValue('quality_rank_4_10'),
    ]);

    const minRate = Number(minRateStr) || 80;
    const maxRate = Number(maxRateStr) || 120;
    
    // 计算奖励金范围
    const minRewards = totalDurationHours * minRate;
    const maxRewards = totalDurationHours * maxRate;
    const totalRewards = `${minRewards}-${maxRewards}`; // 返回范围字符串

    // 构造显示范围
    const rewardRateRange = `${minRate}-${maxRate}`;

    // 榜单奖金配置
    const rankingRewards = {
      duration: {
        rank1: Number(dr1) || 2000,
        rank23: Number(dr23) || 500,
        rank410: Number(dr410) || 200,
      },
      quality: {
        rank1: Number(qr1) || 2000,
        rank23: Number(qr23) || 600,
        rank410: Number(qr410) || 300,
      }
    };

    return {
      totalUsers,
      totalDurationHours,
      totalRewards,
      rewardRateRange, // 返回给前端展示
      rankingRewards, // 新增：返回动态榜单奖金
    };
  }

  async getValue(key: string): Promise<string | null> {
    const config = await this.configRepository.findOne({ where: { key } });
    return config ? config.value : null;
  }

  async getGuideContent() {
    // 从数据库获取动态话题
    const topics = await this.topicsRepository.find({ where: { is_active: true } });

    // 过滤单人/多人话题
    const singleTopics = topics.filter(t => t.category === '单人录制');
    const multiTopics = topics.filter(t => t.category === '多人对话');

    // 映射为前端需要的结构
    const singleScenarios = singleTopics.map(t => ({
      title: t.title,
      // 尝试解析 description 中的 angles，如果只是普通文本则作为单项
      angles: t.description ? t.description.split(/[；;]/).map(s => s.trim()).filter(Boolean) : [],
      questions: t.content ? t.content.split('\n').map(s => s.trim()).filter(Boolean) : []
    }));

    const multiScenarios = multiTopics.map(t => ({
      title: t.title,
      angles: [], // 多人话题暂不强调 angles 结构
      description: t.description,
      topics: t.content ? t.content.split('\n').map(s => s.trim()).filter(Boolean) : []
    }));

    // 静态配置部分 (Title, Desc, Tips) 暂时保持硬编码，
    // 如果需要也可以存入 system_configs
    return {
      single: {
        title: "单人录制",
        description: "单人录制主要是为了采集您个人的纯正长沙话发音。我们希望您能用最自然的状态，讲述您的故事或对某个话题的看法。",
        limit: "录制时长上限为 20 小时",
        scenarios: singleScenarios,
        tips: [
          "找一个安静的环境，避免背景噪音",
          "保持麦克风距离嘴部 10-20 厘米",
          "语速适中，发音清晰",
          "可以先在心里打个腹稿，再开始录制",
          "尽量使用地道的长沙话词汇和表达",
          "遇到不会说的词，可以用普通话代替或跳过"
        ]
      },
      multi: {
        title: "多人对话",
        description: "多人对话旨在采集自然交流场景下的方言数据。您可以邀请家人或朋友一起，进行轻松愉快的交谈。",
        limit: "录制时长上限为 100 小时",
        scenarios: multiScenarios,
        tips: [
          "对话过程要自然，不要照本宣科",
          "尽量避免多人同时说话，造成声音重叠",
          "录制时长建议在 5-15 分钟之间",
          "可以使用家乡话聊家常、讲故事",
          "放松心情，就像平时聊天一样",
          "可以适当加入一些语气词，增加真实感"
        ]
      }
    };
  }

  async update(key: string, value: string, userId?: number) {
    let config = await this.configRepository.findOne({ where: { key } });
    if (!config) {
      config = this.configRepository.create({ key, value });
    } else {
      config.value = value;
    }
    
    const savedConfig = await this.configRepository.save(config);

    // 记录配置修改日志
    await this.logsService.create(
      userId || null,
      '修改系统配置',
      LogType.SYSTEM,
      LogLevel.WARN,
      JSON.stringify({ key, value })
    );

    return savedConfig;
  }

  async findAll() {
    return this.configRepository.find();
  }

  async runBenchmark(duration: number, concurrency: number) {
    // 使用 node-fetch 真实发起请求来产生负载
    // 这样 RequestCounterMiddleware 就能捕获到流量了
    const port = process.env.PORT || 80;
    const baseUrl = `http://localhost:${port}`;
    const targetUrl = `${baseUrl}/api/system/stats`;
    
    const startTime = Date.now();
    let requestsCompleted = 0;
    let requestsFailed = 0;
    const latencies: number[] = [];
    
    // 模拟不同用户的行为模式
    const worker = async () => {
        while (Date.now() - startTime < duration * 1000) {
            const reqStart = Date.now();
            try {
                // 引入随机行为模型
                const rand = Math.random();
                
                if (rand < 0.7) { 
                    // 70% 概率：游客浏览 (轻量，高频)
                    const res = await fetch(`${baseUrl}/api/system/stats`);
                    if (!res.ok) throw new Error('Stats API failed');
                } else if (rand < 0.9) { 
                    // 20% 概率：查看指引 (中等)
                    const res = await fetch(`${baseUrl}/api/system/guide`);
                    if (!res.ok) throw new Error('Guide API failed');
                } else { 
                    // 10% 概率：尝试登录 (重负载，CPU 密集)
                    const res = await fetch(`${baseUrl}/api/auth/login`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ phone: '13800000000', password: 'wrong_password' })
                    });
                    if (res.status !== 401 && !res.ok) throw new Error('Login API failed');
                }

                const reqEnd = Date.now();
                latencies.push(reqEnd - reqStart);
                requestsCompleted++;
                
                // 模拟真实用户的思考时间 (50ms - 200ms)
                // 这能防止单个 Worker 过于疯狂地抢占 CPU，让并发调度更平滑
                await new Promise(r => setTimeout(r, Math.random() * 150 + 50));
                
            } catch (e) {
                requestsFailed++;
                // 出错后也稍微停顿一下
                await new Promise(r => setTimeout(r, 100));
            }
        }
    };

    // 启动并发 workers
    const workers = Array(concurrency).fill(null).map(() => worker());
    await Promise.all(workers);

    // 计算真实延迟统计
    latencies.sort((a, b) => a - b);
    const getPercentile = (p: number) => {
        if (latencies.length === 0) return 0;
        const index = Math.floor(latencies.length * (p / 100));
        return latencies[index];
    };

    return {
      scenariosLaunched: concurrency,
      scenariosCompleted: concurrency,
      requestsCompleted: requestsCompleted,
      requestsFailed: requestsFailed,
      rps: {
        mean: Math.round((requestsCompleted + requestsFailed) / duration),
      },
      latency: {
        min: latencies.length > 0 ? latencies[0] : 0,
        max: latencies.length > 0 ? latencies[latencies.length - 1] : 0,
        median: getPercentile(50),
        p95: getPercentile(95),
        p99: getPercentile(99),
      },
      statusCodes: {
        200: requestsCompleted,
        500: requestsFailed, // 简单归类为 500
      }
    };
  }
}
