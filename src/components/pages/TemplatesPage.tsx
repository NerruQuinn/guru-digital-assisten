import { Plus, FileText, Download, Trash2, Eye, Search, FileSpreadsheet } from 'lucide-react';

const TemplatesPage = () => {
  // Data disesuaikan agar lebih relevan dengan tugas harian guru
  const documents = [
    {
      id: 1,
      name: 'RPP Matematika - Bangun Ruang',
      type: 'RPP',
      class: 'Kelas 10-A',
      lastModified: '2024-02-21',
      status: 'Selesai',
    },
    {
      id: 2,
      name: 'Modul Ajar Bahasa Inggris - Present Tense',
      type: 'Modul',
      class: 'Kelas 11-B',
      lastModified: '2024-02-20',
      status: 'Draft',
    },
    {
      id: 3,
      name: 'Daftar Nilai Ujian Tengah Semester',
      type: 'Nilai',
      class: 'Kelas 12-C',
      lastModified: '2024-02-18',
      status: 'Selesai',
    },
  ];

  return (
    <div className="p-8 space-y-6">
      {/* Header Halaman */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Dokumen Saya</h2>
          <p className="text-slate-500">Kelola berkas RPP, Modul, dan Administrasi Anda</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-blue-600/20">
          <Plus className="w-5 h-5" />
          Buat Dokumen Baru
        </button>
      </div>

      {/* Kontainer Tabel */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Search Bar */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Cari dokumen sekolah..." 
              className="pl-10 pr-4 py-2 w-full max-w-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
            />
          </div>
        </div>

        {/* Tabel Dokumen */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/80">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600 border-b border-slate-100">Nama Berkas</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600 border-b border-slate-100">Tipe</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600 border-b border-slate-100">Kelas</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600 border-b border-slate-100">Status</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600 border-b border-slate-100 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {documents.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${doc.type === 'Nilai' ? 'bg-green-50' : 'bg-blue-50'}`}>
                        {doc.type === 'Nilai' ? (
                          <FileSpreadsheet className="w-5 h-5 text-green-600" />
                        ) : (
                          <FileText className="w-5 h-5 text-blue-600" />
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-900 group-hover:text-blue-600 transition-colors">
                          {doc.name}
                        </span>
                        <span className="text-xs text-slate-400">Diubah: {doc.lastModified}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
                      {doc.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 font-medium">{doc.class}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      doc.status === 'Selesai' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                    }`}>
                      {doc.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-1">
                      <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Buka Dokumen">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all" title="Download PDF">
                        <Download className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Hapus Permanen">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TemplatesPage;