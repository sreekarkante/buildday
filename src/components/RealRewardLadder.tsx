'use client';

import { useState, useEffect, useCallback } from 'react';
import { REWARD_TIERS } from '@/lib/rewards';

export default function RealRewardLadder({ refCode }: { refCode: string }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchRewards = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/rewards?ref=${refCode}`, {
        cache: 'no-store'
      });
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [refCode]);

  useEffect(() => {
    fetchRewards();
    const interval = setInterval(fetchRewards, 30000);
    return () => clearInterval(interval);
  }, [fetchRewards]);

  if (loading && !data) {
    return (
      <div className="mt-8 bg-black/30 rounded-xl p-5 text-center text-gray-400 animate-pulse">
        Loading rewards...
      </div>
    );
  }

  const currentReferrals = data?.count || 0;
  const nextTier = data?.nextTier;
  const referralsToNext = data?.referralsToNext || 0;

  return (
    <div className="mt-8 bg-black/30 rounded-xl p-5 relative">
      <div className="absolute top-4 right-4">
        <button 
          onClick={fetchRewards}
          disabled={loading}
          className="text-xs bg-white/10 hover:bg-white/20 text-gray-300 px-3 py-1.5 rounded-full transition-colors disabled:opacity-50"
        >
          {loading ? 'Refreshing...' : '↻ Refresh'}
        </button>
      </div>

      <div className="flex justify-between items-center mb-4">
        <span className="font-medium text-sm text-gray-300">
          Your Valid Referrals
        </span>
        <span className="text-3xl font-bold gradient-text pr-16">
          {currentReferrals}
        </span>
      </div>
      
      {currentReferrals === 0 && (
        <p className="text-sm text-gray-400 mb-6 italic">
          Share your link! When friends sign up, you'll unlock rewards here.
        </p>
      )}

      {nextTier ? (
        <div className="mb-6">
          <div className="flex justify-between text-xs text-gray-400 mb-2 font-medium">
            <span>
              <span className="text-cyan-400 font-bold">{referralsToNext}</span> more to unlock <span className="text-white">{nextTier.name}</span>
            </span>
            <span>
              {currentReferrals} / {nextTier.referrals}
            </span>
          </div>
          <div className="w-full bg-white/5 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-accent-blue to-accent-cyan h-full rounded-full transition-all duration-700 ease-out"
              style={{
                width: `${Math.min((currentReferrals / nextTier.referrals) * 100, 100)}%`,
              }}
            />
          </div>
        </div>
      ) : (
        <div className="mb-6 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 p-3 rounded-lg text-sm text-center font-medium">
          🌟 You have unlocked all available rewards! 🌟
        </div>
      )}

      <div className="space-y-3">
        {REWARD_TIERS.map((tier, idx) => {
          const isAchieved = currentReferrals >= tier.referrals;
          return (
            <div
              key={idx}
              className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                isAchieved
                  ? 'bg-emerald-500/10 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                  : 'border-white/5 bg-black/40'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isAchieved ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-gray-600'}`}>
                  {isAchieved ? '✓' : tier.referrals}
                </div>
                <div>
                  <span
                    className={`text-sm font-semibold block mb-0.5 ${
                      isAchieved ? 'text-emerald-300' : 'text-gray-400'
                    }`}
                  >
                    {tier.name}
                  </span>
                  {isAchieved ? (
                    <p className="text-xs text-emerald-400/80 font-medium">Unlocked! Check your email soon.</p>
                  ) : (
                    <p className="text-xs text-gray-500">{tier.description}</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
