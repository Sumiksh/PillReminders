'use client';

import React from 'react';
import { signOut, useSession } from 'next-auth/react';
import { Pill, LogOut, User, Bell } from 'lucide-react';
import Link from 'next/link';

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="w-full border-b border-white/5 bg-slate-950/60 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-18 py-4">
          
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="h-10 w-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(79,70,229,0.3)] group-hover:scale-110 transition-transform">
              <Pill className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tighter text-white">
              Pill<span className="text-indigo-400">Scheduler</span>
            </span>
          </Link>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2 sm:gap-6">
            <div className="h-8 w-[1px] bg-white/10 hidden sm:block"></div>

            <div className="flex items-center gap-3">
              <div className="hidden md:flex flex-col items-end">
                <span className="text-sm font-semibold text-slate-200 leading-none">{session?.user?.name}</span>
                {/* <span className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Premium Member</span> */}
              </div>

              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="ml-2 p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}