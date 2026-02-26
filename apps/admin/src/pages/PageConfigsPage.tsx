import { useEffect, useState, useRef } from 'react';
import { api } from '../lib/axios';
import { 
  Save, Loader2, Plus, Trash2, GripVertical, Image, Type, 
  QrCode, Heading, MousePointer2, Minus, ArrowUp, ArrowDown,
  LayoutTemplate, AlertCircle, Crown, Upload
} from 'lucide-react';
import cloudbase from '@cloudbase/js-sdk';

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
  type: 'text' | 'image' | 'qr_code' | 'title' | 'button' | 'divider';
  order: number;
  props: ComponentProps;
}

interface PageConfig {
  id: number;
  pageType: 'join_guardian' | 'join_plan' | 'login';
  title: string;
  components: PageComponent[];
  isActive: boolean;
}

const PAGE_TYPE_LABELS: Record<string, string> = {
  join_guardian: '加入守护',
  join_plan: '加入计划',
  login: '登录页面',
};

const COMPONENT_TYPE_LABELS: Record<string, { label: string; icon: React.ReactNode }> = {
  title: { label: '标题', icon: <Heading className="w-4 h-4" /> },
  text: { label: '文本', icon: <Type className="w-4 h-4" /> },
  image: { label: '图片', icon: <Image className="w-4 h-4" /> },
  qr_code: { label: '二维码', icon: <QrCode className="w-4 h-4" /> },
  button: { label: '按钮', icon: <MousePointer2 className="w-4 h-4" /> },
  divider: { label: '分隔线', icon: <Minus className="w-4 h-4" /> },
};

const DEFAULT_PROPS: Record<string, ComponentProps> = {
  title: { text: '新标题', level: 1, align: 'center' },
  text: { text: '请输入文本内容', align: 'left' },
  image: { imageUrl: '', description: '', width: 300, align: 'center' },
  qr_code: { imageUrl: '', description: '扫描二维码', width: 200, align: 'center' },
  button: { text: '点击按钮', url: '#', variant: 'primary', align: 'center' },
  divider: {},
};

