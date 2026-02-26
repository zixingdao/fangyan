import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PageConfig, PageType } from './page-config.entity';
import { CreatePageConfigDto, UpdatePageConfigDto } from './dto/page-config.dto';

@Injectable()
export class PageConfigsService {
  constructor(
    @InjectRepository(PageConfig)
    private pageConfigRepository: Repository<PageConfig>,
  ) {}

  async findAll(): Promise<PageConfig[]> {
    return this.pageConfigRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findByPageType(pageType: PageType): Promise<PageConfig | null> {
    return this.pageConfigRepository.findOne({
      where: { pageType, isActive: true },
    });
  }

  async findOne(id: number): Promise<PageConfig> {
    const config = await this.pageConfigRepository.findOne({
      where: { id },
    });
    if (!config) {
      throw new NotFoundException(`Page config with id ${id} not found`);
    }
    return config;
  }

  async create(dto: CreatePageConfigDto): Promise<PageConfig> {
    // Check if config for this pageType already exists
    const existing = await this.pageConfigRepository.findOne({
      where: { pageType: dto.pageType },
    });

    if (existing) {
      // Update existing
      existing.title = dto.title;
      existing.setComponents(dto.components);
      if (dto.isActive !== undefined) {
        existing.isActive = dto.isActive;
      }
      return this.pageConfigRepository.save(existing);
    }

    // Create new
    const config = new PageConfig();
    config.pageType = dto.pageType;
    config.title = dto.title;
    config.setComponents(dto.components);
    config.isActive = dto.isActive ?? true;

    return this.pageConfigRepository.save(config);
  }

  async update(id: number, dto: UpdatePageConfigDto): Promise<PageConfig> {
    const config = await this.findOne(id);

    if (dto.title !== undefined) {
      config.title = dto.title;
    }
    if (dto.components !== undefined) {
      config.setComponents(dto.components);
    }
    if (dto.isActive !== undefined) {
      config.isActive = dto.isActive;
    }

    return this.pageConfigRepository.save(config);
  }

  async remove(id: number): Promise<void> {
    const config = await this.findOne(id);
    await this.pageConfigRepository.remove(config);
  }

  // Initialize default configs for all page types
  async initializeDefaults(): Promise<void> {
    const defaultConfigs = [
      {
        pageType: PageType.JOIN_GUARDIAN,
        title: '加入守护',
        components: [
          {
            id: 'default-1',
            type: 'title',
            order: 1,
            props: { text: '欢迎加入长沙方言守护计划', level: 1, align: 'center' },
          },
          {
            id: 'default-2',
            type: 'text',
            order: 2,
            props: { text: '请扫描二维码关注公众号，了解更多详情', align: 'center' },
          },
          {
            id: 'default-3',
            type: 'qr_code',
            order: 3,
            props: { 
              imageUrl: '',
              description: '扫码关注公众号',
              width: 200,
              align: 'center'
            },
          },
        ],
      },
      {
        pageType: PageType.JOIN_PLAN,
        title: '加入计划',
        components: [
          {
            id: 'default-1',
            type: 'title',
            order: 1,
            props: { text: '加入长沙方言守护计划', level: 1, align: 'center' },
          },
          {
            id: 'default-2',
            type: 'text',
            order: 2,
            props: { text: '请扫描二维码加入我们的微信群', align: 'center' },
          },
          {
            id: 'default-3',
            type: 'qr_code',
            order: 3,
            props: { 
              imageUrl: '',
              description: '扫码加入群聊',
              width: 200,
              align: 'center'
            },
          },
        ],
      },
      {
        pageType: PageType.LOGIN,
        title: '登录',
        components: [
          {
            id: 'default-1',
            type: 'title',
            order: 1,
            props: { text: '用户登录', level: 1, align: 'center' },
          },
          {
            id: 'default-2',
            type: 'text',
            order: 2,
            props: { text: '请使用学号和密码登录系统', align: 'center' },
          },
        ],
      },
    ];

    for (const config of defaultConfigs) {
      const existing = await this.pageConfigRepository.findOne({
        where: { pageType: config.pageType },
      });

      if (!existing) {
        const newConfig = new PageConfig();
        newConfig.pageType = config.pageType;
        newConfig.title = config.title;
        newConfig.setComponents(config.components as any);
        newConfig.isActive = true;
        await this.pageConfigRepository.save(newConfig);
      }
    }
  }
}
