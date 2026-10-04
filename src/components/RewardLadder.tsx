import { REWARD_TIERS } from '@/lib/constants';

export default function RewardLadder() {
  return (
    <section className="py-16 md:py-24">
      <div className="container-main">
        <h2 className="section-heading text-center mb-4">
          Share &amp; Unlock Rewards
        </h2>
        <p className="section-subheading text-center mb-12">
          Every friend who registers with your link counts toward rewards.
        </p>

        <div className="max-w-xl mx-auto space-y-4">
          {REWARD_TIERS.map((tier, idx) => (
            <div
              key={idx}
              className="card flex items-center gap-5 group hover:border-accent-cyan/30 transition-colors"
            >
              {/* Threshold badge */}
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-blue/20 to-accent-cyan/20 border border-accent-cyan/20 flex flex-col items-center justify-center shrink-0">
                <span className="text-xl font-bold gradient-text">{tier.threshold}</span>
                <span className="text-[10px] text-gray-500 -mt-0.5">refs</span>
              </div>
              {/* Reward info */}
              <div>
                <h3 className="font-semibold text-white text-sm sm:text-base">
                  {tier.name}
                </h3>
                <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
                  {tier.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-gray-500 mt-8 max-w-md mx-auto">
          You&apos;ll get your personal referral link after registering. Share it
          on WhatsApp, Instagram, or anywhere!
        </p>
      </div>
    </section>
  );
}
