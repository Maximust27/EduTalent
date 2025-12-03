import { useEffect, useState } from 'react';

import { Head, Link, useForm } from '@inertiajs/react';

// --- ICONS (FIXED SVGs - LUCIDE STYLE) ---
const Icons = {
    Mail: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>,
    Lock: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
    Eye: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>,
    EyeOff: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7c.44 0 .87-.03 1.28-.09"/><line x1="2" x2="22" y1="2" y2="22"/></svg>,
    ArrowRight: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>,
    // GANTI WAVE DENGAN GRADUATION CAP AGAR LEBIH JELAS
    GraduationCap: () => <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>,
    Info: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>,
    Check: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17 4 12"/></svg>,
    StarDoodle: ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" /></svg>
};

// --- COMPONENTS ---
const InputField = ({ icon: Icon, type, name, value, onChange, placeholder, error, onTogglePass, isPassVisible }) => (
    <div className="mb-5 group">
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1 transition-colors group-focus-within:text-indigo-600">
            {placeholder}
        </label>
        <div className={`relative flex items-center border-2 rounded-2xl transition-all duration-300 ease-in-out ${error ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white group-hover:border-gray-300 focus-within:border-indigo-500 focus-within:shadow-lg focus-within:shadow-indigo-500/10'}`}>
            <div className={`pl-4 transition-colors duration-300 ${error ? 'text-red-400' : 'text-gray-400 group-focus-within:text-indigo-500'}`}>
                <Icon />
            </div>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                className="w-full py-3.5 px-4 bg-transparent border-none focus:ring-0 text-gray-700 text-sm font-medium placeholder-transparent"
                placeholder={placeholder} 
            />
            {onTogglePass && (
                <button 
                    type="button"
                    onClick={onTogglePass}
                    className="pr-4 text-gray-400 hover:text-indigo-600 transition-colors focus:outline-none"
                >
                    {isPassVisible ? <Icons.EyeOff /> : <Icons.Eye />}
                </button>
            )}
        </div>
        {error && <p className="text-xs text-red-500 mt-1.5 ml-1 font-medium flex items-center gap-1 animate-pulse"><Icons.Info /> {error}</p>}
    </div>
);

