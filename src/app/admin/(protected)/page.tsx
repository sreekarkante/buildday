'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

export default function AdminDashboard() {
  const router = useRouter();
  const [simMode, setSimMode] = useState(false);
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

  useEffect(() => {
    async function fetchMetrics() {
      setLoading(true);
      try {
        const url = `/api/admin/metrics${simMode ? '?sim=1' : ''}`;
        const res = await fetch(url, { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          setMetrics(data);
        }
      } catch (err) {
        console.error('Failed to fetch metrics', err);
      } finally {
        setLoading(false);
      }
    }
    fetchMetrics();
  }, [simMode]);

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

  const handleExport = () => {
    const url = `/api/admin/export.csv${simMode ? '?sim=1' : ''}`;
    window.location.href = url;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleExport}
            className="btn-secondary flex items-center gap-2"
          >
            Export CSV
          </button>
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
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="w-8 h-8 border-4 border-accent-cyan border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : metrics ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card text-center">
              <h3 className="text-gray-400 font-medium mb-1">Total Registrants</h3>
              <p className="text-4xl font-bold text-white">{metrics.total}</p>
            </div>
            <div className="card text-center">
              <h3 className="text-gray-400 font-medium mb-1">Goal</h3>
              <p className="text-4xl font-bold text-white">{metrics.goal}</p>
            </div>
            <div className="card text-center">
              <h3 className="text-gray-400 font-medium mb-1">% to Goal</h3>
              <p className="text-4xl font-bold text-white">{metrics.percent.toFixed(1)}%</p>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold mb-4 text-white">Campaign Pace (7 Days)</h3>
            <div className="h-[300px] w-full text-black">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={metrics.daily} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="date" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#12121A', borderColor: 'rgba(255,255,255,0.1)', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="cumulative" name="Actual Cumulative" stroke="#06B6D4" strokeWidth={3} activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="paceCumulative" name="Pace to 500" stroke="#2563EB" strokeWidth={3} strokeDasharray="5 5" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="text-lg font-semibold mb-4 text-white">Channels</h3>
              <div className="divide-y divide-white/10">
                {metrics.channels.map((ch: any) => (
                  <div key={ch.source} className="py-3 flex justify-between items-center">
                    <span className="font-medium text-gray-300">{ch.source}</span>
                    <div className="text-right">
                      <span className="text-white font-bold block">{ch.count}</span>
                      <span className="text-xs text-gray-500">{ch.share.toFixed(1)}%</span>
                    </div>
                  </div>
                ))}
                {metrics.channels.length === 0 && <p className="text-gray-500 text-sm">No data yet.</p>}
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold mb-4 text-white">Funnel</h3>
              <div className="divide-y divide-white/10">
                {metrics.funnel.map((step: any) => (
                  <div key={step.step} className="py-3 flex justify-between items-center">
                    <span className="font-medium text-gray-300">{step.step}</span>
                    <span className="text-white font-bold">{step.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="card text-center text-red-400">
          Failed to load metrics.
        </div>
      )}
    </div>
  );
}
