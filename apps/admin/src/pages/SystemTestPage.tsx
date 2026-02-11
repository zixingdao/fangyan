import { useState } from 'react';
import { api } from '../lib/axios';
import { Play, Activity, Clock, Zap, AlertTriangle, CheckCircle2 } from 'lucide-react';
import clsx from 'clsx';

export const SystemTestPage = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [config, setConfig] = useState({
    concurrency: 50,
    duration: 10,
  });

  const runTest = async () => {
    setLoading(true);
    setResult(null);
    try {
      const data = await api.post('/system/benchmark', config);
      setResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">系统压力测试</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuration */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <SettingsIcon className="w-5 h-5 text-gray-500" />
              测试配置
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  并发用户数 (Virtual Users)
                </label>
                <input
                  type="number"
                  value={config.concurrency}
                  onChange={(e) => setConfig({ ...config, concurrency: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                />
                <p className="mt-1 text-xs text-gray-500">模拟同时在线并发请求的用户数量</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  测试持续时间 (秒)
                </label>
                <input
                  type="number"
                  value={config.duration}
                  onChange={(e) => setConfig({ ...config, duration: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                />
              </div>

              <div className="pt-4">
                <button
                  onClick={runTest}
                  disabled={loading}
                  className={clsx(
                    "w-full py-3 px-4 rounded-xl text-white font-medium flex items-center justify-center gap-2 transition-all",
                    loading 
                      ? "bg-gray-400 cursor-not-allowed" 
                      : "bg-red-600 hover:bg-red-700 shadow-lg shadow-red-600/20"
                  )}
                >
                  {loading ? (
                    <>
                      <Activity className="w-5 h-5 animate-spin" />
                      正在压测中...
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5" />
                      开始压力测试
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
            <div className="flex gap-3">
              <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0" />
              <div className="text-sm text-orange-800">
                <p className="font-medium mb-1">注意事项</p>
                <ul className="list-disc list-inside space-y-1 opacity-90">
                  <li>建议在非高峰期进行压力测试</li>
                  <li>高并发可能会导致服务器暂时响应变慢</li>
                  <li>测试结果仅供参考，受网络环境影响较大</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-2">
          {result ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={clsx("p-2 rounded-lg", 
                      (result.requestsFailed > 0) ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"
                    )}>
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <span className="text-gray-500 text-sm">成功请求</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {result.requestsCompleted} 
                    <span className="text-sm font-normal text-gray-400 ml-2">/ {result.requestsCompleted + result.requestsFailed}</span>
                  </div>
                  <div className={clsx("text-xs mt-1 font-medium", 
                    (result.requestsFailed > 0) ? "text-red-500" : "text-gray-400"
                  )}>
                    {((result.requestsCompleted / (result.requestsCompleted + result.requestsFailed)) * 100).toFixed(1)}% 成功率
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                      <Zap className="w-5 h-5" />
                    </div>
                    <span className="text-gray-500 text-sm">平均 RPS</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{result.rps.mean}</div>
                  <div className="text-xs text-gray-400 mt-1">Req/Sec</div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                      <Clock className="w-5 h-5" />
                    </div>
                    <span className="text-gray-500 text-sm">平均延迟 (P95)</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{result.latency.p95}ms</div>
                  <div className="text-xs text-gray-400 mt-1">响应时间</div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-6">延迟分布详情</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">中位数 (Median)</span>
                      <span className="font-medium">{result.latency.median}ms</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '40%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">P95 (95%用户)</span>
                      <span className="font-medium">{result.latency.p95}ms</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '70%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">P99 (99%用户)</span>
                      <span className="font-medium">{result.latency.p99}ms</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className="bg-orange-500 h-2 rounded-full" style={{ width: '90%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">最大延迟 (Max)</span>
                      <span className="font-medium">{result.latency.max}ms</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className="bg-red-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 text-gray-400">
              <Activity className="w-16 h-16 mb-4 opacity-20" />
              <p className="text-lg font-medium">准备就绪</p>
              <p className="text-sm">点击左侧按钮开始压力测试</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const SettingsIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);
