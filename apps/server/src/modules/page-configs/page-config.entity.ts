import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum PageType {
  JOIN_GUARDIAN = 'join_guardian',  // 加入守护
  JOIN_PLAN = 'join_plan',          // 加入计划
  LOGIN = 'login',                  // 登录
}

export enum ComponentType {
  TEXT = 'text',           // 文本
  IMAGE = 'image',         // 图片
  QR_CODE = 'qr_code',     // 二维码
  TITLE = 'title',         // 标题
  BUTTON = 'button',       // 按钮
  DIVIDER = 'divider',     // 分隔线
  LOGIN_FORM = 'login_form', // 登录表单
}

export interface PageComponent {
  id: string;                    // 组件唯一ID
  type: ComponentType;           // 组件类型
  order: number;                 // 排序
  props: Record<string, any>;    // 组件属性
}

@Entity('fangyan_page_configs')
export class PageConfig {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 50,
    unique: true,
  })
  pageType: PageType;

  @Column({ type: 'varchar', length: 100 })
  title: string;

  @Column({ type: 'longtext' })
  components: string;  // JSON string of PageComponent[]

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Helper method to get parsed components
  getComponents(): PageComponent[] {
    try {
      return JSON.parse(this.components) || [];
    } catch {
      return [];
    }
  }

  // Helper method to set components
  setComponents(components: PageComponent[]) {
    this.components = JSON.stringify(components);
  }
}
