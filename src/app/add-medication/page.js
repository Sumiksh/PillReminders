'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar'; // Import your new Navbar
import { 
  Pill, 
  Clock, 
  Calendar as CalendarIcon, 
  Plus, 
  Trash2, 
  ChevronLeft, 
  Save,
  Info
} from 'lucide-react';

function AddMedicationForm() {
  const router = useRouter();

  const [medication, setMedication] = useState({
    name: '',
    dosage: '',
    startDate: new Date().toISOString().slice(0, 10),
    times: ['08:00'],
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMedication(prev => ({ ...prev, [name]: value }));
  };

  const handleTimeChange = (index, newTime) => {
    const newTimes = [...medication.times];
    newTimes[index] = newTime;
    setMedication(prev => ({ ...prev, times: newTimes }));
  };

  const handleAddTime = () => {
    setMedication(prev => ({ ...prev, times: [...prev.times, ''] }));
  };

  const handleRemoveTime = (indexToRemove) => {
    setMedication(prev => ({
      ...prev,
      times: prev.times.filter((_, index) => index !== indexToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    if (!medication.name || medication.times.some(t => !t)) {
      alert("Please fill in the medication name and all scheduled times.");
      setIsSaving(false);
      return;
    }

    try {
      const response = await fetch('/api/medications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(medication),
      });

      if (response.ok) {
        router.push('/dashboard');
      } else {
        throw new Error("Failed to save");
      }
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 pb-20">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 pt-12">
        {/* Back Button */}
        <button 
          onClick={() => router.back()}
          className="flex items-center text-slate-400 hover:text-white transition-colors mb-8 group"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Dashboard</span>
        </button>

        <div className="bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-2xl">
          <header className="mb-10">
            <div className="flex items-center gap-4 mb-2">
                <div className="p-3 bg-indigo-500/10 rounded-xl">
                    <Pill className="w-8 h-8 text-indigo-400" />
                </div>
                <h1 className="text-3xl font-bold text-white tracking-tight">Schedule Meds</h1>
            </div>
            <p className="text-slate-400">Set up your dosage and reminders to stay on track with your health.</p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* 1. Medication Name */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-300">
                <Info className="w-4 h-4 text-indigo-400" /> Medication Name
              </label>
              <input
                type="text"
                name="name"
                value={medication.name}
                onChange={handleChange}
                placeholder="e.g., Amoxicillin"
                required
                className="w-full p-4 rounded-2xl bg-slate-800/50 border border-white/10 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-600"
              />
            </div>

            {/* 2. Dosage & Start Date Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-300">
                   Dosage
                </label>
                <input
                  type="text"
                  name="dosage"
                  value={medication.dosage}
                  onChange={handleChange}
                  placeholder="e.g., 250mg"
                  required
                  className="w-full p-4 rounded-2xl bg-slate-800/50 border border-white/10 focus:border-indigo-500 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-300">
                  <CalendarIcon className="w-4 h-4 text-indigo-400" /> Start Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={medication.startDate}
                  onChange={handleChange}
                  required
                  className="w-full p-4 rounded-2xl bg-slate-800/50 border border-white/10 focus:border-indigo-500 outline-none [color-scheme:dark]"
                />
              </div>
            </div>

            {/* 3. Scheduled Times */}
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-300">
                <Clock className="w-4 h-4 text-indigo-400" /> Daily Reminders
              </label>
              
              <div className="grid gap-3">
                {medication.times.map((time, index) => (
                  <div key={index} className="flex gap-3 group">
                    <div className="relative flex-grow">
                      <input
                        type="time"
                        value={time}
                        onChange={(e) => handleTimeChange(index, e.target.value)}
                        required
                        className="w-full p-4 rounded-2xl bg-slate-800/50 border border-white/10 focus:border-indigo-500 outline-none [color-scheme:dark]"
                      />
                    </div>
                    {medication.times.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveTime(index)}
                        className="p-4 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-2xl transition-all"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={handleAddTime}
                className="w-full py-4 border-2 border-dashed border-white/10 rounded-2xl text-slate-400 hover:border-indigo-500/50 hover:text-indigo-400 hover:bg-indigo-500/5 transition-all flex items-center justify-center gap-2 font-medium"
              >
                <Plus className="w-5 h-5" />
                Add Another Time
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSaving}
              className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold rounded-2xl shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
            >
              {isSaving ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <Save className="w-5 h-5" />
              )}
              {isSaving ? 'Saving Schedule...' : 'Confirm Schedule'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddMedicationForm;