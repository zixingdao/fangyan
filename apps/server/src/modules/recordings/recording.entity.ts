import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { RecordType, RecordStatus } from '@changsha/shared';
import { User } from '../users/user.entity';

@Entity('fangyan_recordings')
export class Recording {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'int' })
  duration: number; // 毫秒或秒，统一为秒

  @Column({ length: 255 })
  file_url: string;

  @Column({ type: 'varchar', length: 20 })
  record_type: RecordType;

  @Column({ type: 'tinyint', default: RecordStatus.PENDING_ANNOTATION })
  status: RecordStatus;

  @Column({ length: 255, nullable: true })
  annotation_url: string;

  @Column({ type: 'datetime', nullable: true })
  annotation_time: Date;

  @Column({ type: 'text', nullable: true })
  remark: string;

  @CreateDateColumn()
  upload_time: Date;
}
