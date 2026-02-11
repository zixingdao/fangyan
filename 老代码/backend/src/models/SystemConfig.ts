import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface SystemConfigAttributes {
  id: number;
  key: string;
  value: string;
  description?: string;
  created_at?: Date;
  updated_at?: Date;
}

interface SystemConfigCreationAttributes extends Optional<SystemConfigAttributes, 'id' | 'description' | 'created_at' | 'updated_at'> {}

class SystemConfig extends Model<SystemConfigAttributes, SystemConfigCreationAttributes> implements SystemConfigAttributes {
  public id!: number;
  public key!: string;
  public value!: string;
  public description!: string;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

SystemConfig.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    key: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    value: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(200),
    },
  },
  {
    sequelize,
    tableName: 'fangyan_system_configs',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

export default SystemConfig;
