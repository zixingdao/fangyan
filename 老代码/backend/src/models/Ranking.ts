import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import User from './User';

interface RankingAttributes {
  id: number;
  user_id: number;
  rank_type: string; // 'day' | 'week' | 'month' | 'total'
  rank_number: number;
  duration: number;
  period_start?: Date;
  period_end?: Date;
}

interface RankingCreationAttributes extends Optional<RankingAttributes, 'id' | 'period_start' | 'period_end'> {}

class Ranking extends Model<RankingAttributes, RankingCreationAttributes> implements RankingAttributes {
  public id!: number;
  public user_id!: number;
  public rank_type!: string;
  public rank_number!: number;
  public duration!: number;
  public period_start!: Date;
  public period_end!: Date;
}

Ranking.init(
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
        key: 'id',
      },
    },
    rank_type: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    rank_number: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    period_start: {
      type: DataTypes.DATEONLY,
    },
    period_end: {
      type: DataTypes.DATEONLY,
    },
  },
  {
    sequelize,
    tableName: 'fangyan_rankings',
    timestamps: false, // 榜单表不需要 created_at/updated_at，通常是定时任务生成
  }
);

export default Ranking;
