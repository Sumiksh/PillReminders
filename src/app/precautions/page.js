"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar"; // Reusing your high-end Navbar
import { 
  ShieldAlert, 
  ChevronDown, 
  BookOpen, 
  Info, 
  AlertTriangle, 
  ArrowLeft,
  FileText,
  Search,
  ExternalLink
} from "lucide-react";

export default function PrecautionsPage() {
    const [precautions, setPrecautions] = useState([]);
    const [expandedId, setExpandedId] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const today = new Date().toLocaleDateString('en-CA', {
                    timeZone: 'America/New_York'
                });
                const medRes = await fetch(`/api/medications/get-by-date?date=${today}`);
                const medData = await medRes.json();

                if (medData.length > 0) {
                    const names = medData.map(m => m.name);
                    const precRes = await fetch('/api/medications/get-precautions', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ names })
                    });
                    const precData = await precRes.json();
                    setPrecautions(precData.data || []);
                }
            } catch (err) {
                console.error("Error loading precautions:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const toggleExpand = (idx) => {
        setExpandedId(expandedId === idx ? null : idx);
    };

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200">
            <Navbar />

            <main className="max-w-5xl mx-auto p-6 md:p-12">
                
                {/* Hero Header Section */}
                <div className="relative mb-16 pt-4">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-slate-500 hover:text-indigo-400 transition-colors mb-6 group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm font-bold uppercase tracking-widest">Dashboard</span>
                    </button>
                    
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="max-w-xl">
                            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-none">
                                Safety <span className="text-indigo-500">Guidelines</span>
                            </h1>
                            <p className="text-slate-400 mt-4 text-lg">
                                Real-time clinical insights and critical warnings for your current prescriptions.
                            </p>
                        </div>
                        
                        {/* FDA Trust Badge */}
                        <div className="flex items-center gap-4 bg-indigo-500/5 border border-indigo-500/10 p-4 rounded-3xl">
                            <div className="p-3 bg-indigo-500/20 rounded-2xl">
                                <ShieldAlert className="w-6 h-6 text-indigo-400" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Data Source</p>
                                <p className="text-sm font-bold text-white uppercase tracking-tighter">openFDA verified</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                {loading ? (
                    <div className="grid gap-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-28 bg-slate-900/50 animate-pulse rounded-[2.5rem] border border-white/5" />
                        ))}
                    </div>
                ) : precautions.length > 0 ? (
                    <div className="grid gap-6">
                        {precautions.map((item, idx) => (
                            <div
                                key={idx}
                                className={`group border transition-all duration-500 rounded-[2.5rem] overflow-hidden ${
                                    expandedId === idx 
                                    ? 'bg-slate-900/80 border-indigo-500/30 shadow-[0_30px_60px_-12px_rgba(0,0,0,0.5)]' 
                                    : 'bg-slate-900/40 border-white/5 hover:border-indigo-500/20'
                                }`}
                            >
                                {/* Accordion Header */}
                                <div
                                    onClick={() => toggleExpand(idx)}
                                    className="p-8 cursor-pointer flex justify-between items-center relative"
                                >
                                    <div className="flex items-center gap-6">
                                        <div className={`h-14 w-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                                            expandedId === idx ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
                                        }`}>
                                            <FileText className="w-7 h-7" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3">
                                                <h2 className="text-2xl font-bold text-white group-hover:text-indigo-400 transition-colors tracking-tight">
                                                    {item.name}
                                                </h2>
                                                <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
                                            </div>
                                            <p className="text-slate-500 text-sm mt-1 line-clamp-1 italic max-w-md">
                                                {item.why}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className={`h-12 w-12 rounded-full border border-white/5 flex items-center justify-center transition-all duration-500 ${
                                        expandedId === idx ? 'rotate-180 bg-indigo-500 text-white' : 'text-slate-500'
                                    }`}>
                                        <ChevronDown className="w-5 h-5" />
                                    </div>
                                </div>

                                {/* Accordion Content */}
                                <div className={`transition-all duration-700 ease-in-out ${expandedId === idx ? 'max-h-[1500px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                                    <div className="p-8 pt-0 space-y-8">
                                        <div className="h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                                        {/* Clinical Usage */}
                                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                                            <div className="md:col-span-1 flex justify-center pt-1">
                                                <BookOpen className="w-6 h-6 text-indigo-400" />
                                            </div>
                                            <div className="md:col-span-11">
                                                <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-3">Clinical Usage & Description</h4>
                                                <div className="p-6 bg-slate-950/50 border border-white/5 rounded-3xl">
                                                    <p className="text-slate-300 leading-relaxed text-sm">
                                                        {item.why}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Critical Precautions */}
                                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                                            <div className="md:col-span-1 flex justify-center pt-1">
                                                <AlertTriangle className="w-6 h-6 text-rose-500" />
                                            </div>
                                            <div className="md:col-span-11">
                                                <h4 className="text-[10px] font-black text-rose-500 uppercase tracking-[0.2em] mb-3">Critical Precautions</h4>
                                                <div className="p-6 bg-rose-500/5 border border-rose-500/10 rounded-3xl">
                                                    <p className="text-slate-300 leading-relaxed text-sm antialiased italic">
                                                        "{item.precautions}"
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between pt-6">
                                            <div className="flex items-center gap-2 text-[10px] text-slate-600 font-bold uppercase tracking-widest">
                                                <Info className="w-3 h-3" />
                                                Verified by PillPal Intelligence via openFDA
                                            </div>
                                            <button className="text-[10px] font-black text-indigo-400 uppercase flex items-center gap-1 hover:underline">
                                                Full Labeling <ExternalLink className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-24 text-center border-2 border-dashed border-white/5 rounded-[3.5rem] bg-slate-900/20">
                        <Search className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">No Safety Alerts for Today</p>
                        <p className="text-slate-600 text-xs mt-2">Your current medications do not have critical FDA warnings listed.</p>
                    </div>
                )}

                {/* Footer Disclaimer */}
                <footer className="mt-20 py-12 border-t border-white/5">
                    <p className="text-[10px] text-slate-600 text-center leading-relaxed max-w-3xl mx-auto uppercase tracking-tighter">
                        Disclaimer: These guidelines are generated using the openFDA database. This tool is intended for informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions regarding a medical condition or medication.
                    </p>
                </footer>
            </main>
        </div>
    );
}