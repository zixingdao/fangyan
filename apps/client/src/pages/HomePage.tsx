import { useEffect, useState } from 'react';
import { Layout } from '../components/layout';
// import { useAuthStore } from '../features/auth/hooks/useAuthStore';
import { Link } from 'react-router-dom';
import { Mic, MapPin, Globe, Sparkles } from 'lucide-react';
import { getSystemStats, SystemStats } from '../features/system/api/system';
// import { getRankings, RankingItem } from '../features/ranking/api/rankings';
// import { RankType } from '@changsha/shared';
import changshaBg from '../assets/images/changsha-bg.png';

// 二期方言数据
const domesticDialects = ['河南话', '山西话', '陕西话', '湖南话', '闽南语', '客家话', '上海话', '济南话', '青岛话', '杭州话', '苏州话', '宁波话', '温州话', '南昌话', '潮汕话'];
const foreignDialects = ['英语（口音地区）', '西班牙语', '葡萄牙语', '日语', '印尼语', '泰语', '马来西亚语'];

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
      {/* Hero Section - 减小高度 */}
      <section className="relative min-h-[400px] md:min-h-[450px] rounded-3xl overflow-hidden mb-6 flex items-center shadow-2xl">
        {/* Background Image - Changsha Cityscape */}
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ 
          backgroundImage: `url(${changshaBg})`,
          filter: 'brightness(0.7)'
        }}></div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-red-900/80 via-red-800/60 to-transparent"></div>
        
        <div className="relative z-10 px-6 md:px-12 w-full">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 py-2 px-4 rounded-full bg-red-600/30 text-red-100 text-xs md:text-sm font-medium mb-4 backdrop-blur-sm border border-red-500/30">
              <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse"></span>
              邵阳学院 × 方言守护计划 · 一期长沙
            </div>

            <h1 className="text-3xl md:text-5xl font-bold font-brand mb-4 leading-tight text-white drop-shadow-lg">
              寻觅方言守护者<br/>
              <span className="text-yellow-400">一期 · 长沙</span>
            </h1>

            <p className="text-base md:text-lg text-gray-100 mb-4 leading-relaxed max-w-2xl font-light">
              每一种方言都是文化的活化石。加入我们，用最地道的乡音，记录城市的记忆。
              <span className="text-yellow-300 font-medium ml-2">
                参与录制即可获得 {stats?.rewardRateRange || '80-120'}元/小时 奖励
              </span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <Link to="/join-guardian" className="px-6 md:px-8 py-2.5 md:py-3 bg-red-600 text-white font-bold text-base rounded-full hover:bg-red-700 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center justify-center gap-2">
                <Mic size={18} />
                加入守护
              </Link>
              <Link to="/guide" className="px-6 md:px-8 py-2.5 md:py-3 bg-white/10 backdrop-blur-md border border-white/30 text-white font-bold text-base rounded-full hover:bg-white/20 transition-all flex items-center justify-center gap-2">
                了解规则
              </Link>
            </div>

            {/* Key Metrics */}
            <div className="flex flex-wrap gap-4 md:gap-6 pt-4 border-t border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-yellow-400 text-xl md:text-2xl font-bold font-brand">{stats?.statsConfig?.singleLimit || '20h'}</span>
                <span className="text-gray-300 text-xs">单人上限</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-yellow-400 text-xl md:text-2xl font-bold font-brand">{stats?.statsConfig?.multiLimit || '100h'}</span>
                <span className="text-gray-300 text-xs">多人上限</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-white text-xl md:text-2xl font-bold font-brand">{stats?.totalUsers || 0}+</span>
                <span className="text-gray-300 text-xs">已参与</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-white text-xl md:text-2xl font-bold font-brand">{stats?.totalDurationHours || 0}h</span>
                <span className="text-gray-300 text-xs">已采集</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Phase 1 & 2 Dialects Grid - 并排展示 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6">
        {/* Phase 1 - Current */}
        <section className="bg-gradient-to-br from-red-50 to-orange-50 rounded-3xl p-5 md:p-6 shadow-sm border border-red-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-bold text-gray-900">一期 · 正在进行</h2>
              <p className="text-xs text-red-600 font-medium">火热招募中</p>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-red-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center text-2xl">
                🔥
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">长沙话</h3>
                <p className="text-xs text-gray-500">Hunan Changsha</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              湘语代表，湖湘文化的重要载体。加入我们，用纯正长沙话记录城市记忆。
            </p>
            <Link 
              to="/join-guardian" 
              className="block w-full py-2.5 bg-red-600 text-white text-center rounded-xl font-medium hover:bg-red-700 transition-colors"
            >
              立即参与录制
            </Link>
          </div>
        </section>

        {/* Phase 2 - Coming Soon */}
        <section className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-5 md:p-6 shadow-sm border border-blue-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-bold text-gray-900">二期 · 即将开启</h2>
              <p className="text-xs text-blue-600 font-medium">敬请期待</p>
            </div>
          </div>

          {/* 国内方言 */}
          <div className="mb-4">
            <h3 className="text-xs font-semibold text-gray-600 mb-2 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-red-500" />
              国内方言
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {domesticDialects.map((dialect) => (
                <span
                  key={dialect}
                  className="px-2 py-1 bg-white/80 text-gray-700 rounded-lg text-xs font-medium border border-gray-200"
                >
                  {dialect}
                </span>
              ))}
            </div>
          </div>

          {/* 外语口音 */}
          <div>
            <h3 className="text-xs font-semibold text-gray-600 mb-2 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-blue-500" />
              外语口音
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {foreignDialects.map((dialect) => (
                <span
                  key={dialect}
                  className="px-2 py-1 bg-blue-100/50 text-blue-700 rounded-lg text-xs font-medium border border-blue-200"
                >
                  {dialect}
                </span>
              ))}
            </div>
          </div>
        </section>
      </div>

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
