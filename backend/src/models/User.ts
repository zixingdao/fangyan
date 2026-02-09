import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface UserAttributes {
  id: number;
  student_id: string;
  phone: string;
  name: string;
  password?: string;
  school: string;
  hometown: string;
  status: number; // 0待审核 1已通过 2已拒绝
  role: string; // 'user' | 'admin'
  total_duration: number;
  created_at?: Date;
  updated_at?: Date;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'status' | 'role' | 'total_duration' | 'created_at' | 'updated_at'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public student_id!: string;
  public phone!: string;
  public name!: string;
  public password!: string;
  public school!: string;
  public hometown!: string;
  public status!: number;
  public role!: string;
  public total_duration!: number;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    student_id: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    school: {
      type: DataTypes.STRING(100),
      defaultValue: '邵阳学院',
    },
    hometown: {
      type: DataTypes.STRING(100),
    },
    status: {
      type: DataTypes.TINYINT,
      defaultValue: 0,
    },
    role: {
      type: DataTypes.STRING(20),
      defaultValue: 'user',
    },
    total_duration: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: 'fangyan_users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

export default User;
