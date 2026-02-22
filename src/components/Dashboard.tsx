import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import DashboardPage from './pages/DashboardPage';
import TemplatesPage from './pages/TemplatesPage';
import HistoryPage from './pages/HistoryPage';

const Dashboard = () => {
  const [activePage, setActivePage] = useState('dashboard');

  const renderPage = () => {
    switch (activePage) {
      case 'templates':
        return (
          <>
            <Header title="Template Saya" breadcrumb="Templates" />
            <TemplatesPage />
          </>
        );
      case 'history':
        return (
          <>
            <Header title="Riwayat Pembuatan" breadcrumb="History" />
            <HistoryPage />
          </>
        );
      case 'generator':
        return (
          <>
            <Header title="AI Generator" breadcrumb="Generator" />
            <DashboardPage />
          </>
        );
      default:
        return (
          <>
            <Header title="AI Teacher Assistant" breadcrumb="Dashboard" />
            <DashboardPage />
          </>
        );
    }
  };

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar activePage={activePage} onPageChange={setActivePage} />
      <main className="flex-1 overflow-auto flex flex-col">
        {renderPage()}
      </main>
    </div>
  );
};

export default Dashboard;
