"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Added router for back navigation
import Calendar from "react-calendar";
import Navbar from "@/components/Navbar";
import { 
  Calendar as CalendarIcon, 
  ChevronRight, 
  Pill, 
  Inbox, 
  Clock, 
  AlertCircle,
  ArrowLeft // Added for the back button
} from "lucide-react";

export default function CalendarPage() {
  const router = useRouter();
  const [date, setDate] = useState(new Date());
  const [meds, setMeds] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMedsForDate = async (selectedDate) => {
    setLoading(true);
    const offset = selectedDate.getTimezoneOffset();
    const adjustedDate = new Date(selectedDate.getTime() - (offset * 60 * 1000));
    const formattedDate = adjustedDate.toISOString().split('T')[0];
    
    try {
      const res = await fetch(`/api/medications/get-by-date?date=${formattedDate}`);
      const data = await res.json();
      setMeds(data || []);
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
    <div className="min-h-screen bg-[#020617] text-slate-200 pb-20">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 pt-8">
        
        {/* Navigation & Header Section */}
        <div className="mb-10">
          {/* Back Button */}
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-slate-500 hover:text-indigo-400 transition-colors mb-6 group w-fit"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-bold uppercase tracking-widest">Dashboard</span>
          </button>

          <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <CalendarIcon className="w-5 h-5 text-indigo-400" />
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Intake Timeline</span>
              </div>
              <h1 className="text-4xl font-extrabold text-white tracking-tight">
                {date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
              </h1>
              <p className="text-slate-400 mt-1">Select a date to review your medication history.</p>
            </div>
            
            <div className="hidden md:flex items-center gap-3 bg-slate-900/50 border border-white/5 p-2 pr-6 rounded-2xl">
              <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                <Pill className="w-5 h-5 text-indigo-400" />
              </div>
              <span className="text-sm font-semibold text-slate-300 tracking-tight">Pill Scheduler</span>
            </div>
          </header>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Calendar Sidebar */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 bg-slate-900/40 border border-white/5 rounded-3xl backdrop-blur-xl shadow-xl">
              <style>{`
                .react-calendar { width: 100%; background: transparent; border: none; font-family: inherit; color: white; }
                .react-calendar__tile { color: #64748b; padding: 14px !important; border-radius: 14px; font-weight: 500; transition: all 0.2s; }
                .react-calendar__tile:enabled:hover { background: #1e293b !important; color: #f8fafc; }
                .react-calendar__tile--active { background: #4f46e5 !important; color: white !important; box-shadow: 0 4px 12px rgba(79, 70, 229, 0.4); }
                .react-calendar__tile--now { color: #818cf8; border: 1px solid rgba(129, 140, 248, 0.3) !important; background: transparent; }
                .react-calendar__navigation button { color: white; min-width: 44px; background: none; font-size: 20px; font-weight: bold; }
                .react-calendar__navigation button:enabled:hover { background: #1e293b; border-radius: 12px; }
                .react-calendar__month-view__weekdays { text-transform: uppercase; font-weight: 800; font-size: 0.65rem; color: #475569; padding-bottom: 8px; }
                abbr[title] { text-decoration: none; }
              `}</style>
              <Calendar onChange={setDate} value={date} className="mx-auto" />
            </div>

            <div className="bg-indigo-500/5 border border-indigo-500/10 p-5 rounded-2xl flex gap-4 items-start">
              <AlertCircle className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
              <p className="text-xs text-slate-400 leading-relaxed">
                Click any date above to synchronize and pull logs from your prescription database.
              </p>
            </div>
          </div>

          {/* List Area */}
          <div className="lg:col-span-7">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                Daily Schedule
                <span className="bg-slate-800 text-slate-400 text-[10px] px-2 py-1 rounded-full border border-white/5">
                  {meds.length}
                </span>
              </h2>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-24 bg-slate-900/20 rounded-[2.5rem] border border-white/5">
                <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
                <p className="text-slate-500 text-sm font-medium animate-pulse tracking-widest uppercase">Fetching Logs...</p>
              </div>
            ) : meds.length > 0 ? (
              <div className="space-y-4">
                {meds.map((med) => (
                  <div 
                    key={med.id} 
                    className="group bg-slate-900/50 border border-white/5 hover:border-indigo-500/30 p-6 rounded-3xl transition-all duration-300 shadow-lg hover:shadow-indigo-500/5"
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <Pill className="w-6 h-6 text-indigo-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">{med.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{med.dosage}</span>
                          </div>
                        </div>
                      </div>
                      <button className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:bg-indigo-500 hover:text-white transition-all">
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      {med.times.map((time) => (
                        <div 
                          key={time} 
                          className="px-4 py-2 bg-slate-950 border border-white/5 rounded-xl text-[11px] font-black text-emerald-400 flex items-center gap-2 group-hover:border-emerald-500/20 transition-colors shadow-inner"
                        >
                          <Clock className="w-3.5 h-3.5" />
                          {time}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-20 flex flex-col items-center justify-center bg-slate-900/20 rounded-[2.5rem] border-2 border-dashed border-white/5">
                <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mb-4 text-slate-600">
                  <Inbox className="w-8 h-8" />
                </div>
                <h3 className="text-white font-bold tracking-tight">All Clear!</h3>
                <p className="text-slate-500 text-sm mt-1 text-center max-w-[200px]">
                  No medications recorded for this specific date.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}