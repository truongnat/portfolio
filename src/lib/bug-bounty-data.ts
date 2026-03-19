import type { BugBountyProgram, BountyReward, HallOfFameEntry, BugBountyStats, KnownQuirk } from '@/types/bug-bounty';

/**
 * Bug Bounty Program Data
 */

export const bugBountyProgram: BugBountyProgram = {
  id: 'portfolio-2026',
  name: 'Portfolio Bug Bounty Program',
  description: 'Help me improve my portfolio by finding and reporting bugs. Earn bounties and recognition for your contributions.',
  status: 'active',
  startDate: '2026-03-01',
  totalBudget: 5000,
  remainingBudget: 3750,
  rules: [
    'Report bugs privately first via the submission form',
    'Allow 48 hours for response before public disclosure',
    'Be respectful and constructive in your reports',
    'No automated scanning tools without permission',
    'One bounty per unique bug (duplicates get recognition only)',
  ],
  outOfScope: [
    'Email spoofing / SPF records',
    'Missing security headers (unless critical)',
    'Best practices that are already documented',
    'Issues requiring user interaction for XSS',
    'Rate limiting on public APIs',
  ],
  createdAt: '2026-03-01T00:00:00Z',
  updatedAt: '2026-03-16T12:00:00Z',
};

export const bountyRewards: BountyReward[] = [
  {
    severity: 'critical',
    minAmount: 500,
    maxAmount: 1000,
    description: 'Remote code execution, authentication bypass, data breach',
  },
  {
    severity: 'high',
    minAmount: 200,
    maxAmount: 500,
    description: 'XSS, CSRF, SQL injection, privilege escalation',
  },
  {
    severity: 'medium',
    minAmount: 50,
    maxAmount: 200,
    description: 'Information disclosure, minor security issues',
  },
  {
    severity: 'low',
    minAmount: 10,
    maxAmount: 50,
    description: 'UI bugs, typos, minor functionality issues',
  },
  {
    severity: 'info',
    minAmount: 0,
    maxAmount: 10,
    description: 'Suggestions, improvements, documentation fixes',
  },
];

export const hallOfFameData: HallOfFameEntry[] = [
  {
    id: 'researcher_1',
    reporterName: 'Alex Chen',
    reporterAvatar: 'https://github.com/alexchen.png',
    totalBugs: 8,
    totalBounty: 1450,
    rank: 1,
    badge: '🏆 Bug Hunter Supreme',
    joinedDate: '2026-03-01',
    resolvedBugs: [
      { id: 'bug_1', title: 'XSS in comment form', severity: 'high', bountyAmount: 300, resolvedAt: '2026-03-05', component: 'Comments' },
      { id: 'bug_2', title: 'Broken auth redirect', severity: 'medium', bountyAmount: 100, resolvedAt: '2026-03-08', component: 'Auth' },
      { id: 'bug_3', title: 'Typo in hero section', severity: 'low', bountyAmount: 20, resolvedAt: '2026-03-10', component: 'UI' },
    ],
  },
  {
    id: 'researcher_2',
    reporterName: 'Sarah Miller',
    reporterAvatar: 'https://github.com/sarahmiller.png',
    totalBugs: 5,
    totalBounty: 850,
    rank: 2,
    badge: '🥈 Security Expert',
    joinedDate: '2026-03-02',
    resolvedBugs: [
      { id: 'bug_4', title: 'CSRF on contact form', severity: 'high', bountyAmount: 400, resolvedAt: '2026-03-06', component: 'Forms' },
      { id: 'bug_5', title: 'Missing input validation', severity: 'medium', bountyAmount: 150, resolvedAt: '2026-03-09', component: 'API' },
    ],
  },
  {
    id: 'researcher_3',
    reporterName: 'DevTeam Inc.',
    reporterAvatar: undefined,
    totalBugs: 3,
    totalBounty: 600,
    rank: 3,
    badge: '🥉 Team Player',
    joinedDate: '2026-03-05',
    resolvedBugs: [
      { id: 'bug_6', title: 'Broken links in footer', severity: 'low', bountyAmount: 30, resolvedAt: '2026-03-11', component: 'Navigation' },
    ],
  },
  {
    id: 'researcher_4',
    reporterName: 'John Doe',
    reporterAvatar: undefined,
    totalBugs: 2,
    totalBounty: 120,
    rank: 4,
    joinedDate: '2026-03-08',
    resolvedBugs: [
      { id: 'bug_7', title: 'Mobile layout overflow', severity: 'low', bountyAmount: 40, resolvedAt: '2026-03-12', component: 'Responsive' },
    ],
  },
  {
    id: 'researcher_5',
    reporterName: 'Emma Wilson',
    reporterAvatar: 'https://github.com/emmawilson.png',
    totalBugs: 1,
    totalBounty: 50,
    rank: 5,
    joinedDate: '2026-03-10',
    resolvedBugs: [
      { id: 'bug_8', title: '404 on blog category page', severity: 'medium', bountyAmount: 50, resolvedAt: '2026-03-13', component: 'Blog' },
    ],
  },
];

export const bugBountyStats: BugBountyStats = {
  totalReports: 24,
  resolvedReports: 19,
  totalBountyPaid: 1250,
  activeResearchers: 12,
  averageResolutionTime: '2.3 days',
  topSeverity: 'medium',
};

export const knownQuirks: KnownQuirk[] = [
  {
    id: 'quirk_1',
    title: 'Dark mode flicker on initial load',
    description: 'When loading the site for the first time, there may be a brief flash of light mode before dark mode applies. This is due to CSS loading order.',
    severity: 'wontfix',
    component: 'Theme',
    reportedAt: '2026-03-02',
    upvotes: 5,
  },
  {
    id: 'quirk_2',
    title: 'Slow initial load on 3G networks',
    description: 'First contentful paint can take 3-5 seconds on slow connections. Working on optimization.',
    severity: 'planned',
    component: 'Performance',
    reportedAt: '2026-03-05',
    upvotes: 12,
  },
  {
    id: 'quirk_3',
    title: 'Search returns partial matches',
    description: 'The search feature uses fuzzy matching which may return unexpected results for some queries.',
    severity: 'known',
    component: 'Search',
    reportedAt: '2026-03-08',
    upvotes: 3,
  },
  {
    id: 'quirk_4',
    title: 'Emoji rendering varies by platform',
    description: 'Some emojis may appear differently on Windows vs macOS vs mobile devices.',
    severity: 'wontfix',
    component: 'Content',
    reportedAt: '2026-03-10',
    upvotes: 1,
  },
];

export const submissionGuidelines = [
  {
    title: 'Before Submitting',
    content: 'Check the known quirks list to avoid duplicate reports. Test on multiple browsers/devices to confirm the issue is consistent.',
  },
  {
    title: 'Writing a Good Report',
    content: 'Include clear steps to reproduce, expected vs actual behavior, browser/device info, and screenshots or screen recordings when possible.',
  },
  {
    title: 'After Submission',
    content: 'You will receive an acknowledgment within 48 hours. Critical issues are prioritized. Bounties are paid within 7 days of resolution.',
  },
  {
    title: 'Responsible Disclosure',
    content: 'Please allow time for fixes before public disclosure. I appreciate your help in keeping the site secure for everyone.',
  },
];
