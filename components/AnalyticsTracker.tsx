'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    const trackView = async () => {
      try {
        // We use the RPC function we defined in the SQL setup
        await supabase.rpc('increment_page_view', { page_path: pathname });
      } catch (error) {
        console.error('Error tracking page view:', error);
      }
    };

    trackView();
  }, [pathname]);

  return null;
}
