import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-server';
import { FALLBACK_IDEAS } from '@/lib/fallback-ideas';

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  let source = 'fallback';

  try {
    const { session_id, branch, interest } = await req.json();

    if (!session_id || !branch) {
      return NextResponse.json({ success: false, message: 'Missing parameters' }, { status: 400 });
    }

    let idea = null;
    const apiKey = process.env.GEMINI_API_KEY;
    const modelName = process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite';

    if (apiKey && apiKey !== 'your-gemini-key') {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4500);

        const prompt = `You are an expert engineering mentor. Generate a software project idea for a final-year engineering student.
Branch: ${branch}
Interest: ${interest || 'General'}
CRITICAL CONSTRAINTS:
1. Every idea must be buildable by a complete beginner in 60 minutes.
2. Must use ONLY a simple web app (Next.js or plain HTML/JS) and a single LLM API call.
3. Use ONLY free tiers.
4. NO blockchain, NO hardware, NO robotics, NO model training, NO paid services.
5. The core feature must be demoable in under 2 minutes.
6. Prefer ideas where the user types or uploads something (text/image) and the AI returns something useful.

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

        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.1,
              responseMimeType: 'application/json'
            }
          }),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (res.ok) {
          const data = await res.json();
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) {
            try {
              idea = JSON.parse(text);
              source = 'gemini';
            } catch (parseError: any) {
              console.error(`[Matcher] JSON Parse Error (Model: ${modelName}):`, {
                type: 'json_parse_failure',
                message: parseError.message,
                raw_text: text
              });
            }
          }
        } else {
          const errorText = await res.text();
          let type = 'http_error';
          if (res.status === 400) type = 'bad_request';
          if (res.status === 401 || res.status === 403) type = 'auth_failure';
          if (res.status === 404) type = 'model_not_found';
          
          console.error(`[Matcher] HTTP Error (Model: ${modelName}):`, {
            type,
            status: res.status,
            message: errorText
          });
        }
      } catch (error: any) {
        const isTimeout = error.name === 'AbortError';
        console.error(`[Matcher] Execution Error (Model: ${modelName}):`, {
          type: isTimeout ? 'timeout' : 'network_or_unknown',
          message: error.message || error.toString()
        });
      }
    }

    if (!idea || !idea.title || !idea.blueprint) {
      const branchIdeas = FALLBACK_IDEAS[branch] || FALLBACK_IDEAS['Other'];
      const pickIndex = session_id.length % branchIdeas.length;
      idea = branchIdeas[pickIndex];
    }

    // Fire and forget DB insert so the response is instant
    // Using .then() instead of .catch() directly because Supabase returns a thenable, not a native Promise
    const supabase = getSupabaseAdmin();
    supabase.from('matcher_results').insert({
      session_id,
      branch,
      interest,
      result: idea
    }).then(({ error }) => {
      if (error) console.error('[Matcher] DB Insert Error:', error);
    });

    const latency_ms = Date.now() - startTime;
    const currentModel = apiKey && apiKey !== 'your-gemini-key' ? (process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite') : 'none';
    console.log(`Matcher executed in ${latency_ms}ms (Source: ${source}, Model: ${currentModel})`);

    return NextResponse.json({
      success: true,
      data: {
        title: idea.title,
        pitch: idea.pitch
      },
      meta: {
        source,
        model: currentModel,
        latency_ms
      }
    });

  } catch (error: any) {
    console.error('CRITICAL Matcher error (serving fallback):', error.stack || error);
    
    // In case of any catastrophic failure, still return 200 with a safe fallback
    const fallbackIdea = FALLBACK_IDEAS['Other'][0];
    return NextResponse.json({
      success: true,
      data: {
        title: fallbackIdea.title,
        pitch: fallbackIdea.pitch
      },
      meta: {
        source: 'fallback',
        model: 'none',
        latency_ms: Date.now() - startTime,
        error_recovered: true
      }
    });
  }
}
