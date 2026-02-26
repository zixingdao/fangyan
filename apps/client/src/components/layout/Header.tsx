import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../features/auth/hooks/useAuthStore';
import { LogOut, User as UserIcon, Menu, X } from 'lucide-react';
import { useState } from 'react';

export const Header = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="fixed top-0 w-full h-[70px] bg-white/80 backdrop-blur-md border-b border-gray-100 z-50 transition-all duration-300">
      <div className="max-w-[1200px] mx-auto px-4 h-full flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white font-brand text-2xl shadow-lg group-hover:scale-105 transition-transform">
            湘
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold text-gray-800 font-brand tracking-wide">长沙方言</span>
            <span className="text-xs text-gray-500 tracking-wider">守护计划</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-gray-600 hover:text-primary font-medium transition-colors">首页</Link>
          <Link to="/ranking" className="text-gray-600 hover:text-primary font-medium transition-colors">排行榜</Link>
          <Link to="/guide" className="text-gray-600 hover:text-primary font-medium transition-colors">录制指南</Link>
        </nav>

        {/* User Actions */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <Link to="/profile" className="flex items-center gap-2 text-gray-700 hover:text-primary transition-colors">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <UserIcon size={18} />
                </div>
                <span className="font-medium">{user.name}</span>
              </Link>
              <button 
                onClick={handleLogout}
                className="text-gray-400 hover:text-red-500 transition-colors"
                title="退出登录"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login-info" className="text-gray-600 hover:text-primary font-medium">登录</Link>
              <Link to="/join-plan" className="px-4 py-2 bg-primary text-white rounded-full hover:bg-primary-dark transition-colors shadow-md hover:shadow-lg">
                加入计划
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-gray-600"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-[70px] left-0 w-full bg-white border-b border-gray-100 shadow-lg py-4 px-4 flex flex-col gap-4">
          <Link to="/" className="text-gray-600 font-medium py-2">首页</Link>
          <Link to="/ranking" className="text-gray-600 font-medium py-2">排行榜</Link>
          <Link to="/guide" className="text-gray-600 font-medium py-2">录制指南</Link>
          <div className="h-px bg-gray-100 my-2"></div>
          {user ? (
            <>
              <Link to="/profile" className="flex items-center gap-2 text-gray-700 font-medium py-2">
                <UserIcon size={18} />
                个人中心
              </Link>
              <button onClick={handleLogout} className="flex items-center gap-2 text-red-500 font-medium py-2 w-full text-left">
                <LogOut size={18} />
                退出登录
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-3 mt-2">
              <Link to="/login-info" className="w-full text-center py-2 border border-gray-200 rounded-lg text-gray-600">登录</Link>
              <Link to="/join-plan" className="w-full text-center py-2 bg-primary text-white rounded-lg">加入计划</Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
