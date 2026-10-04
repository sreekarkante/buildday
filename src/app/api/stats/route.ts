import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';
import type { StatsResponse } from '@/types';

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();

    // Get total registrant count
    const { count: totalCount } = await supabase
      .from('registrants')
      .select('*', { count: 'exact', head: true });

    // Get distinct college count (excluding nulls)
    const { data: collegeData } = await supabase
      .from('registrants')
      .select('college_id')
      .not('college_id', 'is', null);

    const uniqueColleges = new Set(collegeData?.map(r => r.college_id) || []);

    const stats: StatsResponse = {
      count: totalCount || 0,
      college_count: uniqueColleges.size,
    };

    return NextResponse.json(stats, {
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
      },
    });
  } catch {
    return NextResponse.json({ count: 0, college_count: 0 }, { status: 500 });
  }
}
