// src/components/CrashButton.jsx
import React, { useState } from 'react';

export default function CrashButton() {
  const [shouldCrash, setShouldCrash] = useState(false);

  if (shouldCrash) {
    // This will throw a runtime error during the React render phase
    throw new Error('💥 Simulated Application Crash!');
  }

  return (
    <button
      onClick={() => setShouldCrash(true)}
      className="px-4 py-2 bg-red-600 text-white rounded font-bold shadow hover:bg-red-700 transition"
    >
      Test UI Crash
    </button>
  );
}