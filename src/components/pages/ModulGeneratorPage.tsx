import React, { useState, createContext, useContext } from 'react';
import { Plus, Trash2, Wand2, Loader2, Sparkles, ChevronRight } from 'lucide-react';

// --- CONTEXT ---
interface FormContextType {
  data: typeof initialData;
  handleChange: (name: string, value: string) => void;
  toggleAiPopup: (fieldKey: string) => void;
  aiPopups: Record<string, boolean>;
  aiPrompts: Record<string, string>;
  setAiPrompts: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  executeAIGeneration: (fieldKey: string, configKey: string, scheduleIndex?: number | null) => void;
  isGenerating: Record<string, boolean>;
}
const FormContext = createContext<FormContextType | null>(null);

// --- DATA AWAL (Initial Data) ---
const initialData = {
  academicYear: "2024 - 2025",
  keywords: "Kreativitas dan inovasi",
  phaseClassQuarter: "Grade 1 / Quarter 3",
  subject: "Komputer",
  duration: "9 Minggu/weeks",
  topic: "Paint- Menggambar objek dunia nyata menggunakan microsoft paint",
  teacher: "Joshua Bartimeus",
  
  concept: "Makro/Macro: Komputer, Ms Paint.\nMikro/Micro: Perangkat komputer, cara save file, cara open file, cara menyalakan dan mematikan komputer.",
  element: "Mengelompokkan shape\nMengurutkan shape\nMembandingkan shape\nMengikuti instruksi",
  learningObjective: "menerapkan berpikir komputasional dalam menyelesaikan persoalan sehari-hari yang dialami dengan mengidentifikasi, membandingkan, memilih, memilah, mengelompokkan, dan mengurutkan objek konkret.",
  timeAllocation: "16 Sesi / 960 Menit",
  enduringUnderstanding: "Allah menciptakan berbagai teknologi untuk membantu manusia dalam berkomunikasi dan memberikan informasi untuk kemuliaanNya.",
  essentialQuestion: "1. Bagaimana Allah menciptakan teknologi informasi dan komunikasi untuk kita?\n2. Bagaimana Allah ingin kita menggunakan teknologi informasi dan komunikasi untuk kemuliaanNya?\n3. Mengapa Allah ingin kita menggunakan teknologi informasi dan komunikasi dalam kehidupan kita?",
  
  studentOutcome: "Murid mampu mengenal dan menggunakan komputer dengan baik dan juga mengelompokkan, membandingkan, dan mengurutkan shape menggunakan paint dengan rapi dan baik sesuai dengan instruksi.",
  learningTarget: "Murid mampu mengenal dan menggunakan komputer dengan baik dan juga mengelompokkan, membandingkan, dan mengurutkan shape menggunakan paint dengan rapi dan baik sesuai dengan instruksi.",
  virtueValue: "Virtue: Kebijaksanaan, ketelitian.\nValue: Komitmen, Kepercayaan diri.",
  transdisciplinarySkills: "",

  prerequisiteCompetence: "Murid dapat mengelompokkan objek berdasarkan bentuk dan fungsi.\nMurid memahami kata dasar bahasa Inggris untuk perintah di komputer.\nMurid mengenali dan mengkategorikan berbagai shape dasar untuk gambar.",
  targetCompetence: "Murid dapat mengelompokkan shape di Paint sesuai instruksi.\nMurid mampu membandingkan dan menyusun shape dengan rapi.\nMurid dapat mengurutkan shape berdasarkan instruksi.\nMurid mampu menggunakan Paint dan menyimpan file dengan benar.",
  
  elaborationWell: "Mampu Mengelompokkan objek dengan bentuk objek yang konkret (Warna dan Shape) menggunakan paint menggunakan paint dengan cukup baik.",
  elaborationCompetent: "Mampu Mengelompokkan objek dengan bentuk objek yang konkret (Warna dan Shape) menggunakan paint menggunakan paint dengan semua dikerjakan dengan baik dan rapi.",
  elaborationVery: "Mampu Mengelompokkan objek dengan bentuk objek yang konkret (Warna dan Shape) menggunakan paint dengan rapi dan baik sesuai dengan instruksi.",
  
  learningMethod: "Ceramah, konseptual, praktik.",
  sources: "Powerpoint dan Paint",
  facilities: "Lab Komputer",
  
  formativeAss: "Kuis dan membuat Mengelompokkan objek dengan bentuk objek yang konkret (Warna dan Shape) menggunakan Paint.",
  summativeAss: "Soal instruksi berupa Mengelompokkan objek dengan bentuk objek yang konkret (Warna dan Shape)",
  missionService: "Murid membuat sebuah hasil daripada instruksi yang disajikan dalam bentuk shape-shape.",

  schedule: [
    { week: "1", objective: "Mampu mengenal kembali cara membuka file di Onedrive. Belajar menggambar/mewarnai objek konkret yang ada didunia nyata dengan sederhana berdasarkan instruksi.", stages: "Murid diawali dengan salam pembuka oleh leader kelas. Murid membuka kelas dengan doa. Guru menjelaskan tujuan pembelajaran hari ini, yaitu mengenal kembali cara membuka file di OneDrive serta belajar menggambar dan mewarnai objek konkret yang ada di dunia nyata dengan instruksi yang sederhana. Murid menyimak penjelasan guru mengenai cara membuka file di OneDrive, termasuk cara mengakses akun, mencari file yang disimpan, dan membuka file tersebut untuk digunakan. Guru juga menjelaskan pentingnya menyimpan file di cloud untuk mempermudah akses dan kolaborasi. Murid mengikuti instruksi guru untuk membuka file yang sudah disimpan di OneDrive dan memastikan file tersebut dapat dibuka dengan benar pada perangkat yang digunakan. Setelah membuka file di OneDrive, murid mengikuti instruksi untuk menggambar atau mewarnai objek konkret yang ada di dunia nyata (misalnya, gambar pohon, rumah, atau hewan), menggunakan bahan gambar sederhana (misalnya, pensil warna, spidol) dengan langkah-langkah yang diberikan guru. Murid menutup kelas dengan doa.", time: "2 Sesi/ 60 Menit" },
    { week: "2", objective: "Mampu mewarnai/menggambar objek konkret sederhana menggunakan paint (Formatif)", stages: "Murid diawali dengan salam pembuka oleh leader kelas. Murid membuka kelas dengan doa. Guru menjelaskan tujuan pembelajaran hari ini, yaitu mampu mewarnai atau menggambar objek konkret sederhana menggunakan aplikasi Paint sebagai penilaian formatif. Murid menyimak penjelasan guru tentang cara menggunakan aplikasi Paint, termasuk cara memilih alat gambar (pensil, kuas), memilih warna, serta cara menggambar dan mewarnai objek sederhana seperti rumah, pohon, atau benda-benda lain yang ada di sekitar mereka. Murid mulai menggambar atau mewarnai objek konkret sederhana di aplikasi Paint sesuai dengan instruksi guru, menggunakan alat yang tersedia dalam program tersebut untuk membuat gambar yang jelas dan rapi. Murid menyimpan hasil gambar atau mewarnai mereka dan mengumpulkannya untuk penilaian formatif, serta menutup kelas dengan doa.", time: "2 Sesi/ 60 Menit" }
  ],

  summativeTask: "Guru akan menyajikan dan menampilkan 5 gambar yang sudah dilatihkan di pertemuan sebelum-sebelumnya. \nMurid akan memilih dua gambar yang untuk digambar sesuai dengan contoh. \nMurid diharapkan menggambar mirip dengan contoh yang ditampilkan di depan kelas. \nMurid dapat mewarnai gambar tersebut dengan warna favoritnya masing-masing.",
  summativeKKM: "70",
  summativeIndicators: "Murid dapat menggunakan tools pada Paint dengan baik untuk menggambar elemen-elemen dasar.\nMurid mampu mengikuti instruksi untuk menggambar 2 dari 5 objek yang ditampilkan dengan elemen yang lengkap dan sesuai.\nMurid dapat mewarnai gambar dengan rapi dan sesuai, tanpa ada objek yang melayang.",

  rubricSangatBaik: "Semua objek ditempatkan dengan benar.\nSemua object diwarnai dengan rapi\nSemua instruksi dilakukan dengan baik.",
  rubricBaik: "Terdapat 1 objek yang salah tempat atau melayang.\nWarna hampir semuanya rapi namun terdapat 1 bagian yang kurang diwarnai dengan baik.\nTerdapat 1 instruksi yang tidak dilakukan dengan baik.",
  rubricStandar: "Terdapat 2-3 objek yang salah tempat atau melayang.\nTerdapat 2-3 bagian objek yang diwarnai kurang baik atau tidak diwarnai.\nTerdapat 2-3 instruksi yang tidak dilakukan dengan baik.",
  rubricKurang: "Terdapat lebih dari 3 objek yang salah tempat atau melayang.\nTerdapat lebih dari 3 objek yang tidak diwarnai atau kurang rapi.\nTerdapat lebih dari 3 instruksi yang tidak dilakukan dengan baik",

  reflection: "Saya menyadari bahwa menjadi seorang guru bukan hanya tentang menyampaikan materi, tetapi juga tentang bagaimana membimbing murid dengan cara yang edukatif dan penuh kesabaran. Setiap anak memiliki karakter dan cara belajar yang berbeda, sehingga saya perlu terus belajar untuk menemukan pendekatan yang paling efektif dalam mengajar. Dengan lebih memahami kebutuhan mereka, saya dapat menciptakan suasana belajar yang lebih interaktif dan menyenangkan.\n\nSelain itu, saya juga ingin melatih diri untuk lebih sabar dalam menghadapi berbagai tantangan dalam mengajar. Anak-anak sering menunjukkan perilaku yang beragam, dan sebagai guru, saya harus mampu merespons dengan bijak dan penuh pengertian. Kesabaran akan membantu saya membangun hubungan yang lebih baik dengan murid serta menciptakan lingkungan yang mendukung pertumbuhan mereka, baik secara akademik maupun karakter.",
  
  signPrincipal: "Denny Pattinasarany",
  signCoordinator: "Kristina Puji Astuti",
  signTeacher: "Joshua Bartimeus"
};

