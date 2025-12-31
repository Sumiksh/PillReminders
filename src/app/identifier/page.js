"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import VisualPillId from "@/components/VisualPillId";
import { 
  Scan, 
  ArrowLeft, 
  AlertTriangle, 
  Fingerprint, 
  Search, 
  Loader2,
  ShieldCheck,
  Eye
} from "lucide-react";

export default function IdentifierPage() {
  const [pillInfo, setPillInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchIdentities = async () => {
      setLoading(true);
      try {
        const today = new Date().toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
        const res = await fetch(`/api/medications/get-by-date?date=${today}`);
        const meds = await res.json();
        
        if (meds.length > 0) {
          const results = [];
          for (const m of meds) {
            const idRes = await fetch('/api/medications/identify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ name: m.name })
            });
            const data = await idRes.json();
            results.push({ ...data, name: m.name });
            if (meds.length > 1) await new Promise(r => setTimeout(r, 800));
          }
          setPillInfo(results);
        }
      } catch (err) {
        console.error("Identification error:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchIdentities();
  }, []);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 pb-20">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 pt-10">
        
        {/* Header Section */}
        <header className="mb-12">
          <button 
            onClick={() => router.back()} 
            className="flex items-center gap-2 text-slate-500 hover:text-amber-400 transition-colors mb-6 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-bold uppercase tracking-widest">Dashboard</span>
          </button>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="h-14 w-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center relative overflow-hidden group">
                <Scan className="w-7 h-7 text-amber-500 z-10" />
                <div className="absolute inset-0 bg-gradient-to-t from-amber-500/20 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-1000 animate-pulse" />
              </div>
              <div>
                <h1 className="text-4xl font-black text-white tracking-tight">Pill Identifier</h1>
                <p className="text-slate-500 text-sm font-medium">Visual verification for your safety</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-900/50 border border-white/5 rounded-full">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Verified Clinical Data</span>
            </div>
          </div>
        </header>

        {/* Safety Warning Banner */}
        {!loading && pillInfo.length > 0 && (
          <div className="relative group mb-10">
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            <div className="relative flex items-start gap-4 p-5 bg-slate-900/80 border border-amber-500/20 rounded-2xl">
              <AlertTriangle className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-amber-100/80 text-xs leading-relaxed font-medium">
                <strong className="text-amber-400 block mb-1 uppercase tracking-tighter font-black text-[10px]">Verification Protocol</strong>
                Compare the physical pill in your hand with the technical imprint and color data below. Any discrepancy in color, shape, or markings requires immediate consultation with a licensed pharmacist.
              </p>
            </div>
          </div>
        )}

        {/* Content Area */}
        {loading ? (
          <div className="space-y-8">
            <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-white/5 rounded-[3rem] bg-slate-900/20">
              <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
              <h3 className="text-white font-bold tracking-tight">Scanning Records</h3>
              <p className="text-slate-500 text-sm mt-1 animate-pulse italic">Connecting to pill image database...</p>
            </div>
          </div>
        ) : pillInfo.length > 0 ? (
          <div className="space-y-12">
            {pillInfo.map((pill, idx) => (
              <div key={idx} className="relative group">
                <div className="flex items-center gap-3 mb-4 ml-2">
                   <div className="h-2 w-2 rounded-full bg-indigo-500 group-hover:animate-ping" />
                   <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.15em]">{pill.name}</h3>
                </div>

                {pill.error ? (
                  <div className="p-8 bg-slate-900/50 rounded-[2.5rem] border border-rose-500/20 flex flex-col items-center gap-4">
                    <Eye className="w-10 h-10 text-rose-500/40" />
                    <p className="text-rose-400 text-sm font-medium text-center">
                      Visual data not found for <span className="underline decoration-rose-500/50 uppercase">{pill.name}</span>.
                      <br/><span className="text-xs text-slate-500 mt-2 block italic">Please check the paper insert provided with your prescription.</span>
                    </p>
                  </div>
                ) : (
                  <div className="relative overflow-hidden rounded-[2.5rem] border border-white/5 hover:border-indigo-500/30 transition-all duration-500 shadow-2xl">
                    <VisualPillId data={pill} />
                    
                    {/* Small Imprint Icon Overlay */}
                    <div className="absolute top-6 right-6 p-3 bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 group-hover:border-indigo-500/40 transition-colors">
                      <Fingerprint className="w-5 h-5 text-indigo-400" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="py-24 text-center border-2 border-dashed border-white/5 rounded-[3.5rem] bg-slate-900/20">
            <Search className="w-12 h-12 text-slate-700 mx-auto mb-4" />
            <h3 className="text-white font-bold tracking-tight uppercase">Database Standby</h3>
            <p className="text-slate-500 text-xs mt-2 max-w-[250px] mx-auto leading-relaxed">
              You have no active medications scheduled for today that require visual identification.
            </p>
          </div>
        )}

        {/* Technical Footer */}
        <footer className="mt-24 pt-12 border-t border-white/5 flex flex-col items-center gap-6">
           <div className="flex items-center gap-8 opacity-40 hover:opacity-100 transition-opacity">
              <span className="text-[10px] font-black tracking-[0.3em] uppercase">OpenFDA</span>
              <span className="text-[10px] font-black tracking-[0.3em] uppercase">PillPal AI</span>
              <span className="text-[10px] font-black tracking-[0.3em] uppercase">USP Standard</span>
           </div>
           <p className="text-[9px] text-slate-600 text-center max-w-xl uppercase tracking-tighter leading-relaxed">
             IDENTIFICATION DATA IS SOURCED FROM NATIONAL LIBRARY OF MEDICINE. THIS IS NOT A SUBSTITUTE FOR PROFESSIONAL MEDICAL ADVICE. ALWAYS VERIFY IMPRINTS PHYSICALLY.
           </p>
        </footer>
      </main>
    </div>
  );
}