import { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      <Header />
      <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 pt-[90px] pb-12 animate-fade-in">
        {children}
      </main>
      <Footer />
    </div>
  );
};
