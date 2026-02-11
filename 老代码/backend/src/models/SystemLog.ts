import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface SystemLogAttributes {
  id: number;
  level: 'info' | 'warn' | 'error';
  type: 'user' | 'admin' | 'system';
  user_id?: number;
  action: string;
  details?: string;
  ip?: string;
  created_at?: Date;
}

interface SystemLogCreationAttributes extends Optional<SystemLogAttributes, 'id' | 'created_at'> {}

export class SystemLog extends Model<SystemLogAttributes, SystemLogCreationAttributes> implements SystemLogAttributes {
  public id!: number;
  public level!: 'info' | 'warn' | 'error';
  public type!: 'user' | 'admin' | 'system';
  public user_id?: number;
  public action!: string;
  public details?: string;
  public ip?: string;
  public readonly created_at!: Date;
}

SystemLog.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  level: {
    type: DataTypes.STRING(10),
    defaultValue: 'info',
  },
  type: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  action: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  details: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  ip: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
}, {
  sequelize,
  tableName: 'system_logs',
  timestamps: true,
  updatedAt: false,
  createdAt: 'created_at',
});
