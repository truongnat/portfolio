import { Hero } from '@/components/Hero';
import { Skills } from '@/components/Skills';
import { Experience } from '@/components/Experience';
import { Projects } from '@/components/Projects';
import { ToolsHub } from '@/components/ToolsHub';
import { ContactForm } from '@/components/ContactForm';

import { personalInfo } from '@/lib/config';

// Enable ISR with 1 hour revalidation for the landing page
export const revalidate = 3600;

// Enable static generation
export const dynamic = 'force-static';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Skills />
      <Experience />
      <Projects />
      <ToolsHub username={personalInfo.githubUsername} />

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Get In Touch
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Have a question or want to work together? Feel free to reach out!
            </p>
          </div>
          <ContactForm />
        </div>
      </section>
    </main>
  );
}
