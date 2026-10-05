import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getSupabaseAdmin } from '@/lib/supabase-server';
import { verifyAdminToken } from '@/lib/adminSession';
import { COLLEGES } from '@/lib/constants';

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
    let query = supabase.from('registrants').select('ref_code, college_id, college_other, branch, grad_year, utm_source, created_at');
    if (!includeSimulated) {
      query = query.eq('is_simulated', false);
    }

    const { data: registrants, error } = await query;
    if (error) throw error;

    // Generate CSV
    const headers = ['ref_code', 'college', 'branch', 'grad_year', 'utm_source', 'created_at'];
    
    const rows = (registrants || []).map(r => {
      const collegeName = r.college_id ? (COLLEGES.find(c => c.id === r.college_id)?.name || 'Unknown') : (r.college_other || 'Unknown');
      return [
        r.ref_code || '',
        `"${collegeName.replace(/"/g, '""')}"`,
        `"${(r.branch || '').replace(/"/g, '""')}"`,
        r.grad_year || '',
        r.utm_source || 'direct',
        r.created_at || ''
      ].join(',');
    });

    const csv = [headers.join(','), ...rows].join('\n');

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="registrants.csv"',
        'Cache-Control': 'no-store'
      }
    });
  } catch (err) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
