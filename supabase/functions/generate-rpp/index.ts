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
    
    // Inisialisasi Supabase Client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Dapatkan data user
    const {
      data: { user },
    } = await supabaseClient.auth.getUser()

    if (!user) {
      throw new Error('Not authenticated')
    }

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
    let documentMessageContent: any = null;
    let templatePromptAddition = `\nNama Template yang harus diikuti formatnya: ${templateData.name}\n`;

    if (templateData.file_type === 'pdf') {
       const arrayBuffer = await fileData.arrayBuffer();
       const uint8Array = new Uint8Array(arrayBuffer);
       
       let binaryString = '';
       for(let i = 0; i < uint8Array.length; i++) {
         binaryString += String.fromCharCode(uint8Array[i]);
       }
       const base64Data = btoa(binaryString);

       documentMessageContent = {
         type: "document",
         source: {
            type: "base64",
            media_type: "application/pdf",
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
Buat dokumen Modul Ajar/Lesson Plan yang sangat mendalam berdasarkan data berikut dan sesuaikan formating dengan konteks Template.

${templatePromptAddition}

=== IDENTITAS & INFO DASAR (STEP 1) ===
- Mata Pelajaran: ${s1.mapel}
- Grade/Kelas: ${s1.grade}
- Topik Unit: ${s1.topik}
- Tahun Ajaran: ${s1.tahun_ajaran}
- Quarter (Q): ${s1.quarter}
- Durasi Unit: ${s1.durasi_minggu} Minggu
- Target Alokasi Sesi: ${s1.alokasi_sesi} Menit/Pertemuan
- Nama Guru Pengampu: ${formData.guru_name}

=== TUJUAN & KONSEP (STEP 2) ===
- Konsep Makro Pembelajaran: ${s2.makro}
- Konsep Mikro Spesifik: ${s2.mikro}
- Elemen Profil/Kemahiran: ${s2.elemen_belajar?.join(', ')}
- Nilai Kebajikan (Virtue Values): ${s2.virtues?.join(', ')}
- Tujuan Pembelajaran Inti: 
${s2.tujuan}
- Enduring Understanding (EU) / Pemahaman Makna: ${s2.eu}
- Essential Question (EQ) / Pertanyaan Pemantik: ${s2.eq}

=== STRATEGI & ASESMEN (STEP 3) ===
- Metode Pembelajaran Utama: ${s3.metode?.join(', ')}
- Outline Target Per Minggu:
  ${s3.outline?.map((o: any) => `* Minggu ${o.minggu}: ${o.tujuan} | Rencana Kegiatan: ${o.kegiatan}`).join('\n  ')}
- Rencana Asesmen Formatif: ${s3.asesmen_formatif}
- Rencana Asesmen Sumatif: ${s3.asesmen_sumatif}
- Standar Kelulusan/KKM: ${s3.kkm}

=== PENUGASAN KHUSUS UNTUK MU ===
Berdasarkan data di atas, mohon hasilkan Modul Ajar utuh dengan instruksi mutlak ini:
1. Formulasikan **Student Expected Outcome** yang selaras dengan EU, EQ, dan Tujuan Pembelajaran. Pastikan tujuan tersebut dijabarkan dengan naratif berdasar hirarki kognitif (taksonomi Bloom).
2. Tuliskan implementasi nyata mengenai detail Metode Pembelajaran yang dipilih (jelaskan "Mengapa metode ${s3.metode?.join(', ')} ditekankan pada bab ini?").
3. Ekspand **Strategi Mingguan** (Outline) yang saya sediakan menjadi **narasi lengkap langkah per langkah per minggu**. Saya hanya memberikan ringkasan (tujuan & kegiatan), kamu harus membangunnya menjadi deskripsi langkah awal, inti, penutup per minggu!
4. Buat **Rubrik Asesmen Sumatif/Formatif spesifik dengan 4 level** kriteria pencapaian untuk KKM ${s3.kkm}.
5. Lengkapi akhir modul dengan kolom **Refleksi Guru**.

Tulislah output Modul Ajar-nya SEKARANG JUGA HANYA dalam format markdown yang langsung dapat dirender dan dibaca. TIDAK ADA intro chat seperti 'Tentu, ini modul ajarnya'.
`

    const contentArray: any[] = [];
    if (documentMessageContent) {
       contentArray.push(documentMessageContent);
    }
    contentArray.push({ type: "text", text: textPrompt });

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': Deno.env.get('ANTHROPIC_API_KEY') ?? '',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 5000,
        messages: [{ role: 'user', content: contentArray }],
      }),
    })

    const anthropicData = await response.json()
    
    if (!response.ok) {
        console.error("Anthropic error:", anthropicData);
        throw new Error(anthropicData.error?.message || "Error generating content with Claude");
    }

    const result = anthropicData.content[0].text

    // Edge function langsung mengirim balik respon, TIDAK auto-insert. 
    // Insert dilakukan frontend lewat tombol Save.
    
    return new Response(
      JSON.stringify({ result }),
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