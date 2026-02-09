-- 长沙方言采集平台数据库初始化脚本
-- 创建数据库
CREATE DATABASE IF NOT EXISTS changsha_dialect DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE changsha_dialect;

-- 用户表 (fangyan_users)
CREATE TABLE IF NOT EXISTS fangyan_users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  student_id VARCHAR(50) UNIQUE NOT NULL COMMENT '学号（登录账号）',
  phone VARCHAR(20) UNIQUE NOT NULL COMMENT '手机号',
  name VARCHAR(50) NOT NULL COMMENT '姓名',
  password VARCHAR(255) NOT NULL COMMENT '密码',
  school VARCHAR(100) DEFAULT '邵阳学院' COMMENT '学校',
  hometown VARCHAR(100) COMMENT '籍贯（长沙）',
  status TINYINT DEFAULT 0 COMMENT '状态：0待审核 1已通过 2已拒绝',
  total_duration INT DEFAULT 0 COMMENT '总录制时长（分钟）',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

-- 录制记录表 (fangyan_recordings)
CREATE TABLE IF NOT EXISTS fangyan_recordings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL COMMENT '用户ID',
  duration INT NOT NULL COMMENT '时长（分钟）',
  file_url VARCHAR(500) COMMENT '文件地址',
  record_type TINYINT COMMENT '类型：1单人 2多人',
  upload_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status TINYINT DEFAULT 0 COMMENT '状态：0待标注 1标注中 2已标注 3审核通过 4审核拒绝',
  annotation_url VARCHAR(500) COMMENT '标注平台链接',
  annotation_time TIMESTAMP NULL COMMENT '标注完成时间',
  remark VARCHAR(500) COMMENT '备注',
  FOREIGN KEY (user_id) REFERENCES fangyan_users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='录制记录表';

-- 榜单记录表 (fangyan_rankings)
CREATE TABLE IF NOT EXISTS fangyan_rankings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  rank_type VARCHAR(20) COMMENT '榜单类型：day/week/month/total',
  rank_number INT COMMENT '排名',
  duration INT COMMENT '统计时长',
  period_start DATE COMMENT '统计周期开始',
  period_end DATE COMMENT '统计周期结束',
  FOREIGN KEY (user_id) REFERENCES fangyan_users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='榜单记录表';

-- 密码修改申请表 (fangyan_password_reset_requests)
CREATE TABLE IF NOT EXISTS fangyan_password_reset_requests (
  id INT PRIMARY KEY AUTO_INCREMENT,
  student_id VARCHAR(50) NOT NULL COMMENT '学号',
  phone VARCHAR(20) NOT NULL COMMENT '手机号',
  reason VARCHAR(500) COMMENT '申请理由',
  status TINYINT DEFAULT 0 COMMENT '状态：0待审核 1已通过 2已拒绝',
  admin_id INT COMMENT '审核管理员ID',
  admin_remark VARCHAR(500) COMMENT '管理员备注',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='密码修改申请表';
