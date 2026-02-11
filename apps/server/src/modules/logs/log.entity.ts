import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { LogLevel, LogType } from '@changsha/shared';

@Entity('fangyan_logs')
export class Log {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 10,
    default: LogLevel.INFO,
  })
  level: LogLevel;

  @Column({
    type: 'varchar',
    length: 20,
  })
  type: LogType;

  @Column({ nullable: true })
  user_id: number;

  @Column()
  action: string;

  @Column({ type: 'text', nullable: true })
  details: string;

  @Column({ nullable: true })
  ip: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;
}
