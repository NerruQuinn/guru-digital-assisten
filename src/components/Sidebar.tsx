import {
  LayoutDashboard,
  FileText,
  History,
  Settings,
  GraduationCap,
  Upload,
  Users,
} from 'lucide-react';

interface SidebarProps {
  activePage: string;
  onPageChange: (page: string) => void;
  role: string | null;
}

const Sidebar = ({ activePage, onPageChange, role }: SidebarProps) => {
  // Menu untuk guru
  const guruMenu = [
    { icon: LayoutDashboard, label: 'Dashboard', id: 'dashboard' },
    { icon: FileText, label: 'My Templates', id: 'templates' },
    { icon: History, label: 'History', id: 'history' },
  ];

  // Menu tambahan untuk admin
  const adminMenu = [
    { icon: LayoutDashboard, label: 'Dashboard', id: 'dashboard' },
    { icon: Upload, label: 'Upload Template', id: 'upload-template' },
    { icon: FileText, label: 'Kelola Template', id: 'templates' },
    { icon: Users, label: 'Kelola Guru', id: 'manage-users' },
    { icon: History, label: 'History', id: 'history' },
  ];

  const menuItems = role === 'admin' ? adminMenu : guruMenu;
  console.log('Sidebar menerima role:', role);

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-semibold text-slate-900">Guru Digital</span>
        </div>
        {/* Badge role */}
        <span className={`mt-2 inline-block text-xs font-medium px-2 py-0.5 rounded-full ${
          role === 'admin'
            ? 'bg-purple-100 text-purple-700'
            : 'bg-blue-100 text-blue-700'
        }`}>
          {role === 'admin' ? 'Administrator' : 'Guru'}
        </span>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onPageChange(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              activePage === item.id
                ? 'bg-blue-50 text-blue-600 font-medium'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100">
        {role === 'admin' && (
          <button
            onClick={() => onPageChange('settings')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all duration-200"
          >
            <Settings className="w-5 h-5" />
            <span>Admin Settings</span>
          </button>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;