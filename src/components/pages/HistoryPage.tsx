import { Download, Eye, RotateCcw } from 'lucide-react';

const HistoryPage = () => {
  const history = [
    {
      id: 1,
      title: 'Rencana Pembelajaran - Fungsi Kuadrat',
      subject: 'Matematika',
      class: 'Kelas 10',
      type: 'Rencana Pembelajaran',
      generated: '2024-02-20 14:30',
      tokens: 850,
      status: 'Selesai',
    },
    {
      id: 2,
      title: 'Soal Ujian Mid Semester - Bahasa Inggris',
      subject: 'Bahasa Inggris',
      class: 'Kelas 11',
      type: 'Soal Ujian',
      generated: '2024-02-19 10:15',
      tokens: 1200,
      status: 'Selesai',
    },
    {
      id: 3,
      title: 'Modul Ajar - Sistem Reproduksi Manusia',
      subject: 'IPA',
      class: 'Kelas 9',
      type: 'Modul Ajar',
      generated: '2024-02-18 16:45',
      tokens: 1500,
      status: 'Selesai',
    },
    {
      id: 4,
      title: 'Ringkasan Materi - Era Reformasi Indonesia',
      subject: 'Sejarah',
      class: 'Kelas 10',
      type: 'Rencana Pembelajaran',
      generated: '2024-02-17 09:20',
      tokens: 920,
      status: 'Selesai',
    },
    {
      id: 5,
      title: 'Latihan Soal - Negara-Negara ASEAN',
      subject: 'IPS',
      class: 'Kelas 8',
      type: 'Soal Ujian',
      generated: '2024-02-16 13:00',
      tokens: 680,
      status: 'Selesai',
    },
    {
      id: 6,
      title: 'Diskusi Interaktif - Perubahan Sosial',
      subject: 'IPS',
      class: 'Kelas 9',
      type: 'Modul Ajar',
      generated: '2024-02-15 11:30',
      tokens: 1100,
      status: 'Selesai',
    },
    {
      id: 7,
      title: 'Soal Formatif - Persamaan Linear',
      subject: 'Matematika',
      class: 'Kelas 10',
      type: 'Soal Ujian',
      generated: '2024-02-14 15:45',
      tokens: 750,
      status: 'Selesai',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Selesai':
        return 'bg-green-50 text-green-700';
      case 'Proses':
        return 'bg-blue-50 text-blue-700';
      default:
        return 'bg-slate-50 text-slate-700';
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Riwayat Pembuatan</h2>
        <p className="text-slate-600 mt-1">Lihat semua materi yang telah dibuat menggunakan AI</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Judul</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Mata Pelajaran</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Kelas</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Tipe</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Tanggal Dibuat</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Token</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Status</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-slate-900">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {history.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-slate-900 max-w-xs">{item.title}</p>
                  </td>
                  <td className="px-6 py-4 text-slate-600 text-sm">{item.subject}</td>
                  <td className="px-6 py-4 text-slate-600 text-sm">{item.class}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium">
                      {item.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600 text-sm">{item.generated}</td>
                  <td className="px-6 py-4 text-slate-600 text-sm text-center font-medium">{item.tokens}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button className="p-2 hover:bg-blue-50 rounded-lg transition-colors text-blue-600" title="Lihat">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-600" title="Download">
                        <Download className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-600" title="Buat Ulang">
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <p className="text-blue-900 text-sm">
          Menampilkan 7 riwayat terbaru. Total penggunaan token bulan ini: <span className="font-bold">6,900 / 10,000</span>
        </p>
      </div>
    </div>
  );
};

export default HistoryPage;
