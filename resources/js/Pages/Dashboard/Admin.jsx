import { useState, useMemo, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';

// --- ICONS ---
const Icons = {
    Users: () => <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    Edit: () => <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>,
    Trash: () => <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>,
    Plus: () => <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"/><path d="M12 5v14"/></svg>,
    Close: () => <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>,
    Search: () => <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>,
    Filter: () => <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
    Check: () => <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>,
    Logout: () => <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>,
    Shield: () => <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
};

// --- COMPONENTS ---

const Navbar = ({ user }) => (
    <nav className="bg-white/80 backdrop-blur-xl border-b border-gray-200 sticky top-0 z-40 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-20">
                <div className="flex items-center gap-4">
                    <div className="bg-gray-900 text-white p-2.5 rounded-2xl font-bold shadow-xl transform hover:scale-105 transition-transform cursor-default">
                        ET
                    </div>
                    <div>
                        <span className="font-black text-gray-800 text-xl tracking-tight block leading-none">EduTalent<span className="text-indigo-600">.</span></span>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">Control Center</span>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-gray-800">{user?.name || 'Admin'}</p>
                        <div className="flex justify-end items-center gap-1.5">
                             <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                             <p className="text-[10px] text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded-md inline-block">Administrator</p>
                        </div>
                    </div>
                    <div className="h-8 w-px bg-gray-200 mx-1 hidden sm:block"></div>
                    <button 
                        onClick={(e) => { e.preventDefault(); router.post('/logout'); }} 
                        className="group p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-300 border border-transparent hover:border-red-100"
                        title="Keluar"
                    >
                        <Icons.Logout />
                    </button>
                </div>
            </div>
        </div>
    </nav>
);

const StatCard = ({ title, value, colorFrom, colorTo, icon: Icon, delay }) => (
    <div 
        className={`bg-gradient-to-br ${colorFrom} ${colorTo} p-6 rounded-[2rem] text-white shadow-xl shadow-gray-200/50 relative overflow-hidden group hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 cursor-default`}
        style={{ animation: `fadeInUp 0.6s ease-out forwards ${delay}s`, opacity: 0, transform: 'translateY(20px)' }}
    >
        <style>{`@keyframes fadeInUp { to { opacity: 1; transform: translateY(0); } }`}</style>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:scale-125 transition-transform duration-700"></div>
        <div className="relative z-10 flex justify-between items-start">
            <div>
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-70 mb-2">{title}</p>
                <h3 className="text-5xl font-black tracking-tighter">{value}</h3>
            </div>
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/10 shadow-inner group-hover:rotate-12 transition-transform duration-300">
                <Icon />
            </div>
        </div>
    </div>
);

// --- MODAL FORM ---
const UserModal = ({ isOpen, onClose, user, subjects, extras }) => {
    if (!isOpen) return null;

    const [form, setForm] = useState({
        id: user?.id || '',
        name: user?.name || '',
        email: user?.email || '',
        password: '',
        role: user?.role || 'siswa',
        nomor_induk: user?.nomor_induk || '',
        kelas: user?.kelas || '',
        subject_id: user?.subject_id || '',
        extra_id: user?.extra_id || ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        // Menggunakan window.route jika tersedia (Laravel Ziggy), atau fallback manual
        const url = typeof window.route !== 'undefined' ? window.route('admin.saveUser') : '/admin/user/save';
        
        router.post(url, form, {
            onSuccess: () => { setLoading(false); onClose(); },
            onError: () => setLoading(false)
        });
    };

    const isEdit = !!user;
    const safeSubjects = subjects || [];
    const safeExtras = extras || [];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-md transition-all duration-300">
            <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in-up transform transition-all border border-gray-100">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-gray-50 to-white">
                    <div>
                        <h3 className="text-xl font-bold text-gray-800">{isEdit ? 'Edit Pengguna' : 'Tambah Pengguna'}</h3>
                        <p className="text-xs text-gray-500 mt-1">Lengkapi data akun di bawah ini.</p>
                    </div>
                    <button onClick={onClose} className="p-2 bg-white rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition shadow-sm border border-gray-100"><Icons.Close /></button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto custom-scrollbar">
                    {/* Role Selector */}
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">Ubah Role</label>
                    <div className="p-1 bg-gray-100 rounded-xl flex gap-1">
                        {['siswa', 'guru', 'pembina', 'admin'].map((roleOption) => (
                            <button
                                key={roleOption}
                                type="button"
                                onClick={() => setForm({...form, role: roleOption})}
                                className={`flex-1 py-2 text-xs font-bold uppercase rounded-lg transition-all ${
                                    form.role === roleOption 
                                    ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-black/5' 
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                {roleOption}
                            </button>
                        ))}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">Nama Lengkap</label>
                            <input type="text" name="name" value={form.name} onChange={handleChange} required placeholder="Nama User" className="w-full border-gray-200 bg-gray-50 focus:bg-white rounded-xl text-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all py-2.5" />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">Nomor Induk</label>
                            <input type="text" name="nomor_induk" value={form.nomor_induk} onChange={handleChange} placeholder="NIS/NIP" className="w-full border-gray-200 bg-gray-50 focus:bg-white rounded-xl text-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all py-2.5" />
                        </div>
                    </div>

                    {form.role === 'siswa' && (
                        <div className="animate-fade-in">
                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">Kelas</label>
                            <input type="text" name="kelas" value={form.kelas} onChange={handleChange} placeholder="Contoh: XII MIPA 1" className="w-full border-gray-200 bg-gray-50 focus:bg-white rounded-xl text-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all py-2.5" />
                        </div>
                    )}

                    {form.role === 'guru' && (
                        <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 animate-fade-in">
                            <label className="block text-[10px] font-bold text-blue-500 uppercase tracking-wide mb-1.5">Ampu Mata Pelajaran</label>
                            <select name="subject_id" value={form.subject_id} onChange={handleChange} className="w-full border-blue-200 bg-white rounded-xl text-sm focus:ring-blue-500 text-blue-900 py-2.5">
                                <option value="">-- Pilih Mapel --</option>
                                {safeSubjects.map(s => <option key={s.id} value={s.id}>{s.nama_mapel}</option>)}
                            </select>
                        </div>
                    )}

                    {form.role === 'pembina' && (
                        <div className="bg-orange-50/50 p-4 rounded-xl border border-orange-100 animate-fade-in">
                            <label className="block text-[10px] font-bold text-orange-500 uppercase tracking-wide mb-1.5">Bina Ekstrakurikuler</label>
                            <select name="extra_id" value={form.extra_id} onChange={handleChange} className="w-full border-orange-200 bg-white rounded-xl text-sm focus:ring-orange-500 text-orange-900 py-2.5">
                                <option value="">-- Pilih Ekskul --</option>
                                {safeExtras.map(e => <option key={e.id} value={e.id}>{e.nama_ekskul}</option>)}
                            </select>
                        </div>
                    )}

                    <div className="border-t border-gray-100 pt-5 mt-2">
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">Email Login</label>
                        <input type="email" name="email" value={form.email} onChange={handleChange} required placeholder="email@sekolah.id" className="w-full border-gray-200 bg-gray-50 focus:bg-white rounded-xl text-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all py-2.5" />
                    </div>

                    <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">{isEdit ? 'Reset Password (Opsional)' : 'Password'}</label>
                        <input type="password" name="password" value={form.password} onChange={handleChange} placeholder={isEdit ? "Isi hanya jika ingin reset..." : "Wajib diisi..."} className="w-full border-gray-200 bg-gray-50 focus:bg-white rounded-xl text-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all py-2.5" />
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-50">
                        <button type="button" onClick={onClose} className="px-5 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-50 transition">Batal</button>
                        <button type="submit" disabled={loading} className="px-6 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-black transition shadow-lg shadow-gray-900/20 flex items-center gap-2">
                            {loading ? '...' : 'Simpan Data'}
                        </button>
                    </div>
                </form>
            </div>
            <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } } .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }`}</style>
        </div>
    );
};

export default function Admin({ auth, users = [], subjects = [], extras = [], stats = { total_user: 0, guru: 0, siswa: 0, pembina: 0 } }) {
    // --- SETUP DATA (Dengan Fallback untuk Preview) ---
    const user = auth?.user || { name: 'Admin Demo' };
    
    // Fallback data dummy jika props kosong (untuk preview)
    const dummyUsers = [
        { id: 1, name: 'Budi Santoso', email: 'budi@sekolah.id', role: 'siswa', kelas: 'XII IPA 1', nomor_induk: '12345' },
        { id: 2, name: 'Siti Aminah', email: 'siti@guru.id', role: 'guru', mapel_ajar: 'Matematika', nomor_induk: '98765' },
        { id: 3, name: 'Pak Joko', email: 'joko@pembina.id', role: 'pembina', ekskul_bina: 'Futsal', nomor_induk: '54321' },
    ];
    
    const dataUsers = Array.isArray(users) && users.length > 0 ? users : dummyUsers;
    const dataStats = stats.total_user ? stats : { total_user: 3, guru: 1, siswa: 1, pembina: 1 };
    
    // --- STATES ---
    const [modalOpen, setModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('all'); // all, guru, siswa, pembina
    const [filterClass, setFilterClass] = useState('all'); // specific class for siswa

    // --- ACTIONS ---
    const openModal = (userToEdit = null) => {
        setEditingUser(userToEdit);
        setModalOpen(true);
    };

    const handleDelete = (id) => {
        if (confirm('Hapus pengguna ini?')) {
             const url = typeof window.route !== 'undefined' ? window.route('admin.deleteUser', id) : '/admin/user/delete/' + id;
             router.delete(url);
        }
    };

    // --- FILTERING LOGIC ---
    // 1. Ambil daftar kelas unik dari user yang role-nya siswa
    const uniqueClasses = useMemo(() => {
        const classes = dataUsers
            .filter(u => u.role === 'siswa' && u.kelas)
            .map(u => u.kelas);
        return [...new Set(classes)].sort();
    }, [dataUsers]);

    // 2. Filter user berdasarkan Search, Role, dan Kelas
    const filteredUsers = dataUsers.filter(u => {
        const matchesSearch = (u.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                              (u.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                              (u.nomor_induk || '').toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesRole = filterRole === 'all' || u.role === filterRole;
        
        // Filter kelas hanya aktif jika role yang dipilih adalah 'siswa' dan kelas tidak 'all'
        const matchesClass = filterRole !== 'siswa' || filterClass === 'all' || u.kelas === filterClass;

        return matchesSearch && matchesRole && matchesClass;
    });

    const getRoleBadge = (role) => {
        switch(role) {
            case 'admin': return <span className="bg-purple-100 text-purple-700 px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase border border-purple-200 tracking-wide shadow-sm">Admin</span>;
            case 'guru': return <span className="bg-blue-100 text-blue-700 px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase border border-blue-200 tracking-wide shadow-sm">Guru</span>;
            case 'pembina': return <span className="bg-orange-100 text-orange-700 px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase border border-orange-200 tracking-wide shadow-sm">Pembina</span>;
            default: return <span className="bg-green-100 text-green-700 px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase border border-green-200 tracking-wide shadow-sm">Siswa</span>;
        }
    };

    const getDetailInfo = (u) => {
        if (u.role === 'siswa') return <span className="text-gray-500 text-xs">Kelas: <strong className="text-gray-900 bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200">{u.kelas || '-'}</strong></span>;
        if (u.role === 'guru') return <span className="text-blue-600 text-xs">Mapel: <strong className="bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">{u.mapel_ajar}</strong></span>;
        if (u.role === 'pembina') return <span className="text-orange-600 text-xs">Ekskul: <strong className="bg-orange-50 px-1.5 py-0.5 rounded border border-orange-100">{u.ekskul_bina}</strong></span>;
        return <span className="text-purple-600 font-bold text-xs bg-purple-50 px-1.5 py-0.5 rounded border border-purple-100">Super User</span>;
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans text-gray-800">
            <Head title="Admin Dashboard" />
            <Navbar user={user} />

            <UserModal 
                isOpen={modalOpen} 
                onClose={() => setModalOpen(false)} 
                user={editingUser}
                subjects={subjects || []}
                extras={extras || []}
            />

            <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-fade-in-up">
                <style>{`@keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } } .animate-fade-in-up { animation: fadeInUp 0.6s ease-out forwards; }`}</style>
                
                {/* 1. STATS CARDS (GRADIENTS) */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                    <StatCard title="Total User" value={dataStats.total_user} colorFrom="from-gray-800" colorTo="to-black" icon={Icons.Users} delay={0} />
                    <StatCard title="Guru Mapel" value={dataStats.guru} colorFrom="from-blue-500" colorTo="to-blue-600" icon={Icons.Edit} delay={0.1} />
                    <StatCard title="Total Siswa" value={dataStats.siswa} colorFrom="from-green-400" colorTo="to-emerald-600" icon={Icons.Shield} delay={0.2} />
                    <StatCard title="Pembina Ekskul" value={dataStats.pembina} colorFrom="from-orange-400" colorTo="to-red-500" icon={Icons.Plus} delay={0.3} />
                </div>

                {/* 2. MAIN CONTENT AREA */}
                <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-200 overflow-hidden">
                    
                    {/* HEADER & FILTER BAR */}
                    <div className="p-6 md:p-8 border-b border-gray-100 bg-gray-50/30">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
                            <div>
                                <h2 className="text-2xl font-black text-gray-800 tracking-tight">Manajemen Pengguna</h2>
                                <p className="text-sm text-gray-500 mt-1">Kelola hak akses dan data seluruh pengguna sistem.</p>
                            </div>
                            <button 
                                onClick={() => openModal(null)} 
                                className="bg-gray-900 hover:bg-black text-white px-5 py-3 rounded-2xl text-sm font-bold flex items-center gap-2 transition-all shadow-xl shadow-gray-900/10 hover:-translate-y-1"
                            >
                                <Icons.Plus /> Tambah Baru
                            </button>
                        </div>

                        {/* ADVANCED FILTER TABS */}
                        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                            
                            {/* Role Tabs */}
                            <div className="flex p-1.5 bg-gray-100 rounded-2xl w-full md:w-auto overflow-x-auto">
                                {['all', 'guru', 'siswa', 'pembina'].map((role) => (
                                    <button
                                        key={role}
                                        onClick={() => { setFilterRole(role); setFilterClass('all'); }} // Reset class filter on role change
                                        className={`px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-wide transition-all ${
                                            filterRole === role 
                                            ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-black/5' 
                                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
                                        }`}
                                    >
                                        {role === 'all' ? 'Semua' : role}
                                    </button>
                                ))}
                            </div>

                            {/* Conditional Class Filter (Only for Siswa) */}
                            {filterRole === 'siswa' && (
                                <div className="animate-fade-in flex items-center gap-2 w-full md:w-auto">
                                    <span className="text-xs font-bold text-gray-400 uppercase">Kelas:</span>
                                    <div className="relative">
                                        <select 
                                            value={filterClass} 
                                            onChange={(e) => setFilterClass(e.target.value)}
                                            className="appearance-none bg-white border border-gray-200 text-gray-700 py-2 pl-4 pr-10 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        >
                                            <option value="all">Semua Kelas</option>
                                            {uniqueClasses.map(cls => <option key={cls} value={cls}>{cls}</option>)}
                                        </select>
                                        <div className="absolute right-3 top-2.5 pointer-events-none text-gray-400"><Icons.Filter /></div>
                                    </div>
                                </div>
                            )}

                            {/* Search Input */}
                            <div className="relative w-full md:w-64">
                                <div className="absolute left-4 top-3 text-gray-400"><Icons.Search /></div>
                                <input 
                                    type="text" 
                                    placeholder="Cari user..." 
                                    value={searchTerm} 
                                    onChange={(e) => setSearchTerm(e.target.value)} 
                                    className="border-gray-200 rounded-2xl text-sm focus:ring-indigo-500 w-full pl-10 py-2.5 bg-white shadow-sm" 
                                />
                            </div>
                        </div>
                    </div>

                    {/* TABLE */}
                    <div className="overflow-x-auto min-h-[400px]">
                        <table className="min-w-full text-left">
                            <thead className="bg-gray-50/50 text-[10px] uppercase text-gray-400 font-extrabold tracking-widest border-b border-gray-100">
                                <tr>
                                    <th className="px-8 py-5">User Profile</th>
                                    <th className="px-6 py-5">Role</th>
                                    <th className="px-6 py-5">Detail Info</th>
                                    <th className="px-8 py-5 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredUsers.length > 0 ? filteredUsers.map((u, i) => (
                                    <tr key={u.id} className="hover:bg-indigo-50/30 transition duration-300 group">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center font-bold text-gray-500 border border-gray-100 shadow-sm group-hover:scale-110 transition-transform duration-300">
                                                    {u.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-gray-800 text-sm group-hover:text-indigo-700 transition-colors">{u.name}</div>
                                                    <div className="text-xs text-gray-400">{u.email}</div>
                                                    <div className="text-[10px] text-gray-300 font-mono mt-1 bg-gray-50 px-1.5 rounded inline-block">ID: {u.nomor_induk || '-'}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            {getRoleBadge(u.role)}
                                        </td>
                                        <td className="px-6 py-5">
                                            {getDetailInfo(u)}
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <div className="flex justify-end gap-2 opacity-50 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0 duration-300">
                                                <button onClick={() => openModal(u)} className="p-2 bg-white border border-gray-200 text-gray-400 hover:text-indigo-600 hover:border-indigo-200 rounded-xl transition shadow-sm hover:shadow-md">
                                                    <Icons.Edit />
                                                </button>
                                                {u.id !== user.id && ( 
                                                    <button onClick={() => handleDelete(u.id)} className="p-2 bg-white border border-gray-200 text-gray-400 hover:text-red-600 hover:border-red-200 rounded-xl transition shadow-sm hover:shadow-md">
                                                        <Icons.Trash />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-20 text-center">
                                            <div className="flex flex-col items-center justify-center text-gray-400 opacity-50">
                                                <Icons.Users />
                                                <p className="text-sm font-bold mt-2">Data tidak ditemukan.</p>
                                                <p className="text-xs">Coba ganti filter atau kata kunci.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-between items-center text-xs text-gray-500 font-medium">
                        <span>Menampilkan {filteredUsers.length} pengguna</span>
                        <span>EduTalent System v1.0</span>
                    </div>
                </div>
            </div>
        </div>
    );
}