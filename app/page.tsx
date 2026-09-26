import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { LandingHeader } from "@/components/LandingHeader";
import { UrgentFundraising } from "@/components/UrgentFundraising";
import { CommunityImpact } from "@/components/CommunityImpact";
import { FAQ } from "@/components/FAQ";
import { LandingFooter } from "@/components/LandingFooter";

export default function HomePage() {
  return (
    <>
      <LandingHeader />

      <main className="w-full px-6 pb-8 pt-6 lg:px-8">
        <Hero />
        <HowItWorks />
        <UrgentFundraising />
        <CommunityImpact />
        <FAQ />
      </main>

      <LandingFooter />
    </>
  );
}
