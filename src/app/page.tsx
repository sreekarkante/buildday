import Hero from '@/components/Hero';
import ProjectMatcher from '@/components/ProjectMatcher';
import LiveCounter from '@/components/LiveCounter';
import WhatYouBuild from '@/components/WhatYouBuild';
import HowItWorks from '@/components/HowItWorks';
import WhoItsFor from '@/components/WhoItsFor';
import RewardLadder from '@/components/RewardLadder';
import FAQ from '@/components/FAQ';
import Footer from '@/components/Footer';

export default function HomePage() {
  return (
    <>
      <Hero />
      <ProjectMatcher />
      <LiveCounter />
      <WhatYouBuild />
      <HowItWorks />
      <WhoItsFor />
      <RewardLadder />
      <FAQ />
      <Footer />
    </>
  );
}
