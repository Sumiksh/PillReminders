// src/app/dashboard/page.js

'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
// Import NextAuth client functions to check session status
import { useSession, signOut } from 'next-auth/react'; 

function DashboardPage() {
  const router = useRouter();
  // 1. Check the session status
  const { data: session, status } = useSession();

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
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center p-4">
      
      {/* Header with User Info and Logout */}
      <div className="w-full max-w-xl flex justify-between items-center mb-8">
        <h2 className="text-xl font-light text-gray-400">
          Welcome, {session?.user?.name?.split(' ')[0] || 'User'}!
        </h2>
        <button 
          onClick={() => signOut({ callbackUrl: '/' })}
          className="py-1 px-3 bg-red-600 text-sm rounded-lg hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>

      {/* Search Box on Top */}
      <div className="w-full max-w-xl mb-8">
        <input 
          type="text" 
          placeholder="🔍 Search medications or history..." 
          className="w-full p-3 rounded-xl bg-gray-700 text-gray-200 border border-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-xl transition"
        />
      </div>

      {/* Quick Action Buttons Container */}
      <div className="flex flex-col sm:flex-row gap-6 w-full max-w-xl justify-center">
        
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
      </div>
    </div>
  );
}

// NOTE: You must wrap your entire application with <SessionProvider> 
// (usually in your main layout file) for useSession() to work.
export default DashboardPage;