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
    Logout: () => <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>,
    Shield: () => <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
    Menu: () => <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" x2="21" y1="6" y2="6"/><line x1="3" x2="21" y1="12" y2="12"/><line x1="3" x2="21" y1="18" y2="18"/></svg>,
    Calendar: () => <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    Dashboard: () => <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="7" height="9" x="3" y="3" rx="1" /><rect width="7" height="5" x="14" y="3" rx="1" /><rect width="7" height="9" x="14" y="12" rx="1" /><rect width="7" height="5" x="3" y="16" rx="1" /></svg>,
    Clock: () => <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
    User: () => <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
};

// --- COMPONENTS ---

const Sidebar = ({ activeView, setActiveView, isOpen, setIsOpen }) => {
    const menuItems = [
        { id: 'users', label: 'Management User', icon: Icons.Users },
        { id: 'jadwal', label: 'Management Jadwal', icon: Icons.Calendar },
    ];

    return (
        <>
            {/* Overlay for mobile */}
            <div 
                className={`fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setIsOpen(false)}
            ></div>

            {/* Sidebar Content */}
            <div className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} flex flex-col`}>
                {/* Logo Area */}
                <div className="h-20 flex items-center px-8 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="bg-gray-900 text-white p-2 rounded-xl font-bold shadow-lg">
                            ET
                        </div>
                        <div>
                            <span className="font-black text-gray-800 text-lg tracking-tight block leading-none">EduTalent<span className="text-indigo-600">.</span></span>
                            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-[0.2em]">Control Panel</span>
                        </div>
                    </div>
                </div>

                {/* Menu Items */}
                <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
                    <p className="px-4 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-2">Main Menu</p>
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => { setActiveView(item.id); setIsOpen(false); }}
                            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all duration-200 group ${
                                activeView === item.id
                                ? 'bg-gray-900 text-white shadow-lg shadow-gray-900/20'
                                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                        >
                            <span className={`${activeView === item.id ? 'text-white' : 'text-gray-400 group-hover:text-gray-900'}`}>
                                <item.icon />
                            </span>
                            {item.label}
                            {activeView === item.id && (
                                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>
                            )}
                        </button>
                    ))}
                </div>

                {/* Footer / User Info Small */}
                <div className="p-4 border-t border-gray-100">
                    <div className="bg-gray-50 rounded-2xl p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                            A
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-gray-900 truncate">Administrator</p>
                            <p className="text-xs text-gray-500 truncate">admin@sekolah.id</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

const Navbar = ({ user, onToggleSidebar }) => (
    <nav className="bg-white/80 backdrop-blur-xl border-b border-gray-200 sticky top-0 z-30 transition-all duration-300">
        <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-20">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={onToggleSidebar}
                        className="p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-xl lg:hidden transition-colors"
                    >
                        <Icons.Menu />
                    </button>
                    {/* Breadcrumb / Title */}
                    <div className="hidden sm:block">
                        <h1 className="text-xl font-bold text-gray-800">Dashboard Overview</h1>
                    </div>
                </div>
                
                <div className="flex items-center gap-6">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-gray-800">{user?.name || 'Admin User'}</p>
                        <div className="flex justify-end items-center gap-1.5">
                             <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                             <p className="text-[10px] text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded-md inline-block">Online</p>
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
                <h3 className="text-4xl lg:text-5xl font-black tracking-tighter">{value}</h3>
            </div>
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/10 shadow-inner group-hover:rotate-12 transition-transform duration-300">
                <Icon />
            </div>
        </div>
    </div>
);

