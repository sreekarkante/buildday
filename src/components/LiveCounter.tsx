'use client';

import React, { useState, useEffect } from 'react';

export default function LiveCounter() {
  const [stats, setStats] = useState<{ count: number; collegeCount: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/stats');
        if (res.ok) {
          const data = await res.json();
          setStats({ count: data.count, collegeCount: data.college_count });
        } else {
          setStats({ count: 0, collegeCount: 0 });
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
        setStats({ count: 0, collegeCount: 0 });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-8 bg-[#0A0A0F]">
      <div className="container-main max-w-6xl mx-auto px-4 text-center flex flex-col items-center">
        {loading ? (
          <div className="w-64 h-16 bg-white/5 animate-pulse rounded-xl"></div>
        ) : stats && stats.count >= 25 ? (
          <div className="w-full max-w-md">
            <h3 className="text-xl font-semibold text-white mb-3">
              {stats.count} of 500 seats claimed
            </h3>
            <div className="w-full bg-white/10 rounded-full h-4 mb-3 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-blue-600 to-cyan-500 h-4 rounded-full transition-all duration-1000 ease-out relative"
                style={{ width: `${Math.min((stats.count / 500) * 100, 100)}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
              </div>
            </div>
            <p className="text-gray-400 text-sm">
              Students from {stats.collegeCount} colleges
            </p>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-3 w-full">
            <div className="w-3 h-3 bg-cyan-500 rounded-full animate-ping"></div>
            <h3 className="text-xl font-semibold text-white">
              Be one of the first 500 to register
            </h3>
          </div>
        )}
      </div>
    </section>
  );
}
