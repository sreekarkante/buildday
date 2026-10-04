import Link from 'next/link';
import React from 'react';

export default function Hero() {
  return (
    <section className="w-full bg-gradient-to-b from-[#0A0A0F] to-black py-16 md:py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20"></div>
      <div className="container-main relative z-10 flex flex-col items-center md:items-start text-center md:text-left">
        <h1 className="section-heading mb-6 max-w-4xl">
          <span className="block text-white mb-2 text-3xl md:text-4xl lg:text-5xl font-bold">Build Your First AI Project in 60 Minutes.</span>
          <span className="block bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent text-3xl md:text-4xl lg:text-5xl font-bold">Free.</span>
        </h1>
        <p className="text-gray-400 text-lg md:text-xl mb-8 max-w-2xl">
          Final-year engineering student? Leave with a working AI project for your resume.
        </p>
        <div className="w-full md:w-auto mb-6">
          <Link href="#matcher" className="btn-primary bg-gradient-to-r from-blue-600 to-cyan-500 text-white block w-full text-center px-8 py-4 rounded-lg font-bold text-lg md:inline-block">
            Reserve My Seat →
          </Link>
        </div>
        <p className="text-gray-400 font-medium flex items-center justify-center md:justify-start gap-2 mb-12">
          <span>⚡</span> 60 minutes &middot; 100% free &middot; No coding background needed
        </p>
        <div className="mt-8 pt-8 border-t border-white/10 w-full max-w-4xl">
          <p className="text-gray-500 text-sm font-medium">
            By NxtWave &middot; NSDC Partner &middot; WEF Technology Pioneer
          </p>
        </div>
      </div>
    </section>
  );
}
