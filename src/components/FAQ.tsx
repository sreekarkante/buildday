'use client';

import { FAQ_ITEMS } from '@/lib/constants';
import React, { useState } from 'react';

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  // Fallback if constants aren't defined yet
  const faqs = FAQ_ITEMS || [
    { question: "Is it really free?", answer: "Yes, 100% free." },
    { question: "Do I need coding experience?", answer: "Basic understanding helps but is not required." },
    { question: "Will I get a certificate?", answer: "Yes, upon project submission." },
    { question: "How long is the workshop?", answer: "Exactly 60 minutes." },
    { question: "What do I need to prepare?", answer: "Just a laptop and internet connection." },
    { question: "Are there recordings available?", answer: "Only for those who register and attend." }
  ];

  return (
    <section className="py-16 bg-[#0A0A0F]">
      <div className="container-main max-w-6xl mx-auto px-4 max-w-3xl">
        <h2 className="section-heading text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-12 text-white">Frequently Asked Questions</h2>
        
        <div className="space-y-4 max-w-3xl mx-auto">
          {faqs.map((faq, idx) => (
            <div key={idx} className="card bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
              <button
                className="w-full px-6 py-4 flex items-center justify-between text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 rounded-2xl"
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
              >
                <span className="font-semibold text-white">{faq.question}</span>
                <svg 
                  className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${openIdx === idx ? 'rotate-180' : ''}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <div 
                className={`transition-all duration-300 ease-in-out ${openIdx === idx ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                style={{ overflow: 'hidden' }}
              >
                <div className="px-6 pb-4 pt-0 text-gray-400">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
