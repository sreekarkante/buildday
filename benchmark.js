const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8');
const key = env.match(/GEMINI_API_KEY=(.*)/)[1].trim();

const models = ['gemini-3.1-flash-lite', 'gemini-3.5-flash-lite', 'gemini-3.8-flash'];
const promptText = `You are an expert engineering mentor. Generate a software project idea for a final-year engineering student.
Branch: CSE - Computer Science
Interest: Healthcare
The project must be buildable in 60 minutes using AI tools.
Output STRICT JSON exactly matching this format, with no markdown formatting or extra text:
{
  "title": "Project Name",
  "pitch": "A 1-sentence exciting description.",
  "outcome": "A short sentence on what they will have at the end for their resume.",
  "blueprint": [
    { "time": "0-10 min", "step": "Setup and environment config...", "tools": "Cursor, Next.js" },
    { "time": "10-35 min", "step": "Core application build...", "tools": "Supabase, LLM API" },
    { "time": "35-50 min", "step": "Testing and refinement...", "tools": "Browser DevTools" },
    { "time": "50-60 min", "step": "Demo and deployment...", "tools": "Vercel" }
  ]
}`;

async function runBenchmark() {
  console.log('| Model | Run | Latency (ms) | JSON Parsed |');
  console.log('|---|---|---|---|');
  
  for (const model of models) {
    for (let i = 1; i <= 3; i++) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      const start = Date.now();
      let parsed = false;
      let latency = -1;
      
      try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: promptText }] }],
            generationConfig: {
              temperature: 0.1,
              responseMimeType: 'application/json'
            }
          }),
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        latency = Date.now() - start;
        
        if (res.ok) {
          const data = await res.json();
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
          try {
            JSON.parse(text);
            parsed = true;
          } catch(e) {}
        }
      } catch (e) {
        latency = Date.now() - start;
      }
      
      console.log(`| ${model} | ${i} | ${latency} | ${parsed ? 'Yes' : 'No'} |`);
    }
  }
}

runBenchmark().catch(console.error);
