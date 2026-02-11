import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { RankType } from '@changsha/shared';
import { User } from '../users/user.entity';

@Entity('fangyan_rankings')
export class Ranking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'varchar', length: 20 })
  rank_type: RankType;

  @Column({ type: 'int' })
  rank_number: number;

  @Column({ type: 'int' })
  duration: number;

  @Column({ type: 'date', nullable: true })
  period_start: string;

  @Column({ type: 'date', nullable: true })
  period_end: string;
  
  @CreateDateColumn()
  created_at: Date;
}
