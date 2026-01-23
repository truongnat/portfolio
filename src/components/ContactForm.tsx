import { lazy, Suspense } from 'react';

const ContactFormClient = lazy(() => import('./ContactForm.client').then(mod => ({ default: mod.ContactFormClient })));

export function ContactForm() {
  return (
    <Suspense fallback={
      <div className="max-w-2xl mx-auto space-y-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i}>
            <div className="h-4 bg-muted/20 rounded mb-2 w-20" />
            <div className="h-12 bg-muted/20 rounded animate-pulse" />
          </div>
        ))}
        <div className="h-12 bg-muted/20 rounded animate-pulse" />
      </div>
    }>
      <ContactFormClient />
    </Suspense>
  );
}
