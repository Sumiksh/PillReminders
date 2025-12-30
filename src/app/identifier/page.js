"use client";
import { useState, useEffect, useRef } from "react"; // Added useRef
import { useRouter } from "next/navigation";
import VisualPillId from "@/components/VisualPillId";

export default function IdentifierPage() {
  const [pillInfo, setPillInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  
  // 1. Guard to prevent double execution in Strict Mode
  const hasFetched = useRef(false);

  useEffect(() => {
    // Only fetch if we haven't already
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
          
          // 2. Sequential Processing instead of Promise.all
          // This avoids "bursting" the API with too many requests at once
          for (const m of meds) {
            const idRes = await fetch('/api/medications/identify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ name: m.name })
            });
            
            const data = await idRes.json();
            results.push(data);
            
            // 3. Small delay (1 second) between requests if there are many
            if (meds.length > 1) await new Promise(r => setTimeout(r, 1000));
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
    <div className="min-h-screen bg-black text-white p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-6 mb-12">
          <button onClick={() => router.back()} className="h-12 w-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:border-amber-500/50 transition-all">
            <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <div>
            <h1 className="text-4xl font-black text-white">Pill Identifier</h1>
            <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest">Visual Verification System</p>
          </div>
        </div>

        {loading ? (
          <div className="space-y-6">
            {[1, 2].map(i => <div key={i} className="h-40 bg-zinc-900/50 animate-pulse rounded-[2.5rem]" />)}
          </div>
        ) : pillInfo.length > 0 ? (
          <div className="space-y-6">
            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl mb-8">
              <p className="text-amber-200 text-xs text-center font-medium">
                ⚠️ Compare the physical pill in your hand with the description below. If the imprint or color does not match, contact your pharmacist.
              </p>
            </div>
            {pillInfo.map((pill, idx) => (
              <div key={idx} className="space-y-2">
                <h3 className="ml-4 text-sm font-black text-zinc-500 uppercase tracking-tighter">{pill.name || "Unknown Medication"}</h3>
                {pill.error ? (
                  <div className="p-6 bg-zinc-900 rounded-3xl border border-red-900/50 text-red-400 text-sm">
                    {pill.error}
                  </div>
                ) : (
                  <VisualPillId data={pill} />
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center border-2 border-dashed border-zinc-800 rounded-[3rem]">
            <p className="text-zinc-500 uppercase text-xs font-bold tracking-widest">No medications scheduled for identification today.</p>
          </div>
        )}
      </div>
    </div>
  );
}