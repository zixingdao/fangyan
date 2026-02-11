import { LoginForm } from '../features/auth/components/LoginForm';
import { Link } from 'react-router-dom';
import { Layout } from '../components/layout';

export const LoginPage = () => {
  return (
    <Layout>
      <div className="flex items-center justify-center py-12">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <h1 className="text-2xl font-bold mb-6 text-center text-gray-900">用户登录</h1>
          <LoginForm />
          <div className="mt-4 text-center">
            <span className="text-gray-600 text-sm">还没有账号？</span>
            <Link to="/register" className="text-primary hover:underline ml-2 text-sm font-medium">
              去注册
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};
