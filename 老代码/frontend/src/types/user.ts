export interface User {
  id: number;
  student_id: string;
  name: string;
  phone?: string;
  school?: string;
  hometown?: string;
  role: string;
  status?: number;
  total_duration?: number;
  created_at?: string;
  updated_at?: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: User;
}

export interface RegisterForm {
  student_id: string;
  phone: string;
  name: string;
  password: string;
  school?: string;
  hometown?: string;
}

export interface LoginForm {
  student_id: string;
  password: string;
}

export interface PasswordResetForm {
  student_id: string;
  phone: string;
  reason: string;
}

export interface ProfileUpdateForm {
  name?: string;
  phone?: string;
  email?: string;
  avatar?: string;
  // 其他可能更新的字段
}
