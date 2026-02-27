import { useEffect, useState } from 'react';
import { Layout } from '../components/layout';
// import { useAuthStore } from '../features/auth/hooks/useAuthStore';
import { Link } from 'react-router-dom';
import { Mic } from 'lucide-react';
import { getSystemStats, SystemStats } from '../features/system/api/system';
// import { getRankings, RankingItem } from '../features/ranking/api/rankings';
// import { RankType } from '@changsha/shared';
import changshaBg from '../assets/images/changsha-bg.png';

export const HomePage = () => {
  // const { user } = useAuthStore(); // Temporarily unused
  const [stats, setStats] = useState<SystemStats | null>(null);
  // const [honorList, setHonorList] = useState<RankingItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const [statsData, rankingsData] = await Promise.all([
        //   getSystemStats(),
        //   getRankings(RankType.TOTAL, 3)
        // ]);
        // setStats(statsData);
        // setHonorList(rankingsData);
        const statsData = await getSystemStats();
        setStats(statsData);
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
            邵阳学院 × 方言守护计划 · 一期长沙
          </div>

          <h1 className="text-4xl md:text-7xl font-bold font-brand mb-4 md:mb-6 leading-tight text-white drop-shadow-lg">
            寻觅方言守护者<br/>
            <span className="text-yellow-400">一期 · 长沙</span>
          </h1>

          <p className="text-base md:text-xl text-gray-100 mb-6 md:mb-8 leading-relaxed max-w-2xl font-light">
            每一种方言都是文化的活化石。加入我们，用最地道的乡音，记录城市的记忆。
            <br/>
            <span className="text-yellow-300 font-medium mt-2 block text-xl md:text-2xl">
              参与录制即可获得 {stats?.rewardRateRange || '80-120'}元/小时 奖励
            </span>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-8 md:mb-12">
            <Link to="/join-guardian" className="px-8 md:px-10 py-3 md:py-4 bg-red-600 text-white font-bold text-base md:text-lg rounded-full hover:bg-red-700 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center justify-center gap-3">
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
              <div className="text-yellow-400 text-2xl md:text-3xl font-bold font-brand mb-1">
                {stats?.statsConfig?.singleLimit || '20h'}
              </div>
              <div className="text-gray-300 text-xs md:text-sm">单人录制上限</div>
            </div>
            <div>
              <div className="text-yellow-400 text-2xl md:text-3xl font-bold font-brand mb-1">
                {stats?.statsConfig?.multiLimit || '100h'}
              </div>
              <div className="text-gray-300 text-xs md:text-sm">多人对话上限</div>
            </div>
            <div>
              <div className="text-white text-2xl md:text-3xl font-bold font-brand mb-1">{stats?.totalUsers || 0}+</div>
              <div className="text-gray-300 text-xs md:text-sm">
                {stats?.statsConfig?.participantsLabel || '已参与人数'}
              </div>
            </div>
            <div>
              <div className="text-white text-2xl md:text-3xl font-bold font-brand mb-1">{stats?.totalDurationHours || 0}h</div>
              <div className="text-gray-300 text-xs md:text-sm">
                {stats?.statsConfig?.durationLabel || '已采集时长'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rewards Info Section - 隐藏排行榜奖励 */}
      {/*
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8 mb-8 md:mb-16">
        ... 时长荣誉榜奖励和质量之星榜奖励内容 ...
      </div>
      */}

      {/* Honor List Preview - 隐藏荣誉榜单 */}
      {/*
      <section className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
        ... 荣誉榜单内容 ...
      </section>
      */}
    </Layout>
  );
};
