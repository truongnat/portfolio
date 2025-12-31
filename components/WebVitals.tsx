'use client';

import { useReportWebVitals } from 'next/web-vitals';

export function WebVitals() {
  useReportWebVitals((metric) => {
    // Send to analytics if available
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', metric.name, {
        value: Math.round(metric.value),
        event_label: metric.id,
        non_interaction: true,
      });
    }
    
    // Log warnings for poor metrics
    if (metric.name === 'LCP' && metric.value > 2500) {
      console.warn(`LCP exceeds 2.5s: ${metric.value}ms`);
    }
    if (metric.name === 'CLS' && metric.value > 0.1) {
      console.warn(`CLS exceeds 0.1: ${metric.value}`);
    }
    if (metric.name === 'FID' && metric.value > 100) {
      console.warn(`FID exceeds 100ms: ${metric.value}ms`);
    }
    if (metric.name === 'INP' && metric.value > 200) {
      console.warn(`INP exceeds 200ms: ${metric.value}ms`);
    }
    if (metric.name === 'TTFB' && metric.value > 600) {
      console.warn(`TTFB exceeds 600ms: ${metric.value}ms`);
    }
    
    // Log all metrics in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Web Vitals] ${metric.name}:`, {
        value: metric.value,
        rating: metric.rating,
        id: metric.id,
      });
    }
  });
  
  return null;
}
