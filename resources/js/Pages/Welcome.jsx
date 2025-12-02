// import { Link, Head } from '@inertiajs/react'; // Aktifkan baris ini di project Laravel asli Anda
import { useState, useEffect } from 'react';

// --- MOCK COMPONENTS (Untuk Preview Saja) ---
// Hapus bagian ini saat dipasang di Project Laravel Anda
const Link = ({ href, children, className }) => <a href={href} className={className}>{children}</a>;
const Head = ({ title }) => {
    if (typeof document !== 'undefined') document.title = title;
    return null;
};
// ---------------------------------------------

// --- CUSTOM SVG ICONS ---
const GraduationIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
);

const BookIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
);

const SportIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="12" r="10" />
        <path d="M6.5 17.5l5-5" />
        <path d="M17.5 6.5l-5 5" />
        <path d="M12 2v20" />
        <path d="M2 12h20" />
    </svg>
);

const ChartIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M18 20V10" />
        <path d="M12 20V4" />
        <path d="M6 20v-6" />
    </svg>
);

export default function Welcome({ auth }) {
    const [scrolled, setScrolled] = useState(false);
    const [activeText, setActiveText] = useState(0);
    
    const words = ["Minat & Bakat", "Masa Depan", "Potensi", "Prestasi"];

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        
        const interval = setInterval(() => {
            setActiveText((prev) => (prev + 1) % words.length);
        }, 2500);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            clearInterval(interval);
        };
    }, []);

    // SVG Doodles
    const ScribbleUnderline = () => (
        <svg className="absolute -bottom-2 left-0 w-full h-3 text-yellow-400 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
            <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
        </svg>
    );

    const StarDoodle = ({ className }) => (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
        </svg>
    );

    const safeRoute = (name) => typeof route !== 'undefined' ? route(name) : '#';

    return (
        <>
            <Head title="EduTalent - Temukan Potensi Anak" />
            
            <div className="min-h-screen bg-[#FDFBF7] text-gray-800 font-sans overflow-x-hidden selection:bg-purple-500 selection:text-white relative">
                
                {/* --- ANIMATED BACKGROUND BLOBS --- */}
                <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden opacity-40">
                    <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-purple-200 rounded-full mix-blend-multiply filter blur-[80px] animate-blob"></div>
                    <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] bg-yellow-200 rounded-full mix-blend-multiply filter blur-[80px] animate-blob animation-delay-2000"></div>
                    <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-teal-200 rounded-full mix-blend-multiply filter blur-[80px] animate-blob animation-delay-4000"></div>
                </div>

                {/* --- NAVBAR --- */}
                <div className="fixed w-full z-50 top-0 pt-6 px-4 flex justify-center">
                    <nav className={`transition-all duration-500 ease-out ${scrolled ? 'w-[90%] md:w-[70%] py-3 px-6 bg-white/90 backdrop-blur-xl shadow-xl shadow-purple-500/5 rounded-full border border-white/50' : 'w-full max-w-7xl py-4 px-6 bg-transparent'}`}>
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3 group cursor-pointer">
                                <div className="bg-gray-900 text-white p-2.5 rounded-xl group-hover:rotate-12 transition-transform duration-300 shadow-lg">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                </div>
                                <span className="text-xl font-extrabold tracking-tight text-gray-900">EduTalent<span className="text-yellow-500">.</span></span>
                            </div>

                            <div className="flex items-center gap-3 md:gap-4">
                                {auth?.user ? (
                                    <Link href={safeRoute('dashboard')} className="font-bold text-white bg-gray-900 hover:bg-gray-800 px-6 py-2.5 rounded-full transition-all hover:scale-105 shadow-lg">Dashboard</Link>
                                ) : (
                                    <>
                                        <Link href={safeRoute('login')} className="hidden md:inline-block font-bold text-gray-600 hover:text-gray-900 transition px-4">Masuk</Link>
                                        <Link href={safeRoute('register')} className="font-bold text-gray-900 bg-yellow-400 hover:bg-yellow-300 px-6 py-2.5 rounded-full transition-all hover:shadow-lg hover:shadow-yellow-400/30 hover:-translate-y-0.5 border-2 border-transparent">Daftar Sekarang</Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </nav>
                </div>

                {/* --- HERO SECTION --- */}
                <div className="relative pt-40 pb-12 px-6 max-w-7xl mx-auto flex flex-col items-center text-center z-10">
                    <div className="inline-flex items-center gap-2 py-2 px-4 rounded-full bg-purple-100 text-purple-700 text-sm font-bold tracking-wide mb-8 animate-fade-in-up border border-purple-200 hover:scale-105 transition-transform cursor-default">
                        <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
                        PLATFORM PENDIDIKAN HOLISTIK NO. #1
                    </div>
                    
                    <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 leading-[1.1] tracking-tight mb-8 max-w-5xl mx-auto">
                        Kembangkan <br className="hidden md:block"/>
                        <span className="relative inline-block mx-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
                            {words[activeText]}
                            <ScribbleUnderline />
                        </span>
                        <span className="relative inline-block">
                             Anak <StarDoodle className="absolute -top-6 -right-8 w-8 h-8 text-yellow-400 animate-spin-slow opacity-80" />
                        </span> <br />
                        Tanpa Batasan.
                    </h1>
                    
                    <p className="text-lg md:text-xl text-gray-500 max-w-2xl mb-10 leading-relaxed font-medium">
                        EduTalent mensinergikan nilai akademik sekolah dengan potensi ekstrakurikuler. Kami membantu orang tua dan guru menemukan "Hidden Gem" dalam diri setiap siswa.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                        {!auth?.user && (
                            <Link href={safeRoute('register')} className="px-8 py-4 bg-gray-900 text-white font-bold text-lg rounded-full shadow-xl hover:shadow-2xl hover:shadow-purple-500/20 transition-all hover:-translate-y-1 flex items-center justify-center gap-2 group">
                                Mulai Gratis
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </Link>
                        )}
                        <button className="px-8 py-4 bg-white text-gray-800 font-bold text-lg rounded-full border-2 border-gray-100 hover:border-gray-300 hover:bg-gray-50 transition shadow-sm hover:scale-105">
                            Pelajari Fitur
                        </button>
                    </div>
                </div>

                {/* --- BENTO GRID FEATURES --- */}
                <div className="py-10 px-6 max-w-7xl mx-auto relative z-10">
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[minmax(180px,auto)]">
                        
                        {/* 1. SISWA (Main Focus) */}
                        <div className="md:col-span-2 lg:col-span-2 row-span-2 bg-indigo-600 rounded-[2.5rem] p-8 md:p-12 text-white relative overflow-hidden group hover:shadow-2xl hover:shadow-indigo-500/30 transition-all duration-500 cursor-default">
                            {/* Animated Background Element */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-white/20 group-hover:scale-125 transition-all duration-700"></div>
                            
                            <div className="relative z-10 h-full flex flex-col justify-between">
                                <div>
                                    <div className="inline-block p-4 bg-white/20 backdrop-blur-md rounded-2xl mb-6 shadow-inner group-hover:rotate-6 transition-transform duration-300">
                                        <GraduationIcon className="w-10 h-10 text-white" />
                                    </div>
                                    <h3 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">Dashboard Siswa & Orang Tua</h3>
                                    <p className="text-indigo-100 text-lg leading-relaxed max-w-md">
                                        Pantau nilai akademik dan non-akademik dalam satu layar. Dapatkan rekomendasi karir berbasis AI dari data harianmu.
                                    </p>
                                </div>
                                <div className="mt-8">
                                    <button className="bg-white text-indigo-700 px-6 py-3 rounded-full font-bold shadow-lg hover:scale-105 transition-transform flex items-center gap-2 group-hover:shadow-white/25">
                                        Coba Demo Siswa
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* 2. STATS (Animated Number) */}
                        <div className="md:col-span-1 lg:col-span-1 bg-[#FFD550] rounded-[2.5rem] p-8 flex flex-col justify-center items-center text-center relative overflow-hidden hover:-translate-y-2 transition-transform duration-300 border-4 border-white/50 shadow-lg group">
                            <StarDoodle className="absolute top-4 left-4 w-6 h-6 text-yellow-600/30 animate-spin-slow" />
                            <StarDoodle className="absolute bottom-6 right-6 w-8 h-8 text-yellow-600/30 rotate-45 animate-pulse" />
                            
                            <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300">
                                <ChartIcon className="w-12 h-12 text-gray-900" />
                            </div>
                            <h4 className="text-5xl font-extrabold text-gray-900 mb-2 tracking-tighter">94%</h4>
                            <p className="font-bold text-gray-800 leading-tight">Akurasi Rekomendasi Minat Bakat</p>
                        </div>

                        {/* 3. GURU (Clean Style) */}
                        <div className="md:col-span-1 lg:col-span-1 bg-[#E0F2FE] rounded-[2.5rem] p-8 hover:bg-[#BAE6FD] transition-colors duration-300 group cursor-pointer border-4 border-white/50 shadow-sm hover:shadow-blue-200">
                            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                                <BookIcon className="w-7 h-7 text-blue-500" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Guru Mapel</h3>
                            <p className="text-gray-600 text-sm font-medium">Input nilai massal, catatan personal, dan pantau grafik kelas.</p>
                        </div>

                        {/* 4. PEMBINA (Wide Card) */}
                        <div className="md:col-span-3 lg:col-span-2 bg-white rounded-[2.5rem] p-8 md:p-10 border-2 border-gray-100 shadow-xl shadow-gray-200/50 hover:border-orange-200 transition-all duration-300 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100 rounded-bl-[2.5rem] transition-transform duration-500 group-hover:scale-110 origin-top-right"></div>
                            <div className="flex flex-col md:flex-row md:items-center gap-6 relative z-10">
                                <div className="bg-orange-100 w-20 h-20 rounded-3xl flex items-center justify-center shrink-0 text-orange-500 group-hover:rotate-12 transition-transform duration-300 shadow-sm">
                                    <SportIcon className="w-10 h-10" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Pembina Ekstrakurikuler</h3>
                                    <p className="text-gray-600">
                                        Ekskul bukan sekadar hobi. Catat perkembangan <i>soft-skill</i>, leadership, dan kedisiplinan siswa di lapangan.
                                    </p>
                                </div>
                                <div className="md:ml-auto">
                                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300 cursor-pointer">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 5. Additional Info (Community) */}
                        <div className="md:col-span-2 lg:col-span-2 bg-[#F3E8FF] rounded-[2.5rem] p-8 flex items-center gap-6 border-4 border-white/50 hover:shadow-lg transition-shadow">
                            <div className="flex -space-x-4 hover:space-x-1 transition-all duration-300">
                                {[1,2,3].map(i => (
                                    <div key={i} className={`w-12 h-12 rounded-full border-4 border-white flex items-center justify-center font-bold text-xs bg-gray-200 overflow-hidden`}>
                                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i*523}`} alt="avatar" className="w-full h-full object-cover" />
                                    </div>
                                ))}
                                <div className="w-12 h-12 rounded-full border-4 border-white bg-white flex items-center justify-center font-bold text-xs text-gray-600 shadow-sm">+1.2k</div>
                            </div>
                            <div>
                                <p className="font-bold text-gray-900">Bergabung bersama komunitas sekolah modern.</p>
                                <p className="text-xs font-bold text-purple-600 uppercase tracking-wide mt-1">Mulai transformasi digital</p>
                            </div>
                        </div>

                    </div>
                </div>

                {/* --- FOOTER --- */}
                <footer className="mt-20 py-12 border-t border-gray-200 bg-white">
                    <div className="max-w-7xl mx-auto px-6 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-6">
                        <div>
                            <span className="text-2xl font-extrabold tracking-tight text-gray-900">EduTalent<span className="text-yellow-500">.</span></span>
                            <p className="text-gray-500 text-sm mt-2">© 2024 EduTalent. All rights reserved.</p>
                        </div>
                        <div className="flex gap-6 font-medium text-gray-600">
                            <a href="#" className="hover:text-purple-600 transition hover:-translate-y-0.5 inline-block">Tentang Kami</a>
                            <a href="#" className="hover:text-purple-600 transition hover:-translate-y-0.5 inline-block">Bantuan</a>
                            <a href="#" className="hover:text-purple-600 transition hover:-translate-y-0.5 inline-block">Privasi</a>
                        </div>
                    </div>
                </footer>

                {/* Animation Styles */}
                <style>{`
                    @keyframes blob {
                        0% { transform: translate(0px, 0px) scale(1); }
                        33% { transform: translate(30px, -50px) scale(1.1); }
                        66% { transform: translate(-20px, 20px) scale(0.9); }
                        100% { transform: translate(0px, 0px) scale(1); }
                    }
                    .animate-blob {
                        animation: blob 7s infinite;
                    }
                    .animation-delay-2000 {
                        animation-delay: 2s;
                    }
                    .animation-delay-4000 {
                        animation-delay: 4s;
                    }
                    .animate-spin-slow {
                        animation: spin 8s linear infinite;
                    }
                    @keyframes spin {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        </>
    );
}