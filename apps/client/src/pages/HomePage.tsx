import { useEffect, useState } from 'react';
import { Layout } from '../components/layout';
// import { useAuthStore } from '../features/auth/hooks/useAuthStore';
import { Link } from 'react-router-dom';
import { Mic, Trophy } from 'lucide-react';
import { getSystemStats, SystemStats } from '../features/system/api/system';
import { getRankings, RankingItem } from '../features/ranking/api/rankings';
import { RankType } from '@changsha/shared';
import changshaBg from '../assets/images/changsha-bg.png';

export const HomePage = () => {
  // const { user } = useAuthStore(); // Temporarily unused
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [honorList, setHonorList] = useState<RankingItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, rankingsData] = await Promise.all([
          getSystemStats(),
          getRankings(RankType.TOTAL, 3)
        ]);
        setStats(statsData);
        setHonorList(rankingsData);
      } catch (error) {
        console.error("Failed to fetch home data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[500px] md:min-h-[600px] rounded-3xl overflow-hidden mb-8 md:mb-12 flex items-center shadow-2xl">
        {/* Background Image - Changsha Cityscape */}
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ 
          backgroundImage: `url(${changshaBg})`,
          filter: 'brightness(0.7)'
        }}></div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-red-900/80 via-red-800/60 to-transparent"></div>
        
        <div className="relative z-10 px-6 md:px-16 max-w-4xl w-full">
          <div className="inline-flex items-center gap-2 py-2 px-4 rounded-full bg-red-600/30 text-red-100 text-xs md:text-sm font-medium mb-4 md:mb-6 backdrop-blur-sm border border-red-500/30">
            <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse"></span>
            邵阳学院 × 长沙方言守护计划
          </div>
          
          <h1 className="text-4xl md:text-7xl font-bold font-brand mb-4 md:mb-6 leading-tight text-white drop-shadow-lg">
            寻觅邵阳学院的<br/>
            <span className="text-yellow-400">长沙人</span>
          </h1>
          
          <p className="text-base md:text-xl text-gray-100 mb-6 md:mb-8 leading-relaxed max-w-2xl font-light">
            每一种方言都是文化的活化石。加入我们，用最地道的长沙话，记录这座城市的记忆。
            <br/>
            <span className="text-yellow-300 font-medium mt-2 block text-xl md:text-2xl">
              参与录制即可获得 {stats?.rewardRateRange || '80-120'}元/小时 奖励
            </span>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-8 md:mb-12">
            <Link to="/upload" className="px-8 md:px-10 py-3 md:py-4 bg-red-600 text-white font-bold text-base md:text-lg rounded-full hover:bg-red-700 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center justify-center gap-3">
              <Mic size={20} className="md:w-6 md:h-6" />
              加入守护
            </Link>
            <Link to="/guide" className="px-8 md:px-10 py-3 md:py-4 bg-white/10 backdrop-blur-md border border-white/30 text-white font-bold text-base md:text-lg rounded-full hover:bg-white/20 transition-all flex items-center justify-center gap-2">
              了解规则
            </Link>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 pt-6 md:pt-8 border-t border-white/10">
            <div>
              <div className="text-yellow-400 text-2xl md:text-3xl font-bold font-brand mb-1">20h</div>
              <div className="text-gray-300 text-xs md:text-sm">单人录制上限</div>
            </div>
            <div>
              <div className="text-yellow-400 text-2xl md:text-3xl font-bold font-brand mb-1">100h</div>
              <div className="text-gray-300 text-xs md:text-sm">多人对话上限</div>
            </div>
            <div>
              <div className="text-white text-2xl md:text-3xl font-bold font-brand mb-1">{stats?.totalUsers || 0}+</div>
              <div className="text-gray-300 text-xs md:text-sm">已参与人数</div>
            </div>
            <div>
              <div className="text-white text-2xl md:text-3xl font-bold font-brand mb-1">{stats?.totalDurationHours || 0}h</div>
              <div className="text-gray-300 text-xs md:text-sm">已采集时长</div>
            </div>
          </div>
        </div>
      </section>

      {/* Rewards Info Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8 mb-8 md:mb-16">
        {/* Duration Ranking Awards */}
        <div className="bg-gradient-to-br from-yellow-50 to-white p-6 md:p-8 rounded-3xl shadow-sm border border-yellow-100 relative overflow-hidden group hover:shadow-md transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-100 rounded-bl-full -mr-10 -mt-10 opacity-50"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-yellow-100 text-yellow-600 rounded-2xl flex items-center justify-center shadow-sm">
                <Trophy size={28} className="md:w-8 md:h-8" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900">时长荣誉榜奖励</h3>
            </div>
            
            <div className="space-y-4 md:space-y-6">
              <div className="bg-white/80 p-4 rounded-xl border border-yellow-200">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-yellow-700 flex items-center gap-2 text-sm md:text-base">
                    <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                    第 1 名
                  </span>
                  <span className="font-bold text-xl md:text-2xl text-red-600">¥{stats?.rankingRewards?.duration.rank1 || 2000}</span>
                </div>
                <div className="text-xs md:text-sm text-gray-500">湘音传承大使证书 + 奖杯</div>
              </div>
              
              <div className="bg-white/60 p-4 rounded-xl border border-yellow-100">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-gray-700 flex items-center gap-2 text-sm md:text-base">
                    <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                    第 2 - 3 名
                  </span>
                  <span className="font-bold text-lg md:text-xl text-red-500">¥{stats?.rankingRewards?.duration.rank23 || 500}</span>
                </div>
                <div className="text-xs md:text-sm text-gray-500">长沙方言守护者证书 + 定制纪念品</div>
              </div>

              <div className="bg-white/60 p-4 rounded-xl border border-yellow-100">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-gray-700 flex items-center gap-2 text-sm md:text-base">
                    <span className="w-2 h-2 rounded-full bg-orange-400"></span>
                    第 4 - 10 名
                  </span>
                  <span className="font-bold text-lg md:text-xl text-red-500">¥{stats?.rankingRewards?.duration.rank410 || 200}</span>
                </div>
                <div className="text-xs md:text-sm text-gray-500">方言文化贡献者证书</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quality Ranking Awards */}
        <div className="bg-gradient-to-br from-blue-50 to-white p-6 md:p-8 rounded-3xl shadow-sm border border-blue-100 relative overflow-hidden group hover:shadow-md transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-bl-full -mr-10 -mt-10 opacity-50"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center shadow-sm">
                <Mic size={28} className="md:w-8 md:h-8" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900">质量之星榜奖励</h3>
            </div>

            <div className="space-y-4 md:space-y-6">
              <div className="bg-white/80 p-4 rounded-xl border border-blue-200">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-blue-700 flex items-center gap-2 text-sm md:text-base">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    第 1 名
                  </span>
                  <span className="font-bold text-xl md:text-2xl text-red-600">¥{stats?.rankingRewards?.quality.rank1 || 2000}</span>
                </div>
                <div className="text-xs md:text-sm text-gray-500">方言大师证书 + 奖杯</div>
              </div>
              
              <div className="bg-white/60 p-4 rounded-xl border border-blue-100">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-gray-700 flex items-center gap-2 text-sm md:text-base">
                    <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                    第 2 - 3 名
                  </span>
                  <span className="font-bold text-lg md:text-xl text-red-500">¥{stats?.rankingRewards?.quality.rank23 || 600}</span>
                </div>
                <div className="text-xs md:text-sm text-gray-500">方言达人证书 + 定制纪念品</div>
              </div>

              <div className="bg-white/60 p-4 rounded-xl border border-blue-100">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-gray-700 flex items-center gap-2 text-sm md:text-base">
                    <span className="w-2 h-2 rounded-full bg-orange-400"></span>
                    第 4 - 10 名
                  </span>
                  <span className="font-bold text-lg md:text-xl text-red-500">¥{stats?.rankingRewards?.quality.rank410 || 300}</span>
                </div>
                <div className="text-xs md:text-sm text-gray-500">方言新秀证书</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Honor List Preview */}
      <section className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6 md:mb-8">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">荣誉榜单</h2>
            <p className="text-gray-500 mt-1 text-xs md:text-sm">感谢每一位为方言传承做出贡献的守护者</p>
          </div>
          <Link to="/ranking" className="text-gray-500 hover:text-primary transition-colors text-sm font-medium">查看全部</Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {honorList.length > 0 ? (
            honorList.map((item) => (
              <div key={item.id} className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-white hover:shadow-md transition-all">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-lg ${
                  item.rank === 1 ? 'bg-yellow-400' : item.rank === 2 ? 'bg-gray-400' : 'bg-orange-400'
                }`}>
                  {item.rank}
                </div>
                <div>
                  <div className="font-bold text-gray-900">{item.user.name}</div>
                  <div className="text-xs text-gray-500">累计录制 {(item.duration / 3600).toFixed(1)} 小时</div>
                </div>
              </div>
            ))
          ) : (
             <div className="col-span-1 md:col-span-3 text-center py-8 text-gray-400">暂无上榜数据</div>
          )}
        </div>
      </section>
    </Layout>
  );
};
