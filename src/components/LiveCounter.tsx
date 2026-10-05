'use client';

import React, { useState, useEffect } from 'react';

export default function LiveCounter() {
  const [stats, setStats] = useState<{ total: number; goal: number; percent: number; collegeCount: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/stats', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          setStats({ total: data.total, goal: data.goal, percent: data.percent, collegeCount: data.college_count });
        } else {
          setStats({ total: 0, goal: 500, percent: 0, collegeCount: 0 });
        }
      } catch (error) {
        setStats({ total: 0, goal: 500, percent: 0, collegeCount: 0 });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full flex flex-col items-center py-6">
      {loading ? (
        <div className="w-64 h-16 bg-white/5 animate-pulse rounded-xl"></div>
      ) : stats ? (
        <div className="w-full max-w-md text-center">
          <h3 className="text-xl font-semibold text-white mb-3">
            {stats.total} of {stats.goal} registered
          </h3>
          <div className="w-full bg-white/10 rounded-full h-4 mb-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-600 to-cyan-500 h-4 rounded-full transition-all duration-1000 ease-out relative"
              style={{ width: `${stats.percent}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
