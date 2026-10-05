import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getSupabaseAdmin } from '@/lib/supabase-server';
import { verifyAdminToken } from '@/lib/adminSession';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const cookieStore = cookies();
  const adminToken = cookieStore.get('admin_session')?.value;

  if (!verifyAdminToken(adminToken)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const includeSimulated = request.nextUrl.searchParams.get('sim') === '1';
  const supabase = getSupabaseAdmin();

  try {
    let query = supabase.from('registrants').select('created_at, utm_source');
    if (!includeSimulated) {
      query = query.eq('is_simulated', false);
    }

    const { data: registrants, error: regError } = await query;
    if (regError) throw regError;

    const total = registrants.length;
    const goal = 500;
    const percent = total > 0 ? Math.min((total / goal) * 100, 100) : 0;

    // Channel (utm_source)
    const channelMap = new Map<string, number>();
    registrants.forEach(r => {
      const source = r.utm_source || 'direct';
      channelMap.set(source, (channelMap.get(source) || 0) + 1);
    });

    const channels = Array.from(channelMap.entries()).map(([source, count]) => ({
      source,
      count,
      share: total > 0 ? (count / total) * 100 : 0
    })).sort((a, b) => b.count - a.count);

    // Daily pacing (7 days)
    // Assume start date is the earliest registration date or today if none
    const sortedDates = registrants
      .map(r => new Date(r.created_at).toISOString().split('T')[0])
      .sort();
      
    const startDate = sortedDates.length > 0 ? new Date(sortedDates[0]) : new Date();
    
    // Create 7 days of pacing
    const daily = [];
    let cumulative = 0;
    const pacePerDay = 500 / 7;
    let paceCumulative = 0;

    const dateCounts = new Map<string, number>();
    sortedDates.forEach(d => dateCounts.set(d, (dateCounts.get(d) || 0) + 1));

    for (let i = 0; i < 7; i++) {
      const d = new Date(startDate);
      d.setDate(d.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      
      const count = dateCounts.get(dateStr) || 0;
      cumulative += count;
      paceCumulative += pacePerDay;

      daily.push({
        date: dateStr,
        count,
        cumulative,
        paceCumulative: Math.round(paceCumulative)
      });
    }

    // Funnel (from events)
    const { data: events, error: evtError } = await supabase.from('events').select('type');
    if (evtError) throw evtError;

    let landingViews = 0;
    let formStarts = 0;

    (events || []).forEach(e => {
      if (e.type === 'page_view') landingViews++;
      if (e.type === 'form_start') formStarts++;
    });

    let finalStarts: string | number = 'not tracked';
    if (formStarts > 0 && formStarts >= total) {
      finalStarts = `${formStarts} (includes test traffic)`;
    }

    let finalViews: string | number = 'not tracked';
    if (landingViews > 0 && landingViews >= formStarts && landingViews >= total) {
      finalViews = `${landingViews} (includes test traffic)`;
    }

    const funnel = [
      { step: 'Landing Views', count: finalViews },
      { step: 'Registration Starts', count: finalStarts },
      { step: 'Completed Registrations', count: total }
    ];

    return NextResponse.json({
      total,
      goal,
      percent: Number(percent.toFixed(1)),
      daily,
      channels,
      funnel
    }, { headers: { 'Cache-Control': 'no-store' } });

  } catch (error) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
