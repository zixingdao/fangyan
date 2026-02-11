import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
// import { UserSchema, RegisterDto } from '@changsha/shared'; // Temporarily disabled due to build issues
import { z } from 'zod';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { RegisterDto } from '@changsha/shared';

// Temporary local schema definition to bypass build error
const LocalRegisterSchema = z.object({
  student_id: z.string().min(1, "学号不能为空").max(50),
  phone: z.string().min(11, "手机号格式不正确").max(20),
  name: z.string().min(1, "姓名不能为空").max(50),
  password: z.string().min(6, "密码至少6位").max(255),
  school: z.string().default('邵阳学院'),
  hometown: z.string().optional(),
});

export const RegisterForm = () => {
  const { register: registerUser, loading: isLoading, error } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterDto>({
    resolver: zodResolver(LocalRegisterSchema) as any, // Temporary fix for type mismatch
    defaultValues: {
      school: '邵阳学院',
    }
  });

  const onSubmit = async (data: RegisterDto) => {
    try {
      await registerUser(data);
      navigate('/');
    } catch (err) {
      // Error is handled by the hook/store
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-100 rounded">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          学号
        </label>
        <input
          {...register('student_id')}
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="请输入学号"
        />
        {errors.student_id && (
          <p className="mt-1 text-xs text-red-500">{errors.student_id.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          姓名
        </label>
        <input
          {...register('name')}
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="请输入真实姓名"
        />
        {errors.name && (
          <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          手机号
        </label>
        <input
          {...register('phone')}
          type="tel"
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="请输入手机号"
        />
        {errors.phone && (
          <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          密码
        </label>
        <input
          {...register('password')}
          type="password"
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="设置登录密码（至少6位）"
        />
        {errors.password && (
          <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          籍贯
        </label>
        <input
          {...register('hometown')}
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="例如：长沙市岳麓区"
        />
        {errors.hometown && (
          <p className="mt-1 text-xs text-red-500">{errors.hometown.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          学校
        </label>
        <input
          {...register('school')}
          type="text"
          disabled
          className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100 text-gray-500 cursor-not-allowed"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded shadow transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? '注册中...' : '立即注册'}
      </button>
    </form>
  );
};
