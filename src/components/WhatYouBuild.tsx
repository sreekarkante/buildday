import Link from 'next/link';
import React from 'react';

export default function WhatYouBuild() {
  const projects = [
    {
      title: "AI Resume Screener",
      desc: "Paste a job description + your resume. Get an instant match score and improvement tips.",
      tag: "Most Popular",
      emoji: "📄"
    },
    {
      title: "Smart Study Notes",
      desc: "Upload lecture notes. Get AI-generated summaries, flashcards, and quiz questions.",
      tag: "Student Favourite",
      emoji: "🧠"
    },
    {
      title: "Campus Q&A Bot",
      desc: "Build a chatbot that answers questions about your college using AI.",
      tag: "Impressive for Interviews",
      emoji: "🤖"
    }
  ];

  return (
    <section className="py-16 bg-[#0A0A0F]">
      <div className="container-main max-w-6xl mx-auto px-4">
        <h2 className="section-heading text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-12 text-white">What You'll Build</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {projects.map((project, idx) => (
            <div key={idx} className="card bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-start relative overflow-hidden">
              <div className="text-4xl mb-4">{project.emoji}</div>
              <h3 className="text-xl font-bold text-white mb-3">{project.title}</h3>
              <p className="text-gray-400 mb-6 flex-grow">{project.desc}</p>
              <span className="inline-block px-3 py-1 bg-cyan-500/10 text-cyan-500 rounded-full text-xs font-semibold uppercase tracking-wider">
                {project.tag}
              </span>
            </div>
          ))}
        </div>
        <div className="text-center text-gray-400">
          <p className="mb-2">...and you'll get YOUR personalised project idea after registering</p>
          <Link href="/register" className="text-cyan-500 hover:text-cyan-400 inline-flex items-center gap-1 font-medium transition-colors">
            Get your idea <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
