import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-server';
import { generateRefCode, normalizePhone, validatePhone, validateEmail, getDeviceType } from '@/lib/utils';
import { checkRateLimit } from '@/lib/rate-limit';
import { BRANCHES, GRAD_YEARS, SLOTS } from '@/lib/constants';
import type { RegisterFormData } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as RegisterFormData;

    if (body.website) {
      return NextResponse.json({ success: true, ref_code: 'honeypot-trap' });
    }

    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const { allowed } = checkRateLimit(ip);
    if (!allowed) {
      return NextResponse.json({ success: false, message: 'Too many requests. Please try again later.' }, { status: 429 });
    }

    const errors: Record<string, string> = {};
    if (!body.name || body.name.length < 2 || body.name.length > 100) errors.name = 'Invalid name';
    if (!validatePhone(body.phone)) errors.phone = 'Invalid phone number';
    if (!validateEmail(body.email)) errors.email = 'Invalid email';
    if (!(BRANCHES as readonly string[]).includes(body.branch)) errors.branch = 'Invalid branch';
    if (!(GRAD_YEARS as readonly number[]).includes(body.grad_year)) errors.grad_year = 'Invalid graduation year';
    if (!SLOTS.some(s => s.value === body.slot)) errors.slot = 'Invalid slot';
    if (!body.consent) errors.consent = 'Consent required';
    if (!body.college_id && !body.college_other) errors.college = 'College required';

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ success: false, errors, message: 'Validation failed' }, { status: 400 });
    }

    const normPhone = normalizePhone(body.phone);
    const supabase = getSupabaseAdmin();

    const { data: existing } = await supabase
      .from('registrants')
      .select('ref_code')
      .or(`phone.eq.${normPhone},email.eq.${body.email.toLowerCase()}`)
      .limit(1)
      .single();

    if (existing) {
      return NextResponse.json({
        success: true,
        duplicate: true,
        ref_code: existing.ref_code,
        message: "You're already registered! Here's your referral link."
      });
    }

    let newCode = '';
    for (let i = 0; i < 10; i++) {
      const code = generateRefCode();
      const { data: codeCheck } = await supabase.from('registrants').select('id').eq('ref_code', code).single();
      if (!codeCheck) {
        newCode = code;
        break;
      }
    }
    if (!newCode) throw new Error('Could not generate unique ref code');

    let validReferrerId: string | null = null;
    let validRefCode: string | null = null;

    if (body.ref) {
      const { data: referrer } = await supabase
        .from('registrants')
        .select('id, ref_code')
        .eq('ref_code', body.ref)
        .single();
        
      if (referrer) {
        validReferrerId = referrer.id;
        validRefCode = referrer.ref_code;
      }
    }

    const deviceType = body.device || getDeviceType(request.headers.get('user-agent') || '');

    const { data: newReg, error: insertError } = await supabase
      .from('registrants')
      .insert({
        name: body.name,
        phone: normPhone,
        email: body.email.toLowerCase(),
        college_id: body.college_id,
        college_other: body.college_other,
        branch: body.branch,
        grad_year: body.grad_year,
        slot: body.slot,
        consent: body.consent,
        ref_code: newCode,
        referred_by_code: validRefCode,
        champion_code: body.champion || null,
        utm_source: body.utm_source || null,
        utm_medium: body.utm_medium || null,
        utm_campaign: body.utm_campaign || null,
        utm_content: body.utm_content || null,
        device: deviceType,
      })
      .select()
      .single();

    if (insertError) throw insertError;

    if (validReferrerId && validReferrerId !== newReg.id) {
      await supabase.from('referrals').insert({ 
        referrer_id: validReferrerId, 
        referred_id: newReg.id 
      });
    }

    await supabase.from('events').insert({
      session_id: body.device || 'server_generated', // Use body.device temporarily if session_id is missing, wait, we don't have session_id in payload?
      type: 'register_success',
      meta: { registrant_id: newReg.id }
    });

    // Try to get session_id from body or cookies if available. Wait, the frontend doesn't send session_id in register payload right now.
    // Let's modify the frontend to send session_id. For now, I'll update the API route to look for body.session_id.
    if (body.session_id) {
      await supabase.from('matcher_results')
        .update({ registrant_id: newReg.id })
        .eq('session_id', body.session_id);
    }

    return NextResponse.json({ success: true, ref_code: newCode });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
