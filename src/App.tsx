import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardPage from './components/pages/DashboardPage';
import TemplatesPage from './components/pages/TemplatesPage';
import HistoryPage from './components/pages/HistoryPage';
import LoginPage from './components/pages/LoginPage';

function App() {
  const [session, setSession] = useState<any>(null);
  // Langsung ambil dari localStorage sebagai initial value
  const [role, setRole] = useState<string | null>(localStorage.getItem('userRole'));
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState('dashboard');

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
        console.log('Role ditemukan:', userRole);
        // Simpan ke localStorage supaya next load langsung terbaca
        localStorage.setItem('userRole', userRole);
        setRole(userRole);
        setLoading(false);
        return;
      } catch (err) {
        console.warn(`fetchRole percobaan ${i + 1} gagal:`, err);
        await new Promise(r => setTimeout(r, 2000));
      }
    }

    // Kalau semua gagal, pakai cache dari localStorage atau default guru
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
    <div className="flex h-screen bg-slate-50 text-slate-900">
      <Sidebar
        activePage={activePage}
        onPageChange={setActivePage}
        role={role}
      />
      <main className="flex-1 overflow-auto flex flex-col">
        <Header
          title={currentPage.title}
          breadcrumb={currentPage.breadcrumb}
          user={session.user}
        />
        <div className="flex-1 overflow-auto">
          {activePage === 'dashboard' && <DashboardPage role={role} />}
          {activePage === 'templates' && <TemplatesPage role={role} />}
          {activePage === 'history' && <HistoryPage />}
          {activePage === 'upload-template' && (
            <div className="p-8 text-slate-400">Halaman Upload Template (coming soon)</div>
          )}
          {activePage === 'manage-users' && (
            <div className="p-8 text-slate-400">Halaman Kelola Guru (coming soon)</div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;