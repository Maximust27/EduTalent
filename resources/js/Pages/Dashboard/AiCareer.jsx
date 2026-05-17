import { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, Cell } from 'recharts';

// --- ICONS (SVG) ---
const Icons = {
    Brain: () => <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/></svg>,
    ArrowLeft: () => <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
    Star: () => <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    Home: () => <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>,
    Briefcase: () => <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>,
    Target: () => <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
    Lightbulb: () => <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="9" y1="18" x2="15" y2="18"/><line x1="10" y1="22" x2="14" y2="22"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1.45.62 2.84 1.5 3.5.76.75 1.23 1.51 1.4 2.5Z"/></svg>,
    Lock: () => <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
    CheckCircle: () => <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
    Cpu: () => <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></svg>,
    Globe: () => <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
};

export default function AiCareer({ auth, aiResult }) {
    const user = auth?.user || { name: "Siswa", kelas: "-" };

    // Default mock data if no real result is passed
    const data = aiResult || {
        radarData: [
            { subject: 'Logika & Sains', A: 85, fullMark: 100 },
            { subject: 'Kreativitas', A: 92, fullMark: 100 },
            { subject: 'Fisik & Olahraga', A: 65, fullMark: 100 },
            { subject: 'Sosial & Empati', A: 88, fullMark: 100 },
            { subject: 'Bahasa & Komunikasi', A: 80, fullMark: 100 },
        ],
        matches: [
            { role: 'AI Engineer', match: 92, type: 'Future Option' },
            { role: 'Data Analyst Business', match: 88, type: 'Hybrid' },
            { role: 'Software Architect', match: 85, type: 'Safe Option' }
        ],
        skillTree: [
            { name: 'Python', level: 90, status: 'Mastered' },
            { name: 'Statistik', level: 60, status: 'In Progress' },
            { name: 'Machine Learning', level: 40, status: 'Locked' },
            { name: 'Public Speaking', level: 85, status: 'Mastered' },
            { name: 'UI/UX Design', level: 75, status: 'In Progress' }
        ],
        roadmap: [
            { year: '2024', title: 'Fokus Akademik', desc: 'Perkuat nilai Matematika & Fisika' },
            { year: '2026', title: 'Kuliah Teknik Informatika', desc: 'Universitas impian dengan beasiswa' },
            { year: '2030', title: 'Junior Data Engineer', desc: 'Mulai karir di perusahaan Tech' },
            { year: '2034', title: 'Senior AI Engineer', desc: 'Memimpin proyek kecerdasan buatan' }
        ],
        crossMajorAnalysis: "Siswa mengambil mata pelajaran lintas jurusan (MIPA -> Ekonomi) dengan nilai sangat baik. Potensi karir di bidang Hybrid seperti Fintech atau Data Analyst Business sangat tinggi.",
        gapAnalysis: "Untuk mencapai karir AI Engineer, siswa masih perlu meningkatkan skill Statistik (saat ini 60%) dan mulai mempelajari dasar Machine Learning yang belum terlihat di data ekstrakurikulernya.",
        aiSummary: "Berdasarkan pembobotan 40% akademik, 40% ekskul, dan 20% catatan guru, kamu memiliki kecenderungan kuat di bidang teknologi dan analisis data, dipadukan dengan kemampuan komunikasi yang baik."
    };

    return (
        <div className="min-h-screen bg-[#0F172A] text-slate-200 font-sans selection:bg-indigo-500 selection:text-white">
            <Head title="AI Career Analysis" />
            
            {/* Navbar */}
            <nav className="bg-[#1E293B]/80 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-4">
                            <Link href={route('dashboard')} className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-slate-300">
                                <Icons.ArrowLeft />
                            </Link>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg shadow-indigo-500/20">
                                    <Icons.Brain />
                                </div>
                                <div>
                                    <h1 className="font-bold text-white text-lg leading-tight">AI Career Analysis</h1>
                                    <p className="text-[10px] text-indigo-300 font-medium tracking-widest uppercase">EduTalent Intelligence</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 hidden sm:flex">
                            <div className="text-right">
                                <p className="text-sm font-bold text-white leading-none">{user?.name}</p>
                                <p className="text-[10px] uppercase tracking-wider text-indigo-400 font-bold mt-1">{user?.kelas}</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 p-[2px] shadow-md">
                                <div className="w-full h-full bg-[#1E293B] rounded-full flex items-center justify-center font-bold text-white text-sm">
                                    {user?.name?.charAt(0)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                
                {/* Header Section */}
                <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 p-8 md:p-12 shadow-2xl shadow-indigo-900/50 border border-white/5">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
                    <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl -ml-10 -mb-10"></div>
                    
                    <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        <div>
                            <span className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold tracking-wide border border-white/10 text-indigo-200 mb-6">
                                <Icons.Cpu /> AI Powered Analysis
                            </span>
                            <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight leading-tight">
                                Halo {user.name.split(' ')[0]}, <br/>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                                    Masa Depanmu Cerah!
                                </span>
                            </h2>
                            <p className="text-slate-300 text-lg leading-relaxed max-w-lg mb-6">
                                {data.aiSummary}
                            </p>
                        </div>

                        {/* Top Matches Widget */}
                        <div className="bg-black/20 backdrop-blur-md rounded-3xl p-6 border border-white/10">
                            <h3 className="text-sm font-bold text-indigo-300 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Icons.Target /> Compatibility Match
                            </h3>
                            <div className="space-y-4">
                                {data.matches.map((match, idx) => (
                                    <div key={idx} className="relative group">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="font-bold text-white group-hover:text-indigo-300 transition-colors">{match.role}</span>
                                            <span className="text-xs font-black bg-white/10 px-2 py-1 rounded text-indigo-200">{match.match}% Match</span>
                                        </div>
                                        <div className="text-[10px] text-slate-400 mb-2 uppercase tracking-wider">{match.type}</div>
                                        <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                                            <div 
                                                className={`h-full rounded-full bg-gradient-to-r ${
                                                    idx === 0 ? 'from-green-400 to-emerald-500' : 
                                                    idx === 1 ? 'from-indigo-400 to-purple-500' : 'from-blue-400 to-cyan-500'
                                                }`}
                                                style={{ width: `${match.match}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Radar Chart (5 Dimensi) */}
                    <div className="lg:col-span-1 bg-[#1E293B] rounded-[2rem] p-8 border border-white/5 shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl"></div>
                        <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                            <Icons.Globe /> Profil 5 Dimensi
                        </h3>
                        <p className="text-xs text-slate-400 mb-6">Keseimbangan potensi diri secara holistik</p>
                        
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data.radarData}>
                                    <PolarGrid stroke="#334155" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#94A3B8', fontSize: 10 }} />
                                    <Radar name="Skor" dataKey="A" stroke="#818CF8" fill="#818CF8" fillOpacity={0.5} />
                                    <RechartsTooltip 
                                        contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                                        itemStyle={{ color: '#818CF8' }}
                                    />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Lintas Jurusan & Gap Analysis */}
                    <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8">
                        {/* Linjur */}
                        <div className="bg-gradient-to-br from-[#1E293B] to-[#0F172A] rounded-[2rem] p-8 border border-white/5 shadow-xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Icons.Lightbulb />
                            </div>
                            <div className="w-12 h-12 bg-yellow-500/20 text-yellow-400 rounded-2xl flex items-center justify-center mb-6 border border-yellow-500/20">
                                <Icons.Lightbulb />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-3">Analisis Lintas Jurusan</h3>
                            <p className="text-sm text-slate-300 leading-relaxed">
                                {data.crossMajorAnalysis}
                            </p>
                        </div>

                        {/* Gap Analysis */}
                        <div className="bg-gradient-to-br from-[#1E293B] to-[#0F172A] rounded-[2rem] p-8 border border-white/5 shadow-xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Icons.Target />
                            </div>
                            <div className="w-12 h-12 bg-red-500/20 text-red-400 rounded-2xl flex items-center justify-center mb-6 border border-red-500/20">
                                <Icons.Target />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-3">Gap Analysis</h3>
                            <p className="text-sm text-slate-300 leading-relaxed">
                                {data.gapAnalysis}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    {/* Skill Tree */}
                    <div className="bg-[#1E293B] rounded-[2rem] p-8 border border-white/5 shadow-xl">
                        <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                            <Icons.Briefcase /> Skill Tree
                        </h3>
                        <p className="text-xs text-slate-400 mb-8">Peta kemampuan yang harus dikuasai</p>

                        <div className="space-y-6">
                            {data.skillTree.map((skill, idx) => (
                                <div key={idx} className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                                        skill.status === 'Mastered' ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-400' :
                                        skill.status === 'In Progress' ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' :
                                        'bg-slate-800 border-slate-700 text-slate-500'
                                    }`}>
                                        {skill.status === 'Mastered' ? <Icons.CheckCircle /> : 
                                         skill.status === 'In Progress' ? <span className="animate-spin text-xs font-black">⟳</span> : 
                                         <Icons.Lock />}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className={`font-bold ${skill.status === 'Locked' ? 'text-slate-500' : 'text-slate-200'}`}>{skill.name}</span>
                                            <span className="text-[10px] uppercase tracking-wider text-slate-400">{skill.status}</span>
                                        </div>
                                        <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                                            <div 
                                                className={`h-full rounded-full ${
                                                    skill.status === 'Mastered' ? 'bg-indigo-500' :
                                                    skill.status === 'In Progress' ? 'bg-blue-500' : 'bg-transparent'
                                                }`}
                                                style={{ width: `${skill.level}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Career Roadmap */}
                    <div className="bg-[#1E293B] rounded-[2rem] p-8 border border-white/5 shadow-xl">
                        <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                            <Icons.Target /> Career Roadmap
                        </h3>
                        <p className="text-xs text-slate-400 mb-8">Garis waktu menuju kesuksesan</p>

                        <div className="relative border-l-2 border-slate-700 ml-4 space-y-8">
                            {data.roadmap.map((step, idx) => (
                                <div key={idx} className="relative pl-6">
                                    <div className={`absolute w-4 h-4 rounded-full -left-[9px] top-1 border-4 border-[#1E293B] ${
                                        idx === 0 ? 'bg-indigo-400 animate-pulse' : 'bg-slate-600'
                                    }`}></div>
                                    <span className="text-[10px] font-black tracking-widest text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded mb-2 inline-block">
                                        {step.year}
                                    </span>
                                    <h4 className="font-bold text-white text-lg mb-1">{step.title}</h4>
                                    <p className="text-sm text-slate-400">{step.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

            </main>
        </div>
    );
}
