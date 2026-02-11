import { useEffect, useState } from 'react';
import { api } from '../lib/axios';
import { Save, Loader2, Trophy, Award, DollarSign, Megaphone } from 'lucide-react';

export const SettingsPage = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form states
  const [rateMin, setRateMin] = useState('80');
  const [rateMax, setRateMax] = useState('120');
  
  // Ranking rewards
  const [durationRank1, setDurationRank1] = useState('2000');
  const [durationRank23, setDurationRank23] = useState('500');
  const [durationRank410, setDurationRank410] = useState('200');
  
  const [qualityRank1, setQualityRank1] = useState('2000');
  const [qualityRank23, setQualityRank23] = useState('600');
  const [qualityRank410, setQualityRank410] = useState('300');

  const [announcement, setAnnouncement] = useState('');

  useEffect(() => {
    fetchConfigs();
  }, []);

  const fetchConfigs = async () => {
    try {
      setLoading(true);
      const data: any[] = await api.get('/system/configs');
      
      const getValue = (key: string) => data.find(c => c.key === key)?.value;

      setRateMin(getValue('hourly_rate_min') || '80');
      setRateMax(getValue('hourly_rate_max') || '120');
      setAnnouncement(getValue('announcement') || '');
      
      setDurationRank1(getValue('duration_rank_1') || '2000');
      setDurationRank23(getValue('duration_rank_2_3') || '500');
      setDurationRank410(getValue('duration_rank_4_10') || '200');
      
      setQualityRank1(getValue('quality_rank_1') || '2000');
      setQualityRank23(getValue('quality_rank_2_3') || '600');
      setQualityRank410(getValue('quality_rank_4_10') || '300');

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await Promise.all([
        api.post('/system/configs', { key: 'hourly_rate_min', value: rateMin }),
        api.post('/system/configs', { key: 'hourly_rate_max', value: rateMax }),
        api.post('/system/configs', { key: 'announcement', value: announcement }),
        
        api.post('/system/configs', { key: 'duration_rank_1', value: durationRank1 }),
        api.post('/system/configs', { key: 'duration_rank_2_3', value: durationRank23 }),
        api.post('/system/configs', { key: 'duration_rank_4_10', value: durationRank410 }),
        
        api.post('/system/configs', { key: 'quality_rank_1', value: qualityRank1 }),
        api.post('/system/configs', { key: 'quality_rank_2_3', value: qualityRank23 }),
        api.post('/system/configs', { key: 'quality_rank_4_10', value: qualityRank410 }),
      ]);
      alert('保存成功');
    } catch (error) {
      console.error(error);
      alert('保存失败');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>加载中...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">系统设置</h1>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-8">
        {/* Reward Settings */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            薪酬参数配置
          </h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">最小奖励金 (元/小时)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">¥</span>
                <input
                  type="number"
                  value={rateMin}
                  onChange={(e) => setRateMin(e.target.value)}
                  className="w-full pl-8 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">最大奖励金 (元/小时)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">¥</span>
                <input
                  type="number"
                  value={rateMax}
                  onChange={(e) => setRateMax(e.target.value)}
                  className="w-full pl-8 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none transition-all"
                />
              </div>
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-500">此范围将显示在首页和用户端，并用于计算预计奖励。</p>
        </div>

        {/* Duration Ranking Config */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            时长荣誉榜奖金配置
          </h2>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">第1名 (元)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">¥</span>
                <input
                  type="number"
                  value={durationRank1}
                  onChange={(e) => setDurationRank1(e.target.value)}
                  className="w-full pl-8 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">第2-3名 (元)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">¥</span>
                <input
                  type="number"
                  value={durationRank23}
                  onChange={(e) => setDurationRank23(e.target.value)}
                  className="w-full pl-8 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">第4-10名 (元)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">¥</span>
                <input
                  type="number"
                  value={durationRank410}
                  onChange={(e) => setDurationRank410(e.target.value)}
                  className="w-full pl-8 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Quality Ranking Config */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2 flex items-center gap-2">
            <Award className="w-5 h-5 text-purple-500" />
            质量之星榜奖金配置
          </h2>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">第1名 (元)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">¥</span>
                <input
                  type="number"
                  value={qualityRank1}
                  onChange={(e) => setQualityRank1(e.target.value)}
                  className="w-full pl-8 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">第2-3名 (元)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">¥</span>
                <input
                  type="number"
                  value={qualityRank23}
                  onChange={(e) => setQualityRank23(e.target.value)}
                  className="w-full pl-8 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">第4-10名 (元)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">¥</span>
                <input
                  type="number"
                  value={qualityRank410}
                  onChange={(e) => setQualityRank410(e.target.value)}
                  className="w-full pl-8 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Announcement */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2 flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-blue-500" />
            公告配置
          </h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">系统公告</label>
            <textarea
              value={announcement}
              onChange={(e) => setAnnouncement(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-8 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? <Loader2 className="animate-spin" /> : <Save size={20} />}
            保存配置
          </button>
        </div>
      </div>
    </div>
  );
};
