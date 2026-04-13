import { useState, useEffect } from 'react';
import { Plus, TrendingUp, FileCheck, Gauge, FileText, ArrowRight } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useToast } from '../../hooks/useToast';
import { SkeletonCard } from '../ui/Skeleton';

interface DashboardPageProps {
  role: string | null;
  onNavigate: (page: string) => void;
}

const DashboardPage = ({ role, onNavigate }: DashboardPageProps) => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [totalGen, setTotalGen] = useState(0);
  const [activeTemplates, setActiveTemplates] = useState(0);
  const [monthlyGen, setMonthlyGen] = useState(0);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // 1. Total Generate (where guru_id = auth.uid)
      const { count: totalCount, error: err1 } = await supabase
        .from('generated_documents')
        .select('*', { count: 'exact', head: true })
        .eq('guru_id', user.id);
      
      if (!err1 && totalCount !== null) setTotalGen(totalCount);

      // 2. Template Aktif
      const { count: templateCount, error: err2 } = await supabase
        .from('templates')
        .select('*', { count: 'exact', head: true });

      if (!err2 && templateCount !== null) setActiveTemplates(templateCount);

      // 3. Modul Bulan Ini
      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      const { count: monthlyCount, error: err3 } = await supabase
        .from('generated_documents')
        .select('*', { count: 'exact', head: true })
        .eq('guru_id', user.id)
        .gte('created_at', firstDayOfMonth);

      if (!err3 && monthlyCount !== null) setMonthlyGen(monthlyCount);

    } catch (err: any) {
      console.error('Error fetching dashboard stats', err);
      showToast('Gagal memuat statistik dashboard', 'error');
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { icon: TrendingUp, label: 'Total Generate', value: totalGen, color: 'bg-blue-50 text-blue-600' },
    { icon: FileCheck, label: 'Template Aktif', value: activeTemplates, color: 'bg-green-50 text-green-600' },
    { icon: Gauge, label: 'Modul Bulan Ini', value: monthlyGen, color: 'bg-purple-50 text-purple-600' },
  ];

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 md:p-8 border border-blue-100">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              {role === 'admin' ? 'Dashboard Administrator' : 'Selamat Datang, Guru!'}
            </h2>
            <p className="text-slate-600 text-lg">
              {role === 'admin' ? 'Kelola template dan pengguna sekolah.' : 'Siap membuat materi hari ini?'}
            </p>
          </div>
          <button 
            onClick={() => onNavigate(role === 'admin' ? 'upload-template' : 'create-modul')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-all duration-200 active:scale-95 shadow-lg shadow-blue-600/20"
          >
            <Plus className="w-5 h-5" />
            {role === 'admin' ? 'Upload Template' : 'Buat Modul Baru'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {loading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          stats.map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-slate-500 text-sm mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {role !== 'admin' && (
        <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-slate-100">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                <FileText className="w-7 h-7 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Buat Modul Ajar Baru</h3>
                <p className="text-slate-500 text-sm mt-0.5">
                  Isi form lengkap dan biarkan AI merancang modul ajar sesuai kurikulum sekolah dan kebutuhan personalisasi siswa Anda.
                </p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('create-modul')}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 active:scale-95 shadow-lg shadow-blue-600/20 whitespace-nowrap shrink-0"
            >
              Mulai Buat Modul <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;