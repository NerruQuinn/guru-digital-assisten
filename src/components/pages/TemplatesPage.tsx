import { useEffect, useState } from 'react';
import { Plus, FileText, Download, Trash2, Eye, Search, FileSpreadsheet, Upload } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface TemplatesPageProps {
  role: string | null;
}

interface Template {
  id: string;
  name: string;
  file_type: string;
  file_path: string;
  created_at: string;
  uploaded_by: string;
}

const TemplatesPage = ({ role }: TemplatesPageProps) => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('templates')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Gagal ambil template:', error.message);
    } else {
      setTemplates(data ?? []);
    }
    setLoading(false);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    // 1. Upload file ke Supabase Storage
    const filePath = `templates/${Date.now()}_${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Gagal upload file:', uploadError.message);
      setUploading(false);
      return;
    }

    // 2. Simpan metadata ke tabel templates
    const { data: userData } = await supabase.auth.getUser();
    const { error: insertError } = await supabase
      .from('templates')
      .insert({
        name: file.name,
        file_path: filePath,
        file_type: file.name.endsWith('.pdf') ? 'pdf' : 'word',
        uploaded_by: userData.user?.id,
      });

    if (insertError) {
      console.error('Gagal simpan metadata:', insertError.message);
    } else {
      fetchTemplates(); // refresh list
    }

    setUploading(false);
  };

  const handleDelete = async (id: string, filePath: string) => {
    if (!confirm('Yakin hapus template ini?')) return;

    // Hapus file dari storage
    await supabase.storage.from('documents').remove([filePath]);

    // Hapus dari tabel
    const { error } = await supabase.from('templates').delete().eq('id', id);
    if (error) {
      console.error('Gagal hapus:', error.message);
    } else {
      fetchTemplates();
    }
  };

  const handleDownload = async (filePath: string, fileName: string) => {
    const { data, error } = await supabase.storage
      .from('documents')
      .download(filePath);

    if (error || !data) {
      console.error('Gagal download:', error?.message);
      return;
    }

    const url = URL.createObjectURL(data);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filtered = templates.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            {role === 'admin' ? 'Kelola Template' : 'Dokumen Saya'}
          </h2>
          <p className="text-slate-500">
            {role === 'admin'
              ? 'Upload dan kelola template RPP untuk semua guru'
              : 'Kelola berkas RPP, Modul, dan Administrasi Anda'}
          </p>
        </div>

        {/* Tombol upload — hanya admin */}
        {role === 'admin' && (
          <label className={`bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-blue-600/20 cursor-pointer ${uploading ? 'opacity-60 pointer-events-none' : ''}`}>
            <Upload className="w-5 h-5" />
            {uploading ? 'Mengupload...' : 'Upload Template'}
            <input
              type="file"
              accept=".doc,.docx,.pdf"
              className="hidden"
              onChange={handleUpload}
            />
          </label>
        )}

        {role !== 'admin' && (
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-blue-600/20">
            <Plus className="w-5 h-5" />
            Buat Dokumen Baru
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={role === 'admin' ? 'Cari template...' : 'Cari dokumen...'}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 w-full max-w-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>{role === 'admin' ? 'Belum ada template. Upload sekarang!' : 'Belum ada dokumen.'}</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50/80">
                <tr>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-600 border-b border-slate-100">Nama File</th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-600 border-b border-slate-100">Tipe</th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-600 border-b border-slate-100">Tanggal Upload</th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-600 border-b border-slate-100 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${doc.file_type === 'pdf' ? 'bg-red-50' : 'bg-blue-50'}`}>
                          {doc.file_type === 'pdf' ? (
                            <FileSpreadsheet className="w-5 h-5 text-red-500" />
                          ) : (
                            <FileText className="w-5 h-5 text-blue-600" />
                          )}
                        </div>
                        <span className="font-medium text-slate-900 group-hover:text-blue-600 transition-colors">
                          {doc.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md uppercase">
                        {doc.file_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {new Date(doc.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric', month: 'long', year: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleDownload(doc.file_path, doc.name)}
                          className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
                          title="Download"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        {role === 'admin' && (
                          <button
                            onClick={() => handleDelete(doc.id, doc.file_path)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            title="Hapus"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default TemplatesPage;