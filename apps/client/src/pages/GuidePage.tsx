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
      <div className="flex flex-col lg:flex-row h-auto lg:h-[calc(100vh-140px)] bg-white lg:rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Sidebar / Mobile Header */}
        <div className="w-full lg:w-[320px] bg-gray-50/50 border-b lg:border-b-0 lg:border-r border-gray-100 flex flex-col shrink-0">
          {/* Mode Switch */}
          <div className="p-4 lg:p-5 border-b border-gray-100 bg-white">
            <div className="bg-gray-100 p-1 rounded-xl flex">
              <button
                onClick={() => setCurrentMode('single')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 lg:py-2.5 text-sm font-medium rounded-lg transition-all ${
                  currentMode === 'single' 
                    ? 'bg-white text-primary shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <User size={16} className="lg:w-[18px] lg:h-[18px]" />
                单人录制
              </button>
              <button
                onClick={() => setCurrentMode('multi')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 lg:py-2.5 text-sm font-medium rounded-lg transition-all ${
                  currentMode === 'multi' 
                    ? 'bg-white text-primary shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Users size={16} className="lg:w-[18px] lg:h-[18px]" />
                多人对话
              </button>
            </div>
          </div>

          {/* Mobile Topic Selector (Horizontal Scroll) */}
          <div className="lg:hidden w-full overflow-x-auto custom-scrollbar bg-white border-b border-gray-100">
            <div className="flex px-4 py-3 gap-3 min-w-max">
              {currentData.scenarios.map((item: any, index: number) => (
                <button
                  key={index}
                  onClick={() => setCurrentTopicIndex(index)}
                  className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap border ${
                    currentTopicIndex === index
                      ? 'bg-primary/10 border-primary/20 text-primary shadow-sm'
                      : 'bg-white border-gray-100 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${
                    currentTopicIndex === index ? 'text-primary/70' : 'text-gray-300'
                  }`}>
                    Topic {index + 1}
                  </span>
                  <span className="text-sm font-bold">{item.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Desktop Topic List (Vertical) */}
          <div className="hidden lg:block flex-1 overflow-y-auto p-4 custom-scrollbar">
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

          {/* Desktop Tips Box */}
          <div className="hidden lg:block p-5 bg-yellow-50/50 border-t border-yellow-100">
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
        <div className="flex-1 flex flex-col bg-white overflow-hidden relative min-h-[500px]">
          <div className="flex-1 overflow-y-auto p-5 lg:p-12 custom-scrollbar">
            <div className="max-w-3xl mx-auto pb-10">
              {/* Header */}
              <div className="mb-6 lg:mb-10 text-center">
                <h2 className="text-2xl lg:text-4xl font-bold text-gray-900 mb-3 lg:mb-4 font-brand tracking-wide">
                  {currentScenario.title}
                </h2>
                {currentScenario.description && (
                  <div className="relative">
                    <p className="text-sm lg:text-lg text-gray-500 font-light leading-relaxed max-w-2xl mx-auto px-4 lg:px-0">
                      {currentScenario.description}
                    </p>
                    <div className="lg:hidden absolute left-1/2 -translate-x-1/2 -bottom-3 w-12 h-1 bg-primary/20 rounded-full"></div>
                  </div>
                )}
              </div>

              {/* Mobile Tips (Collapsible or simplified) */}
              <div className="lg:hidden mb-8">
                 <div className="bg-amber-50 rounded-2xl p-5 border border-amber-100 shadow-sm">
                   <div className="flex items-center gap-2 text-amber-900 font-bold mb-3 text-sm">
                    <Lightbulb size={18} className="text-amber-600" />
                    <span>录制小贴士</span>
                  </div>
                  <div className="text-sm text-amber-950 leading-relaxed grid grid-cols-1 gap-2.5 pl-1">
                     {(currentData.tips || []).slice(0, 3).map((tip: string, idx: number) => (
                       <div key={idx} className="flex items-start gap-2">
                         <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0"></span>
                         <span>{tip}</span>
                       </div>
                     ))}
                  </div>
                 </div>
              </div>

              {/* Angles */}
              {currentScenario.angles && (
                <div className="mb-6 lg:mb-10 bg-indigo-50 border border-indigo-100 rounded-2xl p-5 lg:p-6">
                  <div className="text-indigo-800 font-bold mb-4 lg:mb-4 flex items-center gap-2 text-sm lg:text-base">
                    <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                    推荐叙述角度
                  </div>
                  <div className="grid gap-3 lg:gap-3">
                    {currentScenario.angles?.map((angle: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-3 text-gray-800 bg-white p-3.5 lg:p-3 rounded-xl border border-indigo-100/50 shadow-sm text-sm lg:text-base">
                        <span className="text-indigo-400 mt-0.5 font-bold shrink-0">•</span>
                        <span className="leading-relaxed break-words w-full">{angle}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Prompter Content */}
              <div className="bg-gray-50 rounded-2xl lg:rounded-3xl p-6 lg:p-10 shadow-inner">
                {currentMode === 'single' ? (
                  <div className="space-y-4 lg:space-y-6">
                    {currentScenario.questions?.map((q: string, idx: number) => (
                      <div key={idx} className="text-lg lg:text-2xl text-gray-700 font-medium leading-relaxed hover:text-primary transition-colors cursor-default">
                        {q}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-wrap justify-center gap-3 lg:gap-4">
                    {currentScenario.topics?.map((topic: string, idx: number) => (
                      <div 
                        key={idx} 
                        className="px-4 py-3 lg:px-6 lg:py-4 bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-100 text-base lg:text-lg text-gray-600 font-medium flex items-center gap-2 lg:gap-3 hover:border-primary/30 hover:shadow-md transition-all w-full lg:w-auto justify-center"
                      >
                        <MessageCircle size={18} className="text-primary/60 lg:w-5 lg:h-5" />
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
