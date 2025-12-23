"use client"
// src/app/dashboard/page.js
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
// Import NextAuth client functions to check session status
import { useSession, signOut } from 'next-auth/react';

function DashboardPage() {
  const router = useRouter();
  // 1. Check the session status
  const { data: session, status } = useSession();

  const [meds, setMeds] = useState([]);
  const [loading, setLoading] = useState(true);

  // 2. Fetch today's medications to get the count
  useEffect(() => {
    const fetchTodayMeds = async () => {
      const today = new Date().toLocaleDateString('en-CA', {
        timeZone: 'America/New_York'
      });
      console.log("today", today)
      try {
        const res = await fetch(`/api/medications/get-by-date?date=${today}`);
        const data = await res.json();
        setMeds(data || []);
      } catch (err) {
        console.error("Failed to fetch meds for dashboard:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTodayMeds();
  }, []);

  const handleNavigate = (path) => {
    router.push(path);
  };

  // 2. Handle Loading and Unauthenticated States
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center">
        <p className="text-xl text-indigo-400">Loading Session...</p>
      </div>
    );
  }

  // If the user is not authenticated, redirect them back to the login page
  if (status === 'unauthenticated') {
    // Optionally redirect immediately or show a link to login
    router.push('/');
    return null;
  }

  // --- 3. Render Dashboard for Authenticated Users ---
  // The 'session' object is now guaranteed to contain user data (email, name, image, etc.)

  return (
    // Outer container: Full screen height, centered content, dark background
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center">
      {/* Header with User Info and Logout */}
      <nav className="w-full border-b border-zinc-800 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        {/* Inner Nav Container (Centers the content inside the full-width bar) */}
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">

          {/* Logo Section */}
          <div className="flex items-center gap-6">
            <div className="h-9 w-9 bg-gradient-to-tr from-indigo-600 to-purple-500 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <svg className="w-5 h-5 text-white rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <span className="text-4xl font-black tracking-tighter text-white uppercase">
              Pill<span className="text-indigo-500">Pal</span>
            </span>
          </div>

          {/* Auth/User Section */}
          <div className="flex items-center gap-6">
            <span className="hidden md:block text-sm font-medium text-zinc-500">
              {session?.user?.name}
            </span>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="py-2 px-5 bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs font-bold uppercase tracking-widest rounded-full hover:text-white hover:border-zinc-500 transition-all"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Search Box on Top */}
      <div className="w-full max-w-xl mb-8 mt-8">
        <input
          type="text"
          placeholder="🔍 Search medications or history..."
          className="w-full p-3 rounded-xl bg-gray-700 text-gray-200 border border-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-xl transition"
        />
      </div>

      {/* Quick Action Buttons Container */}
      {/* <div className="flex flex-col sm:flex-row gap-6 w-full max-w-xl justify-center"> */}
      <div className="grid grid-cols-2 gap-4 w-full max-w-xl mx-auto">
        {/* Action 1: Add Medication Card */}
        <button
          className="flex-1 p-6 bg-gray-800 border border-indigo-600 rounded-xl shadow-2xl hover:bg-gray-700 transition duration-300 ease-in-out transform hover:scale-[1.02]"
          onClick={() => handleNavigate('/add-medication')}
        >
          <div className="text-3xl mb-2">➕</div>
          <p className="text-lg font-bold text-indigo-400">Add New Medication</p>
          <p className="text-sm text-gray-400 mt-1">Set up pill, dosage, and schedule.</p>
        </button>

        {/* Action 2: Calendar View Card */}
        <button
          className="flex-1 p-6 bg-gray-800 border border-teal-600 rounded-xl shadow-2xl hover:bg-gray-700 transition duration-300 ease-in-out transform hover:scale-[1.02]"
          onClick={() => handleNavigate('/calendar')}
        >
          <div className="text-3xl mb-2">📅</div>
          <p className="text-lg font-bold text-teal-400">View Calendar</p>
          <p className="text-sm text-gray-400 mt-1">Check doses and track intake history.</p>
        </button>

        <button
          onClick={() => handleNavigate('/precautions')}
          className="flex-1 p-6 bg-gray-800 border border-indigo-600 rounded-xl shadow-2xl hover:bg-gray-700 transition duration-300 ease-in-out transform hover:scale-[1.02]"
        >
          <div className="flex justify-between items-start mb-6">
            <div className="text-3xl mb-2">🛡️</div>
            <div className="text-lg mb-2">
              {loading ? "..." : `${meds.length} Active Guidelines`}
            </div>
          </div>

          <p className="text-lg font-bold text-teal-400">Daily Safety Instructions</p>
          <p className="text-zinc-500 text-sm mt-1 text-left">Food pairings and activity warnings for today's doses.</p>

          {/* Subtle Teal Glow */}
          <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-cyan-500/5 rounded-full blur-3xl group-hover:bg-cyan-500/10 transition-all"></div>
        </button>
      </div>
    </div>
  );
}

// (usually in your main layout file) for useSession() to work.
export default DashboardPage;