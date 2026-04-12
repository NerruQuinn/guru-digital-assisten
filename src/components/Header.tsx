import { User, ChevronRight } from 'lucide-react';

interface HeaderProps {
  title: string;
  breadcrumb: string;
  user?: any;
}

const Header = ({ title, breadcrumb, user }: HeaderProps) => {
  const avatarUrl = user?.user_metadata?.avatar_url;
  const fullName = user?.user_metadata?.full_name ?? 'User';

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
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-600 hidden sm:block">{fullName}</span>
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={fullName}
              className="w-10 h-10 rounded-full object-cover border border-slate-200"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
              <User className="w-5 h-5 text-slate-600" />
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;