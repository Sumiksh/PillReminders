'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
// Icons for a professional look
import { Pill, Chrome, Loader2, ShieldCheck } from 'lucide-react';

function AuthPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const result = await signIn('google', {
        redirect: false,
        callbackUrl: '/dashboard',
      });

      if (result?.error) {
        console.error("Google Sign-In Error:", result.error);
        alert(`Authentication failed: ${result.error}`);
      } else if (result?.ok) {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error("Sign-in process failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-900/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/20 blur-[120px] rounded-full" />

      {/* Main Card */}
      <div className="w-full max-w-md z-10">
        <div className="bg-gray-900/50 backdrop-blur-xl border border-white/10 p-10 rounded-3xl shadow-2xl">
          
          {/* Logo Section */}
          <div className="flex flex-col items-center mb-10">
            <div className="w-16 h-16 bg-indigo-600/20 rounded-2xl flex items-center justify-center mb-4 border border-indigo-500/30">
              <Pill className="w-8 h-8 text-indigo-400" />
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">
              Pill <span className="text-indigo-400">Scheduler</span>
            </h1>
            <p className="text-gray-400 text-sm">Your health, perfectly timed.</p>
          </div>

          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-lg font-medium text-gray-200">Welcome Back</h2>
              <p className="text-sm text-gray-500 mt-1">Sign in to manage your medication</p>
            </div>

            {/* Google Button */}
            <button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="group relative w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-gray-900 font-semibold py-3.5 px-4 rounded-xl transition-all duration-200 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
              ) : (
                <Chrome className="w-5 h-5 text-[#4285F4]" />
              )}
              {isLoading ? 'Connecting...' : 'Continue with Google'}
            </button>

            {/* Trust Badges */}
            <div className="flex items-center justify-center gap-2 pt-4 text-[10px] uppercase tracking-widest text-gray-500 font-bold">
              <ShieldCheck className="w-3 h-3" />
              <span>Secure Encrypted Connection</span>
            </div>
          </div>
        </div>

        {/* Footer Links */}
        <p className="text-center mt-8 text-gray-500 text-xs">
          By continuing, you agree to our 
          <a href="#" className="text-indigo-400 hover:underline mx-1">Terms</a> 
          & 
          <a href="#" className="text-indigo-400 hover:underline mx-1">Privacy Policy</a>
        </p>
      </div>
    </div>
  );
}

export default AuthPage;