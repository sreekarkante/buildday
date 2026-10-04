import React from 'react';

export default function WhoItsFor() {
  return (
    <section className="py-16 bg-[#0A0A0F]">
      <div className="container-main max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="text-green-500">✅</span> This is for you if...
            </h3>
            <ul className="space-y-4">
              {[
                "You're a final-year engineering student",
                "You want a real project for your resume",
                "You've never built an AI app before",
                "You learn better by building than watching",
                "You want something to show recruiters"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-300">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="card bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="text-red-500">❌</span> This is NOT for you if...
            </h3>
            <ul className="space-y-4">
              {[
                "You're looking for an advanced ML course",
                "You want theory without hands-on building",
                "You can't spare 60 minutes"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-red-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span className="text-gray-300">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
