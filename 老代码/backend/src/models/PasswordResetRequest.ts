import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import User from './User';

interface PasswordResetRequestAttributes {
  id: number;
  student_id: string;
  phone: string;
  reason: string;
  status: number; // 0待审核 1已通过 2已拒绝
  admin_id?: number;
  admin_remark?: string;
  created_at?: Date;
  updated_at?: Date;
}

interface PasswordResetRequestCreationAttributes extends Optional<PasswordResetRequestAttributes, 'id' | 'status' | 'admin_id' | 'admin_remark' | 'created_at' | 'updated_at'> {}

class PasswordResetRequest extends Model<PasswordResetRequestAttributes, PasswordResetRequestCreationAttributes> implements PasswordResetRequestAttributes {
  public id!: number;
  public student_id!: string;
  public phone!: string;
  public reason!: string;
  public status!: number;
  public admin_id!: number;
  public admin_remark!: string;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

PasswordResetRequest.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    student_id: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    reason: {
      type: DataTypes.STRING(500),
    },
    status: {
      type: DataTypes.TINYINT,
      defaultValue: 0,
    },
    admin_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    admin_remark: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'fangyan_password_reset_requests',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

export default PasswordResetRequest;
