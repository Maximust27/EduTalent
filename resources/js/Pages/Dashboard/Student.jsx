import { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';

// --- ICONS (SVG) ---
const Icons = {
    Trend: () => <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>,
    Trophy: () => <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2h-9.3a2 2 0 0 0-1.68.9L4 8h16l-3.02-5.1A2 2 0 0 0 15.3 2Z"/></svg>,
    Brain: () => <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/></svg>,
    Calendar: () => <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    ArrowRight: () => <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
    Star: () => <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    Home: () => <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>,
    Logout: () => <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
};

// --- COMPONENTS ---

// Navbar Kustom (Langsung di dalam file ini agar tombol Logout & Home terlihat jelas)
const CustomNavbar = ({ user }) => {
    const handleLogout = (e) => {
        e.preventDefault();
        router.post(route('logout')); // Memanggil route logout Laravel
    };

    return (
        <nav className="bg-white/70 backdrop-blur-lg border-b border-white/20 sticky top-0 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white p-2 rounded-xl font-extrabold shadow-lg shadow-indigo-500/20">ET</div>
                        <span className="font-bold text-gray-800 text-lg tracking-tight hidden sm:block">EduTalent</span>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* Tombol Home */}
                        <Link href="/" className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all" title="Ke Landing Page">
                            <Icons.Home />
                        </Link>
                        
                        <div className="h-6 w-px bg-gray-200 mx-1"></div>

                        {/* Profil User */}
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-bold text-gray-800 leading-none">{user?.name}</p>
                            <p className="text-[10px] uppercase tracking-wider text-indigo-500 font-bold mt-1">{user?.kelas}</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 p-[2px] shadow-md">
                            <div className="w-full h-full bg-white rounded-full flex items-center justify-center font-bold text-indigo-600 text-sm">
                                {user?.name?.charAt(0)}
                            </div>
                        </div>

                        {/* Tombol Logout */}
                        <button 
                            onClick={handleLogout} 
                            className="ml-2 p-2 text-red-500 hover:text-white hover:bg-red-500 rounded-full transition-all" 
                            title="Keluar / Logout"
                        >
                            <Icons.Logout />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

const WelcomeCard = ({ user }) => {
    const [greeting, setGreeting] = useState('Halo');
    
    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 11) setGreeting('Selamat Pagi');
        else if (hour < 15) setGreeting('Selamat Siang');
        else if (hour < 19) setGreeting('Selamat Sore');
        else setGreeting('Selamat Malam');
    }, []);

    return (
        <div className="col-span-1 md:col-span-3 bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-xl shadow-indigo-500/20 group">
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/30 rounded-full blur-3xl -ml-20 -mb-20 animate-pulse"></div>

            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold tracking-wide border border-white/10 flex items-center gap-2">
                             <Icons.Calendar /> Semester Ganjil
                        </span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black mb-2 tracking-tight">
                        {greeting}, <span className="text-yellow-300">{user.name.split(' ')[0]}</span>!
                    </h1>
                    <p className="text-indigo-100 max-w-xl text-lg leading-relaxed font-medium">
                        Laporan mingguanmu sudah siap. Cek nilai <span className="font-bold text-white border-b-2 border-yellow-400">UTS & UAS</span> terbaru kamu di bawah ini.
                    </p>
                </div>
                
                <div className="flex gap-3">
                    <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/20 text-center">
                        <span className="block text-[10px] uppercase tracking-widest text-indigo-200 font-bold mb-1">Rata-Rata</span>
                        <span className="text-3xl font-black tracking-tight">87.5</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const AcademicCard = ({ academics }) => (
    <div className="col-span-1 md:col-span-2 bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 hover:border-indigo-100 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/5">
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                    <Icons.Trend />
                </div>
                <div>
                    <h2 className="font-bold text-2xl text-gray-800 tracking-tight">Akademik</h2>
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Rincian Nilai Ujian</p>
                </div>
            </div>
        </div>

        <div className="space-y-4">
            {/* Header Tabel Mini */}
            <div className="grid grid-cols-12 text-xs font-bold text-gray-400 uppercase tracking-wider px-4 pb-2 border-b border-gray-100">
                <div className="col-span-5">Mata Pelajaran</div>
                <div className="col-span-2 text-center">UTS</div>
                <div className="col-span-2 text-center">UAS</div>
                <div className="col-span-3 text-right">Akhir</div>
            </div>

            {academics.map((item, idx) => (
                <div key={idx} className="group p-4 rounded-2xl bg-gray-50 hover:bg-white border border-transparent hover:border-gray-100 hover:shadow-lg hover:shadow-gray-200/50 transition-all duration-300">
                    <div className="grid grid-cols-12 items-center">
                        {/* Mapel & Catatan */}
                        <div className="col-span-5">
                            <div className="font-bold text-gray-700 group-hover:text-indigo-700 transition-colors text-base">{item.mapel}</div>
                            <p className="text-[10px] text-gray-400 italic mt-1 line-clamp-1">"{item.catatan}"</p>
                        </div>

                        {/* Nilai UTS */}
                        <div className="col-span-2 text-center">
                            <span className="text-sm font-bold text-gray-600 bg-white border border-gray-200 px-2 py-1 rounded-lg">
                                {item.uts || '-'}
                            </span>
                        </div>

                        {/* Nilai UAS */}
                        <div className="col-span-2 text-center">
                            <span className="text-sm font-bold text-gray-600 bg-white border border-gray-200 px-2 py-1 rounded-lg">
                                {item.uas || '-'}
                            </span>
                        </div>

                        {/* Nilai Akhir (Highlight) */}
                        <div className="col-span-3 text-right flex justify-end">
                            <span className={`text-sm font-extrabold px-3 py-1.5 rounded-xl shadow-sm ${
                                item.nilai >= 90 ? 'bg-green-100 text-green-700' : 
                                item.nilai >= 80 ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'
                            }`}>
                                {item.nilai}
                            </span>
                        </div>
                    </div>
                    
                    {/* Animated Bar (Visualisasi Nilai Akhir) */}
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-3 overflow-hidden opacity-50 group-hover:opacity-100 transition-opacity">
                        <div 
                            className={`h-full rounded-full transition-all duration-1000 ease-out ${
                                item.nilai >= 90 ? 'bg-green-500' : item.nilai >= 80 ? 'bg-blue-500' : 'bg-yellow-500'
                            }`}
                            style={{ width: `${item.nilai}%` }}
                        >
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const AnalysisCard = ({ analysis }) => (
    <div className="col-span-1 bg-[#111827] text-white rounded-[2rem] p-1 shadow-2xl shadow-gray-900/20 relative group h-full">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 rounded-[2rem] opacity-50 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
        <div className="relative h-full bg-[#111827] rounded-[1.9rem] p-8 flex flex-col">
            
            <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-white/5 rounded-2xl backdrop-blur-md border border-white/10 shadow-inner group-hover:scale-110 transition-transform duration-300">
                    <Icons.Brain />
                </div>
                <div>
                    <h2 className="font-bold text-xl text-white tracking-tight">AI Analyzer</h2>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Powered by Gemini</p>
                </div>
            </div>

            <div className="flex-1 space-y-6">
                <div className="bg-white/10 p-5 rounded-2xl border border-white/10 hover:bg-white/15 transition-colors group/card">
                    <p className="text-[10px] uppercase tracking-widest text-indigo-300 font-bold mb-2">Rekomendasi Utama</p>
                    <p className="text-2xl font-black text-white">
                        {analysis.jurusan}
                    </p>
                </div>

                <div>
                    <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-3">Mengapa rekomendasi ini?</p>
                    <div className="relative pl-4 border-l-2 border-indigo-600">
                        <p className="text-sm leading-relaxed text-gray-300">
                            {analysis.alasan}
                        </p>
                    </div>
                </div>
            </div>

            <button className="mt-8 w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 group-hover:translate-y-[-2px] hover:shadow-indigo-600/50">
                Lihat Detail Karir <Icons.ArrowRight />
            </button>
        </div>
    </div>
);

const TalentCard = ({ talents }) => (
    <div className="col-span-1 md:col-span-3 bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 hover:border-orange-100 transition-colors duration-500">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-50 text-orange-500 rounded-2xl">
                    <Icons.Trophy />
                </div>
                <div>
                    <h2 className="font-bold text-2xl text-gray-800 tracking-tight">Minat & Bakat</h2>
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Pencapaian Ekstrakurikuler</p>
                </div>
            </div>
            <div className="flex items-center gap-2 px-5 py-2.5 bg-yellow-50 text-yellow-700 rounded-full text-xs font-bold border border-yellow-200 shadow-sm">
                <Icons.Star />
                <span>Top 10% di Sekolah</span>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {talents.map((item, idx) => (
                <div key={idx} className="relative overflow-hidden group rounded-3xl border border-gray-100 hover:border-orange-200 bg-gradient-to-br from-[#FFFBF7] to-white transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/10 p-1">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-125 group-hover:rotate-12 duration-500">
                        <Icons.Trophy />
                    </div>
                    
                    <div className="p-6 md:p-8 flex items-start gap-6 h-full">
                        <div className="shrink-0 pt-1">
                            <div className="w-20 h-20 rounded-2xl bg-white border-2 border-orange-100 flex flex-col items-center justify-center shadow-sm group-hover:border-orange-400 group-hover:rotate-3 transition-all duration-300">
                                <span className="text-3xl font-black text-gray-800">{item.nilai_teknis}</span>
                                <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Poin</span>
                            </div>
                        </div>

                        <div className="flex-1 z-10">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-2xl font-bold text-gray-800 group-hover:text-orange-600 transition-colors">{item.ekskul}</h3>
                            </div>
                            <span className="inline-block px-3 py-1 bg-orange-100/50 text-orange-700 text-xs font-bold rounded-lg mb-4 border border-orange-100">
                                {item.predikat}
                            </span>
                            <div className="bg-white/80 p-4 rounded-xl backdrop-blur-sm border border-orange-100/50 group-hover:bg-white transition-colors shadow-sm">
                                <p className="text-sm text-gray-600 italic leading-relaxed">
                                    "{item.observasi}"
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

// --- MAIN PAGE COMPONENT ---

export default function Student({ auth, academics, talents, analysis }) {
    const user = auth?.user || { name: "Siswa", kelas: "-" };
    
    // Fallback data
    const academicData = academics || [];
    const talentData = talents || [];
    const analysisData = analysis || { jurusan: 'Belum ada data', alasan: 'Hubungi admin untuk update.' };

    return (
        <div className="min-h-screen bg-[#F3F4F6] font-sans selection:bg-indigo-500 selection:text-white">
            <Head title="Dashboard Siswa" />
            
            {/* Custom Navbar dengan Fungsi Logout */}
            <CustomNavbar user={user} />

            <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
                
                {/* 1. HERO SECTION */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <WelcomeCard user={user} />
                </div>

                {/* 2. MAIN CONTENT (Updated Academic Card) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <AcademicCard academics={academicData} />
                    <AnalysisCard analysis={analysisData} />
                </div>

                {/* 3. TALENTS SECTION */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <TalentCard talents={talentData} />
                </div>

                {/* Footer */}
                <div className="text-center py-12 border-t border-gray-200 mt-8">
                    <p className="text-gray-400 text-sm font-medium italic">
                        "Pendidikan adalah senjata paling ampuh untuk mengubah dunia."
                    </p>
                    <p className="text-xs text-gray-300 mt-2 font-bold tracking-widest uppercase">© 2024 EduTalent</p>
                </div>

            </div>
        </div>
    );
}