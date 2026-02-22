import { Plus, Copy, Trash2, Eye } from 'lucide-react';

const TemplatesPage = () => {
  const templates = [
    {
      id: 1,
      name: 'Rencana Pembelajaran Matematika',
      subject: 'Matematika',
      class: 'Kelas 10',
      topic: 'Bab 1: Fungsi',
      created: '2024-02-15',
      status: 'Aktif',
      usage: 8,
    },
    {
      id: 2,
      name: 'Soal Ujian Bahasa Inggris',
      subject: 'Bahasa Inggris',
      class: 'Kelas 11',
      topic: 'Bab 2: Present Perfect',
      created: '2024-02-10',
      status: 'Aktif',
      usage: 12,
    },
    {
      id: 3,
      name: 'Modul Ajar IPA',
      subject: 'IPA',
      class: 'Kelas 9',
      topic: 'Bab 3: Sistem Reproduksi',
      created: '2024-02-05',
      status: 'Aktif',
      usage: 5,
    },
    {
      id: 4,
      name: 'Diskusi Sejarah Indonesia',
      subject: 'Sejarah',
      class: 'Kelas 10',
      topic: 'Bab 1: Era Reformasi',
      created: '2024-01-28',
      status: 'Aktif',
      usage: 3,
    },
    {
      id: 5,
      name: 'Quiz IPS Geografi',
      subject: 'IPS',
      class: 'Kelas 8',
      topic: 'Bab 2: Negara-Negara ASEAN',
      created: '2024-01-20',
      status: 'Draft',
      usage: 0,
    },
  ];

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Template Saya</h2>
          <p className="text-slate-600 mt-1">Kelola dan gunakan kembali template pembelajaran Anda</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-all duration-200 active:scale-95 shadow-lg shadow-blue-600/20">
          <Plus className="w-5 h-5" />
          Template Baru
        </button>
      </div>

      <div className="grid gap-4">
        <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Nama Template</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Mata Pelajaran</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Kelas</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Topik</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Dibuat</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Penggunaan</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-slate-900">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {templates.map((template) => (
                  <tr key={template.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-slate-900">{template.name}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 text-sm">{template.subject}</td>
                    <td className="px-6 py-4 text-slate-600 text-sm">{template.class}</td>
                    <td className="px-6 py-4 text-slate-600 text-sm">{template.topic}</td>
                    <td className="px-6 py-4 text-slate-600 text-sm">
                      {new Date(template.created).toLocaleDateString('id-ID', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          template.status === 'Aktif'
                            ? 'bg-green-50 text-green-700'
                            : 'bg-yellow-50 text-yellow-700'
                        }`}
                      >
                        {template.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600 text-sm text-center">{template.usage}x</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button className="p-2 hover:bg-blue-50 rounded-lg transition-colors text-blue-600" title="Preview">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-600" title="Duplikat">
                          <Copy className="w-4 h-4" />
                        </button>
                        <button className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600" title="Hapus">
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
    </div>
  );
};

export default TemplatesPage;
