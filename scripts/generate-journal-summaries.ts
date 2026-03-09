import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

type JournalType = 'day' | 'week' | 'month' | 'quarter' | 'year' | 'cycle';
type SummaryPeriod = 'week' | 'month' | 'quarter' | 'year';

interface JournalEntry {
  filename: string;
  slug: string;
  title: string;
  date: Date;
  type: JournalType;
  summary?: string;
  tags: string[];
}

interface PeriodWindow {
  period: SummaryPeriod;
  start: Date;
  end: Date;
  label: string;
}

interface CliOptions {
  force: boolean;
  period?: SummaryPeriod;
}

const JOURNAL_DIR = path.resolve(process.cwd(), 'src/content/journal');
const PERIODS: SummaryPeriod[] = ['week', 'month', 'quarter', 'year'];

const parseCliArgs = (argv: string[]): CliOptions => {
  const options: CliOptions = { force: false };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];

    if (arg === '--force') {
      options.force = true;
      continue;
    }

    if (arg === '--period') {
      const value = argv[i + 1] as SummaryPeriod | undefined;
      if (!value || !PERIODS.includes(value)) {
        throw new Error('Invalid value for --period. Use: week | month | quarter | year');
      }
      options.period = value;
      i += 1;
      continue;
    }
  }

  if (options.force && !options.period) {
    throw new Error('When using --force, you must provide --period <week|month|quarter|year>');
  }

  return options;
};

const parseDate = (value: unknown): Date => {
  if (value instanceof Date) {
    return new Date(Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate()));
  }

  if (typeof value === 'string') {
    const m = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (m) {
      const y = Number(m[1]);
      const mo = Number(m[2]);
      const d = Number(m[3]);
      return new Date(Date.UTC(y, mo - 1, d));
    }
  }

  const fallback = new Date(String(value));
  return new Date(Date.UTC(fallback.getUTCFullYear(), fallback.getUTCMonth(), fallback.getUTCDate()));
};

const toIsoDate = (date: Date): string => date.toISOString().slice(0, 10);

const addDays = (date: Date, days: number): Date => {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
};

const startOfIsoWeek = (date: Date): Date => {
  const day = (date.getUTCDay() + 6) % 7; // Monday = 0, Sunday = 6
  return addDays(date, -day);
};

const capitalize = (value: string): string => value.charAt(0).toUpperCase() + value.slice(1);

const inRange = (date: Date, start: Date, end: Date): boolean => date >= start && date <= end;

const readJournalEntries = (): JournalEntry[] => {
  if (!fs.existsSync(JOURNAL_DIR)) {
    return [];
  }

  const files = fs.readdirSync(JOURNAL_DIR).filter((file) => file.endsWith('.md'));
  const parsedEntries: Array<JournalEntry | null> = files.map((filename) => {
    const absolutePath = path.join(JOURNAL_DIR, filename);
    const raw = fs.readFileSync(absolutePath, 'utf8');
    const parsed = matter(raw);
    const data = parsed.data as {
      title?: string;
      date?: string | Date;
      type?: JournalType;
      summary?: string;
      tags?: string[];
    };

    if (!data.title || !data.date || !data.type) {
      return null;
    }

    const entry: JournalEntry = {
      filename,
      slug: filename.replace(/\.md$/, ''),
      title: data.title,
      date: parseDate(data.date),
      type: data.type,
      tags: Array.isArray(data.tags) ? data.tags : [],
      ...(data.summary ? { summary: data.summary } : {}),
    };

    return entry;
  });

  return parsedEntries
    .filter((entry): entry is JournalEntry => entry !== null)
    .sort((a, b) => a.date.getTime() - b.date.getTime());
};

const getAutoWindow = (period: SummaryPeriod, now: Date): PeriodWindow => {
  const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

  if (period === 'week') {
    const currentWeekStart = startOfIsoWeek(today);
    const start = addDays(currentWeekStart, -7);
    const end = addDays(currentWeekStart, -1);
    return { period, start, end, label: `${toIsoDate(start)} -> ${toIsoDate(end)}` };
  }

  if (period === 'month') {
    const currentMonthStart = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), 1));
    const end = addDays(currentMonthStart, -1);
    const start = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), 1));
    return { period, start, end, label: `${end.getUTCFullYear()}-${String(end.getUTCMonth() + 1).padStart(2, '0')}` };
  }

  if (period === 'quarter') {
    const currentQuarterStartMonth = Math.floor(today.getUTCMonth() / 3) * 3;
    const currentQuarterStart = new Date(Date.UTC(today.getUTCFullYear(), currentQuarterStartMonth, 1));
    const end = addDays(currentQuarterStart, -1);
    const quarterStartMonth = Math.floor(end.getUTCMonth() / 3) * 3;
    const start = new Date(Date.UTC(end.getUTCFullYear(), quarterStartMonth, 1));
    const quarter = Math.floor(start.getUTCMonth() / 3) + 1;
    return { period, start, end, label: `${start.getUTCFullYear()}-Q${quarter}` };
  }

  const currentYearStart = new Date(Date.UTC(today.getUTCFullYear(), 0, 1));
  const end = addDays(currentYearStart, -1);
  const start = new Date(Date.UTC(end.getUTCFullYear(), 0, 1));
  return { period, start, end, label: `${start.getUTCFullYear()}` };
};

