'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Navbar from '@/components/Navbar';
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next"; // Make sure it's from next-auth/next
import { authOptions } from "@/utils/authOptions"; // CHECK THIS PATH
import { db } from '@/utils/firebase'; 
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { 
  Plus, Calendar, ShieldCheck, Search, 
  ChevronRight, Activity, Clock, Scan, Pill, X
} from 'lucide-react';

export async function GET(request) {
  try {
    // This is where the error was happening
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const queryStr = searchParams.get('q');
    if (!queryStr) return NextResponse.json([]);

    // Capitalize first letter (tylenol -> Tylenol)
    const normalizedQuery = queryStr.charAt(0).toUpperCase() + queryStr.slice(1);

    const medsRef = collection(db, 'users', session.user.email, 'medications');

    const q = query(
      medsRef,
      where("name", ">=", normalizedQuery),
      where("name", "<=", normalizedQuery + '\uf8ff'),
      limit(5)
    );

    const querySnapshot = await getDocs(q);
    const results = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json(results);
  } catch (error) {
    console.error("Search Error:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}


export default function DashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [meds, setMeds] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // --- Search States ---
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setSearchResults([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- Real-time Search Logic ---
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.length > 1) {
        setIsSearching(true);
        try {
          // Pass the query to your API route
          const res = await fetch(`/api/medications/search?q=${encodeURIComponent(searchQuery)}`);
          const data = await res.json();
          setSearchResults(data);
        } catch (err) {
          console.error("Search error:", err);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  useEffect(() => {
    const fetchTodayMeds = async () => {
      const today = new Date().toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
      try {
        const res = await fetch(`/api/medications/get-by-date?date=${today}`);
        const data = await res.json();
        setMeds(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (status === 'authenticated') fetchTodayMeds();
  }, [status]);

  if (status === 'loading') return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
      <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
      <p className="mt-4 text-slate-400 font-medium tracking-widest animate-pulse">SYNCING DATA...</p>
    </div>
  );

  if (status === 'unauthenticated') {
    router.push('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 pb-12">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <header className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Good morning, <span className="text-indigo-400">{session?.user?.name?.split(' ')[0]}</span>
          </h1>
          <p className="text-slate-400 mt-2">You have {meds.length} doses scheduled for today.</p>
        </header>

        {/* Search Section */}
        <div className="relative max-w-2xl mb-12 z-50" ref={dropdownRef}>
          <div className="relative group">
            <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${isSearching ? 'text-indigo-400 animate-pulse' : 'text-slate-500 group-focus-within:text-indigo-400'}`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search your medications..."
              className="w-full pl-12 pr-12 py-4 bg-slate-900/50 border border-white/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-slate-900 transition-all text-white placeholder:text-slate-600"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Results Dropdown */}
          {searchResults.length > 0 && (
            <div className="absolute mt-2 w-full bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl">
              <div className="p-2">
                {searchResults.map((result) => (
                  <button
                    key={result.id}
                    onClick={() => router.push(`/medication/${result.id}`)}
                    className="w-full flex items-center gap-4 p-3 hover:bg-white/5 rounded-xl transition-colors text-left"
                  >
                    <div className="bg-indigo-500/20 p-2 rounded-lg">
                      <Pill className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{result.name}</p>
                      <p className="text-xs text-slate-500">{result.dosage} • {result.frequency}</p>
                    </div>
                    <ChevronRight className="ml-auto w-4 h-4 text-slate-600" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 h-full">
          <button
            onClick={() => router.push('/add-medication')}
            className="md:col-span-2 md:row-span-2 relative overflow-hidden group p-8 rounded-3xl bg-indigo-600 hover:bg-indigo-500 transition-all text-left flex flex-col justify-between min-h-[300px]"
          >
            <div className="z-10">
              <div className="bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                <Plus className="text-white w-8 h-8" />
              </div>
              <h3 className="text-3xl font-bold text-white">Add New<br />Medication</h3>
              <p className="text-indigo-100 mt-4 max-w-[200px]">Track your doses, schedule, and stock levels.</p>
            </div>
            <ChevronRight className="z-10 w-8 h-8 text-white/50 group-hover:text-white transition-all self-end" />
            <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform"></div>
          </button>

          <button onClick={() => router.push('/calendar')} className="md:col-span-2 bg-slate-900 border border-white/5 p-6 rounded-3xl hover:bg-slate-800 transition-all text-left flex items-center gap-6">
            <div className="bg-teal-500/10 p-4 rounded-2xl">
              <Calendar className="w-8 h-8 text-teal-400" />
            </div>
            <div><h3 className="text-xl font-bold text-white">Calendar</h3><p className="text-slate-400 text-sm">View intake history</p></div>
          </button>

          <button onClick={() => router.push('/precautions')} className="bg-slate-900 border border-white/5 p-6 rounded-3xl hover:bg-slate-800 transition-all text-left flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <ShieldCheck className="w-8 h-8 text-amber-400" />
              <span className="bg-amber-400/10 text-amber-400 text-[10px] font-bold px-2 py-1 rounded">{loading ? '...' : meds.length} ACTIVE</span>
            </div>
            <div><h3 className="text-lg font-bold text-white mt-4">Safety Guide</h3><p className="text-slate-500 text-xs mt-1">Food & interactions</p></div>
          </button>

          <button onClick={() => router.push('/identifier')} className="bg-slate-900 border border-white/5 p-6 rounded-3xl hover:bg-slate-800 transition-all text-left flex flex-col justify-between">
            <Scan className="w-8 h-8 text-purple-400" />
            <div><h3 className="text-lg font-bold text-white mt-4">Identifier</h3><p className="text-slate-500 text-xs mt-1">Scan or describe pill</p></div>
          </button>
        </div>

        <div className="mt-12 p-4 rounded-2xl bg-slate-900/30 border border-white/5 flex flex-wrap gap-8 items-center justify-center">
          <div className="flex items-center gap-2"><Activity className="w-4 h-4 text-indigo-400" /><span className="text-xs text-slate-400 font-medium italic">Status: System Online</span></div>
          <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-indigo-400" /><span className="text-xs text-slate-400 font-medium">Last Sync: Just now</span></div>
        </div>
      </main>
    </div>
  );
}