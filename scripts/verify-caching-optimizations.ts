/**
 * Verification script for data fetching and caching optimizations
 * Task 10: Checkpoint - Verify data and caching optimizations
 */

import { readFileSync } from 'fs';
import { join } from 'path';

interface VerificationResult {
  category: string;
  checks: Array<{
    name: string;
    passed: boolean;
    details: string;
  }>;
}

const results: VerificationResult[] = [];

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  bold: '\x1b[1m',
};

function log(message: string, color: string = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function checkFileContains(filePath: string, patterns: string[], description: string): boolean {
  try {
    const content = readFileSync(join(process.cwd(), filePath), 'utf-8');
    const allFound = patterns.every(pattern => content.includes(pattern));
    return allFound;
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return false;
  }
}

// 1. Verify ISR Configuration
function verifyISRConfiguration() {
  const category = 'ISR Configuration';
  const checks = [];

  // Check blog page has 60s revalidation
  const blogPageHasRevalidate = checkFileContains(
    'app/(landing)/blog/page.tsx',
    ['export const revalidate = 60'],
    'Blog page ISR revalidation'
  );
  checks.push({
    name: 'Blog page has 60-second revalidation',
    passed: blogPageHasRevalidate,
    details: blogPageHasRevalidate 
      ? 'Blog page correctly configured with 60s revalidation'
      : 'Blog page missing revalidate = 60 export',
  });

  // Check blog post page has 60s revalidation
  const blogPostHasRevalidate = checkFileContains(
    'app/(landing)/blog/[slug]/page.tsx',
    ['export const revalidate = 60'],
    'Blog post page ISR revalidation'
  );
  checks.push({
    name: 'Blog post page has 60-second revalidation',
    passed: blogPostHasRevalidate,
    details: blogPostHasRevalidate
      ? 'Blog post page correctly configured with 60s revalidation'
      : 'Blog post page missing revalidate = 60 export',
  });

  // Check landing page has 1-hour revalidation
  const landingPageHasRevalidate = checkFileContains(
    'app/(landing)/page.tsx',
    ['export const revalidate = 3600'],
    'Landing page ISR revalidation'
  );
  checks.push({
    name: 'Landing page has 1-hour revalidation',
    passed: landingPageHasRevalidate,
    details: landingPageHasRevalidate
      ? 'Landing page correctly configured with 3600s (1 hour) revalidation'
      : 'Landing page missing revalidate = 3600 export',
  });

  // Check generateStaticParams exists
  const hasGenerateStaticParams = checkFileContains(
    'app/(landing)/blog/[slug]/page.tsx',
    ['export async function generateStaticParams()'],
    'generateStaticParams function'
  );
  checks.push({
    name: 'Blog post page has generateStaticParams',
    passed: hasGenerateStaticParams,
    details: hasGenerateStaticParams
      ? 'generateStaticParams function exists for static generation'
      : 'Missing generateStaticParams function',
  });

  results.push({ category, checks });
}

// 2. Verify Database Query Optimization
function verifyDatabaseQueryOptimization() {
  const category = 'Database Query Optimization';
  const checks = [];

  // Check queries use specific columns (not SELECT *)
  const queriesContent = readFileSync(join(process.cwd(), 'lib/queries.ts'), 'utf-8');
  const hasSelectStar = queriesContent.includes(".select('*')");
  checks.push({
    name: 'Queries use specific column selection',
    passed: !hasSelectStar,
    details: !hasSelectStar
      ? 'All queries use specific column names instead of SELECT *'
      : 'Found queries using SELECT * - should specify columns',
  });

  // Check pagination is implemented
  const hasPagination = checkFileContains(
    'lib/queries.ts',
    ['.range('],
    'Pagination with .range()'
  );
  checks.push({
    name: 'Pagination implemented with .range()',
    passed: hasPagination,
    details: hasPagination
      ? 'Queries use .range() for pagination'
      : 'Missing .range() pagination in queries',
  });

  // Check queries use unstable_cache
  const usesUnstableCache = checkFileContains(
    'lib/queries.ts',
    ['unstable_cache'],
    'unstable_cache usage'
  );
  checks.push({
    name: 'Queries use unstable_cache for server-side caching',
    passed: usesUnstableCache,
    details: usesUnstableCache
      ? 'Queries wrapped with unstable_cache for server-side caching'
      : 'Queries not using unstable_cache',
  });

  // Check cache tags are used
  const usesCacheTags = checkFileContains(
    'lib/queries.ts',
    ['tags:'],
    'Cache tags'
  );
  checks.push({
    name: 'Cache tags configured for invalidation',
    passed: usesCacheTags,
    details: usesCacheTags
      ? 'Cache tags configured for targeted invalidation'
      : 'Missing cache tags configuration',
  });

  // Check revalidation times are set
  const hasRevalidationTimes = checkFileContains(
    'lib/queries.ts',
    ['revalidate: 60', 'revalidate: 3600'],
    'Revalidation times'
  );
  checks.push({
    name: 'Revalidation times configured',
    passed: hasRevalidationTimes,
    details: hasRevalidationTimes
      ? 'Revalidation times set (60s for posts, 3600s for projects)'
      : 'Missing revalidation time configuration',
  });

  results.push({ category, checks });
}

// 3. Verify API Route Cache Headers
function verifyAPIRouteCacheHeaders() {
  const category = 'API Route Cache Headers';
  const checks = [];

  // Check GitHub API route has cache headers
  const githubHasCacheHeaders = checkFileContains(
    'app/api/github/route.ts',
    ['Cache-Control'],
    'GitHub API cache headers'
  );
  checks.push({
    name: 'GitHub API route has Cache-Control headers',
    passed: githubHasCacheHeaders,
    details: githubHasCacheHeaders
      ? 'GitHub API route returns appropriate Cache-Control headers'
      : 'GitHub API route missing Cache-Control headers',
  });

  // Check GitHub API uses Next.js caching
  const githubUsesNextCache = checkFileContains(
    'app/api/github/route.ts',
    ['next: { revalidate:'],
    'Next.js fetch caching'
  );
  checks.push({
    name: 'GitHub API uses Next.js fetch caching',
    passed: githubUsesNextCache,
    details: githubUsesNextCache
      ? 'GitHub API fetch uses Next.js revalidate option'
      : 'GitHub API fetch not using Next.js caching',
  });

  // Check contact API has cache headers
  const contactHasCacheHeaders = checkFileContains(
    'app/api/contact/route.ts',
    ['Cache-Control'],
    'Contact API cache headers'
  );
  checks.push({
    name: 'Contact API route has Cache-Control headers',
    passed: contactHasCacheHeaders,
    details: contactHasCacheHeaders
      ? 'Contact API route returns appropriate Cache-Control headers'
      : 'Contact API route missing Cache-Control headers',
  });

  // Check revalidate API has cache headers
  const revalidateHasCacheHeaders = checkFileContains(
    'app/api/revalidate/route.ts',
    ['Cache-Control'],
    'Revalidate API cache headers'
  );
  checks.push({
    name: 'Revalidate API route has Cache-Control headers',
    passed: revalidateHasCacheHeaders,
    details: revalidateHasCacheHeaders
      ? 'Revalidate API route returns appropriate Cache-Control headers'
      : 'Revalidate API route missing Cache-Control headers',
  });

  results.push({ category, checks });
}

// 4. Verify Suspense Boundaries for Data Streaming
function verifySuspenseBoundaries() {
  const category = 'Suspense Boundaries for Data Streaming';
  const checks = [];

  // Check blog page has Suspense
  const blogHasSuspense = checkFileContains(
    'app/(landing)/blog/page.tsx',
    ['<Suspense', 'fallback='],
    'Blog page Suspense'
  );
  checks.push({
    name: 'Blog page has Suspense boundaries',
    passed: blogHasSuspense,
    details: blogHasSuspense
      ? 'Blog page uses Suspense for progressive rendering'
      : 'Blog page missing Suspense boundaries',
  });

  // Check blog post page has Suspense
  const blogPostHasSuspense = checkFileContains(
    'app/(landing)/blog/[slug]/page.tsx',
    ['<Suspense', 'fallback='],
    'Blog post page Suspense'
  );
  checks.push({
    name: 'Blog post page has Suspense boundaries',
    passed: blogPostHasSuspense,
    details: blogPostHasSuspense
      ? 'Blog post page uses Suspense for progressive rendering'
      : 'Blog post page missing Suspense boundaries',
  });

  // Check loading skeletons exist
  const hasLoadingSkeletons = checkFileContains(
    'app/(landing)/blog/page.tsx',
    ['Skeleton', 'animate-pulse'],
    'Loading skeletons'
  );
  checks.push({
    name: 'Loading skeletons implemented',
    passed: hasLoadingSkeletons,
    details: hasLoadingSkeletons
      ? 'Loading skeletons provide visual feedback during data fetching'
      : 'Missing loading skeleton components',
  });

  results.push({ category, checks });
}

// 5. Verify Static Generation Configuration
function verifyStaticGeneration() {
  const category = 'Static Generation Configuration';
  const checks = [];

  // Check blog page uses force-static
  const blogIsStatic = checkFileContains(
    'app/(landing)/blog/page.tsx',
    ["export const dynamic = 'force-static'"],
    'Blog page static generation'
  );
  checks.push({
    name: 'Blog page uses force-static',
    passed: blogIsStatic,
    details: blogIsStatic
      ? 'Blog page configured for static generation'
      : 'Blog page not configured for static generation',
  });

  // Check blog post page uses force-static
  const blogPostIsStatic = checkFileContains(
    'app/(landing)/blog/[slug]/page.tsx',
    ["export const dynamic = 'force-static'"],
    'Blog post page static generation'
  );
  checks.push({
    name: 'Blog post page uses force-static',
    passed: blogPostIsStatic,
    details: blogPostIsStatic
      ? 'Blog post page configured for static generation'
      : 'Blog post page not configured for static generation',
  });

  // Check landing page uses force-static
  const landingIsStatic = checkFileContains(
    'app/(landing)/page.tsx',
    ["export const dynamic = 'force-static'"],
    'Landing page static generation'
  );
  checks.push({
    name: 'Landing page uses force-static',
    passed: landingIsStatic,
    details: landingIsStatic
      ? 'Landing page configured for static generation'
      : 'Landing page not configured for static generation',
  });

  results.push({ category, checks });
}

// Print results
function printResults() {
  log('\n' + '='.repeat(80), colors.bold);
  log('CACHING AND DATA FETCHING OPTIMIZATION VERIFICATION', colors.bold + colors.blue);
  log('='.repeat(80) + '\n', colors.bold);

  let totalChecks = 0;
  let passedChecks = 0;

  results.forEach(({ category, checks }) => {
    const categoryPassed = checks.filter(c => c.passed).length;
    const categoryTotal = checks.length;
    totalChecks += categoryTotal;
    passedChecks += categoryPassed;

    const categoryColor = categoryPassed === categoryTotal ? colors.green : colors.yellow;
    log(`\n${category} (${categoryPassed}/${categoryTotal})`, colors.bold + categoryColor);
    log('-'.repeat(80));

    checks.forEach(({ name, passed, details }) => {
      const icon = passed ? '✓' : '✗';
      const color = passed ? colors.green : colors.red;
      log(`  ${icon} ${name}`, color);
      log(`    ${details}`, colors.reset);
    });
  });

  // Summary
  log('\n' + '='.repeat(80), colors.bold);
  const summaryColor = passedChecks === totalChecks ? colors.green : colors.yellow;
  log(`SUMMARY: ${passedChecks}/${totalChecks} checks passed`, colors.bold + summaryColor);
  log('='.repeat(80) + '\n', colors.bold);

  // Recommendations
  if (passedChecks < totalChecks) {
    log('RECOMMENDATIONS:', colors.bold + colors.yellow);
    log('- Review failed checks above and address any missing optimizations');
    log('- Ensure all pages have appropriate revalidation times configured');
    log('- Verify API routes return proper Cache-Control headers');
    log('- Check that database queries use specific column selection');
    log('- Confirm Suspense boundaries are in place for progressive rendering\n');
  } else {
    log('✓ All caching and data fetching optimizations verified!', colors.bold + colors.green);
    log('✓ ISR configuration is correct', colors.green);
    log('✓ Database queries are optimized', colors.green);
    log('✓ API routes have proper cache headers', colors.green);
    log('✓ Suspense boundaries are implemented', colors.green);
    log('✓ Static generation is configured\n', colors.green);
  }

  return passedChecks === totalChecks;
}

// Run all verifications
async function main() {
  log('Starting verification of caching and data fetching optimizations...\n', colors.blue);

  verifyISRConfiguration();
  verifyDatabaseQueryOptimization();
  verifyAPIRouteCacheHeaders();
  verifySuspenseBoundaries();
  verifyStaticGeneration();

  const allPassed = printResults();

  process.exit(allPassed ? 0 : 1);
}

main().catch(console.error);
