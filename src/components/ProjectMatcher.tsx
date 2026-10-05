'use client';

import { useState, useEffect } from 'react';
import { BRANCHES } from '@/lib/constants';
import Link from 'next/link';

export default function ProjectMatcher() {
  const [branch, setBranch] = useState('');
  const [interest, setInterest] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ title: string; pitch: string } | null>(null);
  const [sessionId, setSessionId] = useState('');

  useEffect(() => {
    let sid = '';
    try {
      sid = sessionStorage.getItem('buildday_session_id') || '';
      if (!sid) {
        sid = Array.from(crypto.getRandomValues(new Uint8Array(8)))
          .map((b) => b.toString(16).padStart(2, '0'))
          .join('');
        sessionStorage.setItem('buildday_session_id', sid);
      }
    } catch {
      sid = Math.random().toString(36).slice(2, 18);
    }
    setSessionId(sid);
  }, []);

  const handleMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!branch) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/matcher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId, branch, interest }),
      });
      const data = await res.json();
      if (data.success) {
        setResult(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="matcher" className="py-20 relative overflow-hidden bg-gradient-to-b from-black to-[#0A0A0F]">
      <div className="container-main max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Find Your <span className="gradient-text">Perfect AI Project</span>
          </h2>
          <p className="text-gray-400">
            Tell us your branch, and our AI will generate a personalized 60-minute project idea for your resume.
          </p>
        </div>

        <div className="card max-w-2xl mx-auto border-accent-cyan/20">
          {!result ? (
            <form onSubmit={handleMatch} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Your Engineering Branch <span className="text-red-400">*</span>
                </label>
                <select
                  required
                  className="input-field bg-black/40"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                >
                  <option value="">Select Branch</option>
                  {BRANCHES.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  What are you interested in? <span className="text-gray-500">(Optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sports, Finance, Healthcare, Space..."
                  className="input-field bg-black/40"
                  value={interest}
                  onChange={(e) => setInterest(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={loading || !branch}
                className="btn-primary w-full py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Matching...
                  </>
                ) : (
                  '✨ Match My Project Idea'
                )}
              </button>
            </form>
          ) : (
            <div className="text-center animate-fade-in space-y-6">
              <div className="inline-block p-4 rounded-2xl bg-accent-blue/10 border border-accent-blue/20 mb-2">
                <span className="text-4xl">💡</span>
              </div>
              <h3 className="text-2xl font-bold text-white">{result.title}</h3>
              <p className="text-gray-300 text-lg leading-relaxed">{result.pitch}</p>
              
              <div className="p-4 bg-white/5 border border-white/10 rounded-xl mt-6 relative overflow-hidden group text-left">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80 z-10 flex items-end justify-center pb-4">
                  <span className="text-sm font-medium text-cyan-400 bg-black/50 px-4 py-1.5 rounded-full border border-cyan-500/30 shadow-lg">
                    🔒 Blueprint Locked
                  </span>
                </div>
                
                <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">60-Minute Execution Plan</p>
                <ul className="space-y-4 blur-[3px] select-none text-gray-500">
                  <li className="flex gap-4">
                    <div className="w-16 shrink-0 text-xs font-mono text-cyan-500 mt-0.5">0-10 min</div>
                    <div>
                      <div className="font-semibold text-gray-300 text-sm">Environment Setup</div>
                      <div className="text-xs mt-1 text-gray-600">Tools: Cursor, Next.js</div>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <div className="w-16 shrink-0 text-xs font-mono text-cyan-500 mt-0.5">10-35 min</div>
                    <div>
                      <div className="font-semibold text-gray-300 text-sm">Core Logic &amp; AI Integration</div>
                      <div className="text-xs mt-1 text-gray-600">Tools: Gemini API, Supabase</div>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <div className="w-16 shrink-0 text-xs font-mono text-cyan-500 mt-0.5">35-60 min</div>
                    <div>
                      <div className="font-semibold text-gray-300 text-sm">Testing, Refinement &amp; Deployment</div>
                      <div className="text-xs mt-1 text-gray-600">Tools: Tailwind, Vercel</div>
                    </div>
                  </li>
                </ul>
              </div>

              <Link href="/register" className="btn-primary inline-block w-full py-4 text-lg mt-6 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                Claim Project &amp; Unlock Blueprint →
              </Link>
              <button 
                onClick={() => setResult(null)} 
                className="text-gray-500 text-sm hover:text-white transition-colors mt-4 block w-full"
              >
                Try another match
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
