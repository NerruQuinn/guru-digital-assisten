import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import Sidebar from './components/Sidebar';
import DashboardPage from './components/pages/DashboardPage';
import TemplatesPage from './components/pages/TemplatesPage';
import LoginPage from './components/pages/LoginPage';

function App() {
  const [session, setSession] = useState<any>(null);
  const [activePage, setActivePage] = useState('dashboard');

  useEffect(() => {
    // Mengambil sesi login saat ini
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Mendengarkan perubahan status login
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Tampilkan halaman login jika belum ada sesi
  if (!session) {
    return <LoginPage />;
  }

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <Sidebar activePage={activePage} onPageChange={setActivePage} />
      <main className="flex-1 overflow-auto">
        {activePage === 'dashboard' && <DashboardPage />}
        {activePage === 'templates' && <TemplatesPage />}
      </main>
    </div>
  );
}

export default App;