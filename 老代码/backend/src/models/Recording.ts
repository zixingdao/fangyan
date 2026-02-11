import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import User from './User';

interface RecordingAttributes {
  id: number;
  user_id: number;
  duration: number; // 分钟
  file_url: string;
  record_type: number; // 1单人 2多人
  status: number; // 0待标注 1标注中 2已标注 3审核通过 4审核拒绝
  annotation_url?: string;
  annotation_time?: Date;
  remark?: string;
  createdAt?: Date; // 对应数据库 upload_time
}

interface RecordingCreationAttributes extends Optional<RecordingAttributes, 'id' | 'status' | 'annotation_url' | 'annotation_time' | 'remark' | 'createdAt'> {}

class Recording extends Model<RecordingAttributes, RecordingCreationAttributes> implements RecordingAttributes {
  public id!: number;
  public user_id!: number;
  public duration!: number;
  public file_url!: string;
  public record_type!: number;
  public status!: number;
  public annotation_url!: string;
  public annotation_time!: Date;
  public remark!: string;
  public readonly createdAt!: Date;
}

Recording.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id'
      }
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    file_url: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    record_type: {
      type: DataTypes.TINYINT,
    },
    status: {
      type: DataTypes.TINYINT,
      defaultValue: 0,
    },
    annotation_url: {
      type: DataTypes.STRING(500),
    },
    annotation_time: {
      type: DataTypes.DATE,
    },
    remark: {
      type: DataTypes.STRING(500),
    },
  },
  {
    sequelize,
    tableName: 'fangyan_recordings',
    timestamps: true,
    createdAt: 'upload_time', // 映射数据库字段
    updatedAt: false,
  }
);

export default Recording;
