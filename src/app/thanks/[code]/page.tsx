import Link from 'next/link';
import { getSupabaseAdmin } from '@/lib/supabase-server';
import { SLOTS, REWARD_TIERS } from '@/lib/constants';
import ShareButtons from '@/components/ShareButtons';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://buildday.vercel.app';

export default async function ThanksPage({ params }: { params: { code: string } }) {
  const supabase = getSupabaseAdmin();

  const { data: registrant } = await supabase
    .from('registrants')
    .select('*')
    .eq('ref_code', params.code)
    .single();

  if (!registrant) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-5xl mb-6">🔍</div>
        <h1 className="text-2xl font-bold mb-2">Registration not found</h1>
        <p className="text-gray-400 mb-6">This link doesn't match any registration.</p>
        <Link href="/register" className="btn-primary">
          Register Now
        </Link>
      </div>
    );
  }

  const { count: referralCount } = await supabase
    .from('referrals')
    .select('*', { count: 'exact', head: true })
    .eq('referrer_id', registrant.id);

  const currentReferrals = referralCount || 0;

  // Find the selected slot label
  const slotLabel =
    SLOTS.find((s) => s.value === registrant.slot)?.label || registrant.slot;

  // Find next reward tier
  const nextTier = REWARD_TIERS.find((t) => t.threshold > currentReferrals);
  const referralsToNext = nextTier ? nextTier.threshold - currentReferrals : 0;

  // Fetch matcher result
  const { data: matcherResult } = await supabase
    .from('matcher_results')
    .select('result')
    .eq('registrant_id', registrant.id)
    .single();

  return (
    <div className="min-h-screen py-12 px-4 max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <Link
          href="/"
          className="text-lg font-bold gradient-text hover:opacity-80 transition-opacity"
        >
          BuildDay
        </Link>
      </div>

      {/* Celebration */}
      <div className="text-center mb-10 animate-fade-in">
        <div className="relative inline-block mb-4">
          <span className="text-6xl">🎉</span>
          {/* Decorative dots */}
          <span className="absolute -top-2 -left-4 w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
          <span className="absolute -top-1 right-[-12px] w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse-slow" />
          <span className="absolute bottom-0 -left-6 w-1 h-1 bg-emerald-400 rounded-full animate-pulse" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold mb-3">
          You&apos;re in, {registrant.name}!
        </h1>
        <div className="inline-block bg-accent-cyan/10 border border-accent-cyan/20 text-cyan-300 px-4 py-2 rounded-full text-sm font-medium">
          📅 {slotLabel}
        </div>
      </div>

      {/* Share & Rewards */}
      <div className="card mb-8">
        <h2 className="text-xl font-bold mb-2">Share &amp; Earn Rewards</h2>
        <p className="text-gray-400 text-sm mb-6">
          Invite friends to BuildDay and unlock exclusive rewards.
        </p>

        <ShareButtons refCode={registrant.ref_code} />

        {/* Referral progress */}
        <div className="mt-8 bg-black/30 rounded-xl p-5">
          <div className="flex justify-between items-center mb-4">
            <span className="font-medium text-sm text-gray-300">
              Your Referrals
            </span>
            <span className="text-2xl font-bold gradient-text">
              {currentReferrals}
            </span>
          </div>

          {nextTier && (
            <div className="mb-5">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>
                  {referralsToNext} more to unlock {nextTier.name}
                </span>
                <span>
                  {currentReferrals}/{nextTier.threshold}
                </span>
              </div>
              <div className="w-full bg-white/5 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-accent-blue to-accent-cyan h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(
                      (currentReferrals / nextTier.threshold) * 100,
                      100
                    )}%`,
                  }}
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            {REWARD_TIERS.map((tier, idx) => {
              const isAchieved = currentReferrals >= tier.threshold;
              return (
                <div
                  key={idx}
                  className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                    isAchieved
                      ? 'bg-emerald-500/10 border-emerald-500/20'
                      : 'border-white/5 bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={isAchieved ? 'text-emerald-400' : 'text-gray-600'}>
                      {isAchieved ? '✓' : '○'}
                    </span>
                    <div>
                      <span
                        className={`text-sm font-medium ${
                          isAchieved ? 'text-emerald-300' : 'text-gray-400'
                        }`}
                      >
                        {tier.name}
                      </span>
                      <p className="text-xs text-gray-500">{tier.description}</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-gray-500">
                    {tier.threshold} refs
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* What's Next */}
      <div className="card mb-8">
        <h2 className="text-xl font-bold mb-4">What&apos;s Next?</h2>
        <ul className="space-y-4 text-gray-300">
          <li className="flex gap-3">
            <span className="text-cyan-400 shrink-0">📅</span>
            <span>
              Save the date: <strong className="text-white">{slotLabel}</strong>
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-cyan-400 shrink-0">💻</span>
            <span>Make sure you have a laptop and stable internet</span>
          </li>
          <li className="flex gap-3">
            <span className="text-cyan-400 shrink-0">📧</span>
            <span>
              Keep an eye on your email for the workshop link and prep checklist
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-cyan-400 shrink-0">🔗</span>
            <span>
              Share your referral link to unlock rewards and help your college
              climb the leaderboard!
            </span>
          </li>
        </ul>
      </div>

      {/* Unlocked Blueprint */}
      {matcherResult?.result && (
        <div className="card mb-8 border-cyan-500/30 bg-gradient-to-b from-cyan-900/10 to-transparent">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">🔓</span>
            <h2 className="text-xl font-bold text-white">Your Unlocked Blueprint</h2>
          </div>
          <div className="mb-6">
            <h3 className="text-lg font-bold text-cyan-400 mb-2">{matcherResult.result.title}</h3>
            <p className="text-gray-300 text-sm mb-4 leading-relaxed">{matcherResult.result.pitch}</p>
            <div className="bg-cyan-500/10 border border-cyan-500/20 p-3 rounded-lg flex items-start gap-3">
              <span className="text-cyan-400 mt-0.5">🎯</span>
              <div>
                <p className="text-xs text-gray-400 uppercase font-semibold tracking-wider mb-1">What you'll have at the end</p>
                <p className="text-sm text-cyan-100">{matcherResult.result.outcome}</p>
              </div>
            </div>
          </div>
          <div className="bg-black/40 rounded-xl p-5 border border-white/5">
            <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 border-b border-white/10 pb-2">60-Minute Execution Plan</h4>
            <ul className="space-y-6">
              {matcherResult.result.blueprint.map((step: any, idx: number) => (
                <li key={idx} className="flex gap-4 items-start">
                  <div className="w-20 shrink-0 text-xs font-mono text-cyan-500 font-semibold mt-1 bg-cyan-950/40 px-2 py-1 rounded text-center">
                    {step.time}
                  </div>
                  <div>
                    <p className="text-gray-200 text-sm font-medium mb-1.5">{step.step}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1.5">
                      <span className="text-gray-600">🛠️</span>
                      {step.tools}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <p className="text-xs text-gray-500 mt-6 text-center bg-black/20 p-3 rounded-lg border border-white/5">
            Keep this link safe! We will build this exact project together during the workshop.
          </p>
        </div>
      )}

      {/* Back to home */}
      <div className="text-center">
        <Link
          href="/"
          className="text-gray-400 hover:text-white transition-colors text-sm"
        >
          ← Back to homepage
        </Link>
      </div>
    </div>
  );
}
