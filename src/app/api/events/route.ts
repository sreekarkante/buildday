import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-server';

const VALID_EVENTS = [
  'page_view', 'form_start', 'step_1_complete', 'step_2_complete',
  'step_3_complete', 'register_success', 'share_click', 'match_complete'
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { session_id, type, step, meta } = body;

    if (!session_id || !type || !VALID_EVENTS.includes(type)) {
      return NextResponse.json({ success: false }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    await supabase.from('events').insert({
      session_id,
      type,
      step: step || null,
      meta: meta || {},
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
