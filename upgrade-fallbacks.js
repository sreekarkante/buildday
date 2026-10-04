const fs = require('fs');
const code = fs.readFileSync('src/lib/fallback-ideas.ts', 'utf8');
const match = code.match(/export const FALLBACK_IDEAS.*?=\s*(\{.*?\});/s);
if (!match) throw new Error("Could not parse FALLBACK_IDEAS");
const obj = eval('(' + match[1] + ')');

for (const branch in obj) {
  obj[branch] = obj[branch].map(idea => ({
    title: idea.title,
    pitch: idea.pitch,
    outcome: 'A fully working AI prototype you can link directly on your resume.',
    blueprint: [
      { time: '0-10 min', step: 'Environment Setup: ' + idea.blueprint[0], tools: 'VScode, Next.js' },
      { time: '10-35 min', step: 'Core Logic: ' + (idea.blueprint[1] || 'Implement AI logic'), tools: 'Gemini API, Supabase' },
      { time: '35-50 min', step: 'UI & Refinement: ' + (idea.blueprint[2] || 'Design the interface'), tools: 'Tailwind CSS' },
      { time: '50-60 min', step: 'Demo & Deploy: ' + (idea.blueprint[3] || 'Ship to production'), tools: 'Vercel' }
    ]
  }));
}

const out = `export interface BlueprintStep {
  time: string;
  step: string;
  tools: string;
}

export interface ProjectIdea {
  title: string;
  pitch: string;
  outcome: string;
  blueprint: BlueprintStep[];
}

export const FALLBACK_IDEAS: Record<string, ProjectIdea[]> = ${JSON.stringify(obj, null, 2)};
`;

fs.writeFileSync('src/lib/fallback-ideas.ts', out);
