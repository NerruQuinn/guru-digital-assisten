import { User, ChevronRight } from 'lucide-react';

interface HeaderProps {
  title: string;
  breadcrumb: string;
}

const Header = ({ title, breadcrumb }: HeaderProps) => {
  return (
    <header className="bg-white border-b border-slate-200 px-8 py-5">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
            <span>Home</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-slate-900">{breadcrumb}</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
        </div>
        <button className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors">
          <User className="w-5 h-5 text-slate-600" />
        </button>
      </div>
    </header>
  );
};

export default Header;
