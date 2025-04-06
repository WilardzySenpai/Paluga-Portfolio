// src/app/page.tsx
import { MainNav } from "@/components/main-nav";
import { HeroSection } from "@/components/sections/hero-section";
import { AboutSection } from "@/components/sections/about-section";
import { SkillsSection } from "@/components/sections/skills-section";
import { ProjectsSection } from "@/components/sections/projects-section";
import { OfferingsSection } from "@/components/sections/offerings-section";
import { ContactSection } from "@/components/sections/contact-section";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <>
      <MainNav />
      <main>
        <HeroSection />
        {/* Wrap sections in <section> or <div> if needed for styling/layout */}
        <AboutSection />
        {/* <SkillsSection /> */}
        <ProjectsSection />
        <OfferingsSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}