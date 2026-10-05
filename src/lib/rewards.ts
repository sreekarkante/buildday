export interface RewardTier {
  referrals: number;
  name: string;
  description: string;
}

export const REWARD_TIERS: RewardTier[] = [
  { referrals: 1, name: 'AI Starter Kit', description: '5 bonus AI project templates' },
  { referrals: 3, name: 'Top Referrer Badge', description: 'Special badge on your workshop certificate' },
  { referrals: 5, name: 'Early Access', description: 'Get the workshop recording 24 hours before everyone else' },
  { referrals: 10, name: 'Live Shout-out', description: 'A special shout-out during the live workshop stream' }
];
