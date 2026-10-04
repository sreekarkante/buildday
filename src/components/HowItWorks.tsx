import React from 'react';

export default function HowItWorks() {
  const steps = [
    {
      num: 1,
      title: "Register",
      desc: "Fill a 2-minute form. Pick your time slot.",
      icon: (
        <svg className="w-6 h-6 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      )
    },
    {
      num: 2,
      title: "Join Live",
      desc: "60 minutes of live building. Follow along, ask questions.",
      icon: (
        <svg className="w-6 h-6 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      num: 3,
      title: "Submit & Earn",
      desc: "Submit your project. Get a certificate for your resume.",
      icon: (
        <svg className="w-6 h-6 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      )
    }
  ];

  return (
    <section className="py-16 bg-[#0A0A0F]">
      <div className="container-main max-w-6xl mx-auto px-4">
        <h2 className="section-heading text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-12 text-white">How It Works</h2>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-stretch gap-6 relative">
          <div className="hidden md:block absolute top-1/2 left-[15%] right-[15%] h-0.5 bg-white/10 -translate-y-1/2 z-0"></div>
          {steps.map((step, idx) => (
            <div key={idx} className="card bg-white/5 border border-white/10 rounded-2xl p-6 relative z-10 flex-1 flex flex-col items-center text-center w-full">
              <div className="w-12 h-12 bg-[#0A0A0F] border-2 border-cyan-500 rounded-full flex items-center justify-center mb-4 text-cyan-500 font-bold text-xl relative">
                {step.num}
              </div>
              <div className="mb-4 p-3 bg-white/5 rounded-full">
                {step.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
              <p className="text-gray-400">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
