"use client";
import { useState, useEffect } from "react";
import Calendar from "react-calendar";

export default function CalendarPage() {
  const [date, setDate] = useState(new Date());
  const [meds, setMeds] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMedsForDate = async (selectedDate) => {
    setLoading(true);
    // Adjust for timezone to get pure YYYY-MM-DD
    const offset = selectedDate.getTimezoneOffset();
    const adjustedDate = new Date(selectedDate.getTime() - (offset * 60 * 1000));
    const formattedDate = adjustedDate.toISOString().split('T')[0];
    
    try {
      const res = await fetch(`/api/medications/get-by-date?date=${formattedDate}`);
      const data = await res.json();
      setMeds(data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedsForDate(date);
  }, [date]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 md:p-8 font-sans">
      <div className="max-w-3xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-500">
              Schedule
            </h1>
            <p className="text-gray-400 font-medium">
              {date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
          <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <span className="text-xs font-bold">MED</span>
          </div>
        </div>

        {/* Calendar Card (Pure Tailwind Overrides) */}
        <div className="mb-10 p-4 bg-zinc-900/50 border border-zinc-800 rounded-3xl backdrop-blur-xl">
          <style>{`
            .react-calendar { width: 100%; background: transparent; border: none; font-family: inherit; color: white; }
            .react-calendar__tile { color: #a1a1aa; padding: 12px !important; border-radius: 12px; }
            .react-calendar__tile:enabled:hover { background: #27272a !important; color: white; }
            .react-calendar__tile--active { background: #6366f1 !important; color: white !important; font-weight: bold; }
            .react-calendar__tile--now { border: 1px solid #6366f1 !important; background: transparent; }
            .react-calendar__navigation button { color: white; min-width: 44px; background: none; font-size: 18px; }
            .react-calendar__navigation button:enabled:hover { background: #27272a; border-radius: 10px; }
            .react-calendar__month-view__weekdays { text-transform: uppercase; font-weight: bold; font-size: 0.7rem; color: #71717a; }
            abbr[title] { text-decoration: none; }
          `}</style>
          <Calendar onChange={setDate} value={date} />
        </div>

        {/* Medicine List Area */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight">Today's Intake</h2>
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">
              {meds.length} Medicines
            </span>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-8 h-4 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
              <p className="text-zinc-500 text-sm animate-pulse">Checking records...</p>
            </div>
          ) : meds.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {meds.map((med) => (
                <div 
                  key={med.id} 
                  className="group bg-zinc-900/40 border border-zinc-800 hover:border-indigo-500/50 p-6 rounded-[2rem] transition-all duration-500 ease-out"
                >
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-zinc-100 group-hover:text-white transition-colors">{med.name}</h3>
                        <p className="text-zinc-500 text-sm font-medium">{med.dosage}</p>
                      </div>
                    </div>
                    <button className="h-8 w-8 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-indigo-500 transition-colors">
                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeWidth="3" /></svg>
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {med.times.map((time) => (
                      <div key={time} className="px-4 py-2 bg-black/50 border border-zinc-800 rounded-xl text-xs font-bold text-emerald-400 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                        {time}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-20 flex flex-col items-center justify-center bg-zinc-900/20 rounded-[3rem] border-2 border-dashed border-zinc-800">
              <div className="w-16 h-16 bg-zinc-800/50 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" strokeWidth="2" strokeLinecap="round" /></svg>
              </div>
              <p className="text-zinc-500 font-bold">Clear for today!</p>
              <p className="text-zinc-600 text-xs mt-1">No medication found for this date.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}