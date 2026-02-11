export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin',
}

export enum UserStatus {
  PENDING = 0, // 待审核
  REJECTED = 2, // 封禁账号 (原已拒绝，现明确为封禁)
  TRIAL_PASSED = 3, // 试音通过
  RECORDING_SUCCESS = 4, // 录音成功
  ANNOTATION_SUCCESS = 5, // 标注成功
}

export enum RecordType {
  SOLO = 1,
  DIALOGUE = 2,
}

export enum RecordStatus {
  PENDING_ANNOTATION = 0,
  ANNOTATING = 1,
  ANNOTATED = 2,
  APPROVED = 3,
  REJECTED = 4,
}

export enum RankType {
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
  TOTAL = 'total',
}

export enum LogLevel {
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

export enum LogType {
  USER = 'user',
  ADMIN = 'admin',
  SYSTEM = 'system',
  USER_ACTION = 'user_action',
}
