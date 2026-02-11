import { useEffect, useState } from 'react';
import { Layout } from '../components/layout';
import { useAuthStore } from '../features/auth/hooks/useAuthStore';
import { getMyRecordings, Recording } from '../features/recordings/api/recordings';
import { Mic, Clock, PlayCircle, Calendar, FileAudio } from 'lucide-react';
import { RecordType, RecordStatus, RECORDING_TITLES, getTitleByDuration } from '@changsha/shared';

import { useNavigate } from 'react-router-dom';

export const ProfilePage = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getMyRecordings();
        setRecordings(data);
      } catch (error) {
        console.error("Failed to fetch recordings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalDuration = recordings.reduce((acc, curr) => acc + (curr.duration || 0), 0);
  const formattedDuration = `${Math.floor(totalDuration / 60)}分${totalDuration % 60}秒`;
  const currentTitle = getTitleByDuration(totalDuration, RECORDING_TITLES);

  const getStatusBadge = (status?: RecordStatus) => {
    if (status === undefined) return null;
    switch (status) {
      case RecordStatus.PENDING_ANNOTATION:
        return (
          <div className="flex flex-col items-end gap-1">
            <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">待标注</span>
            <a 
              href="https://label-platform.example.com" 
              target="_blank" 
              rel="noreferrer"
              className="text-xs text-primary hover:underline font-medium"
            >
              去标注 &rarr;
            </a>
          </div>
        );
      case RecordStatus.ANNOTATING:
        return <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">标注中</span>;
      case RecordStatus.ANNOTATED:
        return <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">已标注</span>;
      case RecordStatus.APPROVED:
        return <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">已通过</span>;
      case RecordStatus.REJECTED:
        return <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">已驳回</span>;
      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* 用户信息卡片 */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center text-red-600 text-4xl font-bold">
              {(user?.name || 'U')[0].toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{user?.name}</h1>
              <p className="text-gray-500 mt-1">{currentTitle.description || '长沙方言守护者'}</p>
              <div className="flex gap-2 mt-4">
                <span className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-sm font-medium">
                  Lv.{currentTitle.level} {currentTitle.name}
                </span>
                {user?.school && (
                   <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
                     {user.school}
                   </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 统计数据 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
              <Mic className="w-6 h-6" />
            </div>
            <div>
              <div className="text-gray-500 text-sm">累计录音</div>
              <div className="text-2xl font-bold text-gray-900">{recordings.length} 条</div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <div className="text-gray-500 text-sm">累计时长</div>
              <div className="text-2xl font-bold text-gray-900">{formattedDuration}</div>
            </div>
          </div>
        </div>

        {/* 录音列表 */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <FileAudio className="w-5 h-5 text-red-600" />
              我的录音
            </h2>
            <span className="text-sm text-gray-400">数据平均每周更新一次</span>
          </div>
          
          {loading ? (
            <div className="text-center py-12 text-gray-400">加载中...</div>
          ) : recordings.length > 0 ? (
            <div className="space-y-4">
              {recordings.map((recording) => (
                <div key={recording.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-600 shadow-sm">
                      <PlayCircle className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {recording.record_type === RecordType.SOLO ? '单人朗读' : '情景对话'}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {recording.duration}秒
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {recording.upload_time ? new Date(recording.upload_time).toLocaleDateString() : '刚刚'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    {getStatusBadge(recording.status)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
              <Mic className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>还没有录音记录</p>
              <button 
                onClick={() => navigate('/upload')}
                className="mt-4 px-6 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors text-sm font-medium"
              >
                去录音
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};
