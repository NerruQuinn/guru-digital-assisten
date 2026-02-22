import { Plus, TrendingUp, FileCheck, Gauge, FileText } from 'lucide-react';

const DashboardPage = () => {
  const stats = [
    { icon: TrendingUp, label: 'Total Generate', value: '12', color: 'bg-blue-50 text-blue-600' },
    { icon: FileCheck, label: 'Template Aktif', value: '5', color: 'bg-green-50 text-green-600' },
    { icon: Gauge, label: 'Sisa Kuota AI', value: '85%', color: 'bg-purple-50 text-purple-600' },
  ];

  const subjects = ['Matematika', 'Bahasa Indonesia', 'Bahasa Inggris', 'IPA', 'IPS', 'Sejarah', 'Seni', 'Olahraga'];
  const classes = ['Kelas 10', 'Kelas 11', 'Kelas 12', 'Kelas 1 SD', 'Kelas 2 SD', 'Kelas 3 SD'];
  const topics = ['Bab 1', 'Bab 2', 'Bab 3', 'Bab 4', 'Bab 5', 'Bab 6'];

  return (
    <div className="p-8 space-y-6">
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Selamat Datang, Guru!
            </h2>
            <p className="text-slate-600 text-lg">
              Siap membuat materi hari ini?
            </p>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-all duration-200 active:scale-95 shadow-lg shadow-blue-600/20">
            <Plus className="w-5 h-5" />
            Buat Template Baru
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-200"
          >
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

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Konfigurasi AI</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Jenis Materi
              </label>
              <select className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-slate-900">
                <option>Pilih jenis materi...</option>
                <option>Rencana Pembelajaran</option>
                <option>Soal Ujian</option>
                <option>Modul Ajar</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Mata Pelajaran
              </label>
              <select className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-slate-900">
                <option>Pilih mata pelajaran...</option>
                {subjects.map((subject) => (
                  <option key={subject}>{subject}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Kelas/Tingkat
              </label>
              <select className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-slate-900">
                <option>Pilih kelas/tingkat...</option>
                {classes.map((cls) => (
                  <option key={cls}>{cls}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Topik
              </label>
              <select className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-slate-900">
                <option>Pilih topik...</option>
                {topics.map((topic) => (
                  <option key={topic}>{topic}</option>
                ))}
              </select>
            </div>

            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-all duration-200 active:scale-95">
              Melanjutkan
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Preview</h3>
          <div className="h-full min-h-[400px] border-2 border-dashed border-slate-200 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <FileText className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-slate-500">Hasil AI akan muncul di sini...</p>
              <p className="text-sm text-slate-400 mt-1">Isi form dan klik Melanjutkan untuk memulai</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
