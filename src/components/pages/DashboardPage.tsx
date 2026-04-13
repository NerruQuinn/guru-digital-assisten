import { Plus, TrendingUp, FileCheck, Gauge, FileText, ArrowRight } from 'lucide-react';

interface DashboardPageProps {
  role: string | null;
  onNavigate: (page: string) => void;
}

const DashboardPage = ({ role, onNavigate }: DashboardPageProps) => {
  const stats = [
    { icon: TrendingUp, label: 'Total Generate', value: '12', color: 'bg-blue-50 text-blue-600' },
    { icon: FileCheck, label: 'Template Aktif', value: '5', color: 'bg-green-50 text-green-600' },
    { icon: Gauge, label: 'Sisa Kuota AI', value: '85%', color: 'bg-purple-50 text-purple-600' },
  ];

  return (
    <div className="p-8 space-y-6">
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              {role === 'admin' ? 'Dashboard Administrator' : 'Selamat Datang, Guru!'}
            </h2>
            <p className="text-slate-600 text-lg">
              {role === 'admin' ? 'Kelola template dan pengguna sekolah.' : 'Siap membuat materi hari ini?'}
            </p>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-all duration-200 active:scale-95 shadow-lg shadow-blue-600/20">
            <Plus className="w-5 h-5" />
            {role === 'admin' ? 'Upload Template' : 'Buat Template Baru'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {stats.map((stat) => (
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
        ))}
      </div>

      {role !== 'admin' && (
        <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center">
                <FileText className="w-7 h-7 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Buat Modul Ajar Baru</h3>
                <p className="text-slate-500 text-sm mt-0.5">
                  Isi form lengkap dan biarkan AI generate modul ajar sesuai kurikulum sekolah
                </p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('create-modul')}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 active:scale-95 shadow-lg shadow-blue-600/20 whitespace-nowrap"
            >
              Mulai Buat <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;