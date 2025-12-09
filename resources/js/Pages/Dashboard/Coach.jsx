import { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';

// --- ICONS ---
const Icons = {
    Trophy: () => <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2h-9.3a2 2 0 0 0-1.68.9L4 8h16l-3.02-5.1A2 2 0 0 0 15.3 2Z"/></svg>,
    Save: () => <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>,
    Users: () => <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    Check: () => <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>,
    Logout: () => <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
    Plus: () => <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    Close: () => <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    Trash: () => <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>,
};

// --- COMPONENTS ---

// 1. Toast Notification
const Toast = ({ message, isVisible, onClose }) => {
    if (!isVisible) return null;
    return (
        <div className="fixed top-5 right-5 z-[110] animate-bounce-in">
            <div className="bg-white border-l-4 border-green-500 shadow-2xl rounded-xl p-4 flex items-center gap-3 pr-10 relative overflow-hidden">
                <div className="text-green-500 bg-green-50 p-2 rounded-full ring-2 ring-green-100"><Icons.Check /></div>
                <div>
                    <h4 className="font-bold text-gray-800 text-sm">Berhasil!</h4>
                    <p className="text-xs text-gray-500 mt-0.5">{message}</p>
                </div>
                <button onClick={onClose} className="absolute top-2 right-2 text-gray-300 hover:text-gray-500 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
                <div className="absolute bottom-0 left-0 h-1 bg-green-500 w-full animate-shrink-width"></div>
            </div>
            <style>{`
                @keyframes bounce-in { 0% { transform: translateX(100%); opacity: 0; } 60% { transform: translateX(-10px); opacity: 1; } 100% { transform: translateX(0); } }
                @keyframes shrink-width { from { width: 100%; } to { width: 0%; } }
                .animate-bounce-in { animation: bounce-in 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55); }
                .animate-shrink-width { animation: shrink-width 3s linear forwards; }
            `}</style>
        </div>
    );
};

const Navbar = ({ user, extraName }) => {
    const handleLogout = (e) => {
        e.preventDefault();
        router.post(typeof window !== 'undefined' && window.route ? window.route('logout') : '/logout');
    };

    return (
        <nav className="bg-white/90 backdrop-blur-md border-b border-orange-100 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-2 rounded-xl font-bold shadow-lg shadow-orange-500/20">
                            ET
                        </div>
                        <div>
                            <span className="font-extrabold text-gray-800 text-lg tracking-tight block leading-none">EduTalent</span>
                            <span className="text-[10px] text-orange-500 font-bold uppercase tracking-[0.2em]">Coach Portal • {extraName}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-bold text-gray-800">{user.name}</p>
                            <p className="text-[10px] text-gray-400 font-bold uppercase">Pembina</p>
                        </div>
                        <button 
                            onClick={handleLogout}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                            title="Logout"
                        >
                            <Icons.Logout />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

// Modal Tambah Anggota Baru
const AddMemberModal = ({ isOpen, onClose, availableStudents, extraId, onShowToast }) => {
    const [selectedStudent, setSelectedStudent] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedStudent) return;

        setLoading(true);
        
        const url = typeof window !== 'undefined' && window.route ? window.route('talent.update') : '/talent/update';
        router.post(url, {
            student_id: selectedStudent,
            extra_id: extraId,
            nilai_teknis: 0, // Nilai awal 0
            observasi: 'Anggota baru.',
            rekomendasi: 'Perlu adaptasi.'
        }, {
            onSuccess: () => {
                setLoading(false);
                onClose();
                setSelectedStudent('');
                onShowToast("Anggota berhasil ditambahkan!");
            },
            onError: () => setLoading(false)
        });
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm transition-opacity">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
                <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-orange-50">
                    <h3 className="font-bold text-gray-800">Tambah Anggota Baru</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-red-500"><Icons.Close /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Siswa</label>
                        <select 
                            className="w-full border-gray-300 rounded-xl shadow-sm focus:ring-orange-500 focus:border-orange-500 text-sm"
                            value={selectedStudent}
                            onChange={(e) => setSelectedStudent(e.target.value)}
                            required
                        >
                            <option value="">-- Pilih Siswa --</option>
                            {availableStudents.map(s => (
                                <option key={s.id} value={s.id}>{s.name} ({s.kelas})</option>
                            ))}
                        </select>
                        <p className="text-xs text-gray-400 mt-2">Hanya menampilkan siswa yang belum terdaftar di ekskul ini.</p>
                    </div>
                    <div className="flex justify-end pt-2">
                        <button 
                            type="submit" 
                            disabled={loading || !selectedStudent}
                            className={`px-5 py-2.5 bg-orange-500 text-white text-sm font-bold rounded-xl hover:bg-orange-600 transition shadow-lg shadow-orange-500/30 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {loading ? 'Menyimpan...' : '+ Tambahkan'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const StudentCard = ({ student, extraId, onShowToast, onDelete }) => {
    const [data, setData] = useState({
        student_id: student.id,
        extra_id: extraId,
        nilai_teknis: student.nilai_teknis || 0,
        observasi: student.observasi || '',
        rekomendasi: student.rekomendasi || 'Perlu Latihan'
    });
    const [loading, setLoading] = useState(false);
    const [saved, setSaved] = useState(false);
    const [isDirty, setIsDirty] = useState(false);

    // Sync props changes
    useEffect(() => {
        setData({
            student_id: student.id,
            extra_id: extraId,
            nilai_teknis: student.nilai_teknis || 0,
            observasi: student.observasi || '',
            rekomendasi: student.rekomendasi || 'Perlu Latihan'
        });
        setIsDirty(false);
    }, [student, extraId]);

    const handleChange = (key, val) => {
        let value = val;
        if (key === 'nilai_teknis') {
             if (value > 100) value = 100;
             if (value < 0) value = 0;
        }
        setData({ ...data, [key]: value });
        setSaved(false);
        setIsDirty(true);
    };

    const handleSave = () => {
        setLoading(true);
        const url = typeof window !== 'undefined' && window.route ? window.route('talent.update') : '/talent/update';
        router.post(url, data, {
            preserveScroll: true,
            onSuccess: () => {
                setLoading(false);
                setSaved(true);
                setIsDirty(false);
                onShowToast(`Data ${student.name} berhasil disimpan!`);
                setTimeout(() => setSaved(false), 2000);
            },
            onError: () => setLoading(false)
        });
    };

    return (
        <div className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden group ${isDirty ? 'border-orange-300 shadow-lg shadow-orange-100' : 'border-gray-100 shadow-sm hover:shadow-lg'}`}>
            {/* Header Siswa */}
            <div className="p-5 bg-gradient-to-br from-gray-50 to-white border-b border-gray-100 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white font-bold shadow-sm">
                        {student.name.charAt(0)}
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-800 text-sm">{student.name}</h3>
                        <p className="text-[10px] text-gray-500 font-mono bg-gray-200 px-1.5 py-0.5 rounded inline-block">{student.kelas}</p>
                    </div>
                </div>
                <div className="text-right relative group/score">
                    <span className="text-[9px] uppercase tracking-widest text-gray-400 font-bold block mb-1">Skor</span>
                    <input 
                        type="number" 
                        min="0" max="100"
                        value={data.nilai_teknis}
                        onChange={(e) => handleChange('nilai_teknis', e.target.value)}
                        className="w-16 text-center font-black text-2xl bg-transparent border-b-2 border-dashed border-orange-200 focus:border-orange-500 focus:ring-0 p-0 text-orange-600 transition-all"
                    />
                </div>
            </div>

            {/* Form Body */}
            <div className="p-5 space-y-4">
                <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1.5 block">Observasi Bakat</label>
                    <textarea 
                        rows="2"
                        value={data.observasi}
                        onChange={(e) => handleChange('observasi', e.target.value)}
                        placeholder="Catatan perkembangan..."
                        className="w-full text-sm border-gray-200 bg-gray-50/50 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none transition-all"
                    ></textarea>
                </div>

                <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1.5 block">Rekomendasi</label>
                    <select 
                        value={data.rekomendasi}
                        onChange={(e) => handleChange('rekomendasi', e.target.value)}
                        className="w-full text-sm border-gray-200 bg-white rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 cursor-pointer py-2"
                    >
                        <option value="Perlu Latihan">Perlu Latihan Dasar</option>
                        <option value="Kompeten">Kompeten (Tim Cadangan)</option>
                        <option value="Siap Lomba">Siap Kompetisi (Tim Inti)</option>
                        <option value="Potensi Profesional">Potensi Karir Profesional</option>
                    </select>
                </div>
            </div>

            {/* Footer Action */}
            <div className="p-4 border-t border-gray-50 bg-gray-50/30 flex justify-between items-center">
                <button 
                    type="button"
                    onClick={() => onDelete(student.id)}
                    className="flex items-center gap-1 px-3 py-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg text-xs font-bold transition-colors"
                    title="Keluarkan dari Ekskul"
                >
                    <Icons.Trash /> Hapus
                </button>

                <button 
                    onClick={handleSave}
                    disabled={loading || (!isDirty && !saved)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs transition-all transform active:scale-95 ${
                        loading ? 'bg-gray-200 text-gray-400 cursor-not-allowed' :
                        saved ? 'bg-green-100 text-green-700 border border-green-200' : 
                        isDirty ? 'bg-orange-600 text-white shadow-lg shadow-orange-200' :
                        'bg-white border border-gray-200 text-gray-400 hover:bg-gray-100'
                    }`}
                >
                    {loading ? '...' : saved ? <><Icons.Check /> Tersimpan</> : <><Icons.Save /> Simpan</>}
                </button>
            </div>
        </div>
    );
};

export default function Coach({ auth, extra, students, availableStudents, stats }) {
    // Fallback data jika props belum terload
    const user = auth?.user || { name: "Coach" };
    const activeExtra = extra || { id: 0, nama_ekskul: "Ekskul" };
    const activeStudents = students || [];
    const activeAvailable = availableStudents || [];
    const activeStats = stats || { total: 0, avg: 0, top: '-' };

    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [toastMsg, setToastMsg] = useState(null);

    const showToast = (msg) => {
        setToastMsg(msg);
        setTimeout(() => setToastMsg(null), 3000);
    };

    const handleRemoveStudent = (studentId) => {
        if(confirm('Apakah Anda yakin ingin mengeluarkan siswa ini dari ekskul?')) {
            const url = typeof window !== 'undefined' && window.route ? window.route('pembina.removeStudent', studentId) : `/pembina/student/remove/${studentId}`;
            router.delete(url, {
                onSuccess: () => showToast('Siswa berhasil dikeluarkan dari ekskul.'),
                preserveScroll: true
            });
        }
    };

    return (
        <div className="min-h-screen bg-[#FFF8F4] font-sans text-gray-800">
            <Head title="Dashboard Pembina" />
            <Navbar user={user} extraName={activeExtra.nama_ekskul} />
            
            <Toast message={toastMsg} isVisible={!!toastMsg} onClose={() => setToastMsg(null)} />

            <AddMemberModal 
                isOpen={isAddModalOpen} 
                onClose={() => setAddModalOpen(false)}
                availableStudents={activeAvailable}
                extraId={activeExtra.id}
                onShowToast={showToast}
            />

            <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-fade-in-up">
                <style>{`@keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } } .animate-fade-in-up { animation: fadeInUp 0.6s ease-out forwards; }`}</style>
                
                {/* STATS HEADER */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Main Card */}
                    <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-3xl p-8 text-white shadow-xl shadow-orange-500/20 flex flex-col justify-between relative overflow-hidden md:col-span-1 group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-8 -mt-8 transition-transform duration-700 group-hover:scale-110"></div>
                        <div className="relative z-10">
                            <p className="text-orange-100 text-xs font-bold uppercase tracking-widest mb-1">Rata-Rata Tim</p>
                            <h2 className="text-5xl font-black tracking-tighter mb-4">{activeStats.avg}</h2>
                            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-medium">
                                <Icons.Trophy /> Top: {activeStats.top}
                            </div>
                        </div>
                    </div>

                    {/* Info Card */}
                    <div className="bg-white rounded-3xl p-8 border border-orange-100 shadow-sm flex flex-col justify-center md:col-span-2 relative overflow-hidden">
                         <div className="absolute right-0 bottom-0 opacity-5 transform translate-x-10 translate-y-10">
                            <svg width="200" height="200" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
                         </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2 relative z-10">Selamat Bertugas, Coach! 🏀</h3>
                        <p className="text-gray-500 leading-relaxed relative z-10 max-w-lg">
                            Pantau perkembangan atlet secara berkala. Data observasi bakat sangat penting untuk menentukan jenjang karir siswa di masa depan.
                        </p>
                        <div className="mt-6 flex items-center gap-8 relative z-10">
                            <div>
                                <span className="block text-3xl font-black text-gray-900">{activeStats.total}</span>
                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Anggota Aktif</span>
                            </div>
                            <div className="h-10 w-px bg-gray-100"></div>
                            <div>
                                <button 
                                    onClick={() => setAddModalOpen(true)}
                                    className="flex items-center gap-2 px-5 py-3 bg-orange-50 text-orange-600 font-bold rounded-xl hover:bg-orange-100 transition-colors text-sm"
                                >
                                    <Icons.Plus /> Tambah Anggota
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* STUDENTS GRID */}
                <div>
                    <div className="flex items-center justify-between mb-6 px-2">
                        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                            <Icons.Users /> Daftar Anggota
                        </h3>
                        <div className="text-xs text-gray-500 font-medium bg-white px-3 py-1 rounded-lg border border-gray-200 shadow-sm">
                            Menampilkan {activeStudents.length} siswa
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {activeStudents.length > 0 ? (
                            activeStudents.map((student) => (
                                <StudentCard 
                                    key={student.id} 
                                    student={student} 
                                    extraId={activeExtra.id} 
                                    onShowToast={showToast}
                                    onDelete={handleRemoveStudent}
                                />
                            ))
                        ) : (
                            <div className="col-span-full py-16 text-center text-gray-400 bg-white rounded-[2rem] border-2 border-dashed border-gray-200">
                                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Icons.Users />
                                </div>
                                <p className="font-bold">Belum ada anggota tim.</p>
                                <p className="text-sm mt-1">Klik tombol "Tambah Anggota" untuk memulai.</p>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}