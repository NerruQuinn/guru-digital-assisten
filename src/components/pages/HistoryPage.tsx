import { useState, useEffect } from 'react';
import { Download, Eye, Trash2, Search, FileText, X, CheckCircle2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { generateDocx } from '../../lib/generateDocx';
import { useToast } from '../../hooks/useToast';
import { SkeletonTable } from '../ui/Skeleton';

interface HistoryPageProps {
  onNavigate?: (page: string) => void;
}

interface GeneratedDoc {
  id: string;
  title: string;
  input_data: any;
  output_content: string;
  created_at: string;
  template_id: string;
  templates?: any;
}

const HistoryPage = ({ onNavigate }: HistoryPageProps) => {
  const [documents, setDocuments] = useState<GeneratedDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { showToast } = useToast();

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<GeneratedDoc | null>(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) return;

      const { data, error } = await supabase
        .from('generated_documents')
        .select(`
          id, 
          title, 
          input_data, 
          output_content, 
          created_at, 
          template_id,
          templates ( name )
        `)
        .eq('guru_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error: any) {
      console.error('Error fetching history:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (doc: GeneratedDoc) => {
    setSelectedDoc(doc);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDoc(null);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Yakin ingin menghapus dokumen ini?')) return;

    try {
      const { error } = await supabase
        .from('generated_documents')
        .delete()
        .eq('id', id);

      if (error) throw error;

      showToast('Dokumen berhasil dihapus!', 'success');
      fetchHistory(); // Refresh the list
    } catch (error: any) {
      console.error('Failed to delete:', error.message);
      showToast('Gagal menghapus dokumen.', 'error');
    }
  };

  const handleDownload = async (title: string, content: string) => {
    try {
      await generateDocx(title, content);
      showToast('Dokumen berhasil diunduh!', 'success');
    } catch (err) {
      console.error('Download failed', err);
      showToast('Gagal mengunduh dokumen.', 'error');
    }
  };

  const getMapel = (inputData: any) => {
    if (!inputData) return '-';
    if (inputData.mapel) return inputData.mapel; // structure lama
    if (inputData.step1?.mapel) return inputData.step1.mapel; // structure wizard baru
    return '-';
  };

  const getKelas = (inputData: any) => {
    if (!inputData) return '-';
    if (inputData.kelas) return inputData.kelas;
    if (inputData.step1?.grade) return inputData.step1.grade;
    return '-';
  };

  const getTopik = (inputData: any) => {
    if (!inputData) return '-';
    if (inputData.topik) return inputData.topik;
    if (inputData.step1?.topik) return inputData.step1.topik;
    return '-';
  };

  const getTemplateName = (doc: GeneratedDoc) => {
    if (!doc.templates) return 'Unknown Template';
    if (Array.isArray(doc.templates)) {
      return doc.templates[0]?.name || 'Unknown Template';
    }
    return doc.templates.name || 'Unknown Template';
  };

  // Filter based on Title or Subject (mapel)
  const filteredDocs = documents.filter((doc) => {
    const term = searchQuery.toLowerCase();
    const mapel = getMapel(doc.input_data).toLowerCase();
    return doc.title?.toLowerCase().includes(term) || mapel.includes(term);
  });

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Riwayat Pembuatan</h2>
          <p className="text-slate-600 mt-1">Lihat semua materi dan modul ajar yang telah dibuat menggunakan AI</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden min-h-[400px]">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari berdasarkan judul atau mata pelajaran..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
            />
          </div>
        </div>

        {/* Content Area */}
        <div className="overflow-x-auto w-full">
          {loading ? (
            <div className="p-4">
              <SkeletonTable columns={5} rows={5} />
            </div>
          ) : filteredDocs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
              <div className="bg-blue-50 p-6 rounded-full mb-4">
                <FileText className="w-16 h-16 text-blue-300" />
              </div>
              <h3 className="text-lg font-bold text-slate-700 mb-2">Belum ada modul yang dibuat</h3>
              <p className="text-slate-500 max-w-sm mb-6">
                Riwayat dokumen Anda kosong. Mulai rancang modul ajar pertama Anda dengan bantuan kecerdasan buatan sekarang!
              </p>
              {onNavigate && (
                <button
                  onClick={() => onNavigate('create-modul')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium shadow-md transition-all active:scale-95"
                >
                  Buat Modul Sekarang
                </button>
              )}
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80">
                  <th className="px-6 py-4 text-sm font-semibold text-slate-600 w-1/4">Judul Dokumen</th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-600">Info Dasar (Mapel/Kelas)</th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-600">Topik</th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-600">Tanggal Dibuat</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-slate-600">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDocs.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-800 line-clamp-2">{item.title}</p>
                      <span className="inline-block mt-1 px-2.5 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-indigo-50 text-indigo-600">
                        {getTemplateName(item)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-slate-700">{getMapel(item.input_data)}</div>
                      <div className="text-xs text-slate-500 mt-1">{getKelas(item.input_data)}</div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-600 line-clamp-2">{getTopik(item.input_data)}</p>
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-sm whitespace-nowrap">
                      {new Date(item.created_at).toLocaleDateString('id-ID', {
                        day: '2-digit', month: 'long', year: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleView(item)}
                          className="p-2 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-lg transition-colors"
                          title="Lihat Konten"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDownload(item.title, item.output_content)}
                          className="p-2 hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded-lg transition-colors"
                          title="Download Word"
                        >
                          <Download className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition-colors"
                          title="Hapus Dokumen"
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

      {/* Modal View Content */}
      {isModalOpen && selectedDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50 rounded-t-2xl">
              <div>
                <h3 className="font-bold text-lg text-slate-800">{selectedDoc.title}</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Format: {getTemplateName(selectedDoc)} • Dibuat pada: {new Date(selectedDoc.created_at).toLocaleString('id-ID')}
                </p>
              </div>
              <button
                onClick={closeModal}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 font-sans">
              <div className="prose prose-sm prose-blue max-w-none text-slate-700">
                <pre className="whitespace-pre-wrap font-sans leading-relaxed text-sm">
                  {selectedDoc.output_content}
                </pre>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 rounded-b-2xl">
              <button
                onClick={closeModal}
                className="px-4 py-2 font-medium text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Tutup
              </button>
              <button
                onClick={() => handleDownload(selectedDoc.title, selectedDoc.output_content)}
                className="px-4 py-2 font-medium text-white bg-slate-800 hover:bg-slate-900 rounded-lg flex items-center gap-2 transition-all shadow-md"
              >
                <Download className="w-4 h-4" /> Download Word
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