const getManualWindow = (period: SummaryPeriod, now: Date): PeriodWindow => {
  const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

  if (period === 'week') {
    const start = startOfIsoWeek(today);
    const end = today;
    return { period, start, end, label: `${toIsoDate(start)} -> ${toIsoDate(end)}` };
  }

  if (period === 'month') {
    const start = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), 1));
    const end = today;
    return { period, start, end, label: `${today.getUTCFullYear()}-${String(today.getUTCMonth() + 1).padStart(2, '0')}` };
  }

  if (period === 'quarter') {
    const startMonth = Math.floor(today.getUTCMonth() / 3) * 3;
    const start = new Date(Date.UTC(today.getUTCFullYear(), startMonth, 1));
    const end = today;
    const quarter = Math.floor(start.getUTCMonth() / 3) + 1;
    return { period, start, end, label: `${start.getUTCFullYear()}-Q${quarter}` };
  }

  const start = new Date(Date.UTC(today.getUTCFullYear(), 0, 1));
  const end = today;
  return { period, start, end, label: `${today.getUTCFullYear()}` };
};

const buildSummaryFileName = (window: PeriodWindow): string =>
  `${toIsoDate(window.end)}-${window.period}-${window.label.replace(/\s*->\s*/g, '_to_')}.md`;

const buildSummaryMarkdown = (window: PeriodWindow, logs: JournalEntry[]): string => {
  const sortedLogs = [...logs].sort((a, b) => a.date.getTime() - b.date.getTime());
  const tagsCounter = new Map<string, number>();

  for (const log of sortedLogs) {
    for (const tag of log.tags) {
      tagsCounter.set(tag, (tagsCounter.get(tag) ?? 0) + 1);
    }
  }

  const topTags = [...tagsCounter.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([tag]) => tag);

  const summaryTags = [capitalize(window.period), 'Summary', ...topTags].slice(0, 6);
  const periodTitle = `${capitalize(window.period)} Summary (${window.label})`;
  const shortSummary = `Tổng hợp ${window.period} với ${sortedLogs.length} daily logs trong giai đoạn ${toIsoDate(window.start)} đến ${toIsoDate(window.end)}.`;

  const highlights = sortedLogs
    .map((log) => `- **${toIsoDate(log.date)}**: ${log.title}`)
    .join('\n');

  const sourceList = sortedLogs
    .map((log) => `- [${log.slug}](/journal/${log.slug}/index.html)`)
    .join('\n');

  const themes = topTags.length > 0
    ? topTags.map((tag) => `- #${tag}`).join('\n')
    : '- Chưa có tag nổi bật trong giai đoạn này.';

  return `---
title: "${periodTitle}"
date: ${toIsoDate(window.end)}
type: "${window.period}"
summary: "${shortSummary}"
tags: [${summaryTags.map((tag) => `"${tag}"`).join(', ')}]
---

## Scope

- Period: \`${toIsoDate(window.start)} -> ${toIsoDate(window.end)}\`
- Total daily logs: **${sortedLogs.length}**

## Highlights

${highlights}

## Key Themes

${themes}

## Source Logs

${sourceList}

## Next Focus

- Continue daily logging with measurable outcomes.
- Keep tracking blockers and resolved issues to improve future summaries.
`;
};

const generateSummaryFile = (
  window: PeriodWindow,
  logs: JournalEntry[],
  minLogsRequired: number
): string | null => {
  if (logs.length < minLogsRequired) {
    console.log(`[skip] ${window.period}: need at least ${minLogsRequired} daily logs, found ${logs.length}.`);
    return null;
  }

  const filename = buildSummaryFileName(window);
  const fullPath = path.join(JOURNAL_DIR, filename);

  if (fs.existsSync(fullPath)) {
    console.log(`[skip] ${window.period}: summary already exists (${filename}).`);
    return null;
  }

  const markdown = buildSummaryMarkdown(window, logs);
  fs.writeFileSync(fullPath, markdown, 'utf8');
  console.log(`[ok] Generated ${window.period} summary: ${filename}`);
  return filename;
};

const runAutoMode = (entries: JournalEntry[]): void => {
  const dayLogs = entries.filter((entry) => entry.type === 'day');
  const now = new Date();

  for (const period of PERIODS) {
    const window = getAutoWindow(period, now);
    const scopedLogs = dayLogs.filter((entry) => inRange(entry.date, window.start, window.end));
    const minLogsRequired = period === 'week' ? 7 : 1;
    generateSummaryFile(window, scopedLogs, minLogsRequired);
  }
};

const runManualMode = (entries: JournalEntry[], period: SummaryPeriod): void => {
  const dayLogs = entries.filter((entry) => entry.type === 'day');
  const window = getManualWindow(period, new Date());
  const scopedLogs = dayLogs.filter((entry) => inRange(entry.date, window.start, window.end));

  if (scopedLogs.length === 0) {
    console.log(`[skip] ${period}: no daily logs found in ${toIsoDate(window.start)} -> ${toIsoDate(window.end)}.`);
    return;
  }

  generateSummaryFile(window, scopedLogs, 1);
};

export const runSummaryGenerator = (argv: string[]): void => {
  const options = parseCliArgs(argv);
  const entries = readJournalEntries();

  if (entries.length === 0) {
    console.log('[skip] No journal entries found.');
    return;
  }

  if (options.force && options.period) {
    runManualMode(entries, options.period);
    return;
  }

  runAutoMode(entries);
};

try {
  runSummaryGenerator(process.argv.slice(2));
} catch (error) {
  console.error('[error] Failed to generate journal summaries.');
  console.error(error);
  process.exitCode = 1;
}
