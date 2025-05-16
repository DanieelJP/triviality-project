import React, { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import '../../styles/components/layout/Layout.css';

interface LayoutProps {
  children: ReactNode;
  userName: string;
  activeTab: string;
  onTabChange: (tabId: string) => void;
  onLogout: () => void;
  pageTitle?: string;
  useWrapper?: boolean;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  userName,
  activeTab,
  onTabChange,
  onLogout,
  pageTitle,
  useWrapper = false
}) => {
  return (
    <div className="layout-container">
      <Header
        userName={userName}
        activeTab={activeTab}
        onTabChange={onTabChange}
        onLogout={onLogout}
      />
      
      <main className="main-content">
        {useWrapper ? (
          <div className="content-wrapper">
            {pageTitle && (
              <div className="section-header">
                <h2>{pageTitle}</h2>
              </div>
            )}
            <div className="section-content">
              {children}
            </div>
          </div>
        ) : (
          children
        )}
      </main>
      
      <Footer onTabChange={onTabChange} />
    </div>
  );
};

export default Layout; 