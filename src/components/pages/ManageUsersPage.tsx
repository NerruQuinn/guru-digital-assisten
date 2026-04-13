import { useEffect, useState } from 'react';
import { Search, UserCheck, ShieldAlert, Shield, Users } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useToast } from '../../hooks/useToast';
import { SkeletonTable } from '../ui/Skeleton';

interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  role: 'admin' | 'guru';
  created_at: string;
}

const ManageUsersPage = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email, role, created_at')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setUsers(data as UserProfile[] || []);
    } catch (err: any) {
      console.error('Error fetching users:', err.message);
      showToast('Gagal mengambil data user: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleChangeRole = async (userId: string, currentRole: string, userName: string) => {
    const newRole = currentRole === 'admin' ? 'guru' : 'admin';
    const actionText = newRole === 'admin' ? 'menjadikan ADMIN' : 'menurunkan menjadi GURU';
    
    if (!window.confirm(`Yakin ingin ${actionText} untuk user ${userName}?`)) {
      return;
    }

    setProcessingId(userId);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;

      showToast(`Berhasil mengubah role ${userName} menjadi ${newRole}`, 'success');
      // Update local state without refetching entirely
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    } catch (err: any) {
      console.error('Error updating role:', err.message);
      showToast('Gagal memperbarui role: ' + err.message, 'error');
    } finally {
      setProcessingId(null);
    }
  };

  const filteredUsers = users.filter((u) => {
    const term = search.toLowerCase();
    const name = (u.full_name || '').toLowerCase();
    const email = (u.email || '').toLowerCase();
    return name.includes(term) || email.includes(term);
  });

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Kelola Guru & Akses</h2>
          <p className="text-slate-600 mt-1">Mengelola akun dan mengatur peran (role) pengguna di aplikasi</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden min-h-[400px]">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div className="relative w-full max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari berdasarkan nama atau email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 w-full rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
            />
          </div>
          <div className="text-sm font-medium text-slate-500 mr-2">
            Total: {filteredUsers.length} Pengguna
          </div>
        </div>

        {/* Content Area */}
        <div className="overflow-x-auto w-full">
          {loading ? (
            <div className="p-4">
              <SkeletonTable columns={5} rows={5} />
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
              <div className="bg-slate-50 p-6 rounded-full mb-4">
                <Users className="w-16 h-16 text-slate-300" />
              </div>
              <h3 className="text-lg font-bold text-slate-700 mb-2">Tidak ada pengguna ditemukan</h3>
              <p className="text-slate-500 max-w-sm mb-6">
                Mungkin kata kunci pencarian Anda tidak cocok dengan pengguna manapun di database.
              </p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50/80">
                <tr>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-600 border-b border-slate-100">Nama Lengkap</th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-600 border-b border-slate-100">Email</th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-600 border-b border-slate-100">Role</th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-600 border-b border-slate-100">Tanggal Bergabung</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-slate-600 border-b border-slate-100">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-800">
                      {user.full_name || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {user.email || '-'}
                    </td>
                    <td className="px-6 py-4">
                      {user.role === 'admin' ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-700 border border-purple-200">
                          <ShieldAlert className="w-3 h-3" /> Admin
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 border border-blue-200">
                          <UserCheck className="w-3 h-3" /> Guru
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {new Date(user.created_at).toLocaleDateString('id-ID', {
                        day: '2-digit', month: 'long', year: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center">
                        <button
                          onClick={() => handleChangeRole(user.id, user.role, user.full_name)}
                          disabled={processingId === user.id}
                          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-2 
                            ${processingId === user.id ? 'opacity-50 cursor-not-allowed' : ''} 
                            ${user.role === 'guru' 
                              ? 'bg-purple-50 text-purple-700 hover:bg-purple-100' 
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                        >
                          {processingId === user.id ? (
                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          ) : user.role === 'guru' ? (
                            <Shield className="w-4 h-4" /> 
                          ) : null}
                          {user.role === 'guru' ? 'Jadikan Admin' : 'Jadikan Guru'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageUsersPage;
