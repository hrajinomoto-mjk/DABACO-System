import React, { useState, useMemo } from 'react';
import {
  Users,
  UserPlus,
  UserCheck,
  UserX,
  Shield,
  ShieldAlert,
  KeyRound,
  Search,
  Filter,
  RefreshCw,
  Database,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertTriangle,
  Download,
  Building2,
  Mail,
  Lock,
  X,
  Check
} from 'lucide-react';
import { UserAccount, UserRole, UserSession } from '../types';

interface UserManagementViewProps {
  users: UserAccount[];
  onAddUser: (userData: Omit<UserAccount, 'id' | 'createdAt'>) => void;
  onDeleteUser: (userId: string) => void;
  onUpdateUser: (userId: string, updates: Partial<UserAccount>) => void;
  onSyncDatabase: () => void;
  currentUser: UserSession;
  darkMode: boolean;
}

const DEPARTMENTS = [
  'HR Development',
  'General Affairs',
  'Training & Development',
  'Recruitment & Staffing',
  'Compensation & Benefit',
  'Budget Control Pabrik',
  'Internal Audit & Compliance'
];

const ROLES: Array<{ value: UserRole; label: string; desc: string; color: string }> = [
  {
    value: 'SuperAdmin',
    label: 'Super Admin HR & GA',
    desc: 'Akses penuh seluruh modul, konfigurasi sistem, dan manajemen hak akses.',
    color: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20'
  },
  {
    value: 'BudgetController',
    label: 'Budget Controller',
    desc: 'Pemeriksaan anggaran, persetujuan forecast, dan analisis varians.',
    color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
  },
  {
    value: 'SectionHead',
    label: 'Kepala Seksi (Section Head)',
    desc: 'Pengawasan budget dan pengajuan realisasi di seksi bersangkutan.',
    color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20'
  },
  {
    value: 'Auditor',
    label: 'Auditor Finansial',
    desc: 'Akses peninjauan dan pengunduhan laporan eksekutif (Read-only).',
    color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
  },
  {
    value: 'Staff',
    label: 'Staf Administrasi Seksi',
    desc: 'Pencatatan nota realisasi harian dan pengunggahan berkas bukti kas.',
    color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
  }
];

