import { useEffect, useState, useRef } from 'react';
import { api } from '../lib/axios';
import { RecordStatus, RecordType } from '@changsha/shared';
import { PlayCircle, CheckCircle, XCircle, Upload } from 'lucide-react';

export const RecordingsPage = () => {
  const [recordings, setRecordings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending'>('pending');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchRecordings = async () => {
    try {
      setLoading(true);
      // In a real app, you'd have more robust filtering API
      // For now, we fetch pending by default or all
      // const endpoint = filter === 'pending' ? '/recordings/pending' : '/recordings/all'; 
      // Note: backend currently only has 'pending' and 'my'. 
      // We might need to implement a general admin list endpoint.
      // For this demo, let's use pending endpoint when filter is pending.
      
      let data: any[] = [];
      if (filter === 'pending') {
        data = await api.get('/recordings/pending');
      } else {
        // Fallback or implement new endpoint. 
        // Let's assume we only focus on pending for now as per requirement urgency.
        data = await api.get('/recordings/pending'); 
      }
      setRecordings(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecordings();
  }, [filter]);

  const handleAudit = async (id: number, status: RecordStatus) => {
    const remark = prompt('请输入审核备注（可选）:');
    if (remark === null) return; // Cancelled

    try {
      await api.put(`/admin/recordings/${id}/audit`, { status, remark });
      fetchRecordings(); // Refresh list
    } catch (error) {
      console.error(error);
      alert('操作失败');
    }
  };

  const handleImportRecordings = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
        return {
          studentId: parts[0],
          duration: Number(parts[1]) || 0,
          filename: parts[2] || '',
          recordType: 1 // Default to solo
        };
      }).filter((i): i is { studentId: string; duration: number; filename: string; recordType: number } => !!i && !!i.studentId && i.duration > 0);

      if (items.length === 0) {
        alert('文件内容为空或格式错误。格式示例：学号,时长(秒),文件名');
        return;
      }

      if (!confirm(`即将导入 ${items.length} 条数据，是否继续？`)) return;

      try {
        const res: any = await api.post('/admin/recordings/import', { items });
        alert(`导入完成: 成功 ${res.success}, 失败 ${res.failed}`);
        if (res.errors.length > 0) {
          console.error(res.errors);
          alert('部分失败详情请查看控制台');
        }
        fetchRecordings();
      } catch (error) {
        console.error(error);
        alert('导入失败');
      } finally {
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsText(file);
  };

  const getStatusBadge = (status: RecordStatus) => {
    switch (status) {
      case RecordStatus.PENDING_ANNOTATION:
        return <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">待审核</span>;
      case RecordStatus.APPROVED:
        return <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">已通过</span>;
      case RecordStatus.REJECTED:
        return <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">已驳回</span>;
      default:
        return null;
    }
  };

  const playAudio = (url: string) => {
    const audio = new Audio(url.startsWith('http') ? url : `/api${url}`); // Adjust based on proxy
    audio.play();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">录音审核</h1>
        <div className="flex gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImportRecordings}
            className="hidden"
            accept=".csv,.txt"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 flex items-center gap-2 text-sm font-medium transition-colors"
          >
            <Upload size={16} />
            导入录音记录
          </button>
          
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              filter === 'pending' ? 'bg-red-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            待审核
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
            <tr>
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">用户ID</th>
              <th className="px-6 py-4">类型</th>
              <th className="px-6 py-4">时长</th>
              <th className="px-6 py-4">状态</th>
              <th className="px-6 py-4">提交时间</th>
              <th className="px-6 py-4 text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={7} className="px-6 py-8 text-center text-gray-500">加载中...</td></tr>
            ) : recordings.length === 0 ? (
              <tr><td colSpan={7} className="px-6 py-8 text-center text-gray-500">暂无待审核录音</td></tr>
            ) : (
              recordings.map((recording) => (
                <tr key={recording.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-gray-500">{recording.id}</td>
                  <td className="px-6 py-4 text-gray-900">{recording.user_id}</td>
                  <td className="px-6 py-4">
                    {recording.record_type === RecordType.SOLO ? '单人朗读' : '情景对话'}
                  </td>
                  <td className="px-6 py-4 text-gray-500">{recording.duration}秒</td>
                  <td className="px-6 py-4">{getStatusBadge(recording.status)}</td>
                  <td className="px-6 py-4 text-gray-500">
                    {new Date(recording.upload_time).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                    <button 
                      onClick={() => playAudio(recording.file_url)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="播放"
                    >
                      <PlayCircle size={18} />
                    </button>
                    
                    {recording.status === RecordStatus.PENDING_ANNOTATION && (
                      <>
                        <button 
                          onClick={() => handleAudit(recording.id, RecordStatus.APPROVED)}
                          className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="通过"
                        >
                          <CheckCircle size={18} />
                        </button>
                        <button 
                          onClick={() => handleAudit(recording.id, RecordStatus.REJECTED)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="驳回"
                        >
                          <XCircle size={18} />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
