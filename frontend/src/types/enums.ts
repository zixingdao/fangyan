export const UserStatus = {
  PENDING: 0,
  APPROVED: 1,
  BANNED: 2
} as const;

export type UserStatus = typeof UserStatus[keyof typeof UserStatus];

export const RecordType = {
  SINGLE: 1,
  MULTI: 2
} as const;

export type RecordType = typeof RecordType[keyof typeof RecordType];

export const Role = {
  USER: 'user',
  ADMIN: 'admin'
} as const;

export type Role = typeof Role[keyof typeof Role];
