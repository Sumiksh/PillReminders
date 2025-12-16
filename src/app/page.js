// src/app/page.js

'use client'; 

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
// --- Import NextAuth Client functions ---
import { signIn } from 'next-auth/react'; 

function AuthPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Handles the click event to initiate the Google OAuth sign-in flow.
   */
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    
    try {
      // 1. Call signIn, specifying the provider ('google')
      // and redirecting to the dashboard on success.
      const result = await signIn('google', { 
        redirect: false, // Prevents full page reload/redirect from the hook itself
        callbackUrl: '/dashboard' // Where to go after successful authentication
      });

      if (result && result.error) {
        // Handle errors (e.g., user cancels, Google service error)
        console.error("Google Sign-In Error:", result.error);
        alert(`Authentication failed: ${result.error}`);
      } else {
        // If no error, the callback URL logic will take over the navigation
        // If redirect:false is used, manually push to the dashboard on success
        if (result && !result.error) {
            router.push('/dashboard');
        }
      }

    } catch (error) {
      console.error("Sign-in process failed:", error);
      alert("An unexpected error occurred during sign-in.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Outer container: Dark theme, centered
    <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center p-4">
      
      <div className="w-full max-w-sm bg-gray-800 p-8 rounded-xl shadow-2xl border border-indigo-700 text-center">
        
        <h1 className="text-3xl font-bold mb-4 text-indigo-400">Pill Scheduler</h1>
        <p className="text-gray-400 mb-8">Secure access via your preferred provider.</p>
        
        {/* OAuth Button (Google Example) */}
        <button 
          type="button" 
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="w-full p-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition disabled:bg-red-900 flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            'Redirecting...'
          ) : (
            <>
              {/* Note: You would typically use a proper SVG icon here */}
              <span>G</span> 
              <span>Sign in with Google</span>
            </>
          )}
        </button>

        <div className="mt-8 text-sm text-gray-500">
            By signing in, you agree to our terms of service.
        </div>

      </div>
    </div>
  );
}

export default AuthPage;