import { useState, useEffect } from 'react';
import { ArrowLeft, Sparkles, Loader2, ChevronRight, ChevronLeft, Plus, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { generateDocx } from '../../lib/generateDocx';
import { deepSanitize, findUnsafeKeys } from '../../lib/sanitize';

import { useToast } from '../../hooks/useToast';

interface CreateModulPageProps {
  onBack: () => void;
  onNavigate?: (page: string) => void;
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

const CreateModulPage = ({ onBack, onNavigate }: CreateModulPageProps) => {
  const { showToast } = useToast();
  const [step, setStep] = useState(1);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [guruName, setGuruName] = useState('');
  const [schoolId, setSchoolId] = useState<string | null>(null);

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

  // Step 4: Generate
  const [isGenerating, setIsGenerating] = useState(false);

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
      const { data } = await supabase.from('profiles').select('full_name, school_id').eq('id', user.id).single();
      if (data) {
        if (data.full_name) setGuruName(data.full_name);
        if (data.school_id) setSchoolId(data.school_id);
      }
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
        const initialOutline = Array.from({ length: durasiMinggu }, (_, i) => ({
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

  const saveToDB = async (result: any) => {
    const { data: { user } } = await supabase.auth.getUser();

    let currentSchoolId = schoolId;
    if (!currentSchoolId && user?.id) {
      const { data } = await supabase.from('profiles').select('school_id').eq('id', user.id).single();
      if (data?.school_id) {
        currentSchoolId = data.school_id;
        setSchoolId(data.school_id);
      }
    }

    if (!currentSchoolId) {
      throw new Error('School ID tidak ditemukan. Hubungi admin.');
    }

    const title = `Modul Ajar - ${mapel} - ${topik} (Q${quarter})`;
    
    const { error: saveError } = await supabase.from('generated_documents').insert({
      guru_id: user?.id,
      school_id: currentSchoolId,
      template_id: templateId,
      title: title,
      input_data: compileFormData(),
      output_content: result
    }).select('id').single();

    if (saveError) {
      console.error('saveToDB error:', saveError);
      throw new Error(saveError.message || 'Gagal menyimpan ke database');
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      // ── 1. Panggil Edge Function ──────────────────────────────────────────
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-rpp`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ formData: compileFormData() }),
        }
      );

      if (!response.ok) {
        const errorBody = await response.text().catch(() => '');
        throw new Error(`Server error ${response.status}: ${errorBody.substring(0, 200)}`);
      }

      const parsed = await response.json();
      const result = parsed?.result;

      if (!result || typeof result !== 'object') {
        throw new Error('Tidak ada hasil dari AI');
      }

      // ── 2. NUCLEAR SANITIZATION ──────────────────────────────────────────
      // deepSanitize recursively converts ALL values to strings.
      // Arrays are preserved (for docxtemplater loops) but their items are sanitized.
      // No object can EVER reach React's rendering pipeline.
      const safeResult = deepSanitize(result);

      // Verify sanitization (dev safety check)
      const unsafeKeys = findUnsafeKeys(safeResult);
      if (unsafeKeys.length > 0) {
        console.warn('[SANITIZE] Unsafe keys detected after sanitization:', unsafeKeys);
        // Force-fix any remaining unsafe values
        for (const key of Object.keys(safeResult)) {
          const val = safeResult[key];
          if (val !== null && typeof val === 'object' && !Array.isArray(val)) {
            safeResult[key] = JSON.stringify(val);
          }
        }
      }

      console.log('[GENERATE] Sanitized result keys:', Object.keys(safeResult));

      // ── 3. Simpan ke DB ──────────────────────────────────────────────────
      await saveToDB(safeResult);
      console.log('[GENERATE] Data saved to DB successfully');

      // ── 4. Generate DOCX (non-fatal: jika gagal, data tetap tersimpan) ──
      try {
        const { data: publicUrlData } = supabase.storage
          .from('documents')
          .getPublicUrl('templates/1776116873663_Modul_Ajar_Template.docx');
        const templateUrl = publicUrlData.publicUrl;
        const title = `Modul Ajar - ${mapel} - ${topik} (Q${quarter})`;

        await generateDocx(title, safeResult, templateUrl);
        console.log('[GENERATE] DOCX generated successfully');
      } catch (docxErr: any) {
        // DOCX generation failure is NON-FATAL — data is already saved
        console.error('[GENERATE] DOCX generation failed (non-fatal):', docxErr);
        showToast('Modul tersimpan, tapi file Word gagal diunduh. Anda bisa unduh ulang dari Riwayat.', 'info');
      }

      // ── 5. Navigasi — JANGAN render data apapun ke UI! ────────────────
      showToast('Modul berhasil dibuat dan disimpan!', 'success');
      setTimeout(() => {
        if (onNavigate) {
          onNavigate('history');
        } else {
          onBack();
        }
      }, 1500);

    } catch (error: any) {
      console.error('[GENERATE] Fatal error:', error);
      // Defensive: error.message could be anything, force to string
      let msg = 'Gagal generate modul';
      try {
        if (error && typeof error.message === 'string') {
          msg = error.message;
        } else if (error && typeof error === 'string') {
          msg = error;
        } else if (error) {
          msg = JSON.stringify(error).substring(0, 200);
        }
      } catch {
        msg = 'Gagal generate modul (error tidak dapat dibaca)';
      }
      showToast(msg, 'error');
    } finally {
      setIsGenerating(false);
    }
  };


  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
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
        <div className={`bg-white rounded-xl shadow-sm border border-slate-100 p-8 h-fit lg:col-span-8 lg:col-start-3`}>
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
                    {Array.from({ length: 12 }, (_, i) => <option key={i + 1} value={`Grade ${i + 1}`}>Grade {i + 1}</option>)}
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
                  <input type="text" value={mapel} onChange={e => setMapel(e.target.value)} placeholder="Contoh: Matematika" className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Topik Unit <span className="text-red-500">*</span></label>
                  <input type="text" value={topik} onChange={e => setTopik(e.target.value)} placeholder="Contoh: Aljabar" className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Durasi Unit (Minggu) <span className="text-red-500">*</span></label>
                  <input type="number" min="1" value={durasiMinggu} onChange={e => setDurasiMinggu(e.target.value ? Number(e.target.value) : '')} placeholder="Berlaku berapa minggu" className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Alokasi Waktu/Sesi (Menit) <span className="text-red-500">*</span></label>
                  <input type="number" min="1" value={alokasiSesi} onChange={e => setAlokasiSesi(e.target.value ? Number(e.target.value) : '')} placeholder="Contoh: 45" className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
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
                  <textarea value={makro} onChange={e => setMakro(e.target.value)} rows={2} placeholder="Sistem, Skala, Bukti, dll." className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Konsep Mikro <span className="text-red-500">*</span></label>
                  <textarea value={mikro} onChange={e => setMikro(e.target.value)} rows={2} placeholder="Konsep spesifik terkait topik" className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none" />
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
                <textarea value={tujuan} onChange={e => setTujuan(e.target.value)} rows={3} placeholder="1. Siswa mampu...\n2. Siswa dapat..." className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Enduring Understanding (EU) <span className="text-red-500">*</span></label>
                <textarea value={eu} onChange={e => setEu(e.target.value)} rows={2} placeholder="Pemahaman jangka panjang yang diharapkan" className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Essential Question (EQ) <span className="text-red-500">*</span></label>
                <textarea value={eq} onChange={e => setEq(e.target.value)} rows={2} placeholder="Pertanyaan pemantik (1-3 pertanyaan)" className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none" />
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
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <div className="divide-y divide-slate-100 p-2">
                  {outline.map((row, idx) => (
                    <div key={idx} className="flex flex-col md:flex-row gap-3 py-3 px-2">
                      <div className="w-16 flex-shrink-0 pt-2 font-medium text-slate-500 text-sm text-center">Mg. {row.minggu}</div>
                      <textarea value={row.tujuan} onChange={e => updateOutlineRow(idx, 'tujuan', e.target.value)} placeholder="Tujuan target minggu ini" className="w-full md:w-1/3 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none h-16" />
                      <textarea value={row.kegiatan} onChange={e => updateOutlineRow(idx, 'kegiatan', e.target.value)} placeholder="Ringkasan kegiatan belajar" className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none h-16" />
                      <button type="button" onClick={() => removeOutlineRow(idx)} className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg self-center hidden md:block">
                        <Trash2 className="w-4 h-4" />
                      </button>
                      {/* Trash button mobile res */}
                      <button type="button" onClick={() => removeOutlineRow(idx)} className="text-red-500 text-xs text-right mt-1 md:hidden flex items-center justify-end gap-1">
                        <Trash2 className="w-3 h-3" /> Hapus baris ini
                      </button>
                    </div>
                  ))}
                  {outline.length === 0 && <div className="p-4 text-center text-sm text-slate-400">Belum ada outline minggu ditambahkan.</div>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Asesmen Formatif <span className="text-red-500">*</span></label>
                  <textarea value={asesmenFormatif} onChange={e => setAsesmenFormatif(e.target.value)} rows={3} placeholder="Kapan & kriteria pengerjaan..." className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Asesmen Sumatif <span className="text-red-500">*</span></label>
                  <textarea value={asesmenSumatif} onChange={e => setAsesmenSumatif(e.target.value)} rows={3} placeholder="Deskripsi asesmen akhir/project..." className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">KKM / Nilai Minimum <span className="text-red-500">*</span></label>
                <input type="number" min="0" max="100" value={kkm} onChange={e => setKkm(e.target.value ? Number(e.target.value) : '')} placeholder="Nilai skala 0-100" className="w-32 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
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

              {/* Tombol Generate */}
              <button onClick={handleGenerate} disabled={isGenerating} className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] shadow-xl shadow-blue-600/20">
                {isGenerating ? <><Loader2 className="w-6 h-6 animate-spin" /> Menyusun dan Menyimpan Modul...</> : <><Sparkles className="w-6 h-6" /> Generate &amp; Simpan Modul Ajar</>}
              </button>
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

        {/* Panel preview disembunyikan sementara untuk menghindari React error #31 */}
      </div>
    </div>
  );
};

export default CreateModulPage;
