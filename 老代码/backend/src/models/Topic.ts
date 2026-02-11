import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface TopicAttributes {
  id: number;
  title: string;
  content: string;
  type: number; // 1: 单人话题, 2: 多人对话场景
  created_at?: Date;
  updated_at?: Date;
}

interface TopicCreationAttributes extends Optional<TopicAttributes, 'id' | 'created_at' | 'updated_at'> {}

class Topic extends Model<TopicAttributes, TopicCreationAttributes> implements TopicAttributes {
  public id!: number;
  public title!: string;
  public content!: string;
  public type!: number;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Topic.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    type: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1,
      comment: '1: Single, 2: Multi',
    },
  },
  {
    sequelize,
    tableName: 'fangyan_topics',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

export default Topic;