// --- CONFIG AI PROMPTS ---
type ModulData = typeof initialData;

const aiConfig: Record<string, { system: string, user: (data: ModulData, input: string, extraContext?: any) => string }> = {
  topic: {
    system: "Kamu adalah asisten pembuatan Modul Ajar SDH Ambon. Tulis 1 kalimat deskriptif topik unit pembelajaran dalam Bahasa Indonesia. Format: [Aktivitas utama] menggunakan [alat/media]. Output hanya kalimat topiknya saja, tanpa penjelasan.",
    user: (data, input) => `Mata Pelajaran: ${data.subject}, Kelas: ${data.phaseClassQuarter}, Inti materi: ${input}`
  },
  concept: {
    system: "Kamu adalah asisten Modul Ajar SDH Ambon. Tulis konsep pembelajaran format:\nMakro/Macro: [konsep besar]\nMikro/Micro: [sub-konsep teknis]\nOutput hanya teks formatnya saja.",
    user: (data, input) => `Topik: ${data.topic}, Hal-hal yang dipelajari: ${input}`
  },
  element: {
    system: "Kamu adalah asisten Modul Ajar SDH Ambon. Tulis 4-5 elemen pembelajaran menggunakan kata kerja aktif Bloom's Taxonomy. Setiap elemen di baris baru. Contoh format:\nMengelompokkan shape\nMengurutkan shape\nOutput hanya daftar elemennya.",
    user: (data, input) => `Topik: ${data.topic}, Kompetensi inti: ${input}`
  },
  learningObjective: {
    system: "Kamu adalah asisten Modul Ajar SDH Ambon. Tulis 1 kalimat tujuan pembelajaran yang dimulai dengan kata kerja aktif seperti 'menerapkan', 'menggunakan', atau 'mengidentifikasi'. Kalimat harus menggambarkan kemampuan berpikir dan aktivitas konkret murid. Output hanya kalimatnya.",
    user: (data, input) => `Topik: ${data.topic}, Kata kerja kompetensi: ${input}`
  },
  enduringUnderstanding: {
    system: "Kamu adalah asisten Modul Ajar SDH Ambon. Tulis 1-2 kalimat Pemahaman Sepanjang Masa yang menghubungkan materi dengan perspektif iman Kristen. Harus menunjukkan bagaimana Allah berkarya melalui topik ini. Contoh: 'Allah menciptakan berbagai teknologi untuk membantu manusia dalam berkomunikasi untuk kemuliaanNya.' Output hanya kalimat EU-nya.",
    user: (data, input) => `Topik: ${data.topic}, Nilai iman yang ingin ditanamkan: ${input}`
  },
  essentialQuestion: {
    system: "Kamu adalah asisten Modul Ajar SDH Ambon. Tulis 3 Pertanyaan Esensial yang memancing pemikiran mendalam dengan perspektif iman Kristen. Gunakan kata tanya Bagaimana/Mengapa/Apa. Setiap pertanyaan di baris baru. Output hanya 3 pertanyaannya saja.",
    user: (data, input) => `Topik: ${data.topic}, EU: ${data.enduringUnderstanding}, Fokus nilai: ${input}`
  },
  virtueValue: {
    system: "Kamu adalah asisten Modul Ajar SDH Ambon. Tentukan Virtue dan Value untuk unit ini. Output format:\nVirtue: [2 kebajikan]\nValue: [2 nilai]\nPilih dari: Virtue (Kebijaksanaan, Ketelitian, Ketekunan, Kejujuran, Tanggung Jawab, Kreativitas, Kasih). Value (Komitmen, Kepercayaan Diri, Kerja Sama, Integritas, Hormat, Pelayanan). Output hanya teks formatnya.",
    user: (data, input) => `Topik: ${data.topic}, Aktivitas utama murid: ${input}`
  },
  prerequisiteCompetence: {
    system: "Kamu adalah asisten Modul Ajar SDH Ambon. Tulis 3 kompetensi prasyarat berupa kalimat 'Murid dapat/mampu/mengenal...'. Setiap kompetensi di baris baru. Output hanya 3 kalimat prasyaratnya.",
    user: (data, input) => `Topik: ${data.topic}, Hal dasar yang perlu diketahui murid: ${input}`
  },
  targetCompetence: {
    system: "Kamu adalah asisten Modul Ajar SDH Ambon. Tulis 4 kompetensi target yang terukur dan spesifik berupa kalimat 'Murid dapat/mampu...'. Setiap kompetensi di baris baru. Output hanya 4 kalimat targetnya.",
    user: (data, input) => `Topik: ${data.topic}, Keterampilan akhir yang diharapkan: ${input}`
  },
  elaborationMulti: { // Khusus untuk 3 field sekaligus
    system: "Kamu adalah asisten Modul Ajar SDH Ambon. Tulis 3 level elaborasi pencapaian dengan format:\nBerkembang dengan sangat baik / Well developed:\n[deskripsi]\n\nKompeten / Competent:\n[deskripsi]\n\nSangat kompeten / Very competent:\n[deskripsi]\n\nPola kalimat: 'Mampu [aktivitas] dengan [kualitas]'. Output hanya teks format 3 level tersebut.",
    user: (data, input) => `Topik: ${data.topic}, Kompetensi inti: ${input}`
  },
  methodResources: { // Metode, Sumber, Sarana
    system: "Kamu adalah asisten Modul Ajar SDH Ambon. Tulis metode dan sumber pembelajaran. Format output:\nMetode Pembelajaran: [2-4 metode dipisah koma]\nSumber Pembelajaran: [sumber]\nSarana & Prasarana: [fasilitas]\nOutput hanya teks formatnya.",
    user: (data, input) => `Topik: ${data.topic}, Media yang tersedia: ${input}`
  },
  assessmentsMulti: { // Formatif, Sumatif, Mission Service
    system: "Kamu adalah asisten Modul Ajar SDH Ambon. Tulis asesmen dalam format:\nAsesmen Formatif:\n[bentuk penilaian formatif]\n\nAsesmen Sumatif:\n[bentuk penilaian sumatif]\n\nTindakan Nyata / Mission Service Learning:\n[tindakan nyata murid]\nOutput hanya teks formatnya.",
    user: (data, input) => `Topik: ${data.topic}, Kompetensi target: ${input}`
  },
  scheduleStage: { // Tahapan per minggu
    system: "Kamu adalah asisten Modul Ajar SDH Ambon. Tulis tahapan pembelajaran 1 pertemuan mengikuti POLA WAJIB ini secara berurutan: 1) Murid diawali dengan salam pembuka oleh leader kelas. 2) Murid membuka kelas dengan doa. 3) Guru menjelaskan tujuan pembelajaran hari ini, yaitu [sesuaikan]. 4) Murid menyimak penjelasan guru mengenai [konten]. 5) Murid [aktivitas inti — 2-3 kalimat detail]. 6) Murid [mengumpulkan/menyimpan hasil jika ada penilaian]. 7) Murid menutup kelas dengan doa. Output hanya teks tahapannya, tanpa penomoran.",
    user: (data, input, extraContext) => `Tujuan pertemuan: ${extraContext.objective}, Jenis pertemuan: ${input} (Tuning In/Biasa/Formatif/Sumatif/Refleksi), Aktivitas inti: ${extraContext.stages}`
  },
  rubricMulti: { // Rubrik 4 level
    system: "Kamu adalah asisten Modul Ajar SDH Ambon. Tulis rubrik penilaian 4 level. Format:\nSangat baik (91-100):\n[kriteria — 3 kalimat satu per aspek]\n\nBaik (81-90):\n[kriteria — gunakan Terdapat 1...]\n\nMemenuhi standar (70-80):\n[kriteria — gunakan Terdapat 2-3...]\n\nPerlu meningkatkan (<70):\n[kriteria — gunakan Terdapat lebih dari 3...]\nOutput hanya teks format 4 level tersebut.",
    user: (data, input) => `Topik penilaian: ${data.topic}, Aspek yang dinilai: ${input}`
  },
  reflection: {
    system: "Kamu adalah asisten Modul Ajar SDH Ambon. Tulis refleksi guru 2 paragraf. Paragraf 1: refleksi atas proses mengajar dan pembelajaran dari pengalaman mengajar unit ini. Paragraf 2: komitmen perbaikan ke depan dengan nilai karakter Kristen yang ingin dikembangkan. Gaya: personal, reflektif, jujur, menunjukkan pertumbuhan sebagai pendidik Kristen. Sertakan referensi ayat Alkitab yang relevan. Output hanya 2 paragraf refleksinya.",
    user: (data, input) => `Topik yang diajarkan: ${data.topic}, Pengalaman/tantangan: ${input}`
  }
};

