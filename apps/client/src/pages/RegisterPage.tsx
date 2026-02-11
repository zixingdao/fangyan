import { RegisterForm } from '../features/auth/components/RegisterForm';
import { Link } from 'react-router-dom';
import { Layout } from '../components/layout';

export const RegisterPage = () => {
  return (
    <Layout>
      <div className="flex items-center justify-center py-12">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              注册账号
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              欢迎加入长沙方言守护计划
            </p>
          </div>
          
          <RegisterForm />

          <div className="text-center mt-4">
            <span className="text-gray-600 text-sm">已有账号？</span>
            <Link to="/login" className="font-medium text-primary hover:text-primary-dark text-sm ml-2">
              直接登录
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};
