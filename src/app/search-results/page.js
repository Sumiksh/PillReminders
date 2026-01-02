'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Navbar from '@/components/Navbar';
import { Pill, ChevronLeft, Search, Activity, Clock, ChevronRight } from 'lucide-react';

export default function SearchResultsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get('q'); // Gets the ?q= value from the URL
  
  const { data: session, status } = useSession();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFullResults = async () => {
      if (!query || status !== 'authenticated') return;
      
      setLoading(true);
      try {
        // We reuse your existing search API
        const res = await fetch(`/api/medications/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data || []);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFullResults();
  }, [query, status]);

  // Protect the route
  if (status === 'unauthenticated') {
    router.push('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 pb-12">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        {/* Navigation Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
          <div>
            <button 
              onClick={() => router.push('/dashboard')}
              className="flex items-center gap-2 text-slate-500 hover:text-indigo-400 transition-colors mb-4 group"
            >
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-medium">Back to Dashboard</span>
            </button>
            <h1 className="text-4xl font-bold text-white tracking-tight">
              Search Results
            </h1>
            <p className="text-slate-400 mt-2">
              Showing results for "<span className="text-indigo-400 font-semibold">{query}</span>"
            </p>
          </div>

          <div className="bg-slate-900/50 border border-white/5 px-6 py-3 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                {results.length} Medications Found
              </span>
            </div>
          </div>
        </div>

        {/* Results List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-slate-900/50 border border-white/5 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {results.map((med) => (
              <div 
                key={med.id}
                className="group p-6 rounded-[2.5rem] bg-slate-900/40 border border-white/5 hover:bg-slate-800/60 hover:border-indigo-500/30 transition-all cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-6">
                  <div className="bg-indigo-600/10 p-5 rounded-3xl group-hover:scale-110 transition-transform">
                    <Pill className="w-8 h-8 text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1 group-hover:text-indigo-400 transition-colors">
                      {med.name}
                    </h3>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500">
                      <span className="flex items-center gap-1.5">
                        <Activity className="w-3.5 h-3.5" /> {med.dosage}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" /> {med.frequency}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-4">
                   <div className="text-right">
                     <p className="text-[10px] font-black text-slate-600 uppercase tracking-tighter">Started On</p>
                     <p className="text-sm font-medium text-slate-400">{med.startDate || 'N/A'}</p>
                   </div>
                   {/* <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center">
                     <ChevronRight className="w-5 h-5 text-slate-500" />
                   </div> */}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center bg-slate-900/20 border-2 border-dashed border-white/5 rounded-[3rem]">
            <Search className="w-12 h-12 text-slate-700 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No Medications Found</h3>
            <p className="text-slate-500 max-w-xs mx-auto">
              We couldn't find any medications matching that name in your records.
            </p>
            <button 
              onClick={() => router.push('/dashboard')}
              className="mt-8 px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold transition-all"
            >
              Try Different Search
            </button>
          </div>
        )}
      </main>
    </div>
  );
}