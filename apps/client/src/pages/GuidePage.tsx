import { useState, useMemo, useEffect } from 'react';
import { Layout } from '../components/layout';
import { getGuideContent } from '../features/system/api/guide';
import { User, Users, Lightbulb, ChevronRight, MessageCircle } from 'lucide-react';

type Mode = 'single' | 'multi';

export const GuidePage = () => {
  const [currentMode, setCurrentMode] = useState<Mode>('single');
  const [currentTopicIndex, setCurrentTopicIndex] = useState(0);
  const [guideData, setGuideData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getGuideContent();
        setGuideData(data);
      } catch (error) {
        console.error("Failed to fetch guide content:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Reset topic index when mode changes
  useEffect(() => {
    setCurrentTopicIndex(0);
  }, [currentMode]);

  const currentData = useMemo(() => {
    if (!guideData) return null;
    return guideData[currentMode];
  }, [guideData, currentMode]);

  const currentScenario = useMemo(() => {
    if (!currentData) return null;
    return currentData.scenarios[currentTopicIndex];
  }, [currentData, currentTopicIndex]);

  if (loading || !guideData || !currentData || !currentScenario) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-[calc(100vh-140px)]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex flex-col lg:flex-row h-[calc(100vh-140px)] bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Sidebar */}
        <div className="w-full lg:w-[320px] bg-gray-50/50 border-r border-gray-100 flex flex-col">
          {/* Mode Switch */}
          <div className="p-5 border-b border-gray-100 bg-white">
            <div className="bg-gray-100 p-1 rounded-xl flex">
              <button
                onClick={() => setCurrentMode('single')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all ${
                  currentMode === 'single' 
                    ? 'bg-white text-primary shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <User size={18} />
                单人录制
              </button>
              <button
                onClick={() => setCurrentMode('multi')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all ${
                  currentMode === 'multi' 
                    ? 'bg-white text-primary shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Users size={18} />
                多人对话
              </button>
            </div>
          </div>

          {/* Topic List */}
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2">话题列表</div>
            <div className="space-y-1">
              {currentData.scenarios.map((item: any, index: number) => (
                <button
                  key={index}
                  onClick={() => setCurrentTopicIndex(index)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                    currentTopicIndex === index
                      ? 'bg-primary/5 text-primary'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    currentTopicIndex === index ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                    {index + 1}
                  </span>
                  <span className="font-medium truncate">{item.title}</span>
                  {currentTopicIndex === index && <ChevronRight size={16} className="ml-auto opacity-50" />}
                </button>
              ))}
            </div>
          </div>

          {/* Tips Box */}
          <div className="p-5 bg-yellow-50/50 border-t border-yellow-100">
            <div className="flex items-center gap-2 text-yellow-700 font-bold mb-3 text-sm">
              <Lightbulb size={16} />
              录制小贴士
            </div>
            <ul className="space-y-2 text-xs text-yellow-800/80 list-disc pl-4 leading-relaxed">
              {currentData.tips?.slice(0, 4).map((tip: string, index: number) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col bg-white overflow-hidden relative">
          <div className="flex-1 overflow-y-auto p-8 lg:p-12 custom-scrollbar">
            <div className="max-w-3xl mx-auto">
              {/* Header */}
              <div className="mb-10 text-center">
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 font-brand tracking-wide">
                  {currentScenario.title}
                </h2>
                {currentScenario.description && (
                  <p className="text-lg text-gray-500 font-light leading-relaxed max-w-2xl mx-auto">
                    {currentScenario.description}
                  </p>
                )}
              </div>

              {/* Angles */}
              {currentScenario.angles && (
                <div className="mb-10 bg-blue-50/50 border border-blue-100 rounded-2xl p-6">
                  <div className="text-blue-600 font-bold mb-4 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                    推荐叙述角度
                  </div>
                  <div className="grid gap-3">
                    {currentScenario.angles?.map((angle: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-3 text-gray-600 bg-white/60 p-3 rounded-lg">
                        <span className="text-blue-400 mt-1">•</span>
                        {angle}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Prompter Content */}
              <div className="bg-gray-50 rounded-3xl p-8 lg:p-10 shadow-inner">
                {currentMode === 'single' ? (
                  <div className="space-y-6">
                    {currentScenario.questions?.map((q: string, idx: number) => (
                      <div key={idx} className="text-xl lg:text-2xl text-gray-700 font-medium leading-relaxed hover:text-primary transition-colors cursor-default">
                        {q}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-wrap justify-center gap-4">
                    {currentScenario.topics?.map((topic: string, idx: number) => (
                      <div 
                        key={idx} 
                        className="px-6 py-4 bg-white rounded-2xl shadow-sm border border-gray-100 text-lg text-gray-600 font-medium flex items-center gap-3 hover:border-primary/30 hover:shadow-md transition-all"
                      >
                        <MessageCircle size={20} className="text-primary/60" />
                        {topic}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
