import { Home, FileText, Database, Settings, LogOut, GraduationCap, X, Users } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface SidebarProps {
  activePage: string;
  onPageChange: (page: string) => void;
  role: string | null;
  isOpen?: boolean;
}

const Sidebar = ({ activePage, onPageChange, role, isOpen }: SidebarProps) => {
  const adminMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'templates', label: 'Kelola Template', icon: Database },
    { id: 'upload-template', label: 'Upload Template', icon: FileText },
    { id: 'manage-users', label: 'Kelola Guru', icon: Users },
    { id: 'settings', label: 'Setelan Admin', icon: Settings },
  ];

  const guruMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'create-modul', label: 'Buat Modul Ajar', icon: FileText },
    { id: 'templates', label: 'Template Tersedia', icon: Database },
    { id: 'history', label: 'Riwayat Saya', icon: FileText },
  ];

  const menuItems = role === 'admin' ? adminMenuItems : guruMenuItems;

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <div className={`fixed inset-y-0 left-0 w-64 bg-slate-900 text-white flex flex-col z-40 transform transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      {/* Mobile Close Button Container */}
      <div className="flex items-center justify-between p-6 pb-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white leading-none">Guru Digital</h1>
            <span className="text-xs font-semibold text-blue-400 capitalize tracking-wider">{role} Portal</span>
          </div>
        </div>
        <button 
          onClick={() => onPageChange(activePage)} // Dummy closing action
          className="md:hidden text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 px-4 py-8 space-y-1 overflow-y-auto">
        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 px-3">
          Menu Utama
        </div>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl font-medium transition-all ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-900/20' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        {/* Only show logout directly on Sidebar if desktop, else it is handled in header Dropdown */}
        <button 
          onClick={handleLogout}
          className="w-full hidden md:flex items-center gap-3 px-3 py-3 rounded-xl font-medium text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Keluar Aplikasi</span>
        </button>

        {/* Mobile logout proxy */}
        <button 
          onClick={handleLogout}
          className="w-full md:hidden flex items-center gap-3 px-3 py-3 rounded-xl font-medium text-red-400 hover:bg-slate-800 hover:text-red-300 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Keluar Aplikasi</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;