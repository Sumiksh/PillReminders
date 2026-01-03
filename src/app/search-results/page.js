import React, { Suspense } from "react";
import SearchResultsContent from "./SearchResultsContent";
import Navbar from "@/components/Navbar";

export default function SearchResultsPage() {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-200">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* The Suspense boundary fixes the build error */}
        <Suspense fallback={
          <div className="flex flex-col items-center justify-center pt-20">
            <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
            <p className="mt-4 text-slate-500 animate-pulse">Searching clinical database...</p>
          </div>
        }>
          <SearchResultsContent />
        </Suspense>
      </main>
    </div>
  );
}