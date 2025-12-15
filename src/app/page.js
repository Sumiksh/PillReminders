// src/app/page.js

'use client'; 

import React from 'react';
import { useRouter } from 'next/navigation'; // Using standard Next.js router

function LandingPage() {
  const router = useRouter();

  const handleNavigate = (path) => {
    router.push(path);
  };

  return (
    // Outer container: Full screen height, centered content, dark background
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center p-4">
      
      {/* Search Box on Top */}
      <div className="w-full max-w-xl mb-20">
        <input 
          type="text" 
          placeholder="🔍 Search medications or history..." 
          className="w-full p-3 rounded-xl bg-gray-700 text-gray-200 border border-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-xl transition"
        />
      </div>

      {/* Quick Action Buttons Container */}
      {/* Flex container to center items, space out, and keep them in one row */}
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
      
      {/* Welcome Text centered */}
      <h2 className="mt-12 text-2xl font-light text-gray-400">👋 Your Pill Scheduler</h2>
      
    </div>
  );
}

export default LandingPage;