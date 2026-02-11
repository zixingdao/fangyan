import { useEffect, useState } from 'react';
import { api } from '../lib/axios';
import {
  Users,
  Mic,
  FileText,
  AlertCircle,
  Activity,
  Server,
  HardDrive,
  Cpu,
  Clock,
  Database,
  Network,
  Loader2,
} from 'lucide-react';
import clsx from 'clsx';

export const DashboardPage = () => {
  const [stats, setStats] = useState<any>(null);
  const [serverStats, setServerStats] = useState<any>(null);
  const [monitorError, setMonitorError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      // Fetch business stats
      try {
        const data = await api.get('/admin/dashboard');
        setStats(data);
      } catch (e) {
        console.error('Failed to fetch dashboard stats', e);
      }

      // Fetch server stats independently
      try {
        const serverData = await api.get('/system/monitor/stats');
        console.log('Server Monitor Stats:', serverData); // Log to console for debugging
        setServerStats(serverData);
        setMonitorError(null);
      } catch (e: any) {
        console.error('Failed to fetch server stats', e);
        setServerStats(null);
        setMonitorError(e.message || '获取监控数据失败');
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchStats();
    // Refresh server stats every 10 seconds
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, []);

  const formatBytes = (bytes: number) => {
    if (bytes === 0 || isNaN(bytes) || bytes === undefined || bytes === null) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatUptime = (seconds: number) => {
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (d > 0) return `${d}天 ${h}小时`;
    return `${h}小时 ${m}分`;
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">控制台</h1>
      
      {/* Business Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="text-gray-500 text-sm">总用户数</div>
              <div className="text-2xl font-bold text-gray-900">
                {stats ? stats.totalUsers : <Loader2 className="w-6 h-6 animate-spin text-gray-300" />}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
              <Mic className="w-6 h-6" />
            </div>
            <div>
              <div className="text-gray-500 text-sm">总录音数</div>
              <div className="text-2xl font-bold text-gray-900">
                {stats ? stats.totalRecordings : <Loader2 className="w-6 h-6 animate-spin text-gray-300" />}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <div className="text-gray-500 text-sm">待审核用户</div>
              <div className="text-2xl font-bold text-gray-900">
                {stats ? stats.pendingAudits : <Loader2 className="w-6 h-6 animate-spin text-gray-300" />}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-red-600">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="text-gray-500 text-sm">待标注录音</div>
              <div className="text-2xl font-bold text-gray-900">
                {stats ? stats.pendingAnnotations : <Loader2 className="w-6 h-6 animate-spin text-gray-300" />}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Server Monitor Stats */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-green-600" />
          服务器状态监控
          <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            实时更新
          </span>
        </h2>
        
        {monitorError ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center text-red-600">
            <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>无法加载服务器监控数据</p>
            <p className="text-sm opacity-75 mt-1">{monitorError}</p>
          </div>
        ) : !serverStats ? (
          <div className="bg-gray-50 border border-dashed border-gray-200 rounded-2xl p-8 text-center text-gray-500">
            加载中...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {/* System Info */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 col-span-1 md:col-span-3 lg:col-span-1">
              <h3 className="text-sm font-medium text-gray-500 mb-4 flex items-center gap-2">
                <Server className="w-4 h-4" /> 系统概况
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">操作系统</span>
                  <span className="font-medium">{serverStats.os.platform} ({serverStats.os.arch})</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Node版本</span>
                  <span className="font-medium">{serverStats.os.nodeVersion}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> 运行时长
                  </span>
                  <span className="font-medium text-green-600">{formatUptime(serverStats.uptime)}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="text-gray-600">总请求数</span>
                  <span className="font-bold text-blue-600">{serverStats.requestCount} 次</span>
                </div>
                {serverStats.errorCount !== undefined && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">错误数 (4xx/5xx)</span>
                    <span className={clsx("font-bold", serverStats.errorCount > 0 ? "text-red-600" : "text-green-600")}>
                      {serverStats.errorCount} 次
                    </span>
                  </div>
                )}
                {serverStats.process && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">App内存 (Heap)</span>
                    <span className="font-medium text-purple-600">{formatBytes(serverStats.process.memory.heapUsed)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Database & Network (New) */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 col-span-1 md:col-span-3 lg:col-span-1">
              <h3 className="text-sm font-medium text-gray-500 mb-4 flex items-center gap-2">
                <Database className="w-4 h-4" /> 核心服务状态
              </h3>
              <div className="space-y-4">
                 {/* Database */}
                {serverStats.database && (
                  <div className="pb-3 border-b border-gray-50">
                     <div className="flex justify-between items-center mb-1">
                        <span className="text-gray-600 flex items-center gap-1">
                          数据库 ({serverStats.database.type})
                        </span>
                        <span className={clsx("px-2 py-0.5 rounded-full text-xs font-medium", {
                          "bg-green-100 text-green-700": serverStats.database.status === 'connected',
                          "bg-red-100 text-red-700": serverStats.database.status !== 'connected'
                        })}>
                          {serverStats.database.status === 'connected' ? '运行中' : '异常'}
                        </span>
                     </div>
                  </div>
                )}

                {/* Network */}
                {serverStats.network && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Network className="w-3 h-3 text-gray-400" />
                      <span className="text-sm text-gray-600">网络 I/O</span>
                    </div>
                    {serverStats.network.interfaces && serverStats.network.interfaces.length > 0 ? (
                       serverStats.network.interfaces.slice(0, 1).map((iface: any, i: number) => (
                        <div key={i} className="text-xs space-y-1">
                          <div className="flex justify-between" title={`接口: ${iface.iface}`}>
                            <span className="text-gray-500">接收 (RX)</span>
                            <span className="font-mono">{formatBytes(iface.rx_sec)}/s</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">发送 (TX)</span>
                            <span className="font-mono">{formatBytes(iface.tx_sec)}/s</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-xs text-gray-400 text-center py-2">无网络数据</div>
                    )}
                    <div className="mt-2 flex justify-between text-xs items-center">
                       <span className="text-gray-500">活跃连接 (TCP)</span>
                       <div className="flex gap-2">
                         <span className="font-medium text-green-600" title="ESTABLISHED">{serverStats.network.connections?.established ?? 0}</span>
                         <span className="text-gray-300">/</span>
                         <span className="text-gray-500" title="Total">{serverStats.network.connections?.total ?? serverStats.network.connections ?? 0}</span>
                       </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* CPU & Memory */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 col-span-1 md:col-span-3 lg:col-span-1">
              <h3 className="text-sm font-medium text-gray-500 mb-4 flex items-center gap-2">
                <Cpu className="w-4 h-4" /> 资源使用率
              </h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">CPU 负载 ({serverStats.cpu.cores} 核)</span>
                    <span className="text-sm font-bold">{serverStats.cpu.load}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <div 
                      className={clsx("h-2.5 rounded-full transition-all duration-500", {
                        "bg-green-500": serverStats.cpu.load < 50,
                        "bg-yellow-500": serverStats.cpu.load >= 50 && serverStats.cpu.load < 80,
                        "bg-red-500": serverStats.cpu.load >= 80
                      })}
                      style={{ width: `${serverStats.cpu.load}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">内存使用 ({formatBytes(serverStats.memory.used)} / {formatBytes(serverStats.memory.total)})</span>
                    <span className="text-sm font-bold">
                      {Math.round((serverStats.memory.used / serverStats.memory.total) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <div 
                      className="bg-blue-500 h-2.5 rounded-full transition-all duration-500"
                      style={{ width: `${(serverStats.memory.used / serverStats.memory.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Disk Usage */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 col-span-1 md:col-span-3 lg:col-span-1">
              <h3 className="text-sm font-medium text-gray-500 mb-4 flex items-center gap-2">
                <HardDrive className="w-4 h-4" /> 磁盘状态
              </h3>
              <div className="space-y-4 max-h-[160px] overflow-y-auto pr-2">
                {serverStats.disk.map((d: any, i: number) => (
                  <div key={i} className="pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700 truncate w-1/2" title={d.mount}>
                        {d.mount}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatBytes(d.used)} / {formatBytes(d.size)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                      <div 
                        className={clsx("h-1.5 rounded-full", {
                          "bg-green-500": d.use < 70,
                          "bg-yellow-500": d.use >= 70 && d.use < 90,
                          "bg-red-500": d.use >= 90
                        })}
                        style={{ width: `${d.use}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
