import { useEffect, useState } from 'react';
import { Layout } from '../components/layout';
import { useAuthStore } from '../features/auth/hooks/useAuthStore';
import { Medal, Trophy, User as UserIcon } from 'lucide-react';
import { getRankings, RankingItem } from '../features/ranking/api/rankings';
import { RankType, RECORDING_TITLES, getTitleByDuration } from '@changsha/shared';

interface MyRanking {
  rank_number: number;
  duration: number;
}

export const RankingPage = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<RankType>(RankType.TOTAL);
  const [rankingList, setRankingList] = useState<RankingItem[]>([]);
  const [myRanking, setMyRanking] = useState<MyRanking | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchRankings();
  }, [activeTab]);

  const fetchRankings = async () => {
    setIsLoading(true);
    try {
      const data = await getRankings(activeTab);
      setRankingList(data);

      if (user) {
        // Mock my ranking logic (backend should return this separately or include in list)
        // For now, we calculate it if present in the list
        const myEntry = data.find((item: any) => item.user.name === user.name);
        if (myEntry) {
            setMyRanking({ rank_number: myEntry.rank, duration: myEntry.duration });
        } else {
            setMyRanking({ rank_number: 0, duration: user.total_duration || 0 });
        }
      }
    } catch (error) {
      console.error('Failed to fetch rankings', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}小时${minutes}分钟`;
    }
    return `${minutes}分钟`;
  };

  const getLevelColor = (level: number) => {
    switch (level) {
      case 1: return "text-gray-500 bg-gray-50";
      case 2: return "text-blue-600 bg-blue-50";
      case 3: return "text-green-600 bg-green-50";
      case 4: return "text-purple-600 bg-purple-50";
      case 5: return "text-yellow-600 bg-yellow-50";
      default: return "text-gray-500 bg-gray-50";
    }
  };

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <div className="w-8 h-8 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center"><Trophy size={18} fill="currentColor" /></div>;
      case 1:
        return <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center"><Medal size={18} fill="currentColor" /></div>;
      case 2:
        return <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center"><Medal size={18} fill="currentColor" /></div>;
      default:
        return <div className="w-8 h-8 rounded-full bg-gray-50 text-gray-500 flex items-center justify-center font-bold text-sm">{index + 1}</div>;
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-3 flex items-center justify-center gap-3">
            <Trophy className="text-yellow-500" size={32} />
            贡献排行榜
          </h1>
          <p className="text-gray-500">感谢每一位为长沙方言保护做出贡献的志愿者</p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-gray-100">
            <button
              onClick={() => setActiveTab(RankType.TOTAL)}
              className={`flex-1 py-4 text-sm font-medium transition-colors ${
                activeTab === RankType.TOTAL ? 'text-primary border-b-2 border-primary bg-primary/5' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              时长荣誉榜
            </button>
            <button
              className={`flex-1 py-4 text-sm font-medium transition-colors text-gray-400 cursor-not-allowed`}
              title="暂未开放"
            >
              质量之星榜 (敬请期待)
            </button>
          </div>

          {/* List */}
          <div className="p-6">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="space-y-2">
                {/* Header */}
                <div className="grid grid-cols-12 gap-4 px-4 py-2 text-xs font-medium text-gray-400 uppercase tracking-wider">
                  <div className="col-span-1 text-center">排名</div>
                  <div className="col-span-4">志愿者</div>
                  <div className="col-span-3 text-center">荣誉称号</div>
                  <div className="col-span-2">所属学校</div>
                  <div className="col-span-2 text-right">时长</div>
                </div>

                {rankingList.map((item, index) => {
                  const titleInfo = getTitleByDuration(item.duration, RECORDING_TITLES);
                  return (
                    <div 
                      key={item.id} 
                      className="grid grid-cols-12 gap-4 px-4 py-3 items-center rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100"
                    >
                      <div className="col-span-1 flex justify-center">
                        {getRankIcon(index)}
                      </div>
                      <div className="col-span-4 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                           <UserIcon size={16} className="text-gray-400" />
                        </div>
                        <span className="font-medium text-gray-900 truncate">{item.user.name}</span>
                      </div>
                      <div className="col-span-3 flex justify-center">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getLevelColor(titleInfo.level)}`}>
                          {titleInfo.name}
                        </span>
                      </div>
                      <div className="col-span-2 text-sm text-gray-500 truncate">
                        {item.user.school}
                      </div>
                      <div className="col-span-2 text-right font-bold text-primary">
                        {formatDuration(item.duration)}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* My Ranking Footer */}
          {user && myRanking && (
            <div className="bg-gray-50 border-t border-gray-100 p-4">
              <div className="flex items-center justify-center gap-8 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">我的排名:</span>
                  <span className="font-bold text-gray-900 bg-white px-2 py-0.5 rounded border border-gray-200 shadow-sm">
                    {myRanking.rank_number > 0 ? myRanking.rank_number : '未上榜'}
                  </span>
                </div>
                <div className="w-px h-4 bg-gray-300"></div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">累计贡献:</span>
                  <span className="font-bold text-primary">
                    {formatDuration(myRanking.duration)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};
