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
        role: UserRole.SUPER_ADMIN,
        status: UserStatus.TRIAL_PASSED, // 使用试音通过状态作为激活状态
      });
      await this.usersRepository.save(newAdmin);
      console.log('默认超级管理员账户已创建: 2041105052');
    } else if (admin.role !== UserRole.SUPER_ADMIN) {
        // 如果默认管理员已存在但不是超级管理员，升级它
        admin.role = UserRole.SUPER_ADMIN;
        await this.usersRepository.save(admin);
        console.log('默认管理员账户已升级为超级管理员: 2041105052');
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
    // 由于数据库 Topic 实体结构限制（缺少 angles 字段），且多人对话模式需要复杂的结构
    // 这里暂时直接返回完整的静态指南数据，以保证前端显示正常
    return {
      single: {
        title: "单人录制",
        description: "单人录制主要是为了采集您个人的纯正长沙话发音。我们希望您能用最自然的状态，讲述您的故事或对某个话题的看法。",
        limit: "录制时长上限为 20 小时",
        scenarios: [
          {
            title: "童年记忆中的春节",
            angles: ["时间顺序：从小年、除夕到元宵", "感官体验：鞭炮声、年夜饭香味", "情感变化：期待、开心、不舍"],
            questions: [
              "小时候过年最期待什么？",
              "家里会有哪些特别的习俗？比如团年饭、拜年。",
              "有没有印象最深的某一年春节？",
              "小时候拿了压岁钱一般怎么花？"
            ]
          },
          {
            title: "念念不忘的长沙美食",
            angles: ["色香味形：详细描述外观、香气和口感", "制作过程：选材、烹饪步骤", "独特情结：与某人或某段时光的联系"],
            questions: [
              "您最喜欢的长沙小吃是什么？臭豆腐、糖油粑粑还是别的？",
              "它是什么味道的？在哪里可以吃到最正宗的？",
              "这道美食有没有承载您什么特别的回忆？",
              "您家里做饭有什么拿手好菜？怎么做的？"
            ]
          },
          {
            title: "记忆里的老街巷",
            angles: ["空间方位：街道的走向、店铺分布", "今昔对比：以前的样子 vs 现在的样子", "人文故事：街坊邻居的趣事"],
            questions: [
              "您小时候住在哪里？那里的环境是怎样的？",
              "有没有哪条街道或巷子让您印象深刻？比如坡子街、太平街。",
              "现在那里变成什么样了？您觉得变化大吗？",
              "还记得以前街坊邻居是怎么相处的吗？"
            ]
          },
          {
            title: "长沙的酷暑与严冬",
            angles: ["身体感受：汗流浃背、手脚冰凉", "生活细节：蒲扇、竹床、炭火盆", "季节活动：游泳、吃火锅、堆雪人"],
            questions: [
              "长沙的夏天有多热？您有什么避暑的妙招？",
              "以前没有空调的时候，大家是怎么过夏天的？",
              "长沙的冬天冷不冷？有没有什么取暖的记忆？",
              "您更喜欢长沙的哪个季节？为什么？"
            ]
          },
          {
            title: "周末休闲好去处",
            angles: ["游玩路线：出发、游览、返程", "景点特色：风景、历史、娱乐项目", "个人推荐：必去理由、避坑指南"],
            questions: [
              "如果您有外地朋友来，您会带他们去哪里玩？",
              "您平时周末喜欢去哪里逛？岳麓山、橘子洲还是烈士公园？",
              "您对长沙的夜生活有什么看法？去过解放西路吗？",
              "有没有什么只有本地人才知道的小众景点？"
            ]
          },
          {
            title: "学说长沙话的趣事",
            angles: ["学习经历：跟谁学、怎么学", "语言特色：声调、词汇、句式", "尴尬时刻：闹笑话、被误解"],
            questions: [
              "您的长沙话是跟谁学的？",
              "有没有哪个词或表达是您觉得特别有意思的？",
              "有没有遇到过因为方言造成的误会或笑话？",
              "您觉得现在的年轻人长沙话讲得标准吗？"
            ]
          },
          {
            title: "公共交通变迁史",
            angles: ["工具演变：步行、自行车、公交、地铁", "出行体验：拥挤、便捷、舒适度", "城市发展：交通对生活的影响"],
            questions: [
              "您以前出门主要靠什么交通工具？",
              "还记得以前挤公交车的情景吗？",
              "现在有了地铁，您的生活有什么变化？",
              "您对长沙现在的交通状况满意吗？"
            ]
          },
          {
            title: "那些年追过的星/剧",
            angles: ["节目内容：主持人、嘉宾、经典环节", "观看方式：全家围坐、收音机", "追星心态：模仿、崇拜、讨论"],
            questions: [
              "您看过《越策越开心》吗？最喜欢里面的谁？",
              "有没有特别喜欢的湖南台节目？",
              "您知道哪些是从长沙走出来的明星？",
              "以前大家是怎么看电视、听广播的？"
            ]
          }
        ],
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
        scenarios: [
          {
            title: "两代人的长沙记忆",
            angles: ["时代差异：过去 vs 现在", "价值观碰撞：节约 vs 消费", "情感交流：理解、怀念、感恩"],
            description: "邀请父母或长辈，聊聊他们年轻时的长沙。",
            topics: ["那时的交通状况", "以前的物价水平", "过去流行的娱乐活动", "老照片背后的故事"]
          },
          {
            title: "方言里的家族故事",
            angles: ["家族历史：起源、迁徙、定居", "人物传记：长辈的性格、事迹", "家族传承：规矩、传统、精神"],
            description: "和家人坐在一起，聊聊家族里的趣事或传说。",
            topics: ["家族的迁移史", "长辈们的奋斗故事", "家族里特有的方言称呼", "家训或家规"]
          },
          {
            title: "日常生活闲聊",
            angles: ["信息交换：新闻、八卦、生活小窍门", "情感表达：吐槽、安慰、分享喜悦", "观点讨论：对事物的看法"],
            description: "和朋友或邻居聊聊最近的见闻或生活琐事。",
            topics: ["最近的菜价肉价", "邻里之间的新鲜事", "对某个社会热点的看法", "孩子们的教育问题"]
          },
          {
            title: "周末去哪儿吃",
            angles: ["需求分析：想吃什么、预算多少", "方案比较：这家店 vs 那家店", "决策过程：协商、妥协、拍板"],
            description: "模拟和朋友讨论周末聚餐的地点和吃什么。",
            topics: ["推荐一家好吃的餐馆", "讨论口味偏好(微辣/重辣)", "吐槽某家店不好吃", "决定集合时间和地点"]
          },
          {
            title: "牌桌上的风云",
            angles: ["游戏进程：抓牌、出牌、胡牌", "心理博弈：试探、猜测、虚张声势", "社交互动：闲聊、玩笑、胜负欲"],
            description: "模拟打麻将或打牌时的自然对话。",
            topics: ["打牌的手气", "讨论牌局走势", "闲聊家常", "赢了请客吃饭"]
          },
          {
            title: "菜市场讨价还价",
            angles: ["商品评价：新鲜度、产地、口感", "价格谈判：开价、还价、成交", "人情往来：老顾客、送葱、抹零"],
            description: "模拟在菜市场买菜的场景。",
            topics: ["询问价格", "抱怨菜贵了", "挑选新鲜蔬菜", "要求老板送根葱"]
          },
          {
            title: "问路与指路",
            angles: ["问题描述：目的地、当前位置", "路径规划：左转、右转、直走、标志物", "确认反馈：听懂了吗、谢谢"],
            description: "模拟给外地人指路的场景。",
            topics: ["怎么去五一广场", "坐几路公交车", "地铁在哪里换乘", "附近的标志性建筑"]
          },
          {
            title: "相亲角的对话",
            angles: ["信息核对：年龄、职业、家庭", "择偶标准：外貌、性格、条件", "情感试探：兴趣爱好、未来规划"],
            description: "模拟长辈讨论子女婚恋问题，或者年轻人之间的相亲对话。",
            topics: ["对方的条件如何", "对另一半的要求", "催婚的烦恼", "理想的家庭生活"]
          }
        ],
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
