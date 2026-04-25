import { Hero } from '@/sections/Hero';
import { About } from '@/sections/About';
import { TechStack } from '@/sections/TechStack';
import { FeaturedProjects } from '@/sections/FeaturedProjects';
import { OSSPreview } from '@/sections/OSSPreview';
import { Contact } from '@/sections/Contact';

export default function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <TechStack />
      <FeaturedProjects />
      <OSSPreview />
      <Contact />
    </>
  );
}
