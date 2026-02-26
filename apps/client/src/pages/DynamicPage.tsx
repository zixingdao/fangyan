import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/axios';
import { ArrowLeft, Loader2, User, Lock } from 'lucide-react';

interface ComponentProps {
  text?: string;
  level?: number;
  align?: 'left' | 'center' | 'right';
  imageUrl?: string;
  description?: string;
  width?: number;
  height?: number;
  url?: string;
  variant?: 'primary' | 'secondary' | 'outline';
}

interface PageComponent {
  id: string;
  type: 'text' | 'image' | 'qr_code' | 'title' | 'button' | 'divider' | 'login_form';
  order: number;
  props: ComponentProps;
}

interface PageConfig {
  id: number;
  pageType: string;
  title: string;
  components: PageComponent[];
  isActive: boolean;
}

interface DynamicPageProps {
  pageType: 'join_guardian' | 'join_plan' | 'login';
}

export const DynamicPage: React.FC<DynamicPageProps> = ({ pageType }) => {
  const navigate = useNavigate();
  const [config, setConfig] = useState<PageConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loginForm, setLoginForm] = useState({ student_id: '', password: '' });
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  useEffect(() => {
    fetchPageConfig();
  }, [pageType]);

  const fetchPageConfig = async () => {
    try {
      setLoading(true);
      setError(null);
      const data: PageConfig = await api.get(`/page-configs/by-type?type=${pageType}`);
      setConfig(data);
    } catch (err) {
      console.error('Failed to fetch page config:', err);
      setError('加载页面配置失败');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleButtonClick = (url?: string) => {
    if (!url) return;

    if (url.startsWith('#')) {
      // Internal route
      navigate(url.substring(1));
    } else if (url.startsWith('http')) {
      // External link
      window.open(url, '_blank');
    } else {
      // Default to internal
      navigate(url);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError(null);

    try {
      const response: any = await api.post('/auth/login', loginForm);
      if (response.code === 200 && response.data) {
        // 保存登录信息到 localStorage
        localStorage.setItem('auth-storage', JSON.stringify({
          state: {
            user: response.data.user,
            token: response.data.access_token,
          },
        }));
        // 登录成功，跳转到首页或个人中心
        navigate('/profile');
      } else {
        setLoginError(response.msg || '登录失败');
      }
    } catch (err: any) {
      setLoginError(err.message || '登录失败，请检查账号密码');
    } finally {
      setLoginLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-red-600" />
      </div>
    );
  }

  if (error || !config || !config.isActive) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
        <div className="container mx-auto px-4 py-8">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            返回
          </button>
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
            <p className="text-gray-500">{error || '页面配置不存在或未启用'}</p>
          </div>
        </div>
      </div>
    );
  }

  const renderComponent = (component: PageComponent) => {
    const { type, props } = component;
    const alignClass = props.align === 'center' 
      ? 'text-center' 
      : props.align === 'right' 
        ? 'text-right' 
        : 'text-left';

    switch (type) {
      case 'title':
        const level = props.level || 1;
        const titleClasses = {
          1: 'text-3xl md:text-4xl font-bold mb-6',
          2: 'text-2xl md:text-3xl font-bold mb-4',
          3: 'text-xl md:text-2xl font-bold mb-3',
        };
        const TitleTag = `h${level}` as keyof JSX.IntrinsicElements;
        return (
          <TitleTag 
            key={component.id} 
            className={`${titleClasses[level as keyof typeof titleClasses]} text-gray-900 ${alignClass}`}
          >
            {props.text}
          </TitleTag>
        );

      case 'text':
        return (
          <p 
            key={component.id} 
            className={`text-gray-700 text-base md:text-lg leading-relaxed whitespace-pre-wrap mb-4 ${alignClass}`}
          >
            {props.text}
          </p>
        );

      case 'image':
      case 'qr_code':
        return (
          <div key={component.id} className={`my-6 ${alignClass}`}>
            {props.imageUrl ? (
              <img
                src={props.imageUrl}
                alt={props.description || ''}
                style={{ 
                  width: props.width || 200, 
                  maxWidth: '100%',
                  height: 'auto'
                }}
                className="inline-block rounded-xl shadow-md"
              />
            ) : (
              <div
                className="inline-flex items-center justify-center bg-gray-100 rounded-xl border-2 border-dashed border-gray-300"
                style={{ width: props.width || 200, height: props.width || 200 }}
              >
                <span className="text-gray-400 text-sm">
                  {type === 'qr_code' ? '二维码' : '图片'}
                </span>
              </div>
            )}
            {props.description && (
              <p className="text-sm text-gray-500 mt-3">{props.description}</p>
            )}
          </div>
        );

      case 'button':
        const variantClasses = {
          primary: 'bg-red-600 text-white hover:bg-red-700 shadow-lg hover:shadow-xl',
          secondary: 'bg-gray-600 text-white hover:bg-gray-700',
          outline: 'border-2 border-red-600 text-red-600 hover:bg-red-50',
        };
        return (
          <div key={component.id} className={`my-6 ${alignClass}`}>
            <button
              onClick={() => handleButtonClick(props.url)}
              className={`px-8 py-3 rounded-full font-medium text-base transition-all transform hover:-translate-y-0.5 ${variantClasses[props.variant || 'primary']}`}
            >
              {props.text}
            </button>
          </div>
        );

      case 'divider':
        return <hr key={component.id} className="my-6 border-gray-200" />;

      case 'login_form':
        return (
          <div key={component.id} className={`my-6 ${alignClass}`}>
            <form onSubmit={handleLogin} className="space-y-4 max-w-sm mx-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">学号</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={loginForm.student_id}
                    onChange={(e) => setLoginForm({ ...loginForm, student_id: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-100 outline-none transition-all"
                    placeholder="请输入学号"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">密码</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-100 outline-none transition-all"
                    placeholder="请输入密码"
                    required
                  />
                </div>
              </div>
              {loginError && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center">
                  {loginError}
                </div>
              )}
              <button
                type="submit"
                disabled={loginLoading}
                className="w-full py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-200 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loginLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                {props.text || '登录'}
              </button>
            </form>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          返回
        </button>

        {/* Page Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-10">
          {config.components.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p>页面内容为空</p>
            </div>
          ) : (
            <div className="space-y-2">
              {config.components.map(renderComponent)}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-400">长沙方言守护计划</p>
        </div>
      </div>
    </div>
  );
};