export default function Login({ status, canResetPassword }) {
    // LOGIKA LOGIN ASLI LARAVEL (Akan aktif jika BAGIAN 2 di-uncomment)
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        const url = typeof route !== 'undefined' ? route('login') : '/login';
        post(url);
    };

    return (
        <div className="min-h-screen flex font-sans selection:bg-indigo-500 selection:text-white overflow-hidden bg-[#FDFBF7] relative">
            <Head title="Masuk - EduTalent" />

            {/* --- BACKGROUND BLOBS --- */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-40">
                <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-purple-200 rounded-full mix-blend-multiply filter blur-[80px] animate-blob"></div>
                <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-yellow-200 rounded-full mix-blend-multiply filter blur-[80px] animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-[-10%] left-[20%] w-[700px] h-[700px] bg-teal-200 rounded-full mix-blend-multiply filter blur-[80px] animate-blob animation-delay-4000"></div>
            </div>

            {/* --- CONTAINER UTAMA --- */}
            <div className="w-full max-w-6xl mx-auto flex items-center justify-center p-4 relative z-10">
                <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8 h-full lg:h-auto items-center">
                    
                    {/* BAGIAN KIRI: VISUAL & BRANDING */}
                    <div className="hidden lg:flex flex-col justify-between h-full min-h-[600px] bg-indigo-600 rounded-[2.5rem] p-12 relative overflow-hidden shadow-2xl shadow-indigo-500/20 group">
                        {/* Decorative Circles */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-white/20 transition-all duration-700"></div>
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/30 rounded-full blur-3xl -ml-10 -mb-10 animate-pulse"></div>
                        <Icons.StarDoodle className="absolute top-20 right-20 w-12 h-12 text-yellow-300 opacity-80 animate-spin-slow" />
                        
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-3 text-white w-fit relative z-10">
                            <div className="bg-white/20 backdrop-blur-md p-2.5 rounded-2xl border border-white/20 shadow-lg group-hover:rotate-6 transition-transform">
                                <span className="text-xl font-extrabold tracking-tighter">ET</span>
                            </div>
                            <span className="text-2xl font-extrabold tracking-tight">EduTalent<span className="text-yellow-300">.</span></span>
                        </Link>

                        {/* Text Content */}
                        <div className="relative z-10">
                             <div className="inline-block px-4 py-1.5 rounded-full border border-white/30 bg-white/10 text-indigo-100 text-xs font-bold tracking-widest uppercase mb-6 backdrop-blur-sm">
                                Portal Akademik & Bakat
                            </div>
                            <h2 className="text-5xl font-black text-white leading-[1.1] mb-6 tracking-tight">
                                Satu Akun, <br/>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-pink-200">
                                    Sejuta Potensi.
                                </span>
                            </h2>
                            <p className="text-indigo-100 text-lg max-w-md leading-relaxed font-medium">
                                Masuk untuk memantau nilai, absensi, dan perkembangan ekstrakurikuler siswa secara realtime.
                            </p>
                        </div>

                        {/* Footer */}
                        <div className="relative z-10 text-[10px] text-indigo-200 font-mono uppercase tracking-widest flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
                            System Operational
                        </div>
                    </div>

                    {/* BAGIAN KANAN: FORM LOGIN */}
                    <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-white/50 w-full max-w-md mx-auto lg:max-w-full h-full min-h-[600px] flex flex-col justify-center">
                        
                        <div className="text-center lg:text-left mb-10">
                             {/* Mobile Logo */}
                            <div className="flex lg:hidden items-center justify-center gap-2 text-indigo-900 mb-6">
                                <div className="bg-indigo-600 text-white p-1.5 rounded-lg font-bold text-sm shadow-md">ET</div>
                                <span className="font-bold text-lg tracking-tight">EduTalent</span>
                            </div>

                            <div className="inline-flex items-center justify-center p-3 bg-indigo-50 rounded-2xl mb-4 shadow-sm text-indigo-600 animate-bounce-slow">
                                {/* Menggunakan Ikon Topi Wisuda yang Lebih Jelas */}
                                <Icons.GraduationCap />
                            </div>
                            <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-2 tracking-tight">Selamat Datang!</h1>
                            <p className="text-gray-500 font-medium">Silakan masuk dengan akun sekolah Anda.</p>
                        </div>

                        {status && (
                            <div className="mb-6 font-medium text-sm text-green-700 bg-green-50 p-4 rounded-xl border border-green-100 flex items-center gap-3 shadow-sm animate-fade-in-up">
                                <div className="p-1 bg-green-200 rounded-full"><Icons.Check /></div>
                                {status}
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-6">
                            <InputField
                                icon={Icons.Mail}
                                type="email"
                                name="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="Email Sekolah"
                                error={errors.email}
                            />

                            <div className="relative">
                                <InputField
                                    icon={Icons.Lock}
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="Kata Sandi"
                                    error={errors.password}
                                    onTogglePass={() => setShowPassword(!showPassword)}
                                    isPassVisible={showPassword}
                                />
                            </div>

                            <div className="flex items-center mb-6">
                                <label className="flex items-center gap-3 cursor-pointer group select-none">
                                    <div className="relative flex items-center">
                                        <input
                                            type="checkbox"
                                            name="remember"
                                            checked={data.remember}
                                            onChange={(e) => setData('remember', e.target.checked)}
                                            className="peer h-5 w-5 cursor-pointer transition-all appearance-none rounded-md border-2 border-gray-300 shadow-sm hover:border-indigo-400 checked:bg-indigo-600 checked:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20"
                                        />
                                        <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" strokeWidth="1">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                                            </svg>
                                        </span>
                                    </div>
                                    <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900 transition">Ingat saya</span>
                                </label>
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className={`group w-full py-4 px-6 bg-gray-900 hover:bg-indigo-600 text-white font-bold rounded-2xl shadow-xl shadow-gray-900/10 hover:shadow-indigo-500/30 transition-all duration-300 transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3 ${processing ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {processing ? (
                                    <span className="flex items-center gap-2">
                                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                        Memverifikasi...
                                    </span>
                                ) : (
                                    <>
                                        Masuk Dashboard 
                                        <span className="group-hover:translate-x-1 transition-transform duration-300"><Icons.ArrowRight /></span>
                                    </>
                                )}
                            </button>
                        </form>

                        {/* System Footer Info */}
                        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                            <div className="flex items-center justify-center gap-2 text-xs font-medium text-gray-400 bg-gray-50 py-2 px-4 rounded-full w-fit mx-auto">
                                <Icons.Info />
                                <span>Akses terbatas untuk Guru, Siswa & Staff.</span>
                            </div>
                            <p className="text-xs text-gray-400 mt-4">
                                Butuh bantuan akses? <br className="md:hidden"/>
                                <span className="text-indigo-600 font-bold hover:underline cursor-pointer ml-1">
                                    Hubungi Administrator Sekolah
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* CSS Animations */}
            <style>{`
                @keyframes blob {
                    0% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                    100% { transform: translate(0px, 0px) scale(1); }
                }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes fadeInDown {
                    from { opacity: 0; transform: translateY(-20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes fadeInScale {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
                @keyframes bounceSlow {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-5px); }
                }
                @keyframes spinSlow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-blob { animation: blob 7s infinite; }
                .animation-delay-2000 { animation-delay: 2s; }
                .animation-delay-4000 { animation-delay: 4s; }
                .animate-fade-in-up { animation: fadeInUp 0.8s ease-out forwards; }
                .animate-fade-in-down { animation: fadeInDown 0.8s ease-out forwards; }
                .animate-fade-in-scale { animation: fadeInScale 0.6s ease-out forwards; }
                .animate-bounce-slow { animation: bounceSlow 3s infinite ease-in-out; }
                .animate-spin-slow { animation: spinSlow 10s linear infinite; }
            `}</style>
        </div>
    );
}