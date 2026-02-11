import { Layout } from '../components/layout';
import { AlertCircle, CheckCircle, Lock } from 'lucide-react';
import { UserStatus } from '@changsha/shared';
import { useAuthStore } from '../features/auth/hooks/useAuthStore';

export const UploadPage = () => {
  const { user } = useAuthStore();

  // 检查是否试音通过
  // @ts-ignore - TRIAL_PASSED might be missing in shared package build
  const isTrialPassed = user?.status === UserStatus.TRIAL_PASSED || user?.status === UserStatus.APPROVED;

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 md:px-0">
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 text-center">
          <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">加入长沙方言守护计划</h1>
          
          <div className="mb-6 md:mb-8">
            <div className="w-40 h-40 md:w-48 md:h-48 bg-gray-100 mx-auto rounded-xl flex items-center justify-center mb-4 border-2 border-dashed border-gray-300">
              {/* Placeholder for QR Code */}
              <span className="text-gray-400 font-medium text-xs md:text-base">试音二维码占位</span>
            </div>
            <p className="text-gray-500 text-xs md:text-sm">扫描上方二维码进行试音</p>
          </div>

          <div className="mb-6 md:mb-8 p-4 bg-yellow-50 rounded-xl border border-yellow-100 text-left">
            <h3 className="font-bold text-yellow-800 mb-2 flex items-center gap-2 text-sm md:text-base">
              <AlertCircle size={18} />
              试音说明
            </h3>
            <p className="text-xs md:text-sm text-yellow-700 leading-relaxed mb-4">
              为了确保语料质量，所有新用户需先完成试音。
              <br/>
              1. 请扫描上方二维码进入试音页面。
              <br/>
              2. 使用纯正长沙话朗读指定文本。
              <br/>
              3. 提交后请等待管理员审核，审核通过后即可正式参与录制并获得奖励。
            </p>
            
            <div className="pt-4 border-t border-yellow-200">
              <p className="text-xs md:text-sm text-yellow-800 font-bold mb-2">加入官方钉钉群：</p>
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-lg flex items-center justify-center border border-yellow-200">
                  <span className="text-[10px] md:text-xs text-gray-400">钉钉群二维码</span>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-xs text-yellow-700">扫码或点击链接加入</span>
                  <a href="#" className="text-xs text-primary underline hover:text-primary-dark">点击加入钉钉群 &rarr;</a>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center justify-center gap-2">
              {isTrialPassed ? <CheckCircle className="text-green-500" size={20} /> : <Lock className="text-gray-400" size={20} />}
              正式录制通道
            </h3>
            
            {isTrialPassed ? (
              <div className="text-left">
                <div className="p-4 bg-green-50 rounded-xl border border-green-100 mb-4 text-green-800 text-sm">
                  🎉 恭喜！您已通过试音考核，可以参与正式录制任务。
                </div>
                {/* 恢复之前的上传表单逻辑或跳转到专门的录制页 */}
                <p className="text-gray-600 mb-4">
                  请点击下方链接查看正式录制流程和规范。
                </p>
                <a 
                  href="/guide" 
                  className="block w-full py-3 bg-white border-2 border-primary text-primary rounded-xl font-bold hover:bg-primary hover:text-white transition-colors text-center"
                >
                  查看录制流程 &rarr;
                </a>
              </div>
            ) : (
              <div className="p-6 bg-gray-50 rounded-xl text-gray-500 text-sm">
                <p>完成试音并审核通过后，此处将解锁正式录制入口。</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};