// --- MODAL FORM USER ---
const UserModal = ({ isOpen, onClose, user, subjects, extras }) => {
    if (!isOpen) return null;

    const [form, setForm] = useState({
        id: '',
        name: '',
        email: '',
        password: '',
        role: 'siswa',
        nomor_induk: '',
        kelas: '',
        subject_id: '',
        extra_id: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setForm({
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
    }, [user]);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        const url = typeof window.route !== 'undefined' ? window.route('admin.saveUser') : '/admin/user/save';
        
        router.post(url, form, {
            onSuccess: () => { 
                setLoading(false); 
                onClose(); 
            },
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

// --- MODAL FORM JADWAL (BARU) ---
const ScheduleModal = ({ isOpen, onClose, schedule, subjects, extras, instructors }) => {
    if (!isOpen) return null;

    const [form, setForm] = useState({
        id: '',
        day: 'Senin',
        start_time: '07:00',
        end_time: '08:30',
        type: 'mapel',
        subject_id: '',
        extra_id: '',
        class_name: 'XII MIPA 1',
        instructor_id: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setForm({
            id: schedule?.id || '',
            day: schedule?.day || 'Senin',
            start_time: schedule?.start_time ? schedule.start_time.substring(0,5) : '07:00',
            end_time: schedule?.end_time ? schedule.end_time.substring(0,5) : '08:30',
            type: schedule?.type || 'mapel',
            subject_id: schedule?.subject_id || '',
            extra_id: schedule?.extra_id || '',
            class_name: schedule?.class_name || 'XII MIPA 1',
            instructor_id: schedule?.instructor_id || ''
        });
    }, [schedule]);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        // Menggunakan path yang konsisten
        const url = typeof window.route !== 'undefined' ? window.route('admin.saveSchedule') : '/admin/schedule/save';
        router.post(url, form, {
            onSuccess: () => { 
                setLoading(false); 
                onClose(); 
            },
            onError: () => setLoading(false)
        });
    };

    const isEdit = !!schedule;

    // Filter instructor based on role logic if needed, but for simplicity showing all instructors
    // You might want to filter: if type=mapel, show teachers; if type=ekskul, show coaches
    const filteredInstructors = instructors.filter(u => 
        (form.type === 'mapel' && u.role === 'guru') || 
        (form.type === 'ekskul' && (u.role === 'pembina' || u.role === 'guru'))
    );

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-md transition-all duration-300">
            <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in-up border border-gray-100">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-gray-50 to-white">
                    <div>
                        <h3 className="text-xl font-bold text-gray-800">{isEdit ? 'Edit Jadwal' : 'Tambah Jadwal'}</h3>
                        <p className="text-xs text-gray-500 mt-1">Atur jadwal pelajaran atau ekstrakurikuler.</p>
                    </div>
                    <button onClick={onClose} className="p-2 bg-white rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition shadow-sm border border-gray-100"><Icons.Close /></button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto custom-scrollbar">
                    {/* Basic Info */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">Hari</label>
                            <select name="day" value={form.day} onChange={handleChange} className="w-full border-gray-200 bg-white rounded-xl text-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 py-2.5">
                                {['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'].map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">Tipe</label>
                            <select name="type" value={form.type} onChange={handleChange} className="w-full border-gray-200 bg-white rounded-xl text-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 py-2.5">
                                <option value="mapel">Pelajaran</option>
                                <option value="ekskul">Ekstrakurikuler</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">Jam Mulai</label>
                            <input type="time" name="start_time" value={form.start_time} onChange={handleChange} className="w-full border-gray-200 bg-white rounded-xl text-sm py-2.5" />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">Jam Selesai</label>
                            <input type="time" name="end_time" value={form.end_time} onChange={handleChange} className="w-full border-gray-200 bg-white rounded-xl text-sm py-2.5" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">Target Kelas / Peserta</label>
                        <input type="text" name="class_name" value={form.class_name} onChange={handleChange} placeholder="Contoh: XII MIPA 1 atau SEMUA KELAS" className="w-full border-gray-200 bg-gray-50 focus:bg-white rounded-xl text-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all py-2.5" />
                    </div>

                    {form.type === 'mapel' ? (
                        <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 animate-fade-in">
                            <label className="block text-[10px] font-bold text-blue-500 uppercase tracking-wide mb-1.5">Mata Pelajaran</label>
                            <select name="subject_id" value={form.subject_id} onChange={handleChange} className="w-full border-blue-200 bg-white rounded-xl text-sm focus:ring-blue-500 text-blue-900 py-2.5">
                                <option value="">-- Pilih Mapel --</option>
                                {subjects.map(s => <option key={s.id} value={s.id}>{s.nama_mapel}</option>)}
                            </select>
                        </div>
                    ) : (
                        <div className="bg-orange-50/50 p-4 rounded-xl border border-orange-100 animate-fade-in">
                            <label className="block text-[10px] font-bold text-orange-500 uppercase tracking-wide mb-1.5">Ekstrakurikuler</label>
                            <select name="extra_id" value={form.extra_id} onChange={handleChange} className="w-full border-orange-200 bg-white rounded-xl text-sm focus:ring-orange-500 text-orange-900 py-2.5">
                                <option value="">-- Pilih Ekskul --</option>
                                {extras.map(e => <option key={e.id} value={e.id}>{e.nama_ekskul}</option>)}
                            </select>
                        </div>
                    )}

                    <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">Pengajar / Pembina</label>
                        <select name="instructor_id" value={form.instructor_id} onChange={handleChange} required className="w-full border-gray-200 bg-white rounded-xl text-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 py-2.5">
                            <option value="">-- Pilih Pengajar --</option>
                            {filteredInstructors.map(u => (
                                <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-50">
                        <button type="button" onClick={onClose} className="px-5 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-50 transition">Batal</button>
                        <button type="submit" disabled={loading} className="px-6 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-black transition shadow-lg shadow-gray-900/20 flex items-center gap-2">
                            {loading ? '...' : 'Simpan Jadwal'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// --- SUB-PAGES COMPONENTS ---

const UserManagement = ({ user, dataUsers, openModal, handleDelete, filterRole, setFilterRole, filterClass, setFilterClass, uniqueClasses, searchTerm, setSearchTerm, filteredUsers }) => {
    // ... existing UserManagement code ... (No changes needed here, keep as is)
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
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-200 overflow-hidden animate-fade-in-up">
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
                <div className="flex flex-col xl:flex-row gap-4 items-center justify-between">
                    
                    {/* Role Tabs */}
                    <div className="flex p-1.5 bg-gray-100 rounded-2xl w-full xl:w-auto overflow-x-auto">
                        {['all', 'guru', 'siswa', 'pembina'].map((role) => (
                            <button
                                key={role}
                                onClick={() => { setFilterRole(role); setFilterClass('all'); }} // Reset class filter on role change
                                className={`px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-wide transition-all whitespace-nowrap ${
                                    filterRole === role 
                                    ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-black/5' 
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
                                }`}
                            >
                                {role === 'all' ? 'Semua' : role}
                            </button>
                        ))}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto">
                        {/* Conditional Class Filter (Only for Siswa) */}
                        {filterRole === 'siswa' && (
                            <div className="animate-fade-in flex items-center gap-2 w-full sm:w-auto">
                                <span className="text-xs font-bold text-gray-400 uppercase hidden sm:block">Kelas:</span>
                                <div className="relative w-full sm:w-auto">
                                    <select 
                                        value={filterClass} 
                                        onChange={(e) => setFilterClass(e.target.value)}
                                        className="appearance-none w-full bg-white border border-gray-200 text-gray-700 py-2.5 pl-4 pr-10 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    >
                                        <option value="all">Semua Kelas</option>
                                        {uniqueClasses.map(cls => <option key={cls} value={cls}>{cls}</option>)}
                                    </select>
                                    <div className="absolute right-3 top-3 pointer-events-none text-gray-400"><Icons.Filter /></div>
                                </div>
                            </div>
                        )}

                        {/* Search Input */}
                        <div className="relative w-full sm:w-64">
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
    );
};

const JadwalManagement = ({ schedules, onAdd, onEdit, onDelete }) => {
    // State untuk Tab Hari
    const today = new Date().toLocaleDateString('id-ID', { weekday: 'long' });
    const initialDay = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'].includes(today) ? today : 'Senin';
    const [activeDay, setActiveDay] = useState(initialDay);
    const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'];

    // Filter jadwal berdasarkan hari yang dipilih & urutkan
    const daySchedules = (schedules || [])
        .filter(s => s.day === activeDay)
        .sort((a, b) => a.start_time.localeCompare(b.start_time));

    return (
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-200 overflow-hidden animate-fade-in-up h-[600px] flex flex-col">
             <div className="p-6 md:p-8 border-b border-gray-100 bg-gray-50/30">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h2 className="text-2xl font-black text-gray-800 tracking-tight">Manajemen Jadwal</h2>
                        <p className="text-sm text-gray-500 mt-1">Atur jadwal pelajaran dan kegiatan ekstrakurikuler.</p>
                    </div>
                    {/* BUTTON BUAT JADWAL DENGAN ACTION */}
                    <button 
                        onClick={() => onAdd()}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-2xl text-sm font-bold flex items-center gap-2 transition-all shadow-xl shadow-indigo-600/20 hover:-translate-y-1"
                    >
                        <Icons.Plus /> Buat Jadwal
                    </button>
                </div>
            </div>

            <div className="flex-1 p-6 md:p-8 overflow-hidden flex flex-col">
                {/* Day Tabs */}
                <div className="flex p-1 bg-gray-100 rounded-xl mb-6 overflow-x-auto custom-scrollbar shrink-0">
                    {days.map(day => (
                        <button
                            key={day}
                            onClick={() => setActiveDay(day)}
                            className={`flex-1 px-4 py-2.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                                activeDay === day 
                                ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-black/5' 
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            {day}
                        </button>
                    ))}
                </div>

                {/* List Jadwal */}
                <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-2">
                    {daySchedules.length > 0 ? (
                        daySchedules.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:bg-white hover:border-indigo-100 hover:shadow-md transition-all group">
                                <div className="flex flex-col items-center justify-center w-14 h-14 bg-white rounded-xl border border-gray-200 text-gray-600 text-xs font-bold group-hover:border-indigo-200 group-hover:text-indigo-600 transition-colors shadow-sm shrink-0">
                                    <span>{item.start_time.substring(0, 5)}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                                            item.type === 'mapel' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
                                        }`}>
                                            {item.type === 'mapel' ? 'Pelajaran' : 'Ekskul'}
                                        </span>
                                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">• {item.class_name}</span>
                                    </div>
                                    <h3 className="text-sm font-bold text-gray-800 truncate">{item.subject ? item.subject.nama_mapel : (item.extra ? item.extra.nama_ekskul : '-')}</h3>
                                    <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                                        <Icons.Users /> {item.instructor ? item.instructor.name : 'Belum ditentukan'}
                                    </p>
                                </div>
                                {/* BUTTON ACTIONS JADWAL */}
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                        onClick={() => onEdit(item)}
                                        className="p-2 text-gray-400 hover:text-indigo-600 bg-white rounded-lg border border-gray-200 hover:border-indigo-200 shadow-sm"
                                    >
                                        <Icons.Edit />
                                    </button>
                                    <button 
                                        onClick={() => onDelete(item.id)}
                                        className="p-2 text-gray-400 hover:text-red-600 bg-white rounded-lg border border-gray-200 hover:border-red-200 shadow-sm"
                                    >
                                        <Icons.Trash />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center h-48 text-gray-400 border-2 border-dashed border-gray-100 rounded-2xl">
                            <Icons.Calendar />
                            <p className="text-sm font-bold mt-2">Tidak ada jadwal.</p>
                            <p className="text-xs">Pilih hari lain atau tambahkan jadwal baru.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

// --- MAIN LAYOUT COMPONENT ---

export default function Admin({ auth, users = [], subjects = [], extras = [], stats = { total_user: 0, guru: 0, siswa: 0, pembina: 0 }, schedules = [] }) {
    const user = auth?.user || { id: 999, name: 'Admin Demo', email: 'admin@demo.com' };
    
    // Fallback data
    const dummyUsers = [
        { id: 1, name: 'Budi Santoso', email: 'budi@sekolah.id', role: 'siswa', kelas: 'XII IPA 1', nomor_induk: '12345' },
        { id: 2, name: 'Siti Aminah', email: 'siti@guru.id', role: 'guru', mapel_ajar: 'Matematika', nomor_induk: '98765' },
        { id: 3, name: 'Pak Joko', email: 'joko@pembina.id', role: 'pembina', ekskul_bina: 'Futsal', nomor_induk: '54321' },
    ];
    
    const dataUsers = Array.isArray(users) && users.length > 0 ? users : dummyUsers;
    const dataStats = stats.total_user ? stats : { total_user: 3, guru: 1, siswa: 1, pembina: 1 };
    
    // --- STATES ---
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeView, setActiveView] = useState('users'); // 'users' or 'jadwal'
    
    // User Modal States
    const [modalOpen, setModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    
    // Schedule Modal States
    const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
    const [editingSchedule, setEditingSchedule] = useState(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('all');
    const [filterClass, setFilterClass] = useState('all');

    // --- USER ACTIONS ---
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

    // --- SCHEDULE ACTIONS (BARU) ---
    const openScheduleModal = (scheduleToEdit = null) => {
        setEditingSchedule(scheduleToEdit);
        setScheduleModalOpen(true);
    };

    const handleDeleteSchedule = (id) => {
        if (confirm('Hapus jadwal ini?')) {
             const url = typeof window.route !== 'undefined' ? window.route('admin.deleteSchedule', id) : '/admin/schedule/delete/' + id;
             router.delete(url);
        }
    };

    // Filter Instructors (Guru & Pembina) for Schedule Modal
    const instructors = dataUsers.filter(u => u.role === 'guru' || u.role === 'pembina');

    // --- FILTER LOGIC ---
    const uniqueClasses = useMemo(() => {
        const classes = dataUsers
            .filter(u => u.role === 'siswa' && u.kelas)
            .map(u => u.kelas);
        return [...new Set(classes)].sort();
    }, [dataUsers]);

    const filteredUsers = dataUsers.filter(u => {
        const matchesSearch = (u.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                              (u.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                              (u.nomor_induk || '').toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesRole = filterRole === 'all' || u.role === filterRole;
        const matchesClass = filterRole !== 'siswa' || filterClass === 'all' || u.kelas === filterClass;

        return matchesSearch && matchesRole && matchesClass;
    });

    return (
        <div className="flex h-screen bg-[#F8FAFC] font-sans text-gray-800 overflow-hidden">
            <Head title="Admin Dashboard" />
            
            {/* Sidebar Component */}
            <Sidebar 
                activeView={activeView} 
                setActiveView={setActiveView} 
                isOpen={sidebarOpen}
                setIsOpen={setSidebarOpen}
            />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <Navbar user={user} onToggleSidebar={() => setSidebarOpen(true)} />

                {/* MODAL USER */}
                <UserModal 
                    isOpen={modalOpen} 
                    onClose={() => setModalOpen(false)} 
                    user={editingUser}
                    subjects={subjects || []}
                    extras={extras || []}
                />

                {/* MODAL JADWAL (BARU) */}
                <ScheduleModal
                    isOpen={scheduleModalOpen}
                    onClose={() => setScheduleModalOpen(false)}
                    schedule={editingSchedule}
                    subjects={subjects || []}
                    extras={extras || []}
                    instructors={instructors}
                />

                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#F8FAFC] p-4 sm:p-6 lg:p-8">
                    
                    {/* Common Stats (Show on both pages or only dashboard? Showing on both for now) */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
                        <StatCard title="Total User" value={dataStats.total_user} colorFrom="from-gray-800" colorTo="to-black" icon={Icons.Users} delay={0} />
                        <StatCard title="Guru Mapel" value={dataStats.guru} colorFrom="from-blue-500" colorTo="to-blue-600" icon={Icons.Edit} delay={0.1} />
                        <StatCard title="Total Siswa" value={dataStats.siswa} colorFrom="from-green-400" colorTo="to-emerald-600" icon={Icons.Shield} delay={0.2} />
                        <StatCard title="Pembina Ekskul" value={dataStats.pembina} colorFrom="from-orange-400" colorTo="to-red-500" icon={Icons.Plus} delay={0.3} />
                    </div>

                    {/* View Switcher */}
                    {activeView === 'users' ? (
                        <UserManagement 
                            user={user}
                            dataUsers={dataUsers}
                            openModal={openModal}
                            handleDelete={handleDelete}
                            filterRole={filterRole}
                            setFilterRole={setFilterRole}
                            filterClass={filterClass}
                            setFilterClass={setFilterClass}
                            uniqueClasses={uniqueClasses}
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            filteredUsers={filteredUsers}
                        />
                    ) : (
                        <JadwalManagement 
                            schedules={schedules} 
                            onAdd={() => openScheduleModal(null)}
                            onEdit={openScheduleModal}
                            onDelete={handleDeleteSchedule}
                        />
                    )}
                    
                </main>
            </div>
            <style>{`@keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } } .animate-fade-in-up { animation: fadeInUp 0.6s ease-out forwards; }`}</style>
        </div>
    );
}