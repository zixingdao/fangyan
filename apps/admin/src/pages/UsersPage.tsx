import { useEffect, useState, useRef } from 'react';
import { api } from '../lib/axios';
import { UserStatus, UserRole, RECORDING_TITLES, ANNOTATION_TITLES, getTitleByDuration } from '@changsha/shared';
import { CheckCircle, XCircle, Search, Trash2, Upload, Edit, Mic, Tag, Users, Plus } from 'lucide-react';
import clsx from 'clsx';
import { useAuthStore } from '../store/useAuthStore'; // 引入 useAuthStore 获取当前登录用户

const formatDuration = (seconds: number) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}小时${m}分`;
  if (m > 0) return `${m}分${s}秒`;
  return `${s}秒`;
};

export const UsersPage = () => {
  const { user: currentUserProfile } = useAuthStore(); // 获取当前登录用户信息
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newUser, setNewUser] = useState({
    student_id: '',
    name: '',
    phone: '',
    school: '邵阳学院',
    password: '',
    role: UserRole.USER,
    status: UserStatus.PENDING,
    hometown: '',
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data: any = await api.get('/users');
      setUsers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAudit = async (id: number, status: UserStatus) => {
    try {
      await api.put(`/admin/users/${id}/audit`, { status });
      fetchUsers();
    } catch (error) {
      console.error(error);
      alert('操作失败');
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put(`/admin/users/${currentUser.id}/audit`, { 
        status: currentUser.status,
        solo_duration: currentUser.solo_duration,
        dialogue_duration: currentUser.dialogue_duration,
        annotation_duration: currentUser.annotation_duration,
        total_duration: (currentUser.solo_duration || 0) + (currentUser.dialogue_duration || 0),
      });
      setIsEditing(false);
      setCurrentUser(null);
      fetchUsers();
    } catch (error) {
      console.error(error);
      alert('保存失败');
    }
  };

  const openEdit = (user: any) => {
    setCurrentUser({ ...user });
    setIsEditing(true);
  };

  const openCreate = () => {
    setNewUser({
      student_id: '',
      name: '',
      phone: '',
      school: '邵阳学院',
      password: '',
      role: UserRole.USER,
      status: UserStatus.PENDING,
      hometown: '',
    });
    setIsCreating(true);
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // 构造符合后端 DTO 要求的 payload
      const payload = {
        ...newUser,
        // 显式转换枚举值为后端期望的格式
        // 后端 zod schema 期望的是 nativeEnum (即字符串枚举值)
        role: newUser.role as UserRole,
        status: Number(newUser.status) as UserStatus, // status 是数字枚举，确保转为数字
        // CreateUserSchema 定义中可能没有 hometown 为必填，但为了保险起见可以加上
        hometown: newUser.hometown || '', 
      };

      console.log('Creating user with payload:', payload);

      await api.post('/admin/users', payload);
      console.log('User created successfully');
      setIsCreating(false);
      fetchUsers();
    } catch (error: any) {
      console.error('Create user failed:', error);
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
      }
      // 显示更详细的错误信息
      const message = error.response?.data?.message || error.message || '创建失败';
      alert(`创建失败: ${Array.isArray(message) ? message.join(', ') : message}`);
    }
  };

  const handleImportTrial = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n').filter(l => l.trim());
      const startIndex = lines[0]?.toLowerCase().includes('studentid') ? 1 : 0;
      
      const items = lines.slice(startIndex).map(line => {
        const parts = line.split(/[,，]/).map(s => s.trim());
        if (parts.length < 2) return null;
        const studentId = parts[0];
        const passedStr = parts[1];
        return {
          studentId,
          passed: passedStr === '1' || passedStr.toLowerCase() === 'true' || passedStr === '通过'
        };
      }).filter((i): i is { studentId: string; passed: boolean } => !!i && !!i.studentId);

      if (items.length === 0) {
        alert('文件内容为空或格式错误。格式示例：学号,通过(1/true/通过)');
        return;
      }

      if (!confirm(`即将导入 ${items.length} 条数据，是否继续？`)) return;

      try {
        const res: any = await api.post('/admin/users/import-trial', { items });
        alert(`导入完成: 成功 ${res.success}, 失败 ${res.failed}`);
        if (res.errors.length > 0) {
          console.error(res.errors);
          alert('部分失败详情请查看控制台');
        }
        fetchUsers();
      } catch (error) {
        console.error(error);
        alert('导入失败');
      } finally {
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsText(file);
  };

  const filteredUsers = users.filter(u => 
    u.name.includes(search) || 
    u.student_id.includes(search) || 
    u.phone.includes(search)
  );

  const getStatusBadge = (status: UserStatus) => {
    switch (status) {
      case UserStatus.PENDING:
        return <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">待审核</span>;
      // @ts-ignore
      case UserStatus.TRIAL_PASSED:
        return <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">试音通过</span>;
      // @ts-ignore
      case UserStatus.RECORDING_SUCCESS:
        return <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">录音成功</span>;
      // @ts-ignore
      case UserStatus.ANNOTATION_SUCCESS:
        return <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">标注成功</span>;
      case UserStatus.REJECTED:
        return <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">封禁账号</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">用户管理</h1>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="搜索姓名/学号/手机" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-100 w-64"
            />
          </div>
          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImportTrial}
              className="hidden"
              accept=".csv,.txt"
            />
            <div className="flex gap-3">
              <button
                onClick={openCreate}
                className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 flex items-center gap-2 text-sm font-medium transition-colors"
              >
                <Plus size={16} />
                新增账号
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 flex items-center gap-2 text-sm font-medium transition-colors"
              >
                <Upload size={16} />
                导入试音结果
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
            <tr>
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">姓名</th>
              <th className="px-6 py-4">学号</th>
              <th className="px-6 py-4">手机号</th>
              <th className="px-6 py-4">学校</th>
              <th className="px-6 py-4">时长</th>
              <th className="px-6 py-4">状态</th>
              <th className="px-6 py-4">角色</th>
              <th className="px-6 py-4 text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={9} className="px-6 py-8 text-center text-gray-500">加载中...</td></tr>
            ) : filteredUsers.length === 0 ? (
              <tr><td colSpan={9} className="px-6 py-8 text-center text-gray-500">无数据</td></tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-gray-500">{user.id}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{user.name}</td>
                  <td className="px-6 py-4 text-gray-500">{user.student_id}</td>
                  <td className="px-6 py-4 text-gray-500">{user.phone}</td>
                  <td className="px-6 py-4 text-gray-500">{user.school}</td>
                  <td className="px-6 py-4 text-gray-900 font-mono">
                    <div className="flex flex-col gap-2">
                      <div 
                        className="flex items-center gap-2 bg-red-50 px-2 py-1 rounded-lg w-fit cursor-help" 
                        title={`单人: ${formatDuration(user.solo_duration || 0)}\n多人: ${formatDuration(user.dialogue_duration || 0)}`}
                      >
                        <Mic size={14} className="text-red-600" />
                        <span className="text-red-900 font-medium text-xs">
                          {formatDuration(user.total_duration || 0)}
                        </span>
                        <span className="text-[10px] bg-red-200 text-red-800 px-1 rounded">
                          {getTitleByDuration(user.total_duration || 0, RECORDING_TITLES).name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 bg-green-50 px-2 py-1 rounded-lg w-fit" title="标注时长">
                        <Tag size={14} className="text-green-600" />
                        <span className="text-green-900 font-medium text-xs">
                          {formatDuration(user.annotation_duration || 0)}
                        </span>
                        <span className="text-[10px] bg-green-200 text-green-800 px-1 rounded">
                          {getTitleByDuration(user.annotation_duration || 0, ANNOTATION_TITLES).name}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(user.status)}</td>
                  <td className="px-6 py-4">
                    <span className={clsx(
                      "px-2 py-1 text-xs rounded-full",
                      user.role === UserRole.ADMIN ? "bg-purple-100 text-purple-800" : 
                      user.role === UserRole.SUPER_ADMIN ? "bg-amber-100 text-amber-800" :
                      "bg-gray-100 text-gray-600"
                    )}>
                      {user.role === UserRole.ADMIN ? '管理员' : user.role === UserRole.SUPER_ADMIN ? '超级管理员' : '普通用户'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                    <button 
                      onClick={() => openEdit(user)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="编辑"
                    >
                      <Edit size={18} />
                    </button>
                    {user.status === UserStatus.PENDING && (
                      <>
                        <button 
                          // @ts-ignore
                          onClick={() => handleAudit(user.id, UserStatus.TRIAL_PASSED)}
                          className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="试音通过"
                        >
                          <CheckCircle size={18} />
                        </button>
                        <button 
                          onClick={() => handleAudit(user.id, UserStatus.REJECTED)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="封禁"
                        >
                          <XCircle size={18} />
                        </button>
                      </>
                    )}
                    {user.status !== UserStatus.PENDING && user.status !== UserStatus.REJECTED && (
                      <button 
                        onClick={() => handleAudit(user.id, UserStatus.REJECTED)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="封禁"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {isEditing && currentUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl w-full max-w-lg">
            <h2 className="text-xl font-bold mb-6">编辑用户: {currentUser.name}</h2>
            <form onSubmit={handleUpdateUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">学号</label>
                <input
                  type="text"
                  value={currentUser.student_id}
                  disabled
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center justify-between">
                    <span>单人录音时长 (秒)</span>
                    <span className="text-xs text-purple-600 font-normal">
                      {formatDuration(currentUser.solo_duration || 0)}
                    </span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mic className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      value={currentUser.solo_duration || 0}
                      onChange={(e) => setCurrentUser({ ...currentUser, solo_duration: +e.target.value })}
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-300 transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center justify-between">
                    <span>多人对话时长 (秒)</span>
                    <span className="text-xs text-blue-600 font-normal">
                      {formatDuration(currentUser.dialogue_duration || 0)}
                    </span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Users className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      value={currentUser.dialogue_duration || 0}
                      onChange={(e) => setCurrentUser({ ...currentUser, dialogue_duration: +e.target.value })}
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center justify-between">
                    <span>总标注时长 (秒)</span>
                    <span className="text-xs text-green-600 font-normal">
                      {formatDuration(currentUser.annotation_duration || 0)}
                    </span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Tag className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      value={currentUser.annotation_duration || 0}
                      onChange={(e) => setCurrentUser({ ...currentUser, annotation_duration: +e.target.value })}
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-100 focus:border-green-300 transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center justify-between">
                    <span>总录音时长 (仅供参考)</span>
                    <span className="text-xs text-gray-400 font-normal">
                      {formatDuration(currentUser.total_duration || 0)}
                    </span>
                  </label>
                  <input
                    type="number"
                    value={currentUser.total_duration || 0}
                    disabled
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">状态</label>
                <select
                    value={currentUser.status}
                    onChange={(e) => setCurrentUser({ ...currentUser, status: +e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-100"
                  >
                    <option value={UserStatus.PENDING}>待审核</option>
                    {/* @ts-ignore */}
                    <option value={UserStatus.TRIAL_PASSED}>试音通过</option>
                    {/* @ts-ignore */}
                    <option value={UserStatus.RECORDING_SUCCESS}>录音成功</option>
                    {/* @ts-ignore */}
                    <option value={UserStatus.ANNOTATION_SUCCESS}>标注成功</option>
                    <option value={UserStatus.REJECTED}>封禁账号</option>
                  </select>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 py-2 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors"
                >
                  保存
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isCreating && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl w-full max-w-lg">
            <h2 className="text-xl font-bold mb-6">新增账号</h2>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">学号</label>
                  <input
                    type="text"
                    value={newUser.student_id}
                    onChange={(e) => setNewUser({ ...newUser, student_id: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-100"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">姓名</label>
                  <input
                    type="text"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-100"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">手机号</label>
                  <input
                    type="text"
                    value={newUser.phone}
                    onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-100"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">学校</label>
                  <input
                    type="text"
                    value={newUser.school}
                    onChange={(e) => setNewUser({ ...newUser, school: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">密码</label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-100"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">角色</label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value as any })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-100"
                  >
                    <option value={UserRole.USER}>普通用户</option>
                    {/* 只有超级管理员可以选择管理员角色 */}
                    {currentUserProfile?.role === UserRole.SUPER_ADMIN && (
                      <>
                        <option value={UserRole.ADMIN}>管理员</option>
                        <option value={UserRole.SUPER_ADMIN}>超级管理员</option>
                      </>
                    )}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">状态</label>
                  <select
                    value={newUser.status}
                    onChange={(e) => setNewUser({ ...newUser, status: +e.target.value as any })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-100"
                  >
                    <option value={UserStatus.PENDING}>待审核</option>
                    {/* @ts-ignore */}
                    <option value={UserStatus.TRIAL_PASSED}>试音通过</option>
                    {/* @ts-ignore */}
                    <option value={UserStatus.RECORDING_SUCCESS}>录音成功</option>
                    {/* @ts-ignore */}
                    <option value={UserStatus.ANNOTATION_SUCCESS}>标注成功</option>
                    <option value={UserStatus.REJECTED}>封禁账号</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="flex-1 py-2 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors"
                >
                  创建
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
