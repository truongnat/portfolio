import { spawnSync } from 'child_process';

console.warn('[deprecated] scripts/generate-weekly.ts has been replaced by scripts/generate-journal-summaries.ts');
console.warn('[deprecated] Running forced weekly summary for backward compatibility...');

const result = spawnSync(
  'bun',
  ['scripts/generate-journal-summaries.ts', '--force', '--period', 'week'],
  { stdio: 'inherit' }
);

process.exit(result.status ?? 0);
