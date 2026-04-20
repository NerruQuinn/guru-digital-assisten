import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// ─── Helper: Panggil Kimi API dengan timeout 50 detik ───────────────────────
async function callKimi(prompt: string, kimiApiKey: string): Promise<any> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 50000);

  const response = await fetch('https://konektika.web.id/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${kimiApiKey}`,
    },
    body: JSON.stringify({
      model: 'kimi-pro',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
    }),
    signal: controller.signal,
  });
  clearTimeout(timeoutId);

  const rawText = await response.text();
  console.log("Kimi status:", response.status, "| Preview:", rawText.substring(0, 200));

  if (!response.ok) throw new Error('Kimi API error: ' + rawText.substring(0, 200));

  const data = JSON.parse(rawText);
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error('Kimi returned empty content');

  try {
    return JSON.parse(content);
  } catch {
    const cleaned = content.replace(/^```json|^```|```$/gm, '').trim();
    return JSON.parse(cleaned);
  }
}

// ────────────────────────────────────────────────────────────────────────────

function forceString(val: any): string {
  if (val === null || val === undefined) return '';
  if (typeof val === 'string') return val;
  if (Array.isArray(val)) return val.join(', ');
  if (typeof val === 'object') return JSON.stringify(val);
  return String(val);
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { formData } = await req.json()

    // Inisialisasi Supabase Client dengan Service Role Key
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('APP_SECRET_KEY') ?? '',
    )

    // Ambil detail template dari tabel templates
    const { data: templateData, error: templateError } = await supabaseClient
      .from('templates')
      .select('*')
      .eq('id', formData.template_id)
      .single()

    if (templateError || !templateData) {
      throw new Error('Template not found')
    }

    // Info template (ringkas)
    const templateInfo = `Template: ${templateData.name}. ${(templateData.structure_prompt || '').substring(0, 300)}`;

    // Ekstrak Form Data
    const s1 = formData.step1 || {};
    const s2 = formData.step2 || {};
    const s3 = formData.step3 || {};

    const kimiApiKey = Deno.env.get('KIMI_API_KEY') ?? '';
    console.log("API Key exists:", !!kimiApiKey);

    // ── FASE 1: Identitas & Konsep ──────────────────────────────────────────
    console.log("=== FASE 1 mulai ===");
    const fase1Result = await callKimi(`
Kamu adalah AI Pembuat Modul Ajar profesional.
${templateInfo}

DATA INPUT:
- Mata Pelajaran: ${s1.mapel}
- Grade/Kelas: ${s1.grade}
- Topik Unit: ${s1.topik}
- Tahun Ajaran: ${s1.tahun_ajaran}
- Quarter: ${s1.quarter}
- Durasi: ${s1.durasi_minggu} Minggu
- Alokasi Sesi: ${s1.alokasi_sesi} Menit/Pertemuan
- Guru: ${formData.guru_name}
- Konsep Makro: ${s2.makro}
- Konsep Mikro: ${s2.mikro}
- Elemen Pembelajaran: ${s2.elemen_belajar?.join(', ')}
- Nilai Kebajikan: ${s2.virtues?.join(', ')}
- Tujuan Pembelajaran: ${s2.tujuan}
- Enduring Understanding (EU): ${s2.eu}
- Essential Question (EQ): ${s2.eq}

INSTRUKSI:
- eu HARUS mengandung nilai Kristiani + kutipan ayat Alkitab yang relevan.
- Kembalikan HANYA JSON berikut, tanpa teks lain:

{
  "tahun_ajaran": "",
  "grade": "",
  "quarter": "",
  "mapel": "",
  "topik": "",
  "durasi": "",
  "guru": "",
  "makro": "",
  "mikro": "",
  "elemen": "",
  "tujuan_pembelajaran": "",
  "alokasi_waktu": "",
  "eu": "",
  "eq": "",
  "student_expected_outcome": "",
  "capaian_pembelajaran": "",
  "nilai_kebajikan": "",
  "transdisipliner": ""
}
`, kimiApiKey);
    console.log("=== FASE 1 selesai ===");

    fase1Result.nilai_kebajikan = forceString(fase1Result.nilai_kebajikan);
    fase1Result.transdisipliner = forceString(fase1Result.transdisipliner);
    fase1Result.elemen = forceString(fase1Result.elemen);
    fase1Result.tujuan_pembelajaran = forceString(fase1Result.tujuan_pembelajaran);
    fase1Result.capaian_pembelajaran = forceString(fase1Result.capaian_pembelajaran);
    fase1Result.student_expected_outcome = forceString(fase1Result.student_expected_outcome);

    // ── FASE 2: Kompetensi & Elaborasi & Metode ─────────────────────────────
    console.log("=== FASE 2 mulai ===");
    const fase2Result = await callKimi(`
Kamu adalah AI Pembuat Modul Ajar profesional.

KONTEKS MODUL (dari fase sebelumnya):
- Mata Pelajaran: ${fase1Result.mapel}
- Topik: ${fase1Result.topik}
- Grade: ${fase1Result.grade}
- Tujuan Pembelajaran: ${fase1Result.tujuan_pembelajaran}

DATA TAMBAHAN:
- Metode Pembelajaran: ${s3.metode?.join(', ')}
- Asesmen Formatif: ${s3.asesmen_formatif}
- Asesmen Sumatif: ${s3.asesmen_sumatif}

INSTRUKSI:
Kembalikan HANYA JSON berikut, tanpa teks lain:

{
  "kompetensi_prasyarat": "",
  "kompetensi_target": "",
  "elaborasi_berkembang": "",
  "elaborasi_kompeten": "",
  "elaborasi_sangat_kompeten": "",
  "metode_pembelajaran": "",
  "sumber_pembelajaran": "",
  "sarana_prasarana": ""
}
`, kimiApiKey);
    console.log("=== FASE 2 selesai ===");

    fase2Result.metode_pembelajaran = forceString(fase2Result.metode_pembelajaran);
    fase2Result.sumber_pembelajaran = forceString(fase2Result.sumber_pembelajaran);
    fase2Result.sarana_prasarana = forceString(fase2Result.sarana_prasarana);
    fase2Result.kompetensi_prasyarat = forceString(fase2Result.kompetensi_prasyarat);
    fase2Result.kompetensi_target = forceString(fase2Result.kompetensi_target);
    fase2Result.elaborasi_berkembang = forceString(fase2Result.elaborasi_berkembang);
    fase2Result.elaborasi_kompeten = forceString(fase2Result.elaborasi_kompeten);
    fase2Result.elaborasi_sangat_kompeten = forceString(fase2Result.elaborasi_sangat_kompeten);

    // ── FASE 3: Strategi Mingguan & Asesmen ─────────────────────────────────
    console.log("=== FASE 3 mulai ===");
    const outlineText = s3.outline?.map((o: any) =>
      `Minggu ${o.minggu}: Tujuan="${o.tujuan}" | Kegiatan="${o.kegiatan}"`
    ).join('\n') || '';

    const fase3Result = await callKimi(`
Kamu adalah AI Pembuat Modul Ajar profesional.

KONTEKS MODUL:
- Mata Pelajaran: ${fase1Result.mapel}
- Topik: ${fase1Result.topik}
- Grade: ${fase1Result.grade}
- Durasi: ${s1.durasi_minggu} Minggu
- Tujuan Pembelajaran: ${fase1Result.tujuan_pembelajaran}

DATA STRATEGI:
- Outline per Minggu dari Guru:
${outlineText}
- Asesmen Formatif: ${s3.asesmen_formatif}
- Asesmen Sumatif: ${s3.asesmen_sumatif}
- KKM: ${s3.kkm}

INSTRUKSI KETAT:
1. outline_mingguan HARUS berisi PERSIS ${s1.durasi_minggu} item.
2. Minggu pertama (minggu 1) label = "Tuning In".
3. Minggu terakhir (minggu ${s1.durasi_minggu}) label = "Refleksi & Presentasi".
4. Setiap field "tahapan" SELALU diawali dengan "Salam dan Doa" dan diakhiri dengan "Doa Penutup".
5. Kembalikan HANYA JSON berikut, tanpa teks lain:

{
  "asesmen_formatif": "",
  "asesmen_sumatif": "",
  "tindakan_nyata": "",
  "outline_mingguan": [
    { "minggu": 1, "label": "Tuning In", "tujuan": "", "tahapan": "", "waktu": "${s1.alokasi_sesi || 70}" }
  ],
  "timeline": [
    { "due_date": "", "kegiatan": "" }
  ],
  "prosedur_sumatif": [""],
  "kkm": "",
  "indikator_kkm": [""]
}
`, kimiApiKey);
    console.log("=== FASE 3 selesai ===");

    // Sanitize SEMUA field fase3 — field ini sebelumnya TIDAK disanitasi!
    fase3Result.asesmen_formatif = forceString(fase3Result.asesmen_formatif);
    fase3Result.asesmen_sumatif = forceString(fase3Result.asesmen_sumatif);
    fase3Result.tindakan_nyata = forceString(fase3Result.tindakan_nyata);
    fase3Result.kkm = forceString(fase3Result.kkm);

    // prosedur_sumatif dan indikator_kkm: bisa array, pastikan isi string
    if (Array.isArray(fase3Result.prosedur_sumatif)) {
      fase3Result.prosedur_sumatif = fase3Result.prosedur_sumatif.map((item: any) => forceString(item));
    } else {
      fase3Result.prosedur_sumatif = [forceString(fase3Result.prosedur_sumatif)];
    }
    if (Array.isArray(fase3Result.indikator_kkm)) {
      fase3Result.indikator_kkm = fase3Result.indikator_kkm.map((item: any) => forceString(item));
    } else {
      fase3Result.indikator_kkm = [forceString(fase3Result.indikator_kkm)];
    }

    // outline_mingguan: pastikan setiap item punya field string
    if (Array.isArray(fase3Result.outline_mingguan)) {
      fase3Result.outline_mingguan = fase3Result.outline_mingguan.map((item: any) => {
        if (typeof item !== 'object' || item === null) return { minggu: '', label: '', tujuan: '', tahapan: '', waktu: '' };
        return {
          minggu: forceString(item.minggu),
          label: forceString(item.label),
          tujuan: forceString(item.tujuan),
          tahapan: forceString(item.tahapan),
          waktu: forceString(item.waktu),
        };
      });
    }

    // timeline: pastikan setiap item punya field string
    if (Array.isArray(fase3Result.timeline)) {
      fase3Result.timeline = fase3Result.timeline.map((item: any) => {
        if (typeof item !== 'object' || item === null) return { due_date: '', kegiatan: '' };
        return {
          due_date: forceString(item.due_date),
          kegiatan: forceString(item.kegiatan),
        };
      });
    }


    // ── FASE 4: Rubrik & Refleksi ────────────────────────────────────────────
    console.log("=== FASE 4 mulai ===");
    const fase4Result = await callKimi(`
Kamu adalah AI Pembuat Modul Ajar profesional dengan nilai-nilai Kristiani.

KONTEKS MODUL:
- Mata Pelajaran: ${fase1Result.mapel}
- Topik: ${fase1Result.topik}
- Grade: ${fase1Result.grade}
- EU (Enduring Understanding): ${fase1Result.eu}
- KKM: ${fase3Result.kkm || s3.kkm}
- Guru: ${fase1Result.guru}

INSTRUKSI KETAT:
1. refleksi HARUS ditulis naratif minimal 3 paragraf penuh (bukan poin-poin).
2. refleksi HARUS mengandung nilai Kristiani dan minimal 1 kutipan ayat Alkitab yang relevan.
3. Rubrik harus sesuai dengan konteks mata pelajaran dan topik.
4. Kembalikan HANYA JSON berikut, tanpa teks lain:

{
  "rubrik": [
    { "level": "Sangat Baik (91-100)", "kriteria": "" },
    { "level": "Baik (81-90)", "kriteria": "" },
    { "level": "Memenuhi Standar (70-80)", "kriteria": "" },
    { "level": "Perlu Meningkatkan (<70)", "kriteria": "" }
  ],
  "refleksi": "",
  "nama_guru": "",
  "nama_principal": "Denny Pattinasarany",
  "nama_koordinator": "Kristina Puji Astuti"
}
`, kimiApiKey);
    console.log("=== FASE 4 selesai ===");

    fase4Result.refleksi = forceString(fase4Result.refleksi);
    fase4Result.nama_guru = forceString(fase4Result.nama_guru);
    fase4Result.nama_principal = forceString(fase4Result.nama_principal);
    fase4Result.nama_koordinator = forceString(fase4Result.nama_koordinator);

    // rubrik: pastikan setiap item punya field string
    if (Array.isArray(fase4Result.rubrik)) {
      fase4Result.rubrik = fase4Result.rubrik.map((item: any) => {
        if (typeof item !== 'object' || item === null) return { level: '', kriteria: '' };
        return {
          level: forceString(item.level),
          kriteria: forceString(item.kriteria),
        };
      });
    }

    // ── Gabungkan semua hasil ────────────────────────────────────────────────
    const finalJSON: any = {
      ...fase1Result,
      ...fase2Result,
      ...fase3Result,
      ...fase4Result,
    };

    // Bersihkan semua field: jika isinya adalah object murni (mungkin JSON Schema menyusup), ubah ke string
    for (const key in finalJSON) {
      if (Object.prototype.hasOwnProperty.call(finalJSON, key)) {
        const val = finalJSON[key];
        if (val !== null && typeof val === 'object' && !Array.isArray(val)) {
          finalJSON[key] = JSON.stringify(val);
        }
      }
    }

    console.log("=== SEMUA FASE SELESAI. Mengembalikan hasil gabungan ===");

    return new Response(
      JSON.stringify({ result: finalJSON }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error: any) {
    console.error("Function error execution:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})