import { useEffect, useState } from 'react';
import { Layout } from '../components/layout';
// import { useAuthStore } from '../features/auth/hooks/useAuthStore';
import { Link } from 'react-router-dom';
import { Mic, MapPin, Globe, Sparkles, Users } from 'lucide-react';
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
      {/* Hero Section - 突出两期招募 */}
      <section className="relative min-h-[380px] md:min-h-[420px] rounded-3xl overflow-hidden mb-6 flex items-center shadow-2xl">
        {/* Background Image - Changsha Cityscape */}
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ 
          backgroundImage: `url(${changshaBg})`,
          filter: 'brightness(0.65)'
        }}></div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-red-900/80 via-purple-900/70 to-blue-900/80"></div>
        
        <div className="relative z-10 px-6 md:px-12 w-full">
          <div className="max-w-5xl">
            {/* 顶部标签 */}
            <div className="flex flex-wrap gap-2 mb-4">
              <div className="inline-flex items-center gap-2 py-2 px-4 rounded-full bg-red-600/40 text-red-100 text-xs md:text-sm font-medium backdrop-blur-sm border border-red-500/40">
                <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse"></span>
                一期长沙话
              </div>
              <div className="inline-flex items-center gap-2 py-2 px-4 rounded-full bg-blue-600/40 text-blue-100 text-xs md:text-sm font-medium backdrop-blur-sm border border-blue-500/40">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
                二期多语种
              </div>
            </div>

            {/* 主标题 */}
            <h1 className="text-3xl md:text-5xl font-bold font-brand mb-4 leading-tight text-white drop-shadow-lg">
              寻觅方言守护者
            </h1>

            {/* 两期并排展示 */}
            <div className="flex flex-wrap gap-3 mb-5">
              <span className="px-4 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-full text-sm font-bold shadow-lg">
                🔥 一期 · 长沙话招募中
              </span>
              <span className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full text-sm font-bold shadow-lg">
                🌍 二期 · 22种方言招募中
              </span>
            </div>

            <p className="text-base md:text-lg text-gray-100 mb-5 leading-relaxed max-w-2xl font-light">
              每一种方言都是文化的活化石。加入我们，用最地道的乡音，记录城市的记忆。
              <span className="text-yellow-300 font-medium block mt-1">
                参与录制即可获得 {stats?.rewardRateRange || '80-120'}元/小时 奖励
              </span>
            </p>
            
            {/* 按钮组 */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <Link to="/join-guardian" className="px-8 py-3 bg-gradient-to-r from-red-600 to-orange-500 text-white font-bold text-base rounded-full hover:from-red-700 hover:to-orange-600 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center justify-center gap-2">
                <Mic size={18} />
                立即加入守护
              </Link>
              <Link to="/guide" className="px-8 py-3 bg-white/10 backdrop-blur-md border border-white/30 text-white font-bold text-base rounded-full hover:bg-white/20 transition-all flex items-center justify-center gap-2">
                了解规则
              </Link>
            </div>

            {/* Key Metrics */}
            <div className="flex flex-wrap gap-6 pt-4 border-t border-white/10">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-yellow-400" />
                <span className="text-white text-xl md:text-2xl font-bold font-brand">{stats?.totalUsers || 0}+</span>
                <span className="text-gray-300 text-xs">守护者</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-yellow-400 text-xl md:text-2xl font-bold font-brand">{stats?.totalDurationHours || 0}h</span>
                <span className="text-gray-300 text-xs">已采集</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-yellow-400 text-xl md:text-2xl font-bold font-brand">{stats?.statsConfig?.singleLimit || '20h'}</span>
                <span className="text-gray-300 text-xs">单人上限</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Phase 1 & 2 Dialects Grid - 并排展示 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6">
        {/* Phase 1 - Current */}
        <section className="bg-gradient-to-br from-red-50 to-orange-50 rounded-3xl p-5 md:p-6 shadow-sm border-2 border-red-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">一期 · 正在进行</h2>
              <p className="text-sm text-red-600 font-medium">火热招募中</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-red-100 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-red-100 to-orange-100 flex items-center justify-center text-3xl border-2 border-red-200">
                🔥
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">长沙话</h3>
                <p className="text-sm text-gray-500">Hunan Changsha Dialect</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-5 leading-relaxed">
              湘语代表，湖湘文化的重要载体。长沙话保留了大量古汉语词汇，是研究汉语演变的活化石。
            </p>
            <Link 
              to="/join-guardian" 
              className="block w-full py-3 bg-gradient-to-r from-red-600 to-orange-500 text-white text-center rounded-xl font-bold hover:from-red-700 hover:to-orange-600 transition-all shadow-md"
            >
              立即参与录制
            </Link>
          </div>
        </section>

        {/* Phase 2 - Now Recruiting */}
        <section className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-5 md:p-6 shadow-sm border-2 border-blue-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">二期 · 正在进行</h2>
              <p className="text-sm text-blue-600 font-medium">火热招募中</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-blue-100 shadow-sm">
            {/* 国内方言 */}
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-red-500" />
                国内方言
                <span className="text-xs font-normal text-gray-400">({domesticDialects.length}种)</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {domesticDialects.map((dialect) => (
                  <span
                    key={dialect}
                    className="px-2.5 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-200 transition-colors"
                  >
                    {dialect}
                  </span>
                ))}
              </div>
            </div>

            {/* 外语口音 */}
            <div className="mb-5">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-500" />
                外语口音
                <span className="text-xs font-normal text-gray-400">({foreignDialects.length}种)</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {foreignDialects.map((dialect) => (
                  <span
                    key={dialect}
                    className="px-2.5 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-200 transition-colors"
                  >
                    {dialect}
                  </span>
                ))}
              </div>
            </div>

            {/* 招募按钮 */}
            <Link 
              to="/join-guardian" 
              className="block w-full py-3 bg-gradient-to-r from-blue-600 to-purple-500 text-white text-center rounded-xl font-bold hover:from-blue-700 hover:to-purple-600 transition-all shadow-md"
            >
              立即参与录制
            </Link>
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
