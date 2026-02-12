import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Button } from '@changsha/ui'; // 使用共享组件
import { LoginDto } from '@changsha/shared';
import { useNavigate } from 'react-router-dom';

export const LoginForm: React.FC = () => {
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = React.useState<LoginDto>({
    student_id: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(formData);
      // 登录成功后直接跳转首页，不区分角色
      navigate('/');
    } catch (e) {
      // 错误已由 hook 处理
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label>学号</label>
        <input 
          type="text" 
          value={formData.student_id}
          onChange={e => setFormData({...formData, student_id: e.target.value})}
          className="border p-2 w-full"
        />
      </div>
      <div>
        <label>密码</label>
        <input 
          type="password" 
          value={formData.password}
          onChange={e => setFormData({...formData, password: e.target.value})}
          className="border p-2 w-full"
        />
      </div>
      {error && <div className="text-red-500">{error}</div>}
      <Button type="primary" htmlType="submit" loading={loading}>
        登录
      </Button>
    </form>
  );
};
