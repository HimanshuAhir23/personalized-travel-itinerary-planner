import React, { ReactNode } from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export interface LayoutProps {
  children: ReactNode;
  showFooter?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, showFooter = true }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#FFFFF0] text-[#1A1A2E] selection:bg-[#87A96B] selection:text-white">
      <Navbar />
      <main className="flex-1 flex flex-col">{children}</main>
      {showFooter && <Footer />}
    </div>
  );
};
