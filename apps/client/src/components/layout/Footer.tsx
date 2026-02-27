import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-[#2c3e50] text-white py-12 mt-auto">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 关于我们 */}
          <div>
            <h3 className="text-lg font-bold mb-4 font-brand tracking-wider">方言守护计划</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              致力于保护和传承方言文化，<br/>
              记录每一句地道的乡音，<br/>
              让方言的声音永远流传。
            </p>
          </div>

          {/* 快速链接 */}
          <div>
            <h3 className="text-lg font-bold mb-4">快速链接</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/guide" className="hover:text-white transition-colors">录制指南</Link></li>
              <li><Link to="/topics" className="hover:text-white transition-colors">热门话题</Link></li>
              {/* <li><Link to="/ranking" className="hover:text-white transition-colors">荣誉榜单</Link></li> */}
              <li><Link to="/about" className="hover:text-white transition-colors">关于计划</Link></li>
            </ul>
          </div>

          {/* 加入我们 */}
          <div>
            <h3 className="text-lg font-bold mb-4">加入我们</h3>
            <div className="text-sm text-gray-400 space-y-2">
              <p>📍 湖南省邵阳市大祥区七里坪校区</p>
              <p>
                <Link
                  to="/join-plan"
                  className="hover:text-white transition-colors"
                >
                  📝 加入计划
                </Link>
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-10 pt-6 text-center text-xs text-gray-500">
          <p>© 2026 方言守护计划 · 一期长沙。All rights reserved.</p>
          <p className="mt-2">Designed with ❤️ by Dialect Guardian Team</p>
        </div>
      </div>
    </footer>
  );
};
