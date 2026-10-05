import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getSupabaseAdmin } from '@/lib/supabase-server';
import { verifyAdminToken } from '@/lib/adminSession';
import { REWARD_TIERS } from '@/lib/rewards';
import { checkRateLimit } from '@/lib/rate-limit';

export async function GET(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const { allowed } = checkRateLimit(`rewards_${ip}`, 10, 60000);
    if (!allowed) {
      return NextResponse.json({ success: false, message: 'Too many requests' }, { status: 429 });
    }

    const { searchParams } = new URL(req.url);
    const ref = searchParams.get('ref');

    const emptyResponse = { count: 0, unlocked: [], nextTier: REWARD_TIERS[0], referralsToNext: REWARD_TIERS[0].referrals };

    if (!ref) {
      return NextResponse.json(emptyResponse, { headers: { 'Cache-Control': 'no-store' } });
    }

    const supabase = getSupabaseAdmin();

    const cookieStore = cookies();
    const adminCookie = cookieStore.get('admin_session')?.value;
    const isAdmin = verifyAdminToken(adminCookie);
    const isDev = process.env.NODE_ENV !== 'production';
    
    const allowSim = isAdmin || isDev;
    const simMode = allowSim && searchParams.get('sim') === '1';

    // 1. Get the referrer
    const { data: referrerData, error: referrerError } = await supabase
      .from('registrants')
      .select('id, phone, email')
      .eq('ref_code', ref)
      .single();

    if (referrerError) {
      console.error('[Rewards API] Error fetching referrer:', referrerError.message);
      return NextResponse.json(emptyResponse, { status: 200, headers: { 'Cache-Control': 'no-store' } });
    }
    if (!referrerData) {
      return NextResponse.json(emptyResponse, { status: 200, headers: { 'Cache-Control': 'no-store' } });
    }

    // 2. Get all referrals for this referrer
    const { data: referrals, error: referralsError } = await supabase
      .from('referrals')
      .select('referred_id')
      .eq('referrer_id', referrerData.id);
      
    if (referralsError) {
      console.error('[Rewards API] Error fetching referrals:', referralsError.message);
      return NextResponse.json(emptyResponse, { headers: { 'Cache-Control': 'no-store' } });
    }
    if (!referrals || referrals.length === 0) {
      return NextResponse.json(emptyResponse, { headers: { 'Cache-Control': 'no-store' } });
    }

    const referredIds = referrals.map(r => r.referred_id);

    // 3. Get the actual referred persons to verify them
    const { data: referredPersons, error: personsError } = await supabase
      .from('registrants')
      .select('id, phone, email, is_simulated')
      .in('id', referredIds);

    if (personsError) {
      console.error('[Rewards API] Error fetching referred persons:', personsError.message);
      return NextResponse.json(emptyResponse, { headers: { 'Cache-Control': 'no-store' } });
    }
    if (!referredPersons) {
      return NextResponse.json(emptyResponse, { headers: { 'Cache-Control': 'no-store' } });
    }

    // 4. Validate referrals strictly (different person, no dupes, not simulated unless simMode=1)
    let validCount = 0;
    const seenPhones = new Set();
    const seenEmails = new Set();

    for (const p of referredPersons) {
      // Exclude simulated rows unless simMode is on
      if (!simMode && p.is_simulated === true) continue;
      // Skip if it's the referrer themselves (self-referral)
      if (p.phone === referrerData.phone || p.email === referrerData.email) continue;
      
      // Skip if this is a duplicate we've already counted for this referrer
      if (seenPhones.has(p.phone) || seenEmails.has(p.email)) continue;
      
      seenPhones.add(p.phone);
      seenEmails.add(p.email);
      validCount++;
    }

    // 5. Compute tiers
    const unlocked = [];
    let nextTier = null;
    let referralsToNext = 0;

    for (const tier of REWARD_TIERS) {
      if (validCount >= tier.referrals) {
        unlocked.push(tier.name);
      } else if (!nextTier) {
        nextTier = tier;
        referralsToNext = tier.referrals - validCount;
      }
    }

    return NextResponse.json({
      count: validCount,
      unlocked,
      nextTier,
      referralsToNext
    }, {
      headers: { 'Cache-Control': 'no-store' }
    });

  } catch (error) {
    console.error('Rewards error:', error);
    return NextResponse.json({ count: 0, unlocked: [] }, { status: 500, headers: { 'Cache-Control': 'no-store' } });
  }
}
