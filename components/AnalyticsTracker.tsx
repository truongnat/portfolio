'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

// Analytics tracking has been disabled after Supabase removal
// To re-enable, configure Supabase and restore the tracking logic
export function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Analytics tracking disabled - Supabase removed
    // To re-enable, configure Supabase and restore tracking logic
  }, [pathname]);

  return null;
}