export const PageConfigsPage = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'join_guardian' | 'join_plan' | 'login'>('join_guardian');
  const [configs, setConfigs] = useState<Record<string, PageConfig>>({});
  const [userRole, setUserRole] = useState<string>('');
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [cloudbaseReady, setCloudbaseReady] = useState(false);
  const cloudbaseApp = useRef<any>(null);

  useEffect(() => {
    fetchConfigs();
    // Get user role from localStorage (useAuthStore uses 'admin-auth-storage')
    const authStr = localStorage.getItem('admin-auth-storage');
    if (authStr) {
      try {
        const auth = JSON.parse(authStr);
        if (auth.state && auth.state.user) {
          setUserRole(auth.state.user.role);
        }
      } catch (e) {
        console.error('Failed to parse auth storage:', e);
      }
    }
  }, []);

  const fetchConfigs = async () => {
    try {
      setLoading(true);
      const data: PageConfig[] = await api.get('/page-configs');
      const configMap: Record<string, PageConfig> = {};
      data.forEach(config => {
        configMap[config.pageType] = config;
      });
      setConfigs(configMap);
    } catch (error) {
      console.error(error);
      alert('加载配置失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (userRole !== 'super_admin') {
      alert('只有超级管理员才能保存配置');
      return;
    }

    try {
      setSaving(true);
      const currentConfig = configs[activeTab];
      if (currentConfig) {
        await api.post('/page-configs', {
          pageType: activeTab,
          title: currentConfig.title,
          components: currentConfig.components,
          isActive: currentConfig.isActive,
        });
        alert('保存成功');
      }
    } catch (error) {
      console.error(error);
      alert('保存失败');
    } finally {
      setSaving(false);
    }
  };

  const addComponent = (type: PageComponent['type']) => {
    const currentConfig = configs[activeTab];

    const newComponent: PageComponent = {
      id: `comp-${Date.now()}`,
      type,
      order: currentConfig ? currentConfig.components.length + 1 : 1,
      props: { ...DEFAULT_PROPS[type] },
    };

    if (currentConfig) {
      // 已有配置，添加组件
      setConfigs({
        ...configs,
        [activeTab]: {
          ...currentConfig,
          components: [...currentConfig.components, newComponent],
        },
      });
    } else {
      // 没有配置，创建新配置
      const newConfig: PageConfig = {
        id: 0, // 新配置，id 为 0
        pageType: activeTab,
        title: PAGE_TYPE_LABELS[activeTab],
        components: [newComponent],
        isActive: true,
      };
      setConfigs({
        ...configs,
        [activeTab]: newConfig,
      });
    }
  };

  const removeComponent = (componentId: string) => {
    const currentConfig = configs[activeTab];
    if (!currentConfig) return;

    setConfigs({
      ...configs,
      [activeTab]: {
        ...currentConfig,
        components: currentConfig.components
          .filter(c => c.id !== componentId)
          .map((c, idx) => ({ ...c, order: idx + 1 })),
      },
    });
  };

  const moveComponent = (index: number, direction: 'up' | 'down') => {
    const currentConfig = configs[activeTab];
    if (!currentConfig) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= currentConfig.components.length) return;

    const newComponents = [...currentConfig.components];
    [newComponents[index], newComponents[newIndex]] = [newComponents[newIndex], newComponents[index]];

    setConfigs({
      ...configs,
      [activeTab]: {
        ...currentConfig,
        components: newComponents.map((c, idx) => ({ ...c, order: idx + 1 })),
      },
    });
  };

  const updateComponent = (componentId: string, props: Partial<ComponentProps>) => {
    const currentConfig = configs[activeTab];
    if (!currentConfig) return;

    setConfigs({
      ...configs,
      [activeTab]: {
        ...currentConfig,
        components: currentConfig.components.map(c =>
          c.id === componentId ? { ...c, props: { ...c.props, ...props } } : c
        ),
      },
    });
  };

  const initializeDefaults = async () => {
    if (userRole !== 'super_admin') {
      alert('只有超级管理员才能初始化配置');
      return;
    }

    try {
      await api.post('/page-configs/initialize');
      alert('默认配置初始化成功');
      fetchConfigs();
    } catch (error) {
      console.error(error);
      alert('初始化失败');
    }
  };

  const renderComponentEditor = (component: PageComponent, index: number) => {
    const { type, props, id } = component;

    return (
      <div key={id} className="bg-gray-50 rounded-xl p-4 mb-4 border border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <GripVertical className="w-5 h-5 text-gray-400" />
            <span className="font-medium text-gray-700 flex items-center gap-2">
              {COMPONENT_TYPE_LABELS[type].icon}
              {COMPONENT_TYPE_LABELS[type].label}
            </span>
            <span className="text-sm text-gray-400">#{index + 1}</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => moveComponent(index, 'up')}
              disabled={index === 0}
              className="p-1.5 hover:bg-gray-200 rounded-lg disabled:opacity-30 transition-colors"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
            <button
              onClick={() => moveComponent(index, 'down')}
              disabled={index === (configs[activeTab]?.components.length || 0) - 1}
              className="p-1.5 hover:bg-gray-200 rounded-lg disabled:opacity-30 transition-colors"
            >
              <ArrowDown className="w-4 h-4" />
            </button>
            <button
              onClick={() => removeComponent(id)}
              className="p-1.5 hover:bg-red-100 text-red-500 rounded-lg transition-colors ml-2"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {/* Common align prop for most components */}
          {type !== 'divider' && (
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">对齐方式</label>
              <select
                value={props.align || 'left'}
                onChange={(e) => updateComponent(id, { align: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none"
              >
                <option value="left">左对齐</option>
                <option value="center">居中</option>
                <option value="right">右对齐</option>
              </select>
            </div>
          )}

          {/* Title & Text props */}
          {(type === 'title' || type === 'text' || type === 'button') && (
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                {type === 'button' ? '按钮文字' : '文本内容'}
              </label>
              {type === 'text' ? (
                <textarea
                  value={props.text || ''}
                  onChange={(e) => updateComponent(id, { text: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none"
                />
              ) : (
                <input
                  type="text"
                  value={props.text || ''}
                  onChange={(e) => updateComponent(id, { text: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none"
                />
              )}
            </div>
          )}

          {/* Title level */}
          {type === 'title' && (
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">标题级别</label>
              <select
                value={props.level || 1}
                onChange={(e) => updateComponent(id, { level: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none"
              >
                <option value={1}>H1 - 大标题</option>
                <option value={2}>H2 - 中标题</option>
                <option value={3}>H3 - 小标题</option>
              </select>
            </div>
          )}

          {/* Button variant */}
          {type === 'button' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">按钮样式</label>
                <select
                  value={props.variant || 'primary'}
                  onChange={(e) => updateComponent(id, { variant: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none"
                >
                  <option value="primary">主要按钮</option>
                  <option value="secondary">次要按钮</option>
                  <option value="outline">边框按钮</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">跳转链接</label>
                <input
                  type="text"
                  value={props.url || ''}
                  onChange={(e) => updateComponent(id, { url: e.target.value })}
                  placeholder="https://... 或 #/path"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none"
                />
              </div>
            </>
          )}

          {/* Image & QR Code props */}
          {(type === 'image' || type === 'qr_code') && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  {type === 'qr_code' ? '二维码图片' : '图片'}
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={props.imageUrl || ''}
                    onChange={(e) => updateComponent(id, { imageUrl: e.target.value })}
                    placeholder="图片URL 或上传图片..."
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none"
                    disabled={uploadingId === id}
                  />
                  <label
                    className={`flex items-center gap-1.5 px-3 py-2 bg-red-50 text-red-600 rounded-lg cursor-pointer transition-colors ${
                      uploadingId === id || !isSuperAdmin
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:bg-red-100'
                    }`}
                  >
                    {uploadingId === id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Upload className="w-4 h-4" />
                    )}
                    <span className="text-sm font-medium">
                      {uploadingId === id ? '上传中...' : '上传'}
                    </span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/gif,image/webp"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(id, file);
                        e.target.value = ''; // 清空input，允许重复选择同一文件
                      }}
                      disabled={uploadingId === id || !isSuperAdmin}
                    />
                  </label>
                </div>
                {props.imageUrl && (
                  <div className="mt-2 p-2 bg-gray-50 rounded-lg">
                    <img
                      src={props.imageUrl}
                      alt="预览"
                      className="max-h-32 max-w-full rounded"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">描述文字</label>
                <input
                  type="text"
                  value={props.description || ''}
                  onChange={(e) => updateComponent(id, { description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">宽度 (px)</label>
                <input
                  type="number"
                  value={props.width || 200}
                  onChange={(e) => updateComponent(id, { width: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none"
                />
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-red-600" />
      </div>
    );
  }

  const isSuperAdmin = userRole === 'super_admin';

  // 初始化云开发并匿名登录
  useEffect(() => {
    const initCloudbase = async () => {
      if (!cloudbaseApp.current) {
        cloudbaseApp.current = cloudbase.init({
          env: 'cloud1-8gl0blge9ea5f0ca',
          region: 'ap-shanghai',
        });
        
        try {
          // 匿名登录
          const auth = cloudbaseApp.current.auth();
          await auth.signInAnonymously();
          console.log('云开发匿名登录成功');
          setCloudbaseReady(true);
        } catch (error) {
          console.error('云开发登录失败:', error);
        }
      }
    };
    
    initCloudbase();
  }, []);

  // 处理图片上传 - 前端直传到云存储
  const handleImageUpload = async (componentId: string, file: File) => {
    if (!file) return;

    // 验证文件类型
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('只支持 JPG、PNG、GIF、WEBP 格式的图片');
      return;
    }

    // 验证文件大小 (最大 2MB)
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('图片大小不能超过 2MB');
      return;
    }

    // 检查是否已登录云开发
    if (!cloudbaseReady) {
      alert('云存储服务初始化中，请稍后重试');
      return;
    }

    try {
      setUploadingId(componentId);

      // 生成文件名
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(2, 8);
      const ext = file.name.split('.').pop() || 'png';
      const cloudPath = `page-images/${timestamp}-${randomStr}.${ext}`;

      // 使用云开发 SDK 上传
      await cloudbaseApp.current.uploadFile({
        cloudPath: cloudPath,
        filePath: file,
      });

      // 获取文件访问 URL
      const fileUrl = `https://636c-cloud1-8gl0blge9ea5f0ca-1333174272.tcb.qcloud.la/${cloudPath}`;
      
      updateComponent(componentId, { imageUrl: fileUrl });
      alert('上传成功');
    } catch (error) {
      console.error('上传失败:', error);
      alert('上传失败，请重试');
    } finally {
      setUploadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <LayoutTemplate className="w-7 h-7 text-red-600" />
          页面配置管理
        </h1>
        <div className="flex items-center gap-3">
          {isSuperAdmin ? (
            <span className="text-sm text-purple-600 flex items-center gap-1.5 bg-purple-50 px-4 py-2 rounded-lg border border-purple-100">
              <Crown className="w-4 h-4" />
              尊敬的超级管理员，请开始编辑吧
            </span>
          ) : (
            <span className="text-sm text-orange-600 flex items-center gap-1 bg-orange-50 px-3 py-1.5 rounded-lg">
              <AlertCircle className="w-4 h-4" />
              当前您是普通管理员，无法配置界面
            </span>
          )}
          <button
            onClick={initializeDefaults}
            disabled={!isSuperAdmin}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            重置为默认
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !isSuperAdmin}
            className="px-6 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? <Loader2 className="animate-spin w-4 h-4" /> : <Save className="w-4 h-4" />}
            保存配置
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {(Object.keys(PAGE_TYPE_LABELS) as Array<'join_guardian' | 'join_plan' | 'login'>).map((key) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`px-6 py-3 font-medium transition-colors relative ${
              activeTab === key
                ? 'text-red-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {PAGE_TYPE_LABELS[key]}
            {activeTab === key && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600" />
            )}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Editor */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4">组件编辑</h2>

          {/* Add Component Buttons */}
          <div className="flex flex-wrap gap-2 mb-6">
            {Object.entries(COMPONENT_TYPE_LABELS).map(([type, { label, icon }]) => (
              <button
                key={type}
                onClick={() => addComponent(type as PageComponent['type'])}
                disabled={!isSuperAdmin}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm font-medium disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
                {icon}
                {label}
              </button>
            ))}
          </div>

          {/* Components List */}
          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {configs[activeTab]?.components.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <LayoutTemplate className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>暂无组件，点击上方按钮添加</p>
              </div>
            ) : (
              configs[activeTab]?.components.map((component, index) =>
                renderComponentEditor(component, index)
              )
            )}
          </div>
        </div>

        {/* Preview */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4">实时预览</h2>
          <div className="bg-gray-50 rounded-xl p-6 min-h-[500px]">
            <div className="bg-white rounded-lg shadow-sm p-6 min-h-[400px]">
              {configs[activeTab]?.components.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <p>预览区域</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {configs[activeTab]?.components.map((component) => {
                    const { type, props } = component;
                    const alignClass = props.align === 'center' ? 'text-center' : props.align === 'right' ? 'text-right' : 'text-left';

                    switch (type) {
                      case 'title':
                        const TitleTag = `h${props.level || 1}` as keyof JSX.IntrinsicElements;
                        return (
                          <TitleTag key={component.id} className={`font-bold text-gray-900 ${alignClass}`}>
                            {props.text}
                          </TitleTag>
                        );
                      case 'text':
                        return (
                          <p key={component.id} className={`text-gray-700 whitespace-pre-wrap ${alignClass}`}>
                            {props.text}
                          </p>
                        );
                      case 'image':
                      case 'qr_code':
                        return (
                          <div key={component.id} className={alignClass}>
                            {props.imageUrl ? (
                              <img
                                src={props.imageUrl}
                                alt={props.description || ''}
                                style={{ width: props.width || 200, maxWidth: '100%' }}
                                className="inline-block rounded-lg"
                              />
                            ) : (
                              <div
                                className="inline-flex items-center justify-center bg-gray-200 rounded-lg"
                                style={{ width: props.width || 200, height: props.width || 200 }}
                              >
                                <span className="text-gray-400 text-sm">
                                  {type === 'qr_code' ? '二维码' : '图片'}
                                </span>
                              </div>
                            )}
                            {props.description && (
                              <p className="text-sm text-gray-500 mt-2">{props.description}</p>
                            )}
                          </div>
                        );
                      case 'button':
                        const variantClasses = {
                          primary: 'bg-red-600 text-white hover:bg-red-700',
                          secondary: 'bg-gray-600 text-white hover:bg-gray-700',
                          outline: 'border-2 border-red-600 text-red-600 hover:bg-red-50',
                        };
                        return (
                          <div key={component.id} className={alignClass}>
                            <button
                              className={`px-6 py-2 rounded-lg font-medium transition-colors ${variantClasses[props.variant || 'primary']}`}
                            >
                              {props.text}
                            </button>
                          </div>
                        );
                      case 'divider':
                        return <hr key={component.id} className="border-gray-200" />;
                      default:
                        return null;
                    }
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
