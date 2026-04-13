import { useState, useEffect } from 'react';
import { ArrowLeft, Sparkles, Loader2, CheckCircle2, ChevronRight, ChevronLeft, Plus, Trash2, Save, Download } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { generateDocx } from '../../lib/generateDocx';

interface CreateModulPageProps {
  onBack: () => void;
}

interface Template {
  id: string;
  name: string;
}

interface OutlineMingguan {
  minggu: number;
  tujuan: string;
  kegiatan: string;
}

const CreateModulPage = ({ onBack }: CreateModulPageProps) => {
  const [step, setStep] = useState(1);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [guruName, setGuruName] = useState('');
  
  // Step 1: Info Dasar
  const [templateId, setTemplateId] = useState('');
  const [tahunAjaran, setTahunAjaran] = useState('');
  const [grade, setGrade] = useState('');
  const [quarter, setQuarter] = useState('');
  const [mapel, setMapel] = useState('');
  const [topik, setTopik] = useState('');
  const [durasiMinggu, setDurasiMinggu] = useState<number | ''>('');
  const [alokasiSesi, setAlokasiSesi] = useState<number | ''>('');

  // Step 2: Tujuan & Konsep
  const [makro, setMakro] = useState('');
  const [mikro, setMikro] = useState('');
  const [elemenBelajar, setElemenBelajar] = useState<string[]>([]);
  const [tujuan, setTujuan] = useState('');
  const [eu, setEu] = useState('');
  const [eq, setEq] = useState('');
  const [virtues, setVirtues] = useState<string[]>([]);

  // Step 3: Strategi & Asesmen
  const [metode, setMetode] = useState<string[]>([]);
  const [outline, setOutline] = useState<OutlineMingguan[]>([]);
  const [asesmenFormatif, setAsesmenFormatif] = useState('');
  const [asesmenSumatif, setAsesmenSumatif] = useState('');
  const [kkm, setKkm] = useState<number | ''>('');

  // Step 4: Generate & Review
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [previewData, setPreviewData] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  // Lists for checkboxes
  const listElemen = ["Visual-Spasial", "Kecakapan Digital", "Literasi", "Numerasi", "Sains-Teknologi", "Logika", "Sosial-Emosional"];
  const listVirtue = ["Integritas", "Empati", "Tanggung Jawab", "Keberanian", "Hormat", "Kasih Sayang", "Ketangguhan"];
  const listMetode = ["PjBL", "PBL", "Diskusi", "Demonstrasi", "Ceramah", "Kolaboratif", "Eksperimen"];

  useEffect(() => {
    fetchTemplates();
    fetchProfile();
  }, []);

  const fetchTemplates = async () => {
    const { data, error } = await supabase.from('templates').select('id, name').order('created_at', { ascending: false });
    if (!error && data) setTemplates(data);
  };

  const fetchProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase.from('profiles').select('full_name').eq('id', user.id).single();
      if (data?.full_name) setGuruName(data.full_name);
    }
  };

  const handleNextStep = () => {
    // Validasi basic
    if (step === 1) {
      if (!templateId || !tahunAjaran || !grade || !quarter || !mapel || !topik || !durasiMinggu || !alokasiSesi) {
        alert("Mohon lengkapi semua field di Langkah 1");
        return;
      }
      // Initialize outline length based on durasiMinggu
      if (outline.length === 0 && typeof durasiMinggu === 'number') {
        const initialOutline = Array.from({length: durasiMinggu}, (_, i) => ({
          minggu: i + 1, tujuan: '', kegiatan: ''
        }));
        setOutline(initialOutline);
      }
    } else if (step === 2) {
      if (!makro || !mikro || elemenBelajar.length === 0 || !tujuan || !eu || !eq || virtues.length === 0) {
        alert("Mohon lengkapi semua field dan centang setidaknya 1 opsi di Langkah 2");
        return;
      }
    } else if (step === 3) {
      if (metode.length === 0 || !asesmenFormatif || !asesmenSumatif || !kkm) {
        alert("Mohon lengkapi semua field di Langkah 3");
        return;
      }
      for (const line of outline) {
        if (!line.tujuan || !line.kegiatan) {
          alert("Mohon isi semua tujuan dan kegiatan pada Outline Mingguan");
          return;
        }
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setStep(prev => Math.min(prev + 1, 4));
  };
  
  const handlePrevStep = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setStep(prev => Math.max(prev - 1, 1));
  };

  const toggleCheckbox = (list: string[], setList: (v: string[]) => void, value: string) => {
    if (list.includes(value)) {
      setList(list.filter(item => item !== value));
    } else {
      setList([...list, value]);
    }
  };

  const addOutlineRow = () => {
    const nextMinggu = outline.length > 0 ? outline[outline.length - 1].minggu + 1 : 1;
    setOutline([...outline, { minggu: nextMinggu, tujuan: '', kegiatan: '' }]);
  };

  const removeOutlineRow = (index: number) => {
    const newOutline = [...outline];
    newOutline.splice(index, 1);
    // Re-index minggu
    const reindexed = newOutline.map((item, i) => ({ ...item, minggu: i + 1 }));
    setOutline(reindexed);
  };

  const updateOutlineRow = (index: number, field: keyof OutlineMingguan, value: string) => {
    const newOutline = [...outline];
    newOutline[index] = { ...newOutline[index], [field]: value };
    setOutline(newOutline);
  };

  const compileFormData = () => {
    return {
      template_id: templateId,
      guru_name: guruName,
      step1: { tahun_ajaran: tahunAjaran, grade, quarter, mapel, topik, durasi_minggu: durasiMinggu, alokasi_sesi: alokasiSesi },
      step2: { makro, mikro, elemen_belajar: elemenBelajar, tujuan, eu, eq, virtues },
      step3: { metode, outline, asesmen_formatif: asesmenFormatif, asesmen_sumatif: asesmenSumatif, kkm }
    };
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setIsSaved(false);
    setPreviewData(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-rpp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ formData: compileFormData() }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Terjadi kesalahan saat generate');
      }

      const { result } = await response.json();
      setPreviewData(result);
      
    } catch (error: any) {
      console.error('Error generating:', error);
      alert(error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveToDB = async () => {
    if (!previewData) return;
    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const title = `Modul Ajar - ${mapel} - ${topik} (Q${quarter})`;
      
      const { error } = await supabase.from('generated_documents').insert({
        guru_id: user?.id,
        template_id: templateId,
        title: title,
        input_data: compileFormData(),
        output_content: previewData
      });

      if (error) throw error;
      setIsSaved(true);
      alert("Berhasil disimpan ke dokumen saya!");
      
    } catch (err: any) {
      console.error('Error saving:', err.message);
      alert('Gagal menyimpan dokumen: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors text-sm font-medium">
        <ArrowLeft className="w-4 h-4" /> Kembali ke Dashboard
      </button>

      {/* Progress Indicator */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <div className="flex items-center justify-between mb-2">
          {["Informasi Dasar", "Tujuan & Konsep", "Strategi & Asesmen", "Review & Generate"].map((label, idx) => {
            const num = idx + 1;
            const active = step >= num;
            const current = step === num;
            return (
              <div key={num} className={`flex flex-col items-center w-1/4 relative ${active ? 'text-blue-600' : 'text-slate-400'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mb-2 transition-colors z-10 
                  ${current ? 'bg-blue-600 text-white ring-4 ring-blue-100' : active ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
                  {num}
                </div>
                <span className="text-xs font-semibold text-center hidden md:block">{label}</span>
                {num < 4 && (
                  <div className={`absolute top-5 left-[50%] w-full h-[2px] -z-0 ${step > num ? 'bg-blue-200' : 'bg-slate-100'}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Formulir Wizard (kiri) */}
        <div className={`bg-white rounded-xl shadow-sm border border-slate-100 p-8 h-fit ${step === 4 ? 'lg:col-span-5' : 'lg:col-span-8 lg:col-start-3'}`}>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            {step === 1 && "Langkah 1: Informasi Dasar"}
            {step === 2 && "Langkah 2: Tujuan & Konsep"}
            {step === 3 && "Langkah 3: Strategi & Asesmen"}
            {step === 4 && "Langkah 4: Review Data"}
          </h2>

          {/* === STEP 1 === */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Pilih Template RPP/Modul <span className="text-red-500">*</span></label>
                <select value={templateId} onChange={(e) => setTemplateId(e.target.value)} className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50">
                  <option value="">-- Pilih Template --</option>
                  {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Tahun Ajaran <span className="text-red-500">*</span></label>
                  <select value={tahunAjaran} onChange={(e) => setTahunAjaran(e.target.value)} className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50">
                    <option value="">Pilih</option>
                    <option value="2023/2024">2023/2024</option>
                    <option value="2024/2025">2024/2025</option>
                    <option value="2025/2026">2025/2026</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Grade/Kelas <span className="text-red-500">*</span></label>
                  <select value={grade} onChange={(e) => setGrade(e.target.value)} className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50">
                    <option value="">Pilih</option>
                    {Array.from({length: 12}, (_, i) => <option key={i+1} value={`Grade ${i+1}`}>Grade {i+1}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Quarter <span className="text-red-500">*</span></label>
                  <select value={quarter} onChange={(e) => setQuarter(e.target.value)} className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50">
                    <option value="">Pilih</option>
                    <option value="1">Quarter 1</option><option value="2">Quarter 2</option>
                    <option value="3">Quarter 3</option><option value="4">Quarter 4</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Mata Pelajaran <span className="text-red-500">*</span></label>
                  <input type="text" value={mapel} onChange={e => setMapel(e.target.value)} placeholder="Contoh: Matematika" className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"/>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Topik Unit <span className="text-red-500">*</span></label>
                  <input type="text" value={topik} onChange={e => setTopik(e.target.value)} placeholder="Contoh: Aljabar" className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"/>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Durasi Unit (Minggu) <span className="text-red-500">*</span></label>
                  <input type="number" min="1" value={durasiMinggu} onChange={e => setDurasiMinggu(e.target.value ? Number(e.target.value) : '')} placeholder="Berlaku berapa minggu" className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"/>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Alokasi Waktu/Sesi (Menit) <span className="text-red-500">*</span></label>
                  <input type="number" min="1" value={alokasiSesi} onChange={e => setAlokasiSesi(e.target.value ? Number(e.target.value) : '')} placeholder="Contoh: 45" className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"/>
                </div>
              </div>
            </div>
          )}

          {/* === STEP 2 === */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Konsep Makro <span className="text-red-500">*</span></label>
                  <textarea value={makro} onChange={e => setMakro(e.target.value)} rows={2} placeholder="Sistem, Skala, Bukti, dll." className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"/>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Konsep Mikro <span className="text-red-500">*</span></label>
                  <textarea value={mikro} onChange={e => setMikro(e.target.value)} rows={2} placeholder="Konsep spesifik terkait topik" className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"/>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">Elemen Pembelajaran (Pilih min. 1) <span className="text-red-500">*</span></label>
                <div className="flex flex-wrap gap-2">
                  {listElemen.map(item => (
                    <button key={item} type="button" onClick={() => toggleCheckbox(elemenBelajar, setElemenBelajar, item)} className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-colors ${elemenBelajar.includes(item) ? 'bg-blue-100 border-blue-600 text-blue-700' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'}`}>
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Tujuan Pembelajaran <span className="text-red-500">*</span></label>
                <textarea value={tujuan} onChange={e => setTujuan(e.target.value)} rows={3} placeholder="1. Siswa mampu...\n2. Siswa dapat..." className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"/>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Enduring Understanding (EU) <span className="text-red-500">*</span></label>
                <textarea value={eu} onChange={e => setEu(e.target.value)} rows={2} placeholder="Pemahaman jangka panjang yang diharapkan" className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"/>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Essential Question (EQ) <span className="text-red-500">*</span></label>
                <textarea value={eq} onChange={e => setEq(e.target.value)} rows={2} placeholder="Pertanyaan pemantik (1-3 pertanyaan)" className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"/>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">Nilai Kebajikan / Virtue Value <span className="text-red-500">*</span></label>
                <div className="flex flex-wrap gap-2">
                  {listVirtue.map(item => (
                    <button key={item} type="button" onClick={() => toggleCheckbox(virtues, setVirtues, item)} className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-colors ${virtues.includes(item) ? 'bg-purple-100 border-purple-500 text-purple-700' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'}`}>
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* === STEP 3 === */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">Metode Pembelajaran <span className="text-red-500">*</span></label>
                <div className="flex flex-wrap gap-2">
                  {listMetode.map(item => (
                    <button key={item} type="button" onClick={() => toggleCheckbox(metode, setMetode, item)} className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-colors ${metode.includes(item) ? 'bg-green-100 border-green-600 text-green-700' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'}`}>
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex justify-between items-center">
                  <span className="font-semibold text-slate-700 text-sm">Outline per Minggu <span className="text-red-500">*</span></span>
                  <button type="button" onClick={addOutlineRow} className="text-blue-600 hover:bg-blue-100 p-1 rounded transition-colors" title="Tambah Baris">
                    <Plus className="w-5 h-5"/>
                  </button>
                </div>
                <div className="divide-y divide-slate-100 p-2">
                  {outline.map((row, idx) => (
                    <div key={idx} className="flex flex-col md:flex-row gap-3 py-3 px-2">
                      <div className="w-16 flex-shrink-0 pt-2 font-medium text-slate-500 text-sm text-center">Mg. {row.minggu}</div>
                      <textarea value={row.tujuan} onChange={e => updateOutlineRow(idx, 'tujuan', e.target.value)} placeholder="Tujuan target minggu ini" className="w-full md:w-1/3 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none h-16"/>
                      <textarea value={row.kegiatan} onChange={e => updateOutlineRow(idx, 'kegiatan', e.target.value)} placeholder="Ringkasan kegiatan belajar" className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none h-16"/>
                      <button type="button" onClick={() => removeOutlineRow(idx)} className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg self-center hidden md:block">
                        <Trash2 className="w-4 h-4"/>
                      </button>
                      {/* Trash button mobile res */}
                      <button type="button" onClick={() => removeOutlineRow(idx)} className="text-red-500 text-xs text-right mt-1 md:hidden flex items-center justify-end gap-1">
                        <Trash2 className="w-3 h-3"/> Hapus baris ini
                      </button>
                    </div>
                  ))}
                  {outline.length === 0 && <div className="p-4 text-center text-sm text-slate-400">Belum ada outline minggu ditambahkan.</div>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Asesmen Formatif <span className="text-red-500">*</span></label>
                  <textarea value={asesmenFormatif} onChange={e => setAsesmenFormatif(e.target.value)} rows={3} placeholder="Kapan & kriteria pengerjaan..." className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"/>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Asesmen Sumatif <span className="text-red-500">*</span></label>
                  <textarea value={asesmenSumatif} onChange={e => setAsesmenSumatif(e.target.value)} rows={3} placeholder="Deskripsi asesmen akhir/project..." className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"/>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">KKM / Nilai Minimum <span className="text-red-500">*</span></label>
                <input type="number" min="0" max="100" value={kkm} onChange={e => setKkm(e.target.value ? Number(e.target.value) : '')} placeholder="Nilai skala 0-100" className="w-32 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"/>
              </div>
            </div>
          )}

          {/* === STEP 4 === */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-6 text-sm">
                <h3 className="font-bold text-slate-800 mb-4 border-b pb-2">Ringkasan Modul ({mapel} - {topik})</h3>
                <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-slate-600">
                  <div><span className="font-semibold">TA/Grade:</span> {tahunAjaran} / {grade}</div>
                  <div><span className="font-semibold">Quarter/Durasi:</span> Q{quarter} / {durasiMinggu} Minggu</div>
                </div>
                <div className="mt-4 line-clamp-2 italic text-slate-500 text-xs">
                  Sistem siap melakukan _generation_ Modul Ajar ke sistem AI berdasarkan informasi 3 langkah sebelumnya. Anda dapat kembali untuk mengubah jika ada yang salah sebelum men-_generate_ dokumen.
                </div>
              </div>

              {!previewData && (
                <button onClick={handleGenerate} disabled={isGenerating} className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] shadow-xl shadow-blue-600/20">
                  {isGenerating ? <><Loader2 className="w-6 h-6 animate-spin" /> Menganalisis Struktur...</> : <><Sparkles className="w-6 h-6" /> Generate Modul Ajar AI Sekarang</>}
                </button>
              )}

              {previewData && (
                <div className="grid grid-cols-2 gap-4">
                  <button onClick={handleSaveToDB} disabled={isSaving || isSaved} className={`py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${isSaved ? 'bg-green-500 text-white cursor-default' : 'bg-slate-900 hover:bg-slate-800 text-white shadow-lg active:scale-[0.98]'}`}>
                    {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : isSaved ? <CheckCircle2 className="w-5 h-5" /> : <Save className="w-5 h-5" />}
                    {isSaved ? "Tersimpan" : "Simpan Dokumen"}
                  </button>
                  <button 
                    onClick={() => generateDocx(`Modul Ajar - ${mapel} - ${topik}`, previewData)}
                    className="py-3 rounded-xl font-semibold flex items-center justify-center gap-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-all active:scale-[0.98]">
                    <Download className="w-5 h-5" /> Download (.docx)
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Navigation Controls */}
          {step < 4 && (
            <div className="flex justify-between mt-10 pt-6 border-t border-slate-100">
              <button 
                type="button" 
                onClick={handlePrevStep}
                disabled={step === 1}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-slate-600 font-medium hover:bg-slate-50 border border-transparent hover:border-slate-200 disabled:opacity-0 transition-all"
              >
                <ChevronLeft className="w-4 h-4" /> Sebelumnya
              </button>
              <button 
                type="button" 
                onClick={handleNextStep}
                className="flex items-center gap-2 bg-slate-900 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-slate-800 active:scale-95 transition-all shadow-md"
              >
                Selanjutnya <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
          {step === 4 && (
            <div className="mt-8 pt-4">
                <button type="button" onClick={handlePrevStep} className="text-slate-500 hover:text-slate-800 text-sm font-medium flex items-center gap-1 transition-colors">
                  <ChevronLeft className="w-4 h-4" /> Kembali Edit Informasi
                </button>
            </div>
          )}
        </div>

        {/* Kotak Preview (Kanan) -> Hanya tampil besar di Step 4 */}
        {step === 4 && (
          <div className="lg:col-span-7 bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col h-[600px] lg:h-[800px] overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" /> Preview Hasil AI
              </h3>
            </div>
            <div className="p-6 overflow-y-auto flex-1 bg-slate-50/30">
              {isGenerating ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 p-8 text-center space-y-4">
                  <div className="w-16 h-16 flex items-center justify-center bg-blue-50 rounded-full mb-2">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                  </div>
                  <h4 className="text-slate-700 font-semibold text-lg">Menyusun RPP Lengkap</h4>
                  <p className="text-sm">Menganalisis makro-mikro, menyamakan EU & EQ, merangkai narasi minggu ke minggu... Ini memakan waktu hingga satu menit.</p>
                </div>
              ) : previewData ? (
                <div className="prose prose-sm prose-blue max-w-none text-slate-700">
                  <pre className="whitespace-pre-wrap font-sans text-sm p-4 bg-white border border-slate-100 rounded-lg shadow-inner leading-relaxed">
                    {previewData}
                  </pre>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 p-8 text-center hover:opacity-100 transition-opacity">
                  <Sparkles className="w-16 h-16 mb-4 opacity-20" />
                  <p className="font-medium text-slate-600">Area Preview Dokumen</p>
                  <p className="text-sm mt-1">Dokumen RPP Anda akan ter-render di sini setelah menekan tombol generate.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateModulPage;