// --- KOMPONEN BANTUAN UI (Dipindah ke luar agar tidak hilang fokus saat mengetik) ---
const AIPopup = ({ fieldKey, configKey, placeholder, scheduleIndex = null }: { 
  fieldKey: string; 
  configKey: string; 
  placeholder: string; 
  scheduleIndex?: number | null 
}) => {
  const { aiPopups, aiPrompts, setAiPrompts, executeAIGeneration, isGenerating } = useContext(FormContext)!;
  
  if (!aiPopups[fieldKey]) return null;
  return (
    <div className="mt-2 mb-4 p-3 bg-indigo-50 border border-indigo-100 rounded-md flex items-center space-x-3 shadow-inner">
      <input 
        type="text" 
        placeholder={placeholder}
        className="flex-1 p-2 text-sm border border-indigo-200 rounded focus:ring-2 focus:ring-indigo-400 outline-none bg-white"
        value={aiPrompts[fieldKey ?? ''] || ''}
        onChange={(e) => setAiPrompts(prev => ({ ...prev, [fieldKey]: e.target.value }))}
        onKeyDown={(e) => e.key === 'Enter' && executeAIGeneration(fieldKey, configKey, scheduleIndex)}
        autoFocus
      />
      <button 
        onClick={() => executeAIGeneration(fieldKey, configKey, scheduleIndex)}
        disabled={isGenerating[fieldKey ?? '']}
        className="bg-indigo-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-indigo-700 flex items-center min-w-[120px] justify-center transition-colors disabled:bg-indigo-300"
      >
        {isGenerating[fieldKey] ? <><Loader2 className="w-4 h-4 mr-2 animate-spin"/> Proses...</> : <><Sparkles className="w-4 h-4 mr-1"/> Generate</>}
      </button>
    </div>
  );
};

const FieldWithAI = ({ label, name, type = 'text', rows = 3, configKey, placeholderAi, isMulti = false, multiTargetNames = [] }: {
  label: string;
  name?: string;
  type?: string;
  rows?: number;
  configKey?: string;
  placeholderAi?: string;
  isMulti?: boolean;
  multiTargetNames?: string[];
}) => {
  const { data, handleChange, toggleAiPopup } = useContext(FormContext)!;
  const fieldKey = (isMulti ? configKey : name) ?? ''; 

  return (
    <div className="mb-5">
      <div className="flex items-center justify-between mb-1">
        <label className="block text-sm font-semibold text-gray-700">{label}</label>
        {configKey && (
          <button 
            onClick={() => fieldKey && toggleAiPopup(fieldKey)}
            className="text-xs flex items-center text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-2 py-1 rounded border border-indigo-200 transition-colors"
          >
            <Wand2 className="w-3 h-3 mr-1" /> Generate AI
          </button>
        )}
      </div>
      
      {configKey && <AIPopup fieldKey={fieldKey} configKey={configKey} placeholder={placeholderAi ?? ''} />}
      
      {!isMulti && (
        type === 'textarea' ? (
          <textarea name={name} value={name ? (data as any)[name] : ''} onChange={(e) => handleChange(e.target.name, e.target.value)} rows={rows} className="w-full p-2.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none" />
        ) : (
          <input type="text" name={name} value={name ? (data as any)[name] : ''} onChange={(e) => handleChange(e.target.name, e.target.value)} className="w-full p-2.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none" />
        )
      )}
    </div>
  );
};

