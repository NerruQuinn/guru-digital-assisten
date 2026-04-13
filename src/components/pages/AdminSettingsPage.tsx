import { useState, useEffect } from 'react';
import { Save, Building, User, Upload, Loader2, CheckCircle2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useToast } from '../../hooks/useToast';

export default function AdminSettingsPage() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [savingSchool, setSavingSchool] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [schoolSaved, setSchoolSaved] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);

  // Profile Form State
  const [userId, setUserId] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');

  // School Form State
  const [schoolId, setSchoolId] = useState<string | null>(null);
  const [schoolName, setSchoolName] = useState('');
  const [visi, setVisi] = useState('');
  const [misi, setMisi] = useState('');
  const [logoPath, setLogoPath] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      setUserId(user.id);
      setEmail(user.email || '');

      // Fetch Profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileData) {
        setFullName(profileData.full_name || '');
        
        if (profileData.school_id) {
          setSchoolId(profileData.school_id);
          // Fetch School
          const { data: schoolData } = await supabase
            .from('schools')
            .select('*')
            .eq('id', profileData.school_id)
            .single();

          if (schoolData) {
            setSchoolName(schoolData.name || '');
            setVisi(schoolData.visi || '');
            setMisi(schoolData.misi || '');
            setLogoPath(schoolData.logo_url || '');
          }
        }
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogoFile(e.target.files[0]);
    }
  };

  const handleSaveSchool = async () => {
    setSavingSchool(true);
    setSchoolSaved(false);
    try {
      let finalLogoPath = logoPath;
      
      // Upload Logo to Supabase Storage if changed
      if (logoFile) {
        const filePath = `logos/${Date.now()}_${logoFile.name}`;
        const { error: uploadError } = await supabase.storage
          .from('documents')
          .upload(filePath, logoFile);
          
        if (uploadError) throw uploadError;
        finalLogoPath = filePath;
        setLogoPath(filePath);
      }

      const schoolPayload = {
        name: schoolName,
        visi: visi,
        misi: misi,
        logo_url: finalLogoPath
      };

      let newSchoolId = schoolId;

      if (schoolId) {
        // Update existing school
        const { error } = await supabase
          .from('schools')
          .update(schoolPayload)
          .eq('id', schoolId);
        if (error) throw error;
      } else {
        // Insert new school
        const { data, error } = await supabase
          .from('schools')
          .insert(schoolPayload)
          .select('id')
          .single();
        
        if (error) throw error;
        if (data) {
          newSchoolId = data.id;
          setSchoolId(data.id);
          
          // Link new school to admin profile
          await supabase
            .from('profiles')
            .update({ school_id: data.id })
            .eq('id', userId);
        }
      }

      setSchoolSaved(true);
      showToast('Profil sekolah berhasil disimpan!', 'success');
      setTimeout(() => setSchoolSaved(false), 3000);
    } catch (err: any) {
      console.error('Error saving school:', err);
      showToast('Gagal menyimpan profil sekolah: ' + err.message, 'error');
    } finally {
      setSavingSchool(false);
    }
  };

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    setProfileSaved(false);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: fullName })
        .eq('id', userId);

      if (error) throw error;

      setProfileSaved(true);
      showToast('Profil admin berhasil disimpan!', 'success');
      setTimeout(() => setProfileSaved(false), 3000);
    } catch (err: any) {
      console.error('Error saving profile:', err);
      showToast('Gagal menyimpan profil admin: ' + err.message, 'error');
    } finally {
      setSavingProfile(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-slate-500 font-medium">Memuat pengaturan...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Pengaturan Admin</h2>
        <p className="text-slate-600 mt-1">Kelola informasi sekolah dan profil akun administrasi Anda</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Kolom 1: Profil Sekolah */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
            <Building className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-slate-800">Profil Sekolah</h3>
          </div>
          <div className="p-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Nama Sekolah</label>
              <input 
                type="text" 
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                placeholder="Ex: SMA Negeri 1 Jakarta" 
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Logo Sekolah</label>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl border border-dashed border-slate-300 flex flex-col items-center justify-center bg-slate-50 overflow-hidden">
                  {logoFile ? (
                    <span className="text-xs text-center text-slate-500 px-1 truncate w-full">{logoFile.name}</span>
                  ) : logoPath ? (
                    <span className="text-[10px] text-center text-slate-400 px-1 truncate w-full">{logoPath.split('/').pop()}</span>
                  ) : (
                    <Building className="w-6 h-6 text-slate-300" />
                  )}
                </div>
                <label className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors flex items-center gap-2">
                  <Upload className="w-4 h-4" /> Pilih Logo
                  <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Visi Sekolah</label>
              <textarea 
                value={visi}
                onChange={(e) => setVisi(e.target.value)}
                rows={3} 
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Misi Sekolah</label>
              <textarea 
                value={misi}
                onChange={(e) => setMisi(e.target.value)}
                rows={4} 
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
              />
            </div>

            <button 
              onClick={handleSaveSchool}
              disabled={savingSchool}
              className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${schoolSaved ? 'bg-green-500 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20'}`}
            >
              {savingSchool ? <Loader2 className="w-5 h-5 animate-spin" /> : schoolSaved ? <CheckCircle2 className="w-5 h-5" /> : <Save className="w-5 h-5" />}
              {schoolSaved ? "Profil Sekolah Tersimpan" : "Simpan Profil Sekolah"}
            </button>
          </div>
        </div>

        {/* Kolom 2: Profil Admin */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden h-fit">
          <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
            <User className="w-5 h-5 text-purple-600" />
            <h3 className="font-bold text-slate-800">Profil Administrator</h3>
          </div>
          <div className="p-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Nama Lengkap</label>
              <input 
                type="text" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Alamat Email</label>
              <input 
                type="email" 
                value={email}
                readOnly
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm bg-slate-50 text-slate-500 focus:outline-none cursor-not-allowed"
              />
              <p className="text-xs text-slate-400 mt-1">Email dikelola oleh sistem Autentikasi dan tidak dapat diubah di sini.</p>
            </div>

            <button 
              onClick={handleSaveProfile}
              disabled={savingProfile}
              className={`w-full mt-4 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${profileSaved ? 'bg-green-500 text-white' : 'bg-slate-900 hover:bg-slate-800 text-white shadow-lg'}`}
            >
              {savingProfile ? <Loader2 className="w-5 h-5 animate-spin" /> : profileSaved ? <CheckCircle2 className="w-5 h-5" /> : <Save className="w-5 h-5" />}
              {profileSaved ? "Profil Admin Tersimpan" : "Simpan Profil Admin"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
