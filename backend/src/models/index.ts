import User from './User';
import Recording from './Recording';
import Ranking from './Ranking';
import PasswordResetRequest from './PasswordResetRequest';
import SystemConfig from './SystemConfig';
import Topic from './Topic';
import { SystemLog } from './SystemLog';

// 集中定义模型关联
User.hasMany(Recording, { foreignKey: 'user_id', as: 'recordings' });
Recording.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

User.hasMany(Ranking, { foreignKey: 'user_id', as: 'rankings' });
Ranking.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

User.hasMany(SystemLog, { foreignKey: 'user_id', as: 'logs' });
SystemLog.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

export {
  User,
  Recording,
  Ranking,
  PasswordResetRequest,
  SystemConfig,
  Topic,
  SystemLog
};
