import { useState, useMemo, useEffect } from 'react';

// --- [BAGIAN 1] MOCK UNTUK PREVIEW DISINI (HAPUS INI SAAT DI PROJECT ASLI) ---

// ---------------------------------------------------------------------------

import { Head, router, usePage } from '@inertiajs/react';

// --- ICONS (SVG) ---
const Icons = {
    Chart: () => <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>,
    Users: () => <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    Save: () => <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>,
    Check: () => <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
    Star: () => <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-yellow-500 fill-current" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    Print: () => <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>,
    Logout: () => <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
    Close: () => <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    Alert: () => <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
    Edit: () => <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
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
                    <h4 className="font-bold text-gray-800 text-sm">Berhasil Disimpan!</h4>
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

// 2. Animated Number
const AnimatedNumber = ({ value }) => {
    const [displayValue, setDisplayValue] = useState(0);
    useEffect(() => {
        let start = 0;
        const end = parseInt(value, 10);
        if (start === end) return;
        let totalDuration = 1000;
        let incrementTime = (totalDuration / end) * 2; 
        let timer = setInterval(() => {
            start += 1;
            setDisplayValue(start);
            if (start === end) clearInterval(timer);
        }, incrementTime);
        return () => clearInterval(timer);
    }, [value]);
    return <span>{displayValue}</span>;
};

const Navbar = ({ user }) => {
    const handleLogout = (e) => {
        e.preventDefault();
        // Menggunakan path /logout yang standar
        router.post('/logout'); 
    };

    return (
        <nav className="bg-white/90 backdrop-blur-xl border-b border-gray-200 sticky top-0 z-50 print:hidden transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white p-2 rounded-xl font-bold shadow-lg shadow-indigo-500/20 transform hover:scale-105 transition-transform duration-300">
                            ET
                        </div>
                        <div>
                            <span className="font-extrabold text-gray-800 text-lg tracking-tight block leading-none">EduTalent<span className="text-indigo-600">.</span></span>
                            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-[0.2em]">Teacher Portal</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-bold text-gray-800">{user.name}</p>
                            <div className="flex justify-end items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                                <p className="text-[10px] text-gray-500 font-medium bg-gray-100 px-2 py-0.5 rounded-md inline-block">
                                    NIP. {user.nomor_induk || '-'}
                                </p>
                            </div>
                        </div>
                        <div className="h-8 w-px bg-gray-200 mx-1 hidden sm:block"></div>
                        <button onClick={handleLogout} className="group p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-300" title="Logout">
                            <Icons.Logout />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

const StudentRow = ({ student, subjectId, onShowToast, index }) => {
    const [data, setData] = useState({
        student_id: student.id,
        subject_id: subjectId,
        uts: student.uts,
        uas: student.uas,
        catatan: student.catatan
    });
    const [loading, setLoading] = useState(false);
    const [saved, setSaved] = useState(false);
    const [isDirty, setIsDirty] = useState(false); 

    // FIX NYANGKUT: Reset data saat props student/subjectId berubah
    useEffect(() => {
        setData({
            student_id: student.id,
            subject_id: subjectId,
            uts: student.uts || 0,
            uas: student.uas || 0,
            catatan: student.catatan || ''
        });
        setIsDirty(false);
    }, [student, subjectId]);

    const finalScore = Math.round((parseInt(data.uts || 0) + parseInt(data.uas || 0)) / 2);
    
    const getStatusColor = (score) => {
        if (score >= 90) return 'bg-green-100 text-green-700 border-green-200 ring-green-500/20';
        if (score >= 75) return 'bg-blue-100 text-blue-700 border-blue-200 ring-blue-500/20';
        if (score >= 60) return 'bg-yellow-100 text-yellow-700 border-yellow-200 ring-yellow-500/20';
        return 'bg-red-100 text-red-700 border-red-200 ring-red-500/20';
    };

    const handleChange = (e) => {
        let value = e.target.value;
        if (e.target.type === 'number') {
            if (value > 100) value = 100;
            if (value < 0) value = 0;
        }
        setData({ ...data, [e.target.name]: value });
        setSaved(false);
        setIsDirty(true);
    };

    const handleSave = () => {
        setLoading(true);
        // Menggunakan path /grades/update
        const url = typeof route !== 'undefined' ? route('grades.update') : '/grades/update';
        
        router.post(url, data, {
            preserveScroll: true,
            // Only reload 'students' prop to keep it fast
            only: ['students', 'filters'], 
            onSuccess: () => {
                setLoading(false);
                setSaved(true);
                setIsDirty(false);
                onShowToast(`Nilai ${student.name} berhasil diperbarui.`);
                setTimeout(() => setSaved(false), 2000);
            },
            onError: () => setLoading(false)
        });
    };

    return (
        <tr 
            className={`group transition-all duration-500 border-b border-gray-50 last:border-0 ${isDirty ? 'bg-orange-50/60' : 'hover:bg-indigo-50/30'}`}
            style={{ animation: `slideIn 0.4s ease-out forwards ${index * 0.05}s`, opacity: 0, transform: 'translateY(10px)' }}
        >
            <style>{`@keyframes slideIn { to { opacity: 1; transform: translateY(0); } }`}</style>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold text-white shadow-sm transition-all duration-300 ${finalScore >= 90 ? 'bg-gradient-to-br from-yellow-400 to-orange-500 scale-110' : 'bg-gray-300 group-hover:bg-indigo-400'}`}>
                        {student.name.charAt(0)}
                    </div>
                    <div>
                        <div className="text-sm font-bold text-gray-900 group-hover:text-indigo-700 transition-colors flex items-center gap-2">
                            {student.name}
                            {isDirty && <span className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" title="Belum disimpan"></span>}
                        </div>
                        <div className="text-[10px] text-gray-400 font-mono bg-gray-100 px-1.5 py-0.5 rounded inline-block mt-0.5">{student.nis}</div>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4">
                <div className="relative group/input">
                    <input type="number" name="uts" min="0" max="100" value={data.uts} onChange={handleChange} className="w-20 text-center border-gray-200 bg-white rounded-xl shadow-sm focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 text-sm font-bold text-gray-700 transition-all focus:scale-110 focus:-translate-y-1" />
                    <span className="absolute -top-3 right-2 text-[9px] text-gray-400 font-bold opacity-0 group-hover/input:opacity-100 transition-opacity bg-white px-1 shadow-sm rounded-full border border-gray-100">UTS</span>
                </div>
            </td>
            <td className="px-6 py-4">
                <div className="relative group/input">
                    <input type="number" name="uas" min="0" max="100" value={data.uas} onChange={handleChange} className="w-20 text-center border-gray-200 bg-white rounded-xl shadow-sm focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 text-sm font-bold text-gray-700 transition-all focus:scale-110 focus:-translate-y-1" />
                    <span className="absolute -top-3 right-2 text-[9px] text-gray-400 font-bold opacity-0 group-hover/input:opacity-100 transition-opacity bg-white px-1 shadow-sm rounded-full border border-gray-100">UAS</span>
                </div>
            </td>
            <td className="px-6 py-4 text-center">
                <div className={`inline-flex items-center justify-center px-4 py-1.5 rounded-xl text-sm font-extrabold border shadow-sm ring-2 ring-offset-1 transition-all duration-500 ${getStatusColor(finalScore)}`}>
                    <AnimatedNumber value={finalScore} />
                </div>
            </td>
            <td className="px-6 py-4">
                <div className="relative">
                    <input type="text" name="catatan" value={data.catatan} onChange={handleChange} placeholder="Berikan catatan personal..." className="w-full border-gray-200 bg-gray-50 focus:bg-white rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-xs py-2.5 px-3 text-gray-600 placeholder-gray-400 transition-all" />
                    {data.catatan && <span className="absolute right-3 top-2.5 text-indigo-400"><Icons.Edit /></span>}
                </div>
            </td>
            <td className="px-6 py-4 text-right print:hidden">
                <button onClick={handleSave} disabled={loading || (!isDirty && !saved)} className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl shadow-sm focus:outline-none transition-all transform active:scale-95 duration-300 ${loading ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : saved ? 'bg-green-100 text-green-700 border border-green-200' : isDirty ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200 scale-105 ring-2 ring-indigo-200' : 'bg-white border border-gray-200 text-gray-400 hover:bg-gray-50'}`}>
                    {loading ? <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span> : saved ? <>Tersimpan <Icons.Check /></> : <><Icons.Save /> Simpan</>}
                </button>
            </td>
        </tr>
    );
};

const ReportModal = ({ isOpen, onClose, students, subjectName, className }) => {
    if (!isOpen) return null;

    const stats = useMemo(() => {
        if (!students.length) return null;
        let total = 0, countA = 0, countB = 0, countC = 0, countD = 0;
        let atRisk = [];

        students.forEach(s => {
            const uts = parseFloat(s.uts) || 0;
            const uas = parseFloat(s.uas) || 0;
            const avg = (uts + uas) / 2;
            
            total += avg;
            if (avg >= 90) countA++; else if (avg >= 80) countB++; else if (avg >= 70) countC++; else {
                countD++;
                atRisk.push({ name: s.name, score: avg.toFixed(1) });
            }
        });

        return {
            avg: Math.round(total / students.length),
            dist: { A: countA, B: countB, C: countC, D: countD },
            atRisk
        };
    }, [students]);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm transition-opacity duration-300">
            {/* FIX: Modal Size max-w-lg agar lebih kecil */}
            <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in-scale transform transition-all">
                <style>{`@keyframes fadeInScale { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } } .animate-fade-in-scale { animation: fadeInScale 0.3s cubic-bezier(0.16, 1, 0.3, 1); }`}</style>
                <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-gray-50 to-white">
                    <div>
                        <h3 className="text-lg font-bold text-gray-800">Laporan Analisis Kelas</h3>
                        <p className="text-xs text-gray-500 mt-1">Mata Pelajaran: <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">{subjectName}</span></p>
                    </div>
                    <button onClick={onClose} className="p-2 bg-white rounded-full hover:bg-red-50 hover:text-red-500 transition-all shadow-sm text-gray-400 border border-gray-100"><Icons.Close /></button>
                </div>

                <div className="p-5 md:p-6 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-gradient-to-br from-blue-50 to-white rounded-2xl border border-blue-100 text-center shadow-sm">
                            <span className="text-[10px] text-blue-500 font-extrabold uppercase tracking-widest">Rata-Rata Kelas</span>
                            <div className="text-3xl font-black text-blue-600 mt-2 tracking-tight"><AnimatedNumber value={stats?.avg || 0} /></div>
                        </div>
                        <div className="p-4 bg-gradient-to-br from-indigo-50 to-white rounded-2xl border border-indigo-100 text-center shadow-sm">
                            <span className="text-[10px] text-indigo-500 font-extrabold uppercase tracking-widest">Total Siswa</span>
                            <div className="text-3xl font-black text-indigo-600 mt-2 tracking-tight">{students.length}</div>
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-end mb-4">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Distribusi Nilai</h4>
                            <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-1 rounded-full">Berdasarkan Predikat</span>
                        </div>
                        {students.length > 0 ? (
                            <div className="flex items-end gap-3 h-32 border-b border-gray-200 pb-2 px-2">
                                {['A', 'B', 'C', 'D'].map((grade, i) => {
                                    const count = stats.dist[grade];
                                    const percentage = students.length ? (count / students.length) * 100 : 0;
                                    const height = percentage === 0 ? 2 : percentage; 
                                    const color = grade === 'A' ? 'bg-green-500 shadow-green-200' : grade === 'B' ? 'bg-blue-500 shadow-blue-200' : grade === 'C' ? 'bg-yellow-500 shadow-yellow-200' : 'bg-red-500 shadow-red-200';
                                    return (
                                        <div key={grade} className="flex-1 flex flex-col justify-end items-center group relative">
                                            <div className="mb-1 text-xs font-bold text-gray-700 bg-white shadow-sm border border-gray-100 px-1.5 py-0.5 rounded-md transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-10">{count}</div>
                                            <div className={`w-full rounded-t-lg transition-all duration-1000 ease-out shadow-md ${color} opacity-90 group-hover:opacity-100`} style={{ height: `${height}%`, transitionDelay: `${i * 100}ms` }}></div>
                                            <div className="text-[10px] font-bold text-gray-500 mt-2 bg-gray-50 px-2 py-0.5 rounded border border-gray-100">{grade}</div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="h-32 flex items-center justify-center text-gray-400 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">Belum ada data nilai.</div>
                        )}
                    </div>

                    {stats?.atRisk.length > 0 ? (
                        <div className="bg-red-50/50 border border-red-100 rounded-2xl p-4">
                            <div className="flex items-center gap-2 mb-3 text-red-700 font-bold text-xs">
                                <div className="p-1 bg-red-100 rounded-full"><Icons.Alert /></div>
                                <span>Perlu Perhatian Khusus (Nilai &lt; 70)</span>
                            </div>
                            <div className="max-h-24 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                                {stats.atRisk.map((s, idx) => (
                                    <li key={idx} className="flex justify-between items-center text-xs text-red-600 bg-white px-3 py-2 rounded-lg border border-red-50 shadow-sm">
                                        <span className="font-bold text-gray-700">{s.name}</span>
                                        <span className="font-black bg-red-100 text-red-600 px-2 py-0.5 rounded text-[10px]">{s.score}</span>
                                    </li>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-green-50/50 border border-green-100 rounded-2xl p-4 text-center flex flex-col items-center justify-center gap-2">
                            <div className="bg-white p-2 rounded-full text-green-500 shadow-sm border border-green-100"><Icons.Star /></div>
                            <div>
                                <p className="text-green-800 font-bold text-xs">Target Tercapai!</p>
                                <p className="text-green-600 text-[10px] mt-0.5">Semua siswa di atas standar minimal.</p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-4 bg-gray-50/80 border-t border-gray-100 flex justify-end">
                    <button onClick={onClose} className="px-5 py-2 bg-gray-900 text-white font-bold rounded-lg text-xs hover:bg-gray-800 transition-all shadow-md">Tutup</button>
                </div>
            </div>
        </div>
    );
};

export default function Teacher({ auth, subjects, classes, students, filters, homeroom }) {
    // --- MOCK DATA (Untuk Preview & Fallback) ---
    const mockUser = { name: "Pak Heryanto", nomor_induk: "19850101" };
    const mockSubjects = [{ id: 1, nama_mapel: "Matematika (Wajib)" }, { id: 2, nama_mapel: "Matematika (Minat)" }];
    const mockClasses = ["XII MIPA 1", "XII MIPA 2", "XII IPS 1"];
    const mockStudentsMIPA = [
        { id: 1, name: "Budi Santoso", nis: "12345", uts: 85, uas: 90, catatan: "Sangat baik" },
        { id: 2, name: "Siti Aminah", nis: "12346", uts: 70, uas: 75, catatan: "Perlu bimbingan" },
    ];
    const mockStudentsIPS = [
        { id: 3, name: "Reza Rahadian", nis: "12347", uts: 95, uas: 98, catatan: "Luar biasa" },
        { id: 4, name: "Doni Tata", nis: "12348", uts: 60, uas: 65, catatan: "Remedial" },
    ];
    
    // Gunakan props asli jika tersedia
    const user = auth?.user || mockUser;
    const activeSubjects = subjects || mockSubjects;
    const activeClasses = classes || mockClasses;
    // Logika Mock Sederhana untuk Preview: Ganti siswa jika kelas berubah
    // Di mode REAL, 'students' akan otomatis berubah dari server, jadi fallback ini tidak akan terpakai jika data ada.
    const activeStudents = students || (filters?.kelas?.includes('IPS') ? mockStudentsIPS : mockStudentsMIPA);
    const activeFilters = filters || { kelas: "XII MIPA 1", subject_id: 1 };
    const activeHomeroom = homeroom || "XII MIPA 1";
    // -------------------------------------------------------------

    // --- LOCAL STATE UNTUK FILTER (AGAR TIDAK NYANGKUT) ---
    const [selectedClass, setSelectedClass] = useState(activeFilters.kelas);
    const [selectedSubject, setSelectedSubject] = useState(activeFilters.subject_id);
    const [isTableLoading, setIsTableLoading] = useState(false); // State Loading

    useEffect(() => {
        setSelectedClass(activeFilters.kelas);
        setSelectedSubject(activeFilters.subject_id);
    }, [activeFilters]);

    const [isReportOpen, setReportOpen] = useState(false);
    const [toastMsg, setToastMsg] = useState(null);

    const calculateAverage = useMemo(() => {
        if (!activeStudents.length) return 0;
        const total = activeStudents.reduce((acc, curr) => acc + ((parseFloat(curr.uts||0) + parseFloat(curr.uas||0)) / 2), 0);
        return Math.round(total / activeStudents.length);
    }, [activeStudents]);

    const topPerformer = useMemo(() => {
        if (!activeStudents.length) return null;
        return activeStudents.reduce((prev, current) => {
            const prevScore = (parseFloat(prev.uts||0) + parseFloat(prev.uas||0)) / 2;
            const currScore = (parseFloat(current.uts||0) + parseFloat(current.uas||0)) / 2;
            return (prevScore > currScore) ? prev : current;
        });
    }, [activeStudents]);

    // Handle Filter: Update URL + Indikator Loading + Partial Reload
    const handleClassChange = (e) => {
        const newValue = e.target.value;
        setSelectedClass(newValue); 
        const url = typeof route !== 'undefined' ? '/dashboard' : '/dashboard';
        
        router.get(url, 
            { ...activeFilters, kelas: newValue, subject_id: selectedSubject }, 
            { 
                preserveState: true, 
                preserveScroll: true,
                only: ['students', 'filters', 'homeroom'], // PARTIAL RELOAD (Lebih Cepat)
                onStart: () => setIsTableLoading(true),
                onFinish: () => setIsTableLoading(false)
            }
        );
    };

    const handleSubjectChange = (e) => {
        const newValue = e.target.value;
        setSelectedSubject(newValue); 
        const url = typeof route !== 'undefined' ? '/dashboard' : '/dashboard';
        
        router.get(url, 
            { ...activeFilters, kelas: selectedClass, subject_id: newValue }, 
            { 
                preserveState: true, 
                preserveScroll: true,
                only: ['students', 'filters'],
                onStart: () => setIsTableLoading(true),
                onFinish: () => setIsTableLoading(false)
            }
        );
    };

    const handlePrint = () => window.print();

    const showToast = (msg) => {
        setToastMsg(msg);
        setTimeout(() => setToastMsg(null), 3000);
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans text-gray-800">
            <Head title="Dashboard Guru" />
            <Navbar user={user} />

            <Toast message={toastMsg} isVisible={!!toastMsg} onClose={() => setToastMsg(null)} />

            <ReportModal 
                isOpen={isReportOpen} 
                onClose={() => setReportOpen(false)}
                students={activeStudents}
                subjectName={activeSubjects.find(s => s.id == selectedSubject)?.nama_mapel || 'Mapel'}
                className={selectedClass}
            />

            <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-fade-in-up">
                <style>{`@keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } } .animate-fade-in-up { animation: fadeInUp 0.6s ease-out forwards; }`}</style>
                
                {/* 1. HERO SECTION */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 print:hidden">
                    <div className="md:col-span-2 bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-gray-200/50 flex flex-col justify-between relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -mr-16 -mt-16 transition-transform duration-700 group-hover:scale-110"></div>
                        <div className="relative z-10">
                            <h2 className="text-3xl font-black text-gray-800 mb-2">Halo, {user.name.split(' ')[0]}! 👋</h2>
                            <p className="text-gray-500 max-w-md mb-6">Anda memiliki tanggung jawab sebagai <strong>Wali Kelas {homeroom}</strong>. Pastikan data nilai siswa terupdate sebelum tanggal 25.</p>
                            <div className="flex gap-3">
                                <button onClick={() => setReportOpen(true)} className="px-5 py-2.5 bg-gray-900 text-white text-xs font-bold rounded-xl shadow-lg shadow-gray-900/20 hover:-translate-y-0.5 transition-transform flex items-center gap-2 active:scale-95"><Icons.Chart /> Lihat Laporan</button>
                                <button onClick={handlePrint} className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 text-xs font-bold rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2 active:scale-95"><Icons.Print /> Cetak Rekap</button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-xl shadow-blue-500/30 flex flex-col justify-between relative overflow-hidden group">
                        <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/10 rounded-full blur-2xl -ml-10 -mb-10 animate-pulse"></div>
                        <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-500 rounded-full blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-700"></div>
                        <div className="flex justify-between items-start relative z-10">
                            <div>
                                <p className="text-blue-100 text-xs font-bold uppercase tracking-widest mb-1">Rata-Rata Kelas</p>
                                <h3 className="text-4xl font-black tracking-tight"><AnimatedNumber value={calculateAverage} /></h3>
                            </div>
                            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/10 shadow-inner"><Icons.Chart /></div>
                        </div>
                        {topPerformer && (
                            <div className="relative z-10 mt-6 pt-6 border-t border-white/20">
                                <p className="text-blue-100 text-[10px] font-bold uppercase tracking-widest mb-2 flex items-center gap-1"><Icons.Star /> Top Performer</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-white text-blue-600 flex items-center justify-center font-bold text-xs shadow-sm">{topPerformer.name.charAt(0)}</div>
                                    <div>
                                        <p className="font-bold text-sm leading-none">{topPerformer.name}</p>
                                        <p className="text-xs text-blue-200 mt-0.5">Nilai Akhir: {Math.round((parseFloat(topPerformer.uts||0) + parseFloat(topPerformer.uas||0))/2)}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* 2. MAIN WORKSPACE (WITH LOADING STATE) */}
                <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-200 overflow-hidden relative">
                    {/* LOADING OVERLAY */}
                    {isTableLoading && (
                        <div className="absolute inset-0 z-50 bg-white/60 backdrop-blur-sm flex items-center justify-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-100 border-t-indigo-600 shadow-xl"></div>
                        </div>
                    )}

                    <div className="p-6 md:p-8 border-b border-gray-100 bg-gray-50/50 flex flex-col md:flex-row md:items-center justify-between gap-6 print:hidden">
                        <div>
                            <h3 className="text-xl font-bold text-gray-800">Input Nilai Akademik</h3>
                            <p className="text-sm text-gray-500 mt-1">Pilih kelas dan mata pelajaran untuk mulai menilai.</p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="relative">
                                <select value={selectedClass} onChange={handleClassChange} className="appearance-none bg-white border border-gray-200 text-gray-700 py-3 pl-4 pr-10 rounded-xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 shadow-sm w-full md:w-40 transition-all cursor-pointer hover:border-indigo-300">
                                    {classes.map(cls => <option key={cls} value={cls}>{cls}</option>)}
                                </select>
                                <div className="absolute right-3 top-3.5 pointer-events-none text-gray-400"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg></div>
                            </div>

                            <div className="relative">
                                <select value={selectedSubject} onChange={handleSubjectChange} className="appearance-none bg-white border border-gray-200 text-gray-700 py-3 pl-4 pr-10 rounded-xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 shadow-sm w-full md:w-64 transition-all cursor-pointer hover:border-indigo-300">
                                    {subjects.map(sub => <option key={sub.id} value={sub.id}>{sub.nama_mapel}</option>)}
                                </select>
                                <div className="absolute right-3 top-3.5 pointer-events-none text-gray-400"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg></div>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto min-h-[300px]">
                        <table className="min-w-full text-left">
                            <thead>
                                <tr className="bg-white border-b border-gray-100 text-xs uppercase tracking-wider text-gray-400 font-bold">
                                    <th className="px-6 py-4">Informasi Siswa</th>
                                    <th className="px-6 py-4 text-center w-24">UTS (40%)</th>
                                    <th className="px-6 py-4 text-center w-24">UAS (60%)</th>
                                    <th className="px-6 py-4 text-center w-24">Akhir</th>
                                    <th className="px-6 py-4">Catatan Personal</th>
                                    <th className="px-6 py-4 text-right print:hidden">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {students.length > 0 ? (
                                    students.map((student, index) => (
                                        <StudentRow key={student.id} index={index} student={student} subjectId={selectedSubject} onShowToast={showToast} />
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center justify-center text-gray-400">
                                                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-gray-100"><Icons.Users /></div>
                                                <p className="text-sm font-bold text-gray-600">Tidak ada siswa ditemukan.</p>
                                                <p className="text-xs mt-1">Coba pilih kelas lain.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    
                    <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-between items-center print:hidden">
                        <p className="text-xs text-gray-500 font-medium bg-white px-3 py-1 rounded-lg border border-gray-200 shadow-sm">
                            Menampilkan <span className="font-bold text-gray-800">{students.length}</span> siswa di kelas {selectedClass}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}