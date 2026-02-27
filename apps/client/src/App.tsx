import React, { Component, ErrorInfo, ReactNode } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './features/auth/hooks/useAuthStore';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
// import { RankingPage } from './pages/RankingPage';
import { UploadPage } from './pages/UploadPage';
import { ProfilePage } from './pages/ProfilePage';
import { GuidePage } from './pages/GuidePage';
import { DynamicPage } from './pages/DynamicPage';

// 简单的错误边界组件
class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">哎呀，页面出错了</h1>
          <p className="text-gray-600 mb-6">可能是网络波动或版本更新导致的资源加载失败。</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            刷新重试
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// 路由保护组件
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuthStore();
  return user ? <>{children}</> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <ErrorBoundary>
      <HashRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          <Route path="/" element={<HomePage />} />
          {/* <Route path="/ranking" element={<RankingPage />} /> */}
          <Route path="/guide" element={<GuidePage />} />
          
          {/* Dynamic Pages */}
          <Route path="/join-guardian" element={<DynamicPage pageType="join_guardian" />} />
          <Route path="/join-plan" element={<DynamicPage pageType="join_plan" />} />
          <Route path="/login-info" element={<DynamicPage pageType="login" />} />
          
          <Route
            path="/upload"
            element={
              <PrivateRoute>
                <UploadPage />
              </PrivateRoute>
            }
          />
          
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            }
          />
        </Routes>
      </HashRouter>
    </ErrorBoundary>
  );
}

export default App;
