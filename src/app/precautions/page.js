"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

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
        <div className="min-h-screen bg-black text-white font-sans p-6 md:p-12">
            <div className="max-w-4xl mx-auto">

                {/* Navigation & Header */}
                <div className="flex items-center gap-6 mb-12">
                    <button
                        onClick={() => router.back()}
                        className="group flex items-center justify-center h-12 w-12 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-cyan-500/50 transition-all"
                    >
                        <svg className="w-5 h-5 text-zinc-400 group-hover:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <div>
                        <h1 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-500">
                            Safety Guidelines
                        </h1>
                        <p className="text-zinc-500 text-sm mt-1 uppercase tracking-widest font-bold">Official FDA Insights</p>
                    </div>
                </div>

                {/* Content Area */}
                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-24 bg-zinc-900/50 animate-pulse rounded-[2rem] border border-zinc-800" />
                        ))}
                    </div>
                ) : precautions.length > 0 ? (
                    <div className="space-y-4">
                        {precautions.map((item, idx) => (
                            <div
                                key={idx}
                                className={`group border transition-all duration-500 rounded-[2.5rem] overflow-hidden ${expandedId === idx ? 'bg-zinc-900/40 border-cyan-500/30 shadow-[0_0_50px_rgba(6,182,212,0.05)]' : 'bg-zinc-900/20 border-zinc-800 hover:border-zinc-700'
                                    }`}
                            >
                                {/* Accordion Trigger */}
                                <div
                                    onClick={() => toggleExpand(idx)}
                                    className="p-8 cursor-pointer flex justify-between items-center"
                                >
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3">
                                            <h2 className="text-2xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                                                {item.name}
                                            </h2>
                                            <span className="px-2 py-0.5 rounded text-[10px] bg-cyan-500/10 text-cyan-500 font-bold uppercase tracking-tighter">
                                                Active Guideline
                                            </span>
                                        </div>
                                        <p className="text-zinc-500 text-sm mt-1 line-clamp-1 italic pr-10">
                                            {item.why}
                                        </p>
                                    </div>
                                    <div className={`h-10 w-10 rounded-xl bg-zinc-800 flex items-center justify-center transition-transform duration-500 ${expandedId === idx ? 'rotate-180 bg-cyan-500/20 text-cyan-400' : 'text-zinc-500'}`}>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>

                                {/* Collapsible Section */}
                                <div className={`transition-all duration-700 ease-in-out ${expandedId === idx ? 'max-h-[1500px] opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
                                    <div className="p-8 pt-0 space-y-8">
                                        <div className="h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent mb-8" />

                                        <section>
                                            <h4 className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.2em] mb-3">Clinical Usage</h4>
                                            <div className="p-6 bg-black/40 border border-zinc-800/50 rounded-3xl">
                                                <p className="text-zinc-300 leading-relaxed text-sm">
                                                    {item.why}
                                                </p>
                                            </div>
                                        </section>

                                        <section>
                                            <h4 className="text-[10px] font-black text-rose-500 uppercase tracking-[0.2em] mb-3">Critical Precautions</h4>
                                            <div className="p-6 bg-rose-500/5 border border-rose-500/10 rounded-3xl">
                                                <p className="text-zinc-300 leading-relaxed text-sm antialiased">
                                                    {item.precautions}
                                                </p>
                                            </div>
                                        </section>

                                        <div className="flex items-center gap-2 text-[10px] text-zinc-600 font-bold uppercase pt-4">
                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" /></svg>
                                            Source: openFDA Product Labeling
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-24 text-center border-2 border-dashed border-zinc-800 rounded-[3rem] bg-zinc-900/10">
                        <p className="text-zinc-600 font-bold uppercase tracking-widest text-xs">No Safety Precautions Found for Today</p>
                    </div>
                )}

                {/* Footer Disclaimer */}
                <footer className="mt-16 py-8 border-t border-zinc-900">
                    <p className="text-[10px] text-zinc-600 text-center leading-relaxed max-w-2xl mx-auto uppercase tracking-tighter">
                        Disclaimer: Information retrieved via openFDA. This is for educational use only and does not replace professional medical advice. Always verify instructions with your pharmacist or physician before consumption.
                    </p>
                </footer>
            </div>
        </div>
    );
}