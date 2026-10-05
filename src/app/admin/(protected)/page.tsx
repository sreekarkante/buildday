'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const router = useRouter();
  const [simMode, setSimMode] = useState(false);

  useEffect(() => {
    // Read sim mode from a cookie so it persists
    const isSim = document.cookie.includes('sim_mode=1');
    setSimMode(isSim);

    const logoutBtn = document.getElementById('logout-btn');
    const handleLogout = async () => {
      await fetch('/api/admin/logout', { method: 'POST' });
      router.push('/admin/login');
    };
    if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);
    return () => {
      if (logoutBtn) logoutBtn.removeEventListener('click', handleLogout);
    };
  }, [router]);

  const toggleSimMode = () => {
    const newVal = !simMode;
    setSimMode(newVal);
    if (newVal) {
      document.cookie = "sim_mode=1; path=/; max-age=86400"; // 1 day
    } else {
      document.cookie = "sim_mode=; path=/; max-age=0";
    }
    router.refresh();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-3 bg-white/5 border border-white/10 p-2 rounded-xl">
          <span className="text-sm font-medium text-gray-300">Simulation Mode</span>
          <button 
            onClick={toggleSimMode}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${simMode ? 'bg-amber-500' : 'bg-gray-600'}`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${simMode ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>
      </div>

      {simMode && (
        <div className="bg-amber-500/10 border border-amber-500/20 text-amber-500 p-4 rounded-xl flex items-center gap-3">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span className="font-semibold">Simulated Data Mode Active</span>
          <span className="text-amber-500/70 text-sm ml-auto">API requests will include ?sim=1</span>
        </div>
      )}

      <div className="card">
        <p className="text-gray-400">Welcome to the admin dashboard. (Leaderboard pending Task 4).</p>
      </div>
    </div>
  );
}
