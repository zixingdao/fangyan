import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('fangyan_system_configs')
export class SystemConfig {
  @PrimaryColumn()
  key: string;

  @Column({ type: 'text' })
  value: string;

  @Column({ nullable: true })
  description: string;
}
