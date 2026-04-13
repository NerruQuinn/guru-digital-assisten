import { useState, useEffect } from 'react';
import { Upload, FileText, Trash2, FileSpreadsheet, Search } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Template {
  id: string;
  name: string;
  file_type: string;
  file_path: string;
  created_at: string;
  uploaded_by: string;
  school_id: string | null;
}

const UploadTemplatePage = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState('');

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
      setTemplates(data || []);
    }
    setLoading(false);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      // 1. Dapatkan user yang sedang login
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("Tidak ada sesi user aktif");

      // 2. Dapatkan school_id dari profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('school_id')
        .eq('id', userData.user.id)
        .single();
      
      const schoolId = profile?.school_id || null;

      // 3. Upload file ke Supabase Storage (bucket "documents")
      const filePath = `templates/${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 4. Simpan metadata ke tabel templates dengan school_id
      const { error: insertError } = await supabase
        .from('templates')
        .insert({
          name: file.name,
          file_path: filePath,
          file_type: file.name.endsWith('.pdf') ? 'pdf' : 'word',
          uploaded_by: userData.user.id,
          school_id: schoolId,
        });

      if (insertError) throw insertError;

      alert('Template berhasil diunggah!');
      fetchTemplates();
    } catch (err: any) {
      console.error('Gagal upload file:', err.message);
      alert('Gagal mengupload template: ' + err.message);
    } finally {
      setUploading(false);
      // Reset the file input
      e.target.value = '';
    }
  };

  const handleDelete = async (id: string, filePath: string) => {
    if (!confirm('Yakin ingin menghapus template ini?')) return;

    try {
      // Hapus file dari bucket 'documents'
      await supabase.storage.from('documents').remove([filePath]);

      // Hapus row dari tabel 'templates'
      const { error } = await supabase.from('templates').delete().eq('id', id);
      if (error) throw error;

      fetchTemplates();
    } catch (err: any) {
      console.error('Gagal hapus:', err.message);
      alert('Gagal menghapus template: ' + err.message);
    }
  };

  const filtered = templates.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Upload Template</h2>
          <p className="text-slate-500 mt-1">
            Upload dan kelola dokumen template RPP/Modul Ajar. Hanya format .pdf atau .docx.
          </p>
        </div>

        {/* Upload Button */}
        <label className={`bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-blue-600/20 cursor-pointer ${uploading ? 'opacity-60 pointer-events-none' : ''}`}>
          {uploading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Upload className="w-5 h-5" />
          )}
          {uploading ? 'Mengupload...' : 'Upload File'}
          <input
            type="file"
            accept=".doc,.docx,.pdf"
            className="hidden"
            onChange={handleUpload}
            disabled={uploading}
          />
        </label>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari template yang sudah diupload..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 w-full max-w-md rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto min-h-[300px]">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-slate-400 flex flex-col items-center">
              <FileText className="w-16 h-16 mb-4 opacity-20 text-slate-500" />
              <p className="text-lg font-medium text-slate-600">Belum ada template</p>
              <p className="text-sm mt-1">Gunakan tombol 'Upload File' di atas untuk menambahkan template baru.</p>
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
                      <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md uppercase tracking-wider">
                        {doc.file_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {new Date(doc.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric', month: 'long', year: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center">
                        <button
                          onClick={() => handleDelete(doc.id, doc.file_path)}
                          disabled={uploading}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50"
                          title="Hapus"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
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

export default UploadTemplatePage;
