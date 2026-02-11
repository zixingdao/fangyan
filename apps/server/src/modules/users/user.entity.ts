import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { UserRole, UserStatus } from '@changsha/shared';

@Entity('fangyan_users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, unique: true })
  student_id: string;

  @Column({ length: 20, unique: true })
  phone: string;

  @Column({ length: 50 })
  name: string;

  @Column({ length: 255, select: false }) // 默认不查询密码
  password: string;

  @Column({ length: 100, default: '邵阳学院' })
  school: string;

  @Column({ length: 100, nullable: true })
  hometown: string;

  @Column({ type: 'tinyint', default: UserStatus.PENDING })
  status: UserStatus;

  @Column({ type: 'varchar', length: 20, default: UserRole.USER })
  role: UserRole;

  @Column({ type: 'int', default: 0 })
  total_duration: number; // 总录音时长（秒）

  @Column({ type: 'int', default: 0 })
  solo_duration: number; // 单人录音时长（秒）

  @Column({ type: 'int', default: 0 })
  dialogue_duration: number; // 多人对话录音时长（秒）

  @Column({ type: 'int', default: 0 })
  annotation_duration: number; // 标注时长（秒）

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
