import { useEffect, useState } from 'react';
import { api } from '../lib/axios';
import { LogLevel, LogType } from '@changsha/shared';

export const LogsPage = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    type: '' as LogType | '',
    level: '' as LogLevel | '',
  });

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      try {
        const params: any = { page: filters.page, limit: filters.limit };
        if (filters.type) params.type = filters.type;
        if (filters.level) params.level = filters.level;
        
        const data: any = await api.get('/logs', { params });
        setLogs(data.items);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, [filters]);

  const getLevelBadge = (level: LogLevel) => {
    switch (level) {
      case LogLevel.INFO:
        return <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">INFO</span>;
      case LogLevel.WARN:
        return <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">WARN</span>;
      case LogLevel.ERROR:
        return <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">ERROR</span>;
      default:
        return level;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">系统日志</h1>
        
        <div className="flex gap-4">
          <select 
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-100"
            value={filters.level}
            onChange={(e) => setFilters({ ...filters, level: e.target.value as LogLevel })}
          >
            <option value="">所有级别</option>
            <option value={LogLevel.INFO}>INFO</option>
            <option value={LogLevel.WARN}>WARN</option>
            <option value={LogLevel.ERROR}>ERROR</option>
          </select>

          <select 
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-100"
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value as LogType })}
          >
            <option value="">所有类型</option>
            <option value={LogType.SYSTEM}>系统</option>
            <option value={LogType.USER}>用户</option>
            <option value={LogType.ADMIN}>管理员</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">时间</th>
                <th className="px-6 py-4">级别</th>
                <th className="px-6 py-4">类型</th>
                <th className="px-6 py-4">动作</th>
                <th className="px-6 py-4">详情</th>
                <th className="px-6 py-4">IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">加载中...</td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">暂无日志</td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      {getLevelBadge(log.level)}
                    </td>
                    <td className="px-6 py-4 text-gray-900 font-medium">
                      {log.type.toUpperCase()}
                    </td>
                    <td className="px-6 py-4 text-gray-900">
                      {log.action}
                    </td>
                    <td className="px-6 py-4 text-gray-500 max-w-xs truncate" title={log.details}>
                      {log.details || '-'}
                    </td>
                    <td className="px-6 py-4 text-gray-500 font-mono text-xs">
                      {log.ip || '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
