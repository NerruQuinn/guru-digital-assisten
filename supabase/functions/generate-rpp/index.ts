import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

    // Unduh file dari storage
    const { data: fileData, error: fileError } = await supabaseClient
      .storage
      .from('documents')
      .download(templateData.file_path)

    if (fileError || !fileData) {
      throw new Error('Gagal mengunduh file template')
    }

    // Handling PDF Base64 jika tipe file PDF
    let documentMessagePart: any = null;
    let templatePromptAddition = `\nNama Template yang harus diikuti formatnya: ${templateData.name}\n`;

    if (templateData.file_type === 'pdf') {
       const arrayBuffer = await fileData.arrayBuffer();
       const uint8Array = new Uint8Array(arrayBuffer);
       
       let binaryString = '';
       for(let i = 0; i < uint8Array.length; i++) {
         binaryString += String.fromCharCode(uint8Array[i]);
       }
       const base64Data = btoa(binaryString);

       // Format untuk Gemini API
       documentMessagePart = {
         inlineData: {
            mimeType: "application/pdf",
            data: base64Data
         }
       };
       
       templatePromptAddition += "(Silakan lihat dokumen PDF terlampir untuk pedoman struktur dokumen). Sangat kritis untuk tetap berpegang pada bagian-bagian heading di PDF tersebut bila ada.\n"
    } else {
       templatePromptAddition += "(Ini adalah rujukan dokumen DOCX. Karena tidak ada preview visual, susun Modul Ajar/RPP secara komprehensif memakai standar modern Kurikulum Merdeka atau standar internasional yang paling cocok dengan nama template ini).\n"
    }

    // Ekstrak Form Data
    const s1 = formData.step1 || {};
    const s2 = formData.step2 || {};
    const s3 = formData.step3 || {};

    const textPrompt = `
Kamu adalah AI Pembuat Modul Ajar Level Ahli / Master Teacher.
${templatePromptAddition}
${templateData.structure_prompt || ''}

=== IDENTITAS & INFO DASAR ===
- Mata Pelajaran: ${s1.mapel}
- Grade/Kelas: ${s1.grade}
- Topik Unit: ${s1.topik}
- Tahun Ajaran: ${s1.tahun_ajaran}
- Quarter (Q): ${s1.quarter}
- Durasi Unit: ${s1.durasi_minggu} Minggu
- Target Alokasi Sesi: ${s1.alokasi_sesi} Menit/Pertemuan
- Nama Guru Pengampu: ${formData.guru_name}

=== TUJUAN & KONSEP ===
- Konsep Makro Pembelajaran: ${s2.makro}
- Konsep Mikro Spesifik: ${s2.mikro}
- Elemen Profil/Kemahiran: ${s2.elemen_belajar?.join(', ')}
- Nilai Kebajikan (Virtue Values): ${s2.virtues?.join(', ')}
- Tujuan Pembelajaran Inti: 
${s2.tujuan}
- Enduring Understanding (EU) / Pemahaman Makna: ${s2.eu}
- Essential Question (EQ) / Pertanyaan Pemantik: ${s2.eq}

=== STRATEGI & ASESMEN ===
- Metode Pembelajaran Utama: ${s3.metode?.join(', ')}
- Outline Target Per Minggu:
  ${s3.outline?.map((o: any) => '* Minggu ' + o.minggu + ': ' + o.tujuan + ' | Rencana Kegiatan: ' + o.kegiatan).join('\n  ')}
- Rencana Asesmen Formatif: ${s3.asesmen_formatif}
- Rencana Asesmen Sumatif: ${s3.asesmen_sumatif}
- Standar Kelulusan/KKM: ${s3.kkm}

=== PENUGASAN KHUSUS UNTUK MU ===
Berdasarkan data di atas, mohon hasilkan nilai JSON untuk mengisi template Modul Ajar dengan instruksi mutlak ini:
1. Setiap kegiatan SELALU diawali "salam dan doa" dan diakhiri "doa".
2. EU dan Refleksi Guru HARUS mengandung nilai Kristiani + kutipan ayat Alkitab yang relevan.
3. Refleksi Guru ditulis naratif minimal 3 paragraf, bukan poin-poin.
4. Tabel mingguan harus persis sejumlah durasi minggu (${s1.durasi_minggu}). Minggu pertama selalu bertipe "Tuning In". Minggu terakhir selalu bertipe refleksi/presentasi karya.
5. Kembalikan HASIL HANYA DALAM FORMAT JSON SESUAI DENGAN STRUKTUR BERIKUT INI. JANGAN ADA TEXT LAIN SELAIN JSON!

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
  "transdisipliner": "",
  "kompetensi_prasyarat": "",
  "kompetensi_target": "",
  "elaborasi_berkembang": "",
  "elaborasi_kompeten": "",
  "elaborasi_sangat_kompeten": "",
  "metode_pembelajaran": "",
  "sumber_pembelajaran": "",
  "sarana_prasarana": "",
  "asesmen_formatif": "",
  "asesmen_sumatif": "",
  "tindakan_nyata": "",
  "outline_mingguan": [
    { "minggu": 1, "label": "Tuning In", "tujuan": "", "tahapan": "", "waktu": "70" }
  ],
  "timeline": [
    { "due_date": "", "kegiatan": "" }
  ],
  "prosedur_sumatif": [""],
  "kkm": "",
  "indikator_kkm": [""],
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
`

    const partsArray: any[] = [];
    if (documentMessagePart) {
       partsArray.push(documentMessagePart);
    }
    partsArray.push({ text: textPrompt });

    const geminiApiKey = Deno.env.get('GEMINI_API_KEY') ?? '';
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-04-17:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: partsArray }],
        generationConfig: {
          responseMimeType: "application/json",
        }
      }),
    })

    const geminiData = await response.json()
    
    if (!response.ok) {
        console.error("Gemini error:", geminiData);
        throw new Error(geminiData.error?.message || "Error generating content with Gemini API");
    }

    const textualResult = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!textualResult) {
        console.error("Gemini no result error. Payload:", JSON.stringify(geminiData));
        throw new Error("Gemini API mengembalikan hasil kosong (kemungkinan diblokir oleh Safety Settings).");
    }

    let parsedJSON;
    try {
        parsedJSON = JSON.parse(textualResult);
    } catch (e) {
        // Fallback in case there are missing markdown ticks
        const cleaned = textualResult.replace(/^```json/g, '').replace(/^```/g, '').replace(/```$/g, '').trim();
        parsedJSON = JSON.parse(cleaned);
    }

    return new Response(
      JSON.stringify({ result: parsedJSON }),
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