// src/app/add-medication/page.js (or wherever your component is located)

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

function AddMedicationForm() {
  const router = useRouter();

  // Initialize state for the medication data
  const [medication, setMedication] = useState({
    name: '',
    dosage: '',
    startDate: new Date().toISOString().slice(0, 10), // Default to today: YYYY-MM-DD
    times: ['08:00'], // Default starting time
  });
  const [isSaving, setIsSaving] = useState(false);

  // Generic handler for simple input fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setMedication(prev => ({ ...prev, [name]: value }));
  };

  // Handler for updating the scheduled times array
  const handleTimeChange = (index, newTime) => {
    const newTimes = [...medication.times];
    newTimes[index] = newTime;
    setMedication(prev => ({ ...prev, times: newTimes }));
  };

  const handleAddTime = () => {
    setMedication(prev => ({ ...prev, times: [...prev.times, ''] })); // Add empty string for new time input
  };

  const handleRemoveTime = (indexToRemove) => {
    setMedication(prev => ({
      ...prev,
      times: prev.times.filter((_, index) => index !== indexToRemove)
    }));
  };

  // Submission Logic (will integrate with API/Backend later)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    // Simple validation
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
        const result = await response.json();
        console.log("Saved with ID:", result.id);
        router.push('/dashboard');
      } else {
        throw new Error("Failed to save");
      }
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setIsSaving(false);
    }


    // Simulate API call success/failure
    setTimeout(() => {
      setIsSaving(false);
      // router.push('/'); // Uncomment to redirect after simulated save
    }, 1500);
  };

  return (
    // Outer container: Dark theme, centered form layout
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-lg bg-gray-800 p-8 rounded-xl shadow-2xl border border-indigo-700">

        <h1 className="text-3xl font-semibold mb-6 text-indigo-400">➕ Add New Medication</h1>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* 1. Medication Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Medication Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={medication.name}
              onChange={handleChange}
              placeholder="e.g., Losartan"
              required
              className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-indigo-500 focus:ring-indigo-500 text-gray-200"
            />
          </div>

          {/* 2. Dosage */}
          <div>
            <label htmlFor="dosage" className="block text-sm font-medium text-gray-300 mb-1">Dosage</label>
            <input
              type="text"
              id="dosage"
              name="dosage"
              value={medication.dosage}
              onChange={handleChange}
              placeholder="e.g., 50mg"
              required
              className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-indigo-500 focus:ring-indigo-500 text-gray-200"
            />
          </div>

          {/* 3. Start Date */}
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-300 mb-1">Start Date</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={medication.startDate}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-indigo-500 focus:ring-indigo-500 text-gray-200"
            />
          </div>

          {/* 4. Scheduled Times (Dynamic List) */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-300 mb-2">Scheduled Times (Local)</label>

            {medication.times.map((time, index) => (
              <div key={index} className="flex gap-3 items-center">
                <input
                  type="time"
                  value={time}
                  onChange={(e) => handleTimeChange(index, e.target.value)}
                  required
                  className="flex-grow p-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-indigo-500 focus:ring-indigo-500 text-gray-200"
                />

                {medication.times.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveTime(index)}
                    className="p-3 bg-red-600 hover:bg-red-700 rounded-lg text-white font-bold transition"
                    aria-label="Remove time"
                  >
                    ➖
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={handleAddTime}
              className="w-full p-3 bg-gray-700 text-indigo-400 border border-dashed border-indigo-700 rounded-lg hover:bg-gray-600 transition"
            >
              + Add Another Time
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSaving}
            className="w-full p-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition disabled:bg-indigo-900 disabled:cursor-not-allowed"
          >
            {isSaving ? 'Saving...' : 'Save Medication'}
          </button>

        </form>

      </div>
    </div>
  );
}

export default AddMedicationForm;