export default function ModulGeneratorPage() {
  const [data, setData] = useState(initialData);
  const [activeTab, setActiveTab] = useState('editor'); 
  const [activeSection, setActiveSection] = useState('umum');
  
  // AI State management
  const [aiPrompts, setAiPrompts] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState<Record<string, boolean>>({});
  const [aiPopups, setAiPopups] = useState<Record<string, boolean>>({});

  const handleChange = (name: string, value: string) => {
    setData(prev => ({ ...prev, [name as keyof typeof initialData]: value }));
  };

  const handleScheduleChange = (index: number, field: string, value: string) => {
    const newSchedule = [...data.schedule];
    newSchedule[index] = { ...newSchedule[index], [field]: value };
    setData(prev => ({ ...prev, schedule: newSchedule }));
  };

  const handlePrint = () => {
    window.print();
  };

  const exportToWord = () => {
    const content = document.getElementById('document-preview-content')?.innerHTML ?? '';
    
    // HTML wrapper dengan Schema Khusus Microsoft Office untuk mengatur Landscape
    const preHtml = `<html xmlns:v="urn:schemas-microsoft-com:vml"
      xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:w="urn:schemas-microsoft-com:office:word"
      xmlns:m="http://schemas.microsoft.com/office/2004/12/omml"
      xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset='utf-8'>
        <title>Modul Ajar</title>
        <style>
          v\\:* {behavior:url(#default#VML);}
          o\\:* {behavior:url(#default#VML);}
          w\\:* {behavior:url(#default#VML);}
          .shape {behavior:url(#default#VML);}
          body { font-family: 'Times New Roman', serif; font-size: 11pt; color: black; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; border: 1pt solid black; }
          td, th { border: 1pt solid black; padding: 6pt; vertical-align: top; }
          h1, h2, h3, h4 { margin: 10pt 0; }
          .text-center { text-align: center; }
          .font-bold { font-weight: bold; }
          .italic { font-style: italic; }
          .bg-gray-100 { background-color: #f3f4f6; }
          .bg-blue-300 { background-color: #8eaada; }
          .bg-blue-200 { background-color: #d9e1f2; }
          .whitespace-pre-wrap { white-space: pre-wrap; }
          
          /* PENGATURAN KERTAS LANDSCAPE (SEMUA HALAMAN) */
          @page Section1 {
              size: 29.7cm 21cm; /* A4 Landscape */
              margin: 2cm 2cm 2cm 2cm;
              mso-page-orientation: landscape;
              mso-header-margin: 35.4pt;
              mso-footer-margin: 35.4pt;
              mso-paper-source: 0;
          }
          div.Section1 { page: Section1; }
        </style>
      </head><body><div class="Section1">`;
    const postHtml = "</div></body></html>";
    
    // Konversi warna Tailwind ke warna standar
    let processedContent = content
      .replace(/bg-\[#8eaada\]/g, 'bg-blue-300')
      .replace(/bg-\[#d9e1f2\]/g, 'bg-blue-200')
      .replace(/bg-\[#1e3a6e\]/g, 'bg-blue-900') /* Fallback warna biru gelap */
      .replace(/text-white/g, 'color-white');

    const html = preHtml + processedContent + postHtml;
    
    const blob = new Blob(['\ufeff', html], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const filename = `Modul_Ajar_${data.phaseClassQuarter.replace(/\W+/g, '_')}.doc`;
    
    const downloadLink = document.createElement("a");
    downloadLink.href = url;
    downloadLink.download = filename;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(url);
  };

  // --- LOGIKA AI GENERATE (GEMINI API) ---
  const executeAIGeneration = async (fieldKey: string, configKey: string, scheduleIndex: number | null = null) => {
    const userInputValue = aiPrompts[fieldKey] || '';
    if (!userInputValue.trim()) {
      alert("Silakan ketikkan instruksi singkat terlebih dahulu.");
      return;
    }

    setIsGenerating(prev => ({ ...prev, [fieldKey]: true }));
    
    try {
      const config = aiConfig[configKey];
      let userPromptText = "";
      
      if (configKey === 'scheduleStage') {
        const extraContext = { 
          objective: data.schedule[scheduleIndex!].objective, 
          stages: data.schedule[scheduleIndex!].stages 
        };
        userPromptText = config.user(data, userInputValue, extraContext);
      } else {
        userPromptText = config.user(data, userInputValue);
      }

      const apiKey = ""; // API Key disediakan oleh runtime Canvas
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
      
      const payload = {
        contents: [{ parts: [{ text: userPromptText }] }],
        systemInstruction: { parts: [{ text: config.system }] }
      };

      // Fetch dengan mekanisme retry backoff
      const fetchWithRetry = async (url: string, options: RequestInit, retries = 5): Promise<any> => {
        const delays = [1000, 2000, 4000, 8000, 16000];
        for (let i = 0; i < retries; i++) {
          try {
            const response = await fetch(url, options);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
          } catch (error) {
            if (i === retries - 1) throw error;
            await new Promise(res => setTimeout(res, delays[i]));
          }
        }
      };

      const result = await fetchWithRetry(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const generatedText = result.candidates?.[0]?.content?.parts?.[0]?.text || "";
      
      // PARSER UNTUK MULTI-FIELD OUTPUTS
      if (configKey === 'elaborationMulti') {
        const well = generatedText.split(/Kompeten \/ Competent:/i)[0]?.replace(/Berkembang dengan sangat baik \/ Well developed:/i, '').trim() || "";
        const competent = generatedText.split(/Sangat kompeten \/ Very competent:/i)[0]?.split(/Kompeten \/ Competent:/i)[1]?.trim() || "";
        const very = generatedText.split(/Sangat kompeten \/ Very competent:/i)[1]?.trim() || "";
        setData(prev => ({ ...prev, elaborationWell: well, elaborationCompetent: competent, elaborationVery: very }));
      } 
      else if (configKey === 'methodResources') {
        const methods = generatedText.split(/Sumber Pembelajaran:/i)[0]?.replace(/Metode Pembelajaran:/i, '').trim() || "";
        const sources = generatedText.split(/Sarana & Prasarana:/i)[0]?.split(/Sumber Pembelajaran:/i)[1]?.trim() || "";
        const facilities = generatedText.split(/Sarana & Prasarana:/i)[1]?.trim() || "";
        setData(prev => ({ ...prev, learningMethod: methods, sources: sources, facilities: facilities }));
      }
      else if (configKey === 'assessmentsMulti') {
        const form = generatedText.split(/Asesmen Sumatif:/i)[0]?.replace(/Asesmen Formatif:/i, '').trim() || "";
        const sum = generatedText.split(/Tindakan Nyata \/ Mission Service Learning:/i)[0]?.split(/Asesmen Sumatif:/i)[1]?.trim() || "";
        const miss = generatedText.split(/Tindakan Nyata \/ Mission Service Learning:/i)[1]?.trim() || "";
        setData(prev => ({ ...prev, formativeAss: form, summativeAss: sum, missionService: miss }));
      }
      else if (configKey === 'rubricMulti') {
        const sb = generatedText.split(/Baik \(81-90\):/i)[0]?.replace(/Sangat baik \(91-100\):/i, '').trim() || "";
        const bk = generatedText.split(/Memenuhi standar \(70-80\):/i)[0]?.split(/Baik \(81-90\):/i)[1]?.trim() || "";
        const st = generatedText.split(/Perlu meningkatkan \(<70\):/i)[0]?.split(/Memenuhi standar \(70-80\):/i)[1]?.trim() || "";
        const kr = generatedText.split(/Perlu meningkatkan \(<70\):/i)[1]?.trim() || "";
        setData(prev => ({ ...prev, rubricSangatBaik: sb, rubricBaik: bk, rubricStandar: st, rubricKurang: kr }));
      }
      else if (configKey === 'scheduleStage') {
        const newSchedule = [...data.schedule];
        newSchedule[scheduleIndex!].stages = generatedText.trim();
        setData(prev => ({ ...prev, schedule: newSchedule }));
      }
      else {
        // Single field update
        setData(prev => ({ ...prev, [fieldKey]: generatedText.trim() }));
      }

      // Close popup after success
      setAiPopups(prev => ({ ...prev, [fieldKey]: false }));
      
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat menghubungi AI. Silakan coba lagi.");
    } finally {
      setIsGenerating(prev => ({ ...prev, [fieldKey]: false }));
    }
  };

  // --- KOMPONEN BANTUAN UI ---
  const toggleAiPopup = (fieldKey: string) => {
    setAiPopups(prev => ({ ...prev, [fieldKey]: !prev[fieldKey] }));
  };

  const contextValue = { data, handleChange, toggleAiPopup, aiPopups, aiPrompts, setAiPrompts, executeAIGeneration, isGenerating };

  return (
    <FormContext.Provider value={contextValue}>
      <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
        
        {/* ======================= MODE EDITOR ======================= */}
        {activeTab === 'editor' && (
          <div className="max-w-[90rem] mx-auto py-8 px-4 sm:px-6 lg:px-8 flex items-start print:hidden">
            
            {/* SIDEBAR NAV */}
            <div className="w-64 sticky top-24 mr-8 hidden lg:block">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 px-3">Navigasi Modul</h3>
              <nav className="space-y-1">
                {[
                  { id: 'umum', label: 'Gambaran Umum' },
                  { id: 'tujuan', label: 'Konsep & Tujuan' },
                  { id: 'asesmen', label: 'Capaian & Asesmen' },
                  { id: 'timeline', label: 'Timeline Instruksional' },
                  { id: 'rubrik', label: 'Rubrik Penilaian' },
                  { id: 'refleksi', label: 'Refleksi Guru' }
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveSection(item.id);
                      document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded-md text-sm font-medium flex items-center justify-between transition-colors ${activeSection === item.id ? 'bg-blue-100 text-blue-800' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    {item.label}
                    {activeSection === item.id && <ChevronRight className="w-4 h-4 text-blue-500" />}
                  </button>
                ))}
              </nav>
              <div className="mt-8 p-4 bg-indigo-50 rounded-lg border border-indigo-100 text-sm text-indigo-800">
                <p className="font-semibold flex items-center mb-1"><Sparkles className="w-4 h-4 mr-1 text-indigo-500"/> Tips AI</p>
                <p className="text-xs opacity-90">Klik "Generate AI" di setiap kotak untuk membuat teks modul secara otomatis dan rapi.</p>
              </div>
            </div>

            {/* MAIN FORM AREA */}
            <div className="flex-1 space-y-8">
              
              {/* Bagian 1 */}
              <div id="umum" className="bg-white p-7 rounded-xl shadow-sm border border-gray-200 scroll-mt-24">
                <h2 className="text-lg font-bold bg-blue-50 text-blue-900 px-4 py-2 rounded-md mb-6 border-l-4 border-blue-600">1. Gambaran Umum</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                  <FieldWithAI label="Tahun Ajaran" name="academicYear" />
                  <FieldWithAI label="Fase / Kelas / Kuarter" name="phaseClassQuarter" />
                  <FieldWithAI label="Kata Kunci (Keywords)" name="keywords" />
                  <FieldWithAI label="Mata Pelajaran" name="subject" />
                  <FieldWithAI label="Durasi Unit" name="duration" />
                  <FieldWithAI label="Nama Guru" name="teacher" />
                </div>
                <div className="mt-2">
                  <FieldWithAI label="Topik" name="topic" configKey="topic" placeholderAi="Deskripsikan inti topik (misal: belajar mengetik di Word)" />
                </div>
              </div>

              {/* Bagian 2 */}
              <div id="tujuan" className="bg-white p-7 rounded-xl shadow-sm border border-gray-200 scroll-mt-24">
                <h2 className="text-lg font-bold bg-blue-50 text-blue-900 px-4 py-2 rounded-md mb-6 border-l-4 border-blue-600">2. Konsep & Tujuan Pembelajaran</h2>
                <FieldWithAI label="Konsep (Makro & Mikro)" name="concept" type="textarea" rows={3} configKey="concept" placeholderAi="Apa materi inti yang dipelajari?" />
                <FieldWithAI label="Elemen (Kata Kerja Aktif)" name="element" type="textarea" rows={4} configKey="element" placeholderAi="Kompetensi apa yang akan dilatih?" />
                <FieldWithAI label="Tujuan Pembelajaran (Learning Objective)" name="learningObjective" type="textarea" rows={2} configKey="learningObjective" placeholderAi="Apa tujuan utama pembelajaran ini?" />
                <FieldWithAI label="Alokasi Waktu" name="timeAllocation" />
                <FieldWithAI label="Pemahaman Sepanjang Masa (Enduring Understanding)" name="enduringUnderstanding" type="textarea" rows={2} configKey="enduringUnderstanding" placeholderAi="Nilai iman/spiritual apa yang ingin ditanamkan?" />
                <FieldWithAI label="Pertanyaan Esensial (Essential Question)" name="essentialQuestion" type="textarea" rows={3} configKey="essentialQuestion" placeholderAi="Fokus nilai untuk pemantik diskusi?" />
                <FieldWithAI label="Hasil yang diekspetasikan dari murid (Student Outcome)" name="studentOutcome" type="textarea" rows={4} />
                <FieldWithAI label="Capaian Pembelajaran (Learning Target)" name="learningTarget" type="textarea" rows={2} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FieldWithAI label="Nilai-nilai kebajikan (Virtue value)" name="virtueValue" type="textarea" rows={2} configKey="virtueValue" placeholderAi="Aktivitas utama murid (untuk menentukan virtue)?" />
                  <FieldWithAI label="Keterampilan Transdisipliner" name="transdisciplinarySkills" type="textarea" rows={2} />
                </div>
              </div>

              {/* Bagian 3 */}
              <div id="asesmen" className="bg-white p-7 rounded-xl shadow-sm border border-gray-200 scroll-mt-24">
                <h2 className="text-lg font-bold bg-blue-50 text-blue-900 px-4 py-2 rounded-md mb-6 border-l-4 border-blue-600">3. Capaian Pembelajaran & Asesmen</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FieldWithAI label="Kompetensi Prasyarat" name="prerequisiteCompetence" type="textarea" rows={3} configKey="prerequisiteCompetence" placeholderAi="Hal dasar yang perlu diketahui murid?" />
                  <FieldWithAI label="Kompetensi Target" name="targetCompetence" type="textarea" rows={3} configKey="targetCompetence" placeholderAi="Keterampilan akhir spesifik yang diharapkan?" />
                </div>
                
                <div className="mt-8 mb-4 border-t pt-6">
                  <FieldWithAI 
                    label="Elaborasi Pencapaian (3 Level Sekaligus)" 
                    isMulti={true} configKey="elaborationMulti" placeholderAi="Kompetensi inti untuk dijabarkan ke 3 level kemampuan?" 
                  />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1">Berkembang Sangat Baik</label>
                      <textarea value={data.elaborationWell} onChange={(e) => handleChange('elaborationWell', e.target.value)} rows={4} className="w-full p-2 text-sm border border-gray-300 rounded" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1">Kompeten</label>
                      <textarea value={data.elaborationCompetent} onChange={(e) => handleChange('elaborationCompetent', e.target.value)} rows={4} className="w-full p-2 text-sm border border-gray-300 rounded" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1">Sangat Kompeten</label>
                      <textarea value={data.elaborationVery} onChange={(e) => handleChange('elaborationVery', e.target.value)} rows={4} className="w-full p-2 text-sm border border-gray-300 rounded" />
                    </div>
                  </div>
                </div>

                <div className="mt-8 mb-4 border-t pt-6">
                  <FieldWithAI 
                    label="Dukungan Pembelajaran (Metode, Sumber, Sarana)" 
                    isMulti={true} configKey="methodResources" placeholderAi="Media/alat apa saja yang tersedia?" 
                  />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1">Metode Pembelajaran</label>
                      <textarea value={data.learningMethod} onChange={(e) => handleChange('learningMethod', e.target.value)} rows={3} className="w-full p-2 text-sm border border-gray-300 rounded" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1">Sumber Pembelajaran</label>
                      <textarea value={data.sources} onChange={(e) => handleChange('sources', e.target.value)} rows={3} className="w-full p-2 text-sm border border-gray-300 rounded" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1">Sarana & Prasarana</label>
                      <textarea value={data.facilities} onChange={(e) => handleChange('facilities', e.target.value)} rows={3} className="w-full p-2 text-sm border border-gray-300 rounded" />
                    </div>
                  </div>
                </div>

                <div className="mt-8 border-t pt-6">
                  <FieldWithAI 
                    label="Asesmen & Tindakan Nyata" 
                    isMulti={true} configKey="assessmentsMulti" placeholderAi="Kompetensi target yang akan diuji?" 
                  />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1">Asesmen Formatif</label>
                      <textarea value={data.formativeAss} onChange={(e) => handleChange('formativeAss', e.target.value)} rows={4} className="w-full p-2 text-sm border border-gray-300 rounded" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1">Asesmen Sumatif</label>
                      <textarea value={data.summativeAss} onChange={(e) => handleChange('summativeAss', e.target.value)} rows={4} className="w-full p-2 text-sm border border-gray-300 rounded" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1">Tindakan Nyata (Mission Service)</label>
                      <textarea value={data.missionService} onChange={(e) => handleChange('missionService', e.target.value)} rows={4} className="w-full p-2 text-sm border border-gray-300 rounded" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Bagian 4: Timeline */}
              <div id="timeline" className="bg-white p-7 rounded-xl shadow-sm border border-gray-200 scroll-mt-24">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-bold bg-blue-50 text-blue-900 px-4 py-2 rounded-md border-l-4 border-blue-600 m-0">4. Strategi Instruksional (Timeline)</h2>
                  <button onClick={() => setData(prev => ({...prev, schedule: [...prev.schedule, { week: "", objective: "", stages: "", time: "" }]}))} className="flex items-center text-sm bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 transition-colors">
                    <Plus className="w-4 h-4 mr-1" /> Tambah Minggu
                  </button>
                </div>
                
                <div className="space-y-6">
                  {data.schedule.map((item, index) => {
                    const fieldKey = `schedule_${index}`;
                    return (
                      <div key={index} className="border border-gray-200 p-5 rounded-lg bg-gray-50 relative group">
                        <button onClick={() => {
                          const newSch = data.schedule.filter((_, i) => i !== index);
                          setData(prev => ({...prev, schedule: newSch}));
                        }} className="absolute top-3 right-3 text-red-400 hover:text-red-600 p-1 bg-white rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                          <Trash2 className="w-4 h-4" />
                        </button>
                        
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                          <div className="md:col-span-2 space-y-4">
                            <div>
                              <label className="block text-xs font-semibold text-gray-600 mb-1">Minggu</label>
                              <input type="text" value={item.week} onChange={(e) => handleScheduleChange(index, 'week', e.target.value)} className="w-full p-2 border rounded text-sm bg-white" placeholder="Contoh: 1" />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-gray-600 mb-1">Waktu</label>
                              <input type="text" value={item.time} onChange={(e) => handleScheduleChange(index, 'time', e.target.value)} className="w-full p-2 border rounded text-sm bg-white" placeholder="60 Menit" />
                            </div>
                          </div>
                          <div className="md:col-span-3">
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Tujuan Pertemuan</label>
                            <textarea value={item.objective} onChange={(e) => handleScheduleChange(index, 'objective', e.target.value)} rows={5} className="w-full p-2 border rounded text-sm bg-white" placeholder="Tujuan hari ini..." />
                          </div>
                          <div className="md:col-span-7">
                            <div className="flex justify-between items-center mb-1">
                              <label className="block text-xs font-semibold text-gray-600">Tahapan (Stages of Learning)</label>
                              <button onClick={() => toggleAiPopup(fieldKey)} className="text-xs flex items-center text-indigo-600 hover:text-indigo-800 transition-colors">
                                <Wand2 className="w-3 h-3 mr-1" /> Generate Tahapan
                              </button>
                            </div>
                            
                            {aiPopups[fieldKey] && (
                              <AIPopup fieldKey={fieldKey} configKey="scheduleStage" placeholder="Jenis (Tuning in / Formatif / Sumatif)..." scheduleIndex={index} />
                            )}
                            
                            <textarea value={item.stages} onChange={(e) => handleScheduleChange(index, 'stages', e.target.value)} rows={5} className="w-full p-2 border rounded text-sm bg-white" placeholder="1) Murid diawali salam... 2) Doa..." />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bagian 5: Rubrik */}
              <div id="rubrik" className="bg-white p-7 rounded-xl shadow-sm border border-gray-200 scroll-mt-24">
                <h2 className="text-lg font-bold bg-blue-50 text-blue-900 px-4 py-2 rounded-md mb-6 border-l-4 border-blue-600">5. Prosedur Sumatif & Rubrik</h2>
                <FieldWithAI label="Ketentuan Tugas Sumatif" name="summativeTask" type="textarea" rows={2} />
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="md:col-span-1"><FieldWithAI label="KKM" name="summativeKKM" /></div>
                  <div className="md:col-span-3"><FieldWithAI label="Indikator Pencapaian" name="summativeIndicators" type="textarea" rows={3} /></div>
                </div>
                
                <div className="mt-6 border-t pt-6">
                  <FieldWithAI 
                    label="Kriteria Rubrik (4 Level Sekaligus)" 
                    isMulti={true} configKey="rubricMulti" placeholderAi="Aspek utama apa yang akan dinilai di sumatif?" 
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-green-700 mb-1 bg-green-50 p-1.5 rounded">Sangat Baik (91-100)</label>
                      <textarea value={data.rubricSangatBaik} onChange={(e) => handleChange('rubricSangatBaik', e.target.value)} rows={3} className="w-full p-2 text-sm border border-gray-300 rounded" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-blue-700 mb-1 bg-blue-50 p-1.5 rounded">Baik (81-90)</label>
                      <textarea value={data.rubricBaik} onChange={(e) => handleChange('rubricBaik', e.target.value)} rows={3} className="w-full p-2 text-sm border border-gray-300 rounded" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-yellow-700 mb-1 bg-yellow-50 p-1.5 rounded">Memenuhi Standar (70-80)</label>
                      <textarea value={data.rubricStandar} onChange={(e) => handleChange('rubricStandar', e.target.value)} rows={3} className="w-full p-2 text-sm border border-gray-300 rounded" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-red-700 mb-1 bg-red-50 p-1.5 rounded">Perlu Meningkatkan (&lt;70)</label>
                      <textarea value={data.rubricKurang} onChange={(e) => handleChange('rubricKurang', e.target.value)} rows={3} className="w-full p-2 text-sm border border-gray-300 rounded" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Bagian 6: Refleksi */}
              <div id="refleksi" className="bg-white p-7 rounded-xl shadow-sm border border-gray-200 scroll-mt-24">
                <h2 className="text-lg font-bold bg-blue-50 text-blue-900 px-4 py-2 rounded-md mb-6 border-l-4 border-blue-600">6. Refleksi & Pengesahan</h2>
                <FieldWithAI label="Refleksi Guru (Teacher Reflection)" name="reflection" type="textarea" rows={6} configKey="reflection" placeholderAi="Ceritakan tantangan/pengalaman berkesan saat mengajar unit ini..." />
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 pt-6 border-t border-gray-100">
                  <FieldWithAI label="Nama Principal" name="signPrincipal" />
                  <FieldWithAI label="Nama Curriculum Coordinator" name="signCoordinator" />
                  <FieldWithAI label="Nama Guru" name="signTeacher" />
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ======================= MODE PREVIEW (DOKUMEN SIAP CETAK) ======================= */}
        {activeTab === 'preview' && (
          <div className="bg-gray-200 py-10 print:p-0 print:bg-white print:py-0 min-h-screen">
            <div id="document-preview-content" className="print-container font-serif text-[11pt] leading-snug text-black mx-auto">
              
              {/* CSS KHUSUS PRINT */}
              <style dangerouslySetInnerHTML={{__html: `
                @media print {
                  body { background-color: white; margin: 0; padding: 0; }
                  .print-container { width: 100%; max-width: 100%; box-shadow: none; padding: 0; margin:0;}
                  table { page-break-inside: auto; border-color: black !important;}
                  td { border-color: black !important; }
                  tr    { page-break-inside: avoid; page-break-after: auto; }
                  thead { display: table-header-group; }
                  tfoot { display: table-footer-group; }
                  @page { size: landscape; margin: 1.5cm; }
                  .page-break { page-break-before: always; }
                  * { color: black !important; }
                }
              `}} />

              {/* KERTAS: FULL LANDSCAPE */}
              <div className="bg-white p-12 mx-auto max-w-[297mm] min-h-[210mm] shadow-2xl mb-8 print:shadow-none print:mb-0 print:max-w-full">
                
                {/* HEADER */}
                <div className="flex justify-between items-center mb-8">
                  <div className="w-24 h-24 border-2 border-gray-400 rounded-full flex items-center justify-center bg-gray-50 text-[10px] text-center text-gray-500 font-sans font-bold">
                    LOGO SDH
                  </div>
                  <div className="text-center flex-1">
                    <h1 className="text-2xl font-extrabold tracking-widest mb-1">MODUL AJAR</h1>
                    <h2 className="text-xl font-bold mb-1">SEKOLAH DIAN HARAPAN AMBON</h2>
                    <p className="italic text-base">( Teaching Module )</p>
                  </div>
                  <div className="w-24 h-24 border-2 border-gray-400 flex items-center justify-center bg-gray-50 text-[10px] text-center text-gray-500 font-sans font-bold">
                    LOGO ACWU
                  </div>
                </div>

                {/* VISI MISI */}
                <table className="w-full border-collapse border border-black mb-8 text-[11pt]">
                  <tbody>
                    <tr>
                      <td className="border border-black p-2.5 font-bold bg-gray-100 w-[15%] align-top">Visi<br/><span className="font-normal italic">Vision</span></td>
                      <td className="border border-black p-2.5 text-left leading-relaxed">
                        Pengetahuan Sejati, Iman di dalam Kristus, Karakter Ilahi.<br/>
                        <span className="italic">(True Knowledge, Faith in Christ, Godly character)</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-black p-2.5 font-bold bg-gray-100 align-top">Misi<br/><span className="font-normal italic">Mission</span></td>
                      <td className="border border-black p-2.5 text-left leading-relaxed">
                        Menyatakan Keutamaan Kristus dan terlibat dalam pemulihan yang bersifat menebus segala sesuatu di dalam Dia melalui Pendidikan Holistik.<br/>
                        <span className="italic">(Proclaiming the preeminence of Christ and engaging in the redemptive restoration of all things in Him through holistic education)</span>
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* GAMBARAN UMUM */}
                <h3 className="font-bold mb-1">A. Gambaran Umum</h3>
                <table className="w-full border-collapse border border-black mb-8 text-[11pt]">
                  <tbody>
                    <tr>
                      <td className="border border-black p-2 bg-gray-100 w-[20%]">TKWKA<br/><span className="italic">BCWT</span></td>
                      <td className="border border-black p-2 w-[30%]">Worshipful Expression</td>
                      <td className="border border-black p-2 bg-gray-100 w-[20%]">Tahun Ajaran<br/><span className="italic">Academic Year</span></td>
                      <td className="border border-black p-2 w-[30%]">{data.academicYear}</td>
                    </tr>
                    <tr>
                      <td className="border border-black p-2 bg-gray-100">Kata kunci TKWKA<br/><span className="italic">BCWT keywords</span></td>
                      <td className="border border-black p-2">{data.keywords}</td>
                      <td className="border border-black p-2 bg-gray-100">Fase/Kelas/Kuarter<br/><span className="italic">Phase/Class/Quarter</span></td>
                      <td className="border border-black p-2">{data.phaseClassQuarter}</td>
                    </tr>
                    <tr>
                      <td className="border border-black p-2 bg-gray-100">Mata Pelajaran<br/><span className="italic">Subject</span></td>
                      <td className="border border-black p-2">{data.subject}</td>
                      <td className="border border-black p-2 bg-gray-100">Durasi Unit<br/><span className="italic">Duration</span></td>
                      <td className="border border-black p-2">{data.duration}</td>
                    </tr>
                    <tr>
                      <td className="border border-black p-2 bg-gray-100">Topik<br/><span className="italic">Topic</span></td>
                      <td className="border border-black p-2">{data.topic}</td>
                      <td className="border border-black p-2 bg-gray-100">Guru<br/><span className="italic">Teacher</span></td>
                      <td className="border border-black p-2">{data.teacher}</td>
                    </tr>
                  </tbody>
                </table>

                {/* APA YANG DIPELAJARI */}
                <table className="w-full border-collapse border border-black mb-8 text-[11pt]">
                  <thead>
                    <tr>
                      <td colSpan={4} className="border border-black p-2 font-bold text-center bg-[#1e3a6e] text-white">
                        <span className="text-white">Apa yang akan dipelajari oleh siswa tentang topik ini? Mengapa itu penting?</span><br/>
                        <span className="text-white italic">What do you intend students to learn about this topic? Why is it important for students to know this?</span>
                      </td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-black p-2 w-[35%] align-top">
                        <span className="font-bold underline">Konsep/Concept:</span><br/>
                        <div className="whitespace-pre-wrap mt-1">{data.concept}</div>
                      </td>
                      <td className="border border-black p-2 w-[25%] align-top">
                        <span className="font-bold underline">Elemen/ Element:</span><br/>
                        <div className="whitespace-pre-wrap mt-1">- {data.element.replace(/\n/g, '\n- ')}</div>
                      </td>
                      <td className="border border-black p-2 w-[30%] align-top">
                        <span className="font-bold underline">Tujuan Pembelajaran/ Learning objective:</span><br/>
                        <div className="whitespace-pre-wrap mt-1">{data.learningObjective}</div>
                      </td>
                      <td className="border border-black p-2 w-[10%] align-top">
                        <span className="font-bold underline">Alokasi Waktu/<br/><span className="italic">Time allocation:</span></span><br/>
                        <div className="mt-1">{data.timeAllocation}</div>
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-black p-2 align-top">
                        <span className="font-bold underline">Pemahaman Sepanjang Masa/ Enduring Understanding (EU)</span><br/>
                        <div className="whitespace-pre-wrap mt-1">{data.enduringUnderstanding}</div>
                        <br/>
                        <span className="font-bold underline">Pertanyaan Esensial/ Essential Question (EQ)</span><br/>
                        <div className="whitespace-pre-wrap mt-1">{data.essentialQuestion}</div>
                      </td>
                      <td colSpan={2} className="border border-black p-2 align-top">
                        <span className="font-bold underline">Capaian Pembelajaran / Learning target:</span><br/>
                        <div className="whitespace-pre-wrap mt-1 italic">{data.learningTarget}</div>
                      </td>
                      <td className="border border-black p-2 align-top"></td>
                    </tr>
                    <tr>
                      <td className="border border-black p-2 align-top">
                        <span className="font-bold underline">Hasil yang diekspetasikan dari murid/ Student Expected Outcome</span><br/>
                        <div className="whitespace-pre-wrap mt-1">{data.studentOutcome}</div>
                      </td>
                      <td colSpan={3} rowSpan={3} className="border-none"></td>
                    </tr>
                    <tr>
                      <td className="border border-black p-2 align-top">
                        <span className="font-bold underline">Nilai-nilai kebajikan/ Virtue value</span><br/>
                        <div className="whitespace-pre-wrap mt-1">{data.virtueValue}</div>
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-black p-2 align-top">
                        <span className="font-bold underline">Keterampilan Transdisipliner / Transdisciplinary skills</span><br/>
                        <div className="whitespace-pre-wrap mt-1">{data.transdisciplinarySkills}</div>
                      </td>
                    </tr>
                  </tbody>
                </table>

                <div className="page-break"></div>

                {/* CAPAIAN DAN ASESMEN */}
                <h3 className="font-bold mb-1">B. Capaian Pembelajaran dan Asesmen / <span className="italic font-normal">Competences and Assessment</span></h3>
                <table className="w-full border-collapse border border-black mb-8 text-[11pt]">
                  <tbody>
                    <tr>
                      <td className="border border-black p-2 font-bold text-center bg-[#1e3a6e] text-white">
                        <span className="text-white">Capaian pembelajaran apa yang perlu dimiliki oleh murid pada saat akan mempelajari topik ini?</span><br/>
                        <span className="text-white italic">What kind of competences students will have when learning this topic?</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-black p-2 align-top">
                        <span className="font-bold">Kompetensi prasyarat / <span className="italic">Prerequisite competence:</span></span><br/>
                        <div className="whitespace-pre-wrap ml-4 mt-1">1. {data.prerequisiteCompetence.replace(/\n/g, '\n2. ').replace(/2\.\s(.*?)\n/g, '2. $1\n3. ').replace(/3\.\s(.*?)\n/g, '3. $1\n4. ')}</div>
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-black p-2 align-top">
                        <span className="font-bold">Kompetensi yang akan dicapai / <span className="italic">Target competence:</span></span><br/>
                        <div className="whitespace-pre-wrap ml-4 mt-1">1. {data.targetCompetence.replace(/\n/g, '\n2. ').replace(/2\.\s(.*?)\n/g, '2. $1\n3. ').replace(/3\.\s(.*?)\n/g, '3. $1\n4. ')}</div>
                      </td>
                    </tr>
                    
                    <tr>
                      <td className="border border-black p-2 font-bold text-center bg-[#1e3a6e] text-white">
                        <span className="text-white">Bagaimana mengelaborasi topik yang akan diajarkan kepada murid?</span><br/>
                        <span className="text-white italic">How will you elaborate the topic that you are going to teach?</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-black p-2 align-top">
                        <span className="font-bold">Berkembang dengan sangat baik / <span className="italic">Well developed:</span></span><br/>
                        <div className="whitespace-pre-wrap mt-1">{data.elaborationWell}</div>
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-black p-2 align-top">
                        <span className="font-bold">Kompeten / <span className="italic">Competent:</span></span><br/>
                        <div className="whitespace-pre-wrap mt-1">{data.elaborationCompetent}</div>
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-black p-2 align-top">
                        <span className="font-bold">Sangat kompeten / <span className="italic">Very competent:</span></span><br/>
                        <div className="whitespace-pre-wrap mt-1">{data.elaborationVery}</div>
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-black p-2 font-bold text-center bg-[#1e3a6e] text-white">
                        <span className="text-white">Metode apa yang akan digunakan untuk mendukung pembelajaran?</span><br/>
                        <span className="text-white italic">What kind of method and support do you need to teach this topic?</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-black p-2 align-top">
                        <span className="font-bold">Metode Pembelajaran / <span className="italic">Learning method:</span></span> {data.learningMethod}
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-black p-2 align-top">
                        <span className="font-bold">Sumber Pembelajaran / <span className="italic">Sources:</span></span> {data.sources}
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-black p-2 align-top">
                        <span className="font-bold">Sarana & Prasarana / <span className="italic">Facilities & Infrastructure:</span></span> {data.facilities}
                      </td>
                    </tr>

                    <tr>
                      <td className="border border-black p-2 font-bold text-center bg-[#1e3a6e] text-white">
                        <span className="text-white">Bagaimana memastikan pemahaman murid? Bagaimana melibatkan murid dalam tindakan nyata / pelayanan misi?</span><br/>
                        <span className="text-white italic">How to ascertain student’s understanding? How to engage student in wisdom lead to action?</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-black p-2 align-top">
                        <span className="font-bold">Asesmen Formatif / <span className="italic">Formative:</span></span> {data.formativeAss}
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-black p-2 align-top">
                        <span className="font-bold">Asesmen Sumatif / <span className="italic">Summative:</span></span> {data.summativeAss}
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-black p-2 align-top">
                        <span className="font-bold">Tindakan nyata / Pelayanan Misi<br/><span className="italic">Wisdom Lead To Action / Mission Service Learning:</span></span> {data.missionService}
                      </td>
                    </tr>
                  </tbody>
                </table>

                <div className="page-break"></div>

                {/* TIMELINE */}
                <h3 className="font-bold mb-1">Strategi Instruksional / <span className="italic font-normal">Instructional strategy</span></h3>
                <table className="w-full border-collapse border border-black mb-8 text-[11pt]">
                  <thead>
                    <tr className="bg-gray-100 text-center">
                      <td className="border border-black p-2 font-bold w-[12%]">Minggu Ke- / Pertemuan Ke-<br/><span className="italic font-normal">Weeks/Meeting</span></td>
                      <td className="border border-black p-2 font-bold w-[30%]">Tujuan yang ingin dicapai per pertemuan<br/><span className="italic font-normal">Learning Objective</span></td>
                      <td className="border border-black p-2 font-bold w-[45%]">Tahapan-tahapan<br/><span className="italic font-normal">Stages of Learning</span></td>
                      <td className="border border-black p-2 font-bold w-[13%]">Waktu<br/><span className="italic font-normal">Alocated Time</span></td>
                    </tr>
                  </thead>
                  <tbody>
                    {data.schedule.map((item, index) => (
                      <tr key={index}>
                        <td className="border border-black p-2 text-center align-top">{item.week}</td>
                        <td className="border border-black p-2 whitespace-pre-wrap align-top">{item.objective}</td>
                        <td className="border border-black p-2 whitespace-pre-wrap align-top">{item.stages}</td>
                        <td className="border border-black p-2 text-center align-top">{item.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* RUBRIK */}
                <h3 className="font-bold mb-1">Rubrik / <span className="italic font-normal">Rubric</span></h3>
                <h4 className="font-bold mb-1 mt-4">Prosedur Pengerjaan Sumatif</h4>
                <table className="w-full border-collapse border border-black mb-4 text-[11pt]">
                  <tbody>
                    <tr>
                      <td className="border border-black p-2 bg-gray-100 font-bold w-[25%] align-top">Ketentuan</td>
                      <td className="border border-black p-2 whitespace-pre-wrap">{data.summativeTask}</td>
                    </tr>
                  </tbody>
                </table>

                <table className="w-full border-collapse border border-black mb-6 text-[11pt]">
                  <thead>
                    <tr className="bg-gray-100 font-bold">
                      <td className="border border-black p-2 text-center w-[25%]">KKM</td>
                      <td className="border border-black p-2 text-center">Indikator Pencapaian</td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-black p-2 text-center font-bold text-xl align-middle">{data.summativeKKM}</td>
                      <td className="border border-black p-2 whitespace-pre-wrap">{data.summativeIndicators}</td>
                    </tr>
                  </tbody>
                </table>

                <table className="w-full border-collapse border border-black mb-8 text-[11pt]">
                  <thead>
                    <tr className="bg-gray-100 font-bold text-center">
                      <td className="border border-black p-2 w-[25%]">Pencapaian</td>
                      <td className="border border-black p-2">Kriteria</td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-black p-2 text-center font-bold align-middle">Sangat baik<br/>(91-100)</td>
                      <td className="border border-black p-2 whitespace-pre-wrap">{data.rubricSangatBaik}</td>
                    </tr>
                    <tr>
                      <td className="border border-black p-2 text-center font-bold align-middle">Baik<br/>(81-90)</td>
                      <td className="border border-black p-2 whitespace-pre-wrap">{data.rubricBaik}</td>
                    </tr>
                    <tr>
                      <td className="border border-black p-2 text-center font-bold align-middle">Memenuhi standar<br/>(70-80)</td>
                      <td className="border border-black p-2 whitespace-pre-wrap">{data.rubricStandar}</td>
                    </tr>
                    <tr>
                      <td className="border border-black p-2 text-center font-bold align-middle">Perlu meningkatkan<br/>(&lt;70)</td>
                      <td className="border border-black p-2 whitespace-pre-wrap">{data.rubricKurang}</td>
                    </tr>
                  </tbody>
                </table>

                <div className="page-break"></div>

                {/* REFLEKSI */}
                <h3 className="font-bold mb-1">Refleksi / <span className="italic font-normal">Reflection</span></h3>
                <div className="border border-black p-5 mb-12 text-[11pt] whitespace-pre-wrap text-justify leading-relaxed">
                  {data.reflection}
                </div>

                {/* TANDA TANGAN */}
                <table className="w-full text-center text-[11pt] mt-16 border-none">
                  <tbody>
                    <tr>
                      <td className="pb-24 align-top w-1/3 border-none">Acknowledged by,<br/><br/>Principal</td>
                      <td className="pb-24 align-top w-1/3 border-none">Checked by,<br/><br/>Curriculum Coordinator</td>
                      <td className="pb-24 align-top w-1/3 border-none">Prepared by,<br/><br/>Teacher</td>
                    </tr>
                    <tr>
                      <td className="border-none px-4">
                        <div className="font-bold border-b border-black w-full pb-1 mx-auto">{data.signPrincipal}</div>
                      </td>
                      <td className="border-none px-4">
                        <div className="font-bold border-b border-black w-full pb-1 mx-auto">{data.signCoordinator}</div>
                      </td>
                      <td className="border-none px-4">
                        <div className="font-bold border-b border-black w-full pb-1 mx-auto">{data.signTeacher}</div>
                      </td>
                    </tr>
                  </tbody>
                </table>
                
              </div>
            </div>
          </div>
        )}

      </div>
    </FormContext.Provider>
  );
}
