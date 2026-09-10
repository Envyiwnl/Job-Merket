import CTA from "../components/CTA";
import FeaturedJobs from "../components/FeaturedJobs";
import Features from "../components/Features";
import Hero from "../components/Hero";
import HowItWorks from "../components/HowItWorks";
import PopularCategories from "../components/PopularCategories";
import TopCompanies from "../components/TopCompanies";

export default function Home() {
  return (
    <main>
      <Hero />
      <Features />
      <PopularCategories />
      <FeaturedJobs />
      <HowItWorks />
      <TopCompanies />
      <CTA />
    </main>
  );
}