export const UserManagementView: React.FC<UserManagementViewProps> = ({
  users,
  onAddUser,
  onDeleteUser,
  onUpdateUser,
  onSyncDatabase,
  currentUser,
  darkMode
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'Active' | 'Suspended'>('all');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserAccount | null>(null);
  const [userToEdit, setUserToEdit] = useState<UserAccount | null>(null);

  const [isSyncing, setIsSyncing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Add form fields
  const [formDisplayName, setFormDisplayName] = useState('');
  const [formUsername, setFormUsername] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formDepartment, setFormDepartment] = useState('HR Development');
  const [formRole, setFormRole] = useState<UserRole>('Staff');
  const [formPassword, setFormPassword] = useState('ajinomoto123');
  const [formError, setFormError] = useState('');

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Filtered users
  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      if (selectedDept !== 'all' && u.department !== selectedDept) return false;
      if (selectedRole !== 'all' && u.role !== selectedRole) return false;
      if (selectedStatus !== 'all' && u.status !== selectedStatus) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = u.displayName.toLowerCase().includes(q);
        const matchUser = u.username.toLowerCase().includes(q);
        const matchEmail = u.email.toLowerCase().includes(q);
        const matchDept = u.department.toLowerCase().includes(q);
        if (!matchName && !matchUser && !matchEmail && !matchDept) return false;
      }
      return true;
    });
  }, [users, selectedDept, selectedRole, selectedStatus, searchQuery]);

  // Statistics
  const totalUsersCount = users.length;
  const activeUsersCount = users.filter(u => u.status === 'Active').length;
  const adminAndControllerCount = users.filter(u => u.role === 'SuperAdmin' || u.role === 'BudgetController').length;
  const sectionHeadAndStaffCount = users.filter(u => u.role === 'SectionHead' || u.role === 'Staff').length;

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!formDisplayName.trim() || !formUsername.trim() || !formEmail.trim()) {
      setFormError('Harap lengkapi seluruh isian wajib.');
      return;
    }

    const cleanUsername = formUsername.trim().toLowerCase().replace(/\s+/g, '_');
    // Check if username already exists
    if (users.some(u => u.username.toLowerCase() === cleanUsername)) {
      setFormError(`Username "${cleanUsername}" sudah digunakan oleh pengguna lain.`);
      return;
    }

    // Avatar color pool
    const colors = ['bg-red-600', 'bg-blue-600', 'bg-emerald-600', 'bg-purple-600', 'bg-amber-600', 'bg-cyan-600', 'bg-rose-600'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    onAddUser({
      displayName: formDisplayName.trim(),
      username: cleanUsername,
      email: formEmail.trim().toLowerCase(),
      department: formDepartment,
      role: formRole,
      status: 'Active',
      password: formPassword || 'ajinomoto123',
      avatarColor: randomColor,
      lastLogin: 'Belum pernah login'
    });

    setIsAddModalOpen(false);
    // Reset
    setFormDisplayName('');
    setFormUsername('');
    setFormEmail('');
    setFormDepartment('HR Development');
    setFormRole('Staff');
    setFormPassword('ajinomoto123');

    showNotification(`Akun pengguna "${cleanUsername}" berhasil didaftarkan ke basis data.`);
  };

  const handleConfirmDelete = () => {
    if (!userToDelete) return;

    if (userToDelete.username.toLowerCase() === currentUser.username.toLowerCase()) {
      showNotification('Tidak dapat menghapus akun yang sedang Anda gunakan saat ini.');
      setUserToDelete(null);
      return;
    }

    onDeleteUser(userToDelete.id);
    showNotification(`Akun pengguna "${userToDelete.displayName}" telah dihapus dari basis data.`);
    setUserToDelete(null);
  };

  const handleSyncDatabaseClick = () => {
    setIsSyncing(true);
    setTimeout(() => {
      onSyncDatabase();
      setIsSyncing(false);
      showNotification('Daftar pengguna dan hak akses berhasil disinkronkan dengan basis data.');
    }, 700);
  };

  const handleExportUsers = () => {
    const csvHeader = 'ID,Username,Nama Lengkap,Email,Departemen,Peran,Status,Tanggal Dibuat,Login Terakhir\n';
    const csvRows = users.map(u => 
      `"${u.id}","${u.username}","${u.displayName}","${u.email}","${u.department}","${u.role}","${u.status}","${u.createdAt}","${u.lastLogin || '-'}"`
    ).join('\n');

    const blob = new Blob([csvHeader + csvRows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `DABACO_Daftar_Pengguna_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showNotification('Daftar akun pengguna berhasil diunduh dalam format CSV.');
  };

  const getRoleBadge = (role: UserRole) => {
    const matched = ROLES.find(r => r.value === role) || ROLES[4];
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${matched.color}`}>
        <Shield className="w-3 h-3" />
        <span>{matched.label}</span>
      </span>
    );
  };

  return (
    <div className="space-y-6 pb-14 animate-in fade-in duration-300">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-emerald-600 text-white text-xs font-bold shadow-xl animate-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Header Card */}
      <div className={`p-6 sm:p-7 rounded-3xl border transition-all ${
        darkMode ? 'bg-[#0f1424] border-slate-800 shadow-lg' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-red-600/10 text-red-600 dark:text-red-400">
                <Users className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                  Manajemen Pengguna & Hak Akses
                </h2>
                <p className={`text-xs mt-0.5 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                  Kelola akun staf, kepala seksi, dan penanggung jawab anggaran. Penambahan dan penghapusan akun terintegrasi langsung dengan basis data DABACO.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleSyncDatabaseClick}
              disabled={isSyncing}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                darkMode
                  ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
                  : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Database className={`w-3.5 h-3.5 ${isSyncing ? 'animate-pulse text-red-500' : ''}`} />
              <span>{isSyncing ? 'Menyinkronkan...' : 'Sinkron ke Basis Data'}</span>
            </button>

            <button
              onClick={handleExportUsers}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                darkMode
                  ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
                  : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Download className="w-3.5 h-3.5" />
              <span>Ekspor CSV</span>
            </button>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-md shadow-red-600/25 transition-all cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Tambah Pengguna Baru</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Pengguna */}
        <div className={`p-5 rounded-3xl border transition-all ${
          darkMode ? 'bg-[#0f1424] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div className="flex items-center justify-between text-xs mb-2">
            <span className={`font-bold ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              Total Pengguna Terdaftar
            </span>
            <span className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500">
              <Users className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
            {totalUsersCount} Akun
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
            <UserCheck className="w-3.5 h-3.5" />
            <span>{activeUsersCount} Akun Berstatus Aktif</span>
          </div>
        </div>

        {/* Card 2: Administrator & Controller */}
        <div className={`p-5 rounded-3xl border transition-all ${
          darkMode ? 'bg-[#0f1424] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div className="flex items-center justify-between text-xs mb-2">
            <span className={`font-bold ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              Admin & Pengendali Anggaran
            </span>
            <span className="p-1.5 rounded-lg bg-red-500/10 text-red-500">
              <Shield className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
            {adminAndControllerCount} Akun
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-red-600 dark:text-red-400 font-bold">
            <span>Hak Akses Penuh & Verifikasi</span>
          </div>
        </div>

        {/* Card 3: Kepala Seksi & Staf Operasional */}
        <div className={`p-5 rounded-3xl border transition-all ${
          darkMode ? 'bg-[#0f1424] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div className="flex items-center justify-between text-xs mb-2">
            <span className={`font-bold ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              Kepala Seksi & Staf
            </span>
            <span className="p-1.5 rounded-lg bg-purple-500/10 text-purple-500">
              <Building2 className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
            {sectionHeadAndStaffCount} Akun
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-purple-600 dark:text-purple-400 font-bold">
            <span>Budget & Pelaporan Tiap Seksi</span>
          </div>
        </div>

        {/* Card 4: Status Sinkronisasi Basis Data */}
        <div className={`p-5 rounded-3xl border transition-all ${
          darkMode ? 'bg-[#0f1424] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div className="flex items-center justify-between text-xs mb-2">
            <span className={`font-bold ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              Koneksi Basis Data
            </span>
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500">
              <Database className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
            Tersinkron
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
            <span>Enkripsi AES-256 Aktif</span>
          </div>
        </div>
      </div>

      {/* Main Table Container */}
      <div className={`p-6 rounded-3xl border space-y-4 ${
        darkMode ? 'bg-[#0f1424] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        {/* Filter and search toolbar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex flex-wrap items-center gap-2">
            {/* Search Input */}
            <div className="relative min-w-[240px]">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari nama, username, email, seksi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-9 pr-3 py-2 rounded-xl text-xs border transition-colors outline-none ${
                  darkMode
                    ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500 focus:border-red-500'
                    : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-red-500'
                }`}
              />
            </div>

            {/* Department Filter */}
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className={`px-3 py-2 rounded-xl text-xs border outline-none font-medium cursor-pointer ${
                darkMode ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-300 text-slate-800'
              }`}
            >
              <option value="all">Semua Seksi / Departemen</option>
              {DEPARTMENTS.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>

            {/* Role Filter */}
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className={`px-3 py-2 rounded-xl text-xs border outline-none font-medium cursor-pointer ${
                darkMode ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-300 text-slate-800'
              }`}
            >
              <option value="all">Semua Peran (Role)</option>
              {ROLES.map(r => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as any)}
              className={`px-3 py-2 rounded-xl text-xs border outline-none font-medium cursor-pointer ${
                darkMode ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-300 text-slate-800'
              }`}
            >
              <option value="all">Semua Status Akun</option>
              <option value="Active">Akun Aktif</option>
              <option value="Suspended">Akun Ditangguhkan</option>
            </select>
          </div>

          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Menampilkan <b>{filteredUsers.length}</b> dari {users.length} pengguna
          </div>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-xs text-left min-w-[780px]">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-[11px] uppercase font-bold tracking-wider">
                <th className="py-3 px-3">Pengguna & Akun</th>
                <th className="py-3 px-2">Seksi / Departemen</th>
                <th className="py-3 px-2">Peran & Hak Akses</th>
                <th className="py-3 px-2 text-center">Status</th>
                <th className="py-3 px-2">Login Terakhir</th>
                <th className="py-3 px-3 text-right">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredUsers.map(user => {
                const isCurrent = user.username.toLowerCase() === currentUser.username.toLowerCase();
                return (
                  <tr
                    key={user.id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    {/* User Profile Cell */}
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white text-xs shadow-xs ${
                          user.avatarColor || 'bg-red-600'
                        }`}>
                          {user.displayName.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-slate-900 dark:text-white">
                              {user.displayName}
                            </span>
                            {isCurrent && (
                              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-red-600/10 text-red-600 dark:text-red-400 border border-red-500/20">
                                Anda
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                            <span>@{user.username}</span>
                            <span>&bull;</span>
                            <span className="font-sans text-[11px]">{user.email}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Department Cell */}
                    <td className="py-3.5 px-2">
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        {user.department}
                      </span>
                    </td>

                    {/* Role Cell */}
                    <td className="py-3.5 px-2">
                      {getRoleBadge(user.role)}
                    </td>

                    {/* Status Cell */}
                    <td className="py-3.5 px-2 text-center">
                      <button
                        onClick={() => {
                          const newStatus = user.status === 'Active' ? 'Suspended' : 'Active';
                          onUpdateUser(user.id, { status: newStatus });
                          showNotification(`Status akun ${user.displayName} diubah menjadi ${newStatus === 'Active' ? 'Aktif' : 'Ditangguhkan'}.`);
                        }}
                        title="Klik untuk mengubah status akun"
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                          user.status === 'Active'
                            ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 hover:bg-emerald-500/25 border border-emerald-500/30'
                            : 'bg-rose-500/15 text-rose-600 dark:text-rose-300 hover:bg-rose-500/25 border border-rose-500/30'
                        }`}
                      >
                        {user.status === 'Active' ? <Check className="w-3 h-3" /> : <UserX className="w-3 h-3" />}
                        <span>{user.status === 'Active' ? 'Aktif' : 'Ditangguhkan'}</span>
                      </button>
                    </td>

                    {/* Last Login Cell */}
                    <td className="py-3.5 px-2 text-slate-500 dark:text-slate-400 text-[11px]">
                      {user.lastLogin || '-'}
                    </td>

                    {/* Actions Cell */}
                    <td className="py-3.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setUserToEdit(user)}
                          title="Ubah Rincian Pengguna"
                          className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                            darkMode
                              ? 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700'
                              : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => setUserToDelete(user)}
                          disabled={isCurrent}
                          title={isCurrent ? 'Akun aktif tidak dapat dihapus' : 'Hapus Akun Pengguna'}
                          className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                            isCurrent
                              ? 'opacity-30 cursor-not-allowed bg-slate-800 border-slate-700 text-slate-500'
                              : darkMode
                              ? 'bg-rose-950/40 border-rose-900/60 text-rose-400 hover:bg-rose-900/60 hover:text-white'
                              : 'bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100'
                          }`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: Tambah Pengguna Baru */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className={`relative w-full max-w-lg rounded-3xl border shadow-2xl overflow-hidden transition-all ${
            darkMode ? 'bg-[#0f1424] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-red-600/10 text-red-600 dark:text-red-400">
                  <UserPlus className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="font-bold text-base">Tambah Pengguna Baru</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Daftarkan akun staf atau pimpinan untuk mengakses DABACO
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="p-6 space-y-4 text-xs">
              {formError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div>
                <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">
                  Nama Lengkap Pegawai *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Budi Santoso"
                  value={formDisplayName}
                  onChange={(e) => setFormDisplayName(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl border outline-none ${
                    darkMode ? 'bg-slate-900 border-slate-700 text-white focus:border-red-500' : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-red-500'
                  }`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">
                    Username Login *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: budi_ga"
                    value={formUsername}
                    onChange={(e) => setFormUsername(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl border outline-none font-mono ${
                      darkMode ? 'bg-slate-900 border-slate-700 text-white focus:border-red-500' : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-red-500'
                    }`}
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">
                    Alamat Email Ajinomoto *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="budi.s@ajinomoto.co.id"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl border outline-none ${
                      darkMode ? 'bg-slate-900 border-slate-700 text-white focus:border-red-500' : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-red-500'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">
                    Seksi / Departemen *
                  </label>
                  <select
                    value={formDepartment}
                    onChange={(e) => setFormDepartment(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl border outline-none font-medium cursor-pointer ${
                      darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  >
                    {DEPARTMENTS.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">
                    Peran & Hak Akses *
                  </label>
                  <select
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value as UserRole)}
                    className={`w-full px-3 py-2 rounded-xl border outline-none font-medium cursor-pointer ${
                      darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  >
                    {ROLES.map(r => (
                      <option key={r.value} value={r.value}>{r.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">
                  Kata Sandi Awal (Password)
                </label>
                <input
                  type="text"
                  placeholder="ajinomoto123"
                  value={formPassword}
                  onChange={(e) => setFormPassword(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl border outline-none font-mono ${
                    darkMode ? 'bg-slate-900 border-slate-700 text-white focus:border-red-500' : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-red-500'
                  }`}
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Pengguna dapat memperbarui kata sandi mandiri melalui menu Pengaturan Akun.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className={`px-4 py-2 rounded-xl border font-bold cursor-pointer ${
                    darkMode ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold shadow-md shadow-red-600/25 cursor-pointer"
                >
                  Simpan Akun Pengguna
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Konfirmasi Hapus Pengguna */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className={`relative w-full max-w-md rounded-3xl border p-6 shadow-2xl transition-all ${
            darkMode ? 'bg-[#0f1424] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-600 flex items-center justify-center mb-4">
              <Trash2 className="w-6 h-6" />
            </div>

            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Hapus Akun Pengguna?
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Apakah Anda yakin ingin menghapus akun <b>{userToDelete.displayName}</b> (<code>@{userToDelete.username}</code>) dari basis data DABACO? Pengguna tidak akan dapat mengakses modul seksi lagi.
            </p>

            <div className="mt-6 flex items-center justify-end gap-2.5 text-xs">
              <button
                onClick={() => setUserToDelete(null)}
                className={`px-4 py-2 rounded-xl border font-bold cursor-pointer ${
                  darkMode ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Batal
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold shadow-md shadow-rose-600/25 cursor-pointer"
              >
                Ya, Hapus Akun
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Edit Pengguna */}
      {userToEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className={`relative w-full max-w-lg rounded-3xl border shadow-2xl overflow-hidden transition-all ${
            darkMode ? 'bg-[#0f1424] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-blue-600/10 text-blue-600">
                  <Edit2 className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="font-bold text-base">Ubah Data Pengguna</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Perbarui profil atau hak akses untuk @{userToEdit.username}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setUserToEdit(null)}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">
                  Nama Lengkap Pegawai
                </label>
                <input
                  type="text"
                  value={userToEdit.displayName}
                  onChange={(e) => setUserToEdit({ ...userToEdit, displayName: e.target.value })}
                  className={`w-full px-3 py-2 rounded-xl border outline-none ${
                    darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">
                  Email Ajinomoto
                </label>
                <input
                  type="email"
                  value={userToEdit.email}
                  onChange={(e) => setUserToEdit({ ...userToEdit, email: e.target.value })}
                  className={`w-full px-3 py-2 rounded-xl border outline-none ${
                    darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">
                    Seksi / Departemen
                  </label>
                  <select
                    value={userToEdit.department}
                    onChange={(e) => setUserToEdit({ ...userToEdit, department: e.target.value })}
                    className={`w-full px-3 py-2 rounded-xl border outline-none font-medium cursor-pointer ${
                      darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  >
                    {DEPARTMENTS.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">
                    Peran & Hak Akses
                  </label>
                  <select
                    value={userToEdit.role}
                    onChange={(e) => setUserToEdit({ ...userToEdit, role: e.target.value as UserRole })}
                    className={`w-full px-3 py-2 rounded-xl border outline-none font-medium cursor-pointer ${
                      darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  >
                    {ROLES.map(r => (
                      <option key={r.value} value={r.value}>{r.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setUserToEdit(null)}
                  className={`px-4 py-2 rounded-xl border font-bold cursor-pointer ${
                    darkMode ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onUpdateUser(userToEdit.id, userToEdit);
                    setUserToEdit(null);
                    showNotification(`Perubahan data untuk @${userToEdit.username} berhasil disimpan.`);
                  }}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-md shadow-blue-600/25 cursor-pointer"
                >
                  Simpan Perubahan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
