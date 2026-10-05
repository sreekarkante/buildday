import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getSupabaseAdmin } from '@/lib/supabase-server';
import { verifyAdminToken } from '@/lib/adminSession';
import { checkRateLimit } from '@/lib/rate-limit';
import { COLLEGES } from '@/lib/constants';

export const dynamic = 'force-dynamic';

function formatName(name: string): string {
  if (!name) return 'Anonymous';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0];
  const first = parts[0];
  const last = parts[parts.length - 1];
  return `${first} ${last[0].toUpperCase()}.`;
}

export async function GET(request: NextRequest) {
  try {
    if (process.env.FORCE_ERROR === '1') {
      throw new Error('Forced DB Error');
    }

    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const { allowed } = checkRateLimit(ip, 20, 60 * 1000); // 20 requests per minute
    if (!allowed) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const cookieStore = cookies();
    const adminToken = cookieStore.get('admin_session')?.value;
    const isAdmin = verifyAdminToken(adminToken);
    const simParam = request.nextUrl.searchParams.get('sim') === '1';
    
    // Only include simulated rows if valid admin AND sim=1
    const includeSimulated = isAdmin && simParam;

    const supabase = getSupabaseAdmin();

    // 1. Fetch colleges
    // In Supabase without RPC, we can just fetch college_ids of all eligible registrants, then aggregate.
    // Since expected volume is low for this phase, this is fine. For scale, use a view/rpc.
    let registrantsQuery = supabase
      .from('registrants')
      .select('college_id');
      
    if (!includeSimulated) {
      registrantsQuery = registrantsQuery.eq('is_simulated', false);
    }
    
    const { data: registrantsData, error: regError } = await registrantsQuery;
    if (regError) throw regError;

    const collegeCounts = new Map<number, number>();
    for (const row of registrantsData || []) {
      if (row.college_id) {
        collegeCounts.set(row.college_id, (collegeCounts.get(row.college_id) || 0) + 1);
      }
    }

    const colleges = Array.from(collegeCounts.entries())
      .filter(([_, count]) => count >= 5)
      .map(([id, count]) => {
        const col = COLLEGES.find(c => c.id === id);
        return {
          name: col ? col.name : 'Unknown College',
          count
        };
      })
      .sort((a, b) => b.count - a.count);

    // 2. Fetch individuals (Top 10 direct referrers)
    let referralsQuery = supabase
      .from('referrals')
      .select('referrer_id, referred_id');
      
    let eligibleRegistrantsQuery = supabase
      .from('registrants')
      .select('id, name');
      
    if (!includeSimulated) {
      eligibleRegistrantsQuery = eligibleRegistrantsQuery.eq('is_simulated', false);
    }

    const { data: eligibleData, error: eligError } = await eligibleRegistrantsQuery;
    if (eligError) throw eligError;

    const eligibleMap = new Map(eligibleData?.map(r => [r.id, r.name]) || []);

    const { data: referralsData, error: refError } = await referralsQuery;
    if (refError) throw refError;

    const referralCounts = new Map<string, number>();
    for (const row of referralsData || []) {
      // Only count if BOTH referrer and referred are eligible
      if (eligibleMap.has(row.referrer_id) && eligibleMap.has(row.referred_id)) {
        referralCounts.set(row.referrer_id, (referralCounts.get(row.referrer_id) || 0) + 1);
      }
    }

    const individuals = Array.from(referralCounts.entries())
      .map(([id, count]) => ({
        name: formatName(eligibleMap.get(id) || ''),
        referrals: count
      }))
      .sort((a, b) => b.referrals - a.referrals)
      .slice(0, 10);

    return NextResponse.json({
      colleges,
      individuals,
      error: false
    }, {
      headers: {
        'Cache-Control': 'no-store, must-revalidate'
      }
    });

  } catch (err) {
    return NextResponse.json({
      colleges: [],
      individuals: [],
      error: true
    }, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, must-revalidate'
      }
    });
  }
}
