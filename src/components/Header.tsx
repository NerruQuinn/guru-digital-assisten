import { useState, useRef, useEffect } from 'react';
import { User, ChevronDown, Menu, LogOut } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface HeaderProps {
  title: string;
  breadcrumb: string;
  user: any;
  onMenuClick?: () => void;
}

const Header = ({ title, breadcrumb, user, onMenuClick }: HeaderProps) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
      <div className="flex items-center justify-between px-4 md:px-8 py-4">
        <div className="flex items-center gap-3">
          <button 
            className="md:hidden p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            onClick={onMenuClick}
            type="button"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center text-sm text-slate-500 font-medium mb-1">
              <span>Aplikasi</span>
              <span className="mx-2">/</span>
              <span className="text-blue-600">{breadcrumb}</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 leading-none">{title}</h1>
          </div>
        </div>

        <div className="flex items-center gap-4 relative" ref={dropdownRef}>
          <div className="hidden md:block text-right">
            <p className="text-sm font-bold text-slate-900">{user?.email?.split('@')[0] || 'User'}</p>
            <p className="text-xs text-slate-500 font-medium">{user?.email}</p>
          </div>
          
          <button 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 w-10 h-10 md:w-auto md:h-auto bg-slate-100 md:bg-transparent md:hover:bg-slate-50 p-2 md:pr-1 rounded-full md:rounded-xl border border-transparent md:border-slate-200 transition-all cursor-pointer select-none"
          >
            <div className="w-full h-full md:w-8 md:h-8 bg-blue-600 rounded-full flex items-center justify-center -ml-1">
              <User className="w-4 h-4 text-white" />
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 hidden md:block" />
          </button>

          {/* User Dropdown */}
          {dropdownOpen && (
            <div className="absolute top-14 right-0 w-60 bg-white border border-slate-100 shadow-xl rounded-xl py-2 animate-in fade-in slide-in-from-top-2 origin-top-right z-50">
              <div className="px-4 py-3 border-b border-slate-100">
                <p className="text-sm font-bold text-slate-900 truncate">{user?.email?.split('@')[0] || 'User'}</p>
                <p className="text-xs text-slate-500 font-medium truncate">{user?.email}</p>
              </div>
              <div className="p-2">
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
                >
                  <LogOut className="w-4 h-4" /> Keluar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;