import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardPage from './components/pages/DashboardPage';
import TemplatesPage from './components/pages/TemplatesPage';
import HistoryPage from './components/pages/HistoryPage';
import LoginPage from './components/pages/LoginPage';
import CreateModulPage from './components/pages/CreateModulPage';
import UploadTemplatePage from './components/pages/UploadTemplatePage';
import ManageUsersPage from './components/pages/ManageUsersPage';
import AdminSettingsPage from './components/pages/AdminSettingsPage';
import { ToastProvider } from './components/ToastProvider';

function App() {
  const [session, setSession] = useState<any>(null);
  const [role, setRole] = useState<string | null>(localStorage.getItem('userRole'));
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      if (session) {
        await fetchRole(session.user.id);
      } else {
        localStorage.removeItem('userRole');
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        setSession(null);
        setRole(null);
        localStorage.removeItem('userRole');
        setLoading(false);
      } else if (event === 'SIGNED_IN' && session) {
        setSession(session);
        fetchRole(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchRole = async (userId: string) => {
    for (let i = 0; i < 5; i++) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', userId)
          .single();

        if (error) throw error;

        const userRole = data?.role ?? 'guru';
        localStorage.setItem('userRole', userRole);
        setRole(userRole);
        setLoading(false);
        return;
      } catch (err) {
        console.warn(`fetchRole percobaan ${i + 1} gagal:`, err);
        await new Promise(r => setTimeout(r, 2000));
      }
    }

    const cached = localStorage.getItem('userRole') ?? 'guru';
    setRole(cached);
    setLoading(false);
  };

  const pageConfig: Record<string, { title: string; breadcrumb: string }> = {
    dashboard: { title: 'AI Teacher Assistant', breadcrumb: 'Dashboard' },
    templates: { title: role === 'admin' ? 'Kelola Template' : 'Template Saya', breadcrumb: 'Templates' },
    history: { title: 'Riwayat Pembuatan', breadcrumb: 'History' },
    'upload-template': { title: 'Upload Template', breadcrumb: 'Upload Template' },
    'manage-users': { title: 'Kelola Guru', breadcrumb: 'Kelola Guru' },
    settings: { title: 'Admin Settings', breadcrumb: 'Settings' },
    'create-modul': { title: 'Buat Modul Ajar', breadcrumb: 'Buat Modul Ajar' },
  };

  const currentPage = pageConfig[activePage] ?? { title: 'Dashboard', breadcrumb: 'Dashboard' };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-slate-500 text-sm">Memuat aplikasi...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return <LoginPage />;
  }

  return (
    <ToastProvider>
      <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden relative">
        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-slate-900/50 z-30 md:hidden backdrop-blur-sm transition-opacity"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
        
        <Sidebar
          activePage={activePage}
          onPageChange={(page) => {
            setActivePage(page);
            setIsSidebarOpen(false); // Close sidebar automatically on mobile
          }}
          role={role}
          isOpen={isSidebarOpen}
        />
        
        <main className="flex-1 overflow-auto flex flex-col w-full h-full relative">
          <Header
            title={currentPage.title}
            breadcrumb={currentPage.breadcrumb}
            user={session.user}
            onMenuClick={() => setIsSidebarOpen(true)}
          />
          <div className="flex-1 overflow-auto h-full w-full relative">
            {activePage === 'dashboard' && <DashboardPage role={role} onNavigate={setActivePage} />}
            {activePage === 'create-modul' && <CreateModulPage onBack={() => setActivePage('dashboard')} />}
            {activePage === 'templates' && <TemplatesPage role={role} />}
            {activePage === 'history' && <HistoryPage onNavigate={setActivePage} />}
            {activePage === 'upload-template' && <UploadTemplatePage />}
            {activePage === 'manage-users' && <ManageUsersPage />}
            {activePage === 'settings' && <AdminSettingsPage />}
          </div>
        </main>
      </div>
    </ToastProvider>
  );
}

export default App;