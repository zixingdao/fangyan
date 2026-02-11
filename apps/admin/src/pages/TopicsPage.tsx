import { useEffect, useState, useRef } from 'react';
import { api } from '../lib/axios';
import { Plus, Edit, Trash2, CheckCircle, XCircle, Search, Upload, Download } from 'lucide-react';

export const TopicsPage = () => {
  const [topics, setTopics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentTopic, setCurrentTopic] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchTopics = async () => {
    try {
      setLoading(true);
      const data: any = await api.get('/topics?active=false'); // Get all topics including inactive
      setTopics(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopics();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除这个话题吗？')) return;
    try {
      await api.delete(`/topics/${id}`);
      fetchTopics();
    } catch (error) {
      console.error(error);
      alert('删除失败');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (currentTopic.id) {
        await api.patch(`/topics/${currentTopic.id}`, currentTopic);
      } else {
        await api.post('/topics', currentTopic);
      }
      setIsEditing(false);
      setCurrentTopic(null);
      fetchTopics();
    } catch (error) {
      console.error(error);
      alert('保存失败');
    }
  };

  const handleExport = async () => {
    try {
      const data = await api.get('/topics/export');
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `topics_export_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      alert('导出失败');
    }
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (!Array.isArray(json)) {
          alert('文件格式错误：必须是 JSON 数组');
          return;
        }
        
        if (!confirm(`即将导入 ${json.length} 个话题，重复的标题将被更新，是否继续？`)) return;

        const res: any = await api.post('/topics/import', json);
        alert(`导入完成: 成功 ${res.success}, 失败 ${res.failed}`);
        fetchTopics();
      } catch (error) {
        console.error(error);
        alert('导入失败：文件解析错误或网络异常');
      } finally {
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsText(file);
  };

  const openEdit = (topic: any = { title: '', description: '', content: '', category: '单人录制', difficulty: 1, is_active: true }) => {
    setCurrentTopic(topic);
    setIsEditing(true);
  };

  const filteredTopics = topics.filter(t => t.title.includes(search));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">话题管理</h1>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="搜索话题" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-100 w-64"
            />
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <Download size={16} />
              导出
            </button>
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImport}
              className="hidden"
              accept=".json"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <Upload size={16} />
              导入
            </button>

            <button
              onClick={() => openEdit()}
              className="px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 transition-colors flex items-center gap-2"
            >
              <Plus size={18} />
              新增话题
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
            <tr>
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">标题</th>
              <th className="px-6 py-4">分类</th>
              <th className="px-6 py-4">难度</th>
              <th className="px-6 py-4">状态</th>
              <th className="px-6 py-4 text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500">加载中...</td></tr>
            ) : filteredTopics.length === 0 ? (
              <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500">无数据</td></tr>
            ) : (
              filteredTopics.map((topic) => (
                <tr key={topic.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-gray-500">{topic.id}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{topic.title}</td>
                  <td className="px-6 py-4 text-gray-500">{topic.category}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className={`w-1.5 h-1.5 rounded-full ${i < topic.difficulty ? 'bg-red-500' : 'bg-gray-200'}`} />
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {topic.is_active ? (
                      <span className="text-green-600 flex items-center gap-1 text-xs"><CheckCircle size={14} /> 启用</span>
                    ) : (
                      <span className="text-gray-400 flex items-center gap-1 text-xs"><XCircle size={14} /> 禁用</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                    <button 
                      onClick={() => openEdit(topic)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(topic.id)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-6">{currentTopic.id ? '编辑话题' : '新增话题'}</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">标题</label>
                  <input
                    type="text"
                    value={currentTopic.title}
                    onChange={(e) => setCurrentTopic({ ...currentTopic, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-100"
                    placeholder="如：童年记忆"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">分类</label>
                  <select
                    value={currentTopic.category || '单人录制'}
                    onChange={(e) => setCurrentTopic({ ...currentTopic, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-100"
                  >
                    <option value="单人录制">单人录制</option>
                    <option value="多人对话">多人对话</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">描述/角度</label>
                <textarea
                  value={currentTopic.description || ''}
                  onChange={(e) => setCurrentTopic({ ...currentTopic, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-100"
                  rows={2}
                  placeholder="单人录制：用分号分隔不同角度（如：时间顺序；感官体验）&#10;多人对话：简述对话背景"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">引导内容/问题列表</label>
                <textarea
                  value={currentTopic.content || ''}
                  onChange={(e) => setCurrentTopic({ ...currentTopic, content: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-100 font-mono text-sm"
                  rows={6}
                  placeholder="单人录制：每行一个问题&#10;1. 问题一&#10;2. 问题二&#10;&#10;多人对话：每行一个话题点&#10;- 话题一&#10;- 话题二"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">难度 (1-5)</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={currentTopic.difficulty}
                    onChange={(e) => setCurrentTopic({ ...currentTopic, difficulty: +e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-100"
                  />
                </div>
                <div className="flex items-center pt-6">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={currentTopic.is_active}
                      onChange={(e) => setCurrentTopic({ ...currentTopic, is_active: e.target.checked })}
                      className="w-5 h-5 rounded text-red-600 focus:ring-red-500 border-gray-300"
                    />
                    <label htmlFor="isActive" className="text-sm font-medium text-gray-700 cursor-pointer">启用该话题</label>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 py-2.5 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors"
                >
                  保存
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
