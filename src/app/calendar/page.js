"use client";
import { useState, useEffect } from "react";
import Calendar from "react-calendar";

export default function CalendarPage() {
  const [date, setDate] = useState(new Date());
  const [meds, setMeds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [safetyLoading, setSafetyLoading] = useState(false);
  const [interactions, setInteractions] = useState([]);

  // Fetch meds from your Firebase backend
  const fetchMedsForDate = async (selectedDate) => {
    setLoading(true);
    const formattedDate = selectedDate.toISOString().split('T')[0];
    try {
      const res = await fetch(`/api/medications/get-by-date?date=${formattedDate}`);
      const data = await res.json();
      setMeds(data);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  // Trigger the Safety Scanner API
  const checkSafety = async (medList) => {
    if (medList.length < 2) {
      setInteractions([]);
      return;
    }
    setSafetyLoading(true);
    try {
      const res = await fetch('/api/medications/check-interactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ names: medList.map(m => m.name) })
      });
      const data = await res.json();
      setInteractions(data.interactions || []);
    } catch (err) { console.error(err); } finally { setSafetyLoading(false); }
  };

  useEffect(() => { fetchMedsForDate(date); }, [date]);
  useEffect(() => { checkSafety(meds); }, [meds]);

  return (
    <div className="min-h-screen bg-black text-white p-6 font-sans">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Side: Schedule List */}
        <div className="lg:col-span-8">
          <header className="mb-10">
            <h1 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-500">
              Schedule
            </h1>
            <p className="text-zinc-500 mt-2 font-medium">{date.toDateString()}</p>
          </header>

          <div className="space-y-4">
            {loading ? (
              <div className="animate-pulse bg-zinc-900 h-40 rounded-3xl" />
            ) : meds.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {meds.map(med => (
                  <div key={med.id} className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-[2rem] hover:border-indigo-500/50 transition-all">
                    <h3 className="text-xl font-bold">{med.name}</h3>
                    <p className="text-zinc-500 text-sm mb-4">{med.dosage}</p>
                    <div className="flex gap-2">
                      {med.times.map(t => (
                        <span key={t} className="px-3 py-1 bg-black rounded-lg text-emerald-400 text-xs font-bold">{t}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-20 text-center border-2 border-dashed border-zinc-800 rounded-[3rem]">
                <p className="text-zinc-600 font-bold uppercase tracking-widest text-xs">No Medications Scheduled</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Calendar & Safety Scanner */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Calendar Widget */}
          <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
            <style>{`
              .react-calendar { width: 100%; background: transparent; border: none; font-family: inherit; color: white; }
              .react-calendar__tile--active { background: #6366f1 !important; color: white !important; border-radius: 12px; }
              .react-calendar__tile { color: #52525b; border-radius: 12px; }
              .react-calendar__navigation button { color: white; background: none; font-size: 1.2rem; }
            `}</style>
            <Calendar onChange={setDate} value={date} />
          </div>

          {/* Safety Scanner Sidebar */}
          <div className={`p-6 rounded-[2.5rem] border transition-all duration-700 ${interactions.length > 0 ? 'bg-red-500/10 border-red-500/40 shadow-[0_0_50px_rgba(239,68,68,0.1)]' : 'bg-zinc-900/40 border-zinc-800'}`}>
            <div className="flex items-center gap-3 mb-6">
              <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${interactions.length > 0 ? 'bg-red-500 text-white animate-pulse' : 'bg-zinc-800 text-zinc-500'}`}>
                {safetyLoading ? '...' : (interactions.length > 0 ? '!' : '✓')}
              </div>
              <h2 className="font-black text-sm uppercase tracking-widest">Safety Scanner</h2>
            </div>

            {safetyLoading ? (
              <p className="text-xs text-zinc-500 animate-pulse">Running cross-interaction check...</p>
            ) : interactions.length > 0 ? (
              <div className="space-y-3">
                <p className="text-[10px] font-black text-red-500 uppercase tracking-widest px-2 py-1 bg-red-500/10 rounded-md w-fit">Warning: Action Required</p>
                {interactions.map((i, idx) => (
                  <div key={idx} className="p-4 bg-black/60 border border-red-500/20 rounded-2xl text-[11px] leading-relaxed text-zinc-300">
                    {i.description}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <p className="text-xs text-zinc-400">Everything looks safe.</p>
                <p className="text-[10px] text-zinc-600 italic leading-tight">Interaction results are based on clinical data from the NIH RxNav system.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}