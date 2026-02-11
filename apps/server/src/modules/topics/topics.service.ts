import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Topic } from './topic.entity';
import { CreateTopicDto, UpdateTopicDto } from '@changsha/shared';

@Injectable()
export class TopicsService implements OnModuleInit {
  constructor(
    @InjectRepository(Topic)
    private topicsRepository: Repository<Topic>,
  ) {}

  async onModuleInit() {
    const count = await this.topicsRepository.count();
    if (count > 0) return;

    // 初始数据种子
    const initialTopics = [
      // 单人话题
      {
        title: "童年记忆中的春节",
        category: "单人录制",
        description: "时间顺序：从小年、除夕到元宵；感官体验：鞭炮声、年夜饭香味",
        content: "1. 小时候过年最期待什么？\n2. 家里会有哪些特别的习俗？\n3. 有没有印象最深的某一年春节？\n4. 小时候拿了压岁钱一般怎么花？",
        difficulty: 1,
      },
      {
        title: "念念不忘的长沙美食",
        category: "单人录制",
        description: "色香味形：详细描述外观、香气和口感；制作过程：选材、烹饪步骤",
        content: "1. 您最喜欢的长沙小吃是什么？\n2. 它是什么味道的？在哪里可以吃到最正宗的？\n3. 这道美食有没有承载您什么特别的回忆？",
        difficulty: 1,
      },
      {
        title: "记忆里的老街巷",
        category: "单人录制",
        description: "空间方位：街道的走向、店铺分布；今昔对比：以前的样子 vs 现在的样子",
        content: "1. 您小时候住在哪里？\n2. 有没有哪条街道或巷子让您印象深刻？\n3. 现在那里变成什么样了？",
        difficulty: 2,
      },
      {
        title: "长沙的酷暑与严冬",
        category: "单人录制",
        description: "身体感受：汗流浃背、手脚冰凉；生活细节：蒲扇、竹床、炭火盆",
        content: "1. 长沙的夏天有多热？您有什么避暑的妙招？\n2. 以前没有空调的时候，大家是怎么过夏天的？\n3. 长沙的冬天冷不冷？",
        difficulty: 1,
      },
      // 多人话题
      {
        title: "两代人的长沙记忆",
        category: "多人对话",
        description: "邀请父母或长辈，聊聊他们年轻时的长沙。关注时代差异和价值观碰撞。",
        content: "话题参考：\n- 那时的交通状况\n- 以前的物价水平\n- 过去流行的娱乐活动\n- 老照片背后的故事",
        difficulty: 2,
      },
      {
        title: "周末去哪儿吃",
        category: "多人对话",
        description: "模拟和朋友讨论周末聚餐的地点和吃什么。包含需求分析和决策过程。",
        content: "话题参考：\n- 推荐一家好吃的餐馆\n- 讨论口味偏好(微辣/重辣)\n- 吐槽某家店不好吃\n- 决定集合时间和地点",
        difficulty: 1,
      },
      {
        title: "牌桌上的风云",
        category: "多人对话",
        description: "模拟打麻将或打牌时的自然对话。包含游戏进程和心理博弈。",
        content: "话题参考：\n- 打牌的手气\n- 讨论牌局走势\n- 闲聊家常\n- 赢了请客吃饭",
        difficulty: 3,
      }
    ];

    for (const t of initialTopics) {
      await this.topicsRepository.save(this.topicsRepository.create(t));
    }
    console.log('Initial topics seeded');
  }

  async import(topics: CreateTopicDto[]) {
    const results = {
      success: 0,
      failed: 0,
    };

    for (const dto of topics) {
      try {
        // Simple deduplication check by title
        const existing = await this.topicsRepository.findOne({ where: { title: dto.title } });
        if (existing) {
          await this.topicsRepository.update(existing.id, dto);
        } else {
          await this.topicsRepository.save(this.topicsRepository.create(dto));
        }
        results.success++;
      } catch (e) {
        console.error(e);
        results.failed++;
      }
    }
    return results;
  }

  async create(createTopicDto: CreateTopicDto): Promise<Topic> {
    const topic = this.topicsRepository.create(createTopicDto);
    return this.topicsRepository.save(topic);
  }

  async findAll(isActive?: boolean): Promise<Topic[]> {
    const where: any = {};
    if (isActive !== undefined) {
      where.is_active = isActive;
    }
    return this.topicsRepository.find({
      where,
      order: { difficulty: 'ASC', created_at: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Topic> {
    const topic = await this.topicsRepository.findOne({ where: { id } });
    if (!topic) {
      throw new NotFoundException(`Topic with ID ${id} not found`);
    }
    return topic;
  }

  async update(id: number, updateTopicDto: UpdateTopicDto): Promise<Topic> {
    await this.topicsRepository.update(id, updateTopicDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.topicsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Topic with ID ${id} not found`);
    }
  }
}
