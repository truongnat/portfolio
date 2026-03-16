import type { LearningSession, Sponsor, LearningStats, LearningMilestone, LearningJournal } from '@/types/learning-journey';

/**
 * Learning Journey Sponsor Data
 */

export const currentSessions: LearningSession[] = [
  {
    id: 'session_1',
    topic: 'Advanced RLS in PostgreSQL',
    description: 'Deep dive into Row Level Security policies, performance optimization, and real-world multi-tenant architectures.',
    category: 'database',
    status: 'live',
    scheduledStart: '2026-03-16T09:00:00Z',
    scheduledEnd: '2026-03-16T17:00:00Z',
    actualStart: '2026-03-16T09:15:00Z',
    targetHours: 8,
    sponsoredHours: 6.5,
    progress: 65,
    sponsorCount: 12,
    resources: [
      'PostgreSQL Documentation: RLS',
      'Supabase RLS Guide',
      'Multi-tenant Architecture Patterns',
    ],
    outcomes: [
      'Implement complex RLS policies',
      'Optimize query performance with RLS',
      'Create reusable policy templates',
    ],
    createdAt: '2026-03-14T00:00:00Z',
    updatedAt: '2026-03-16T14:30:00Z',
  },
  {
    id: 'session_2',
    topic: 'PDF Security & Validation',
    description: 'Understanding PDF structure, implementing validation pipelines, and malware detection strategies.',
    category: 'security',
    status: 'planned',
    scheduledStart: '2026-03-17T09:00:00Z',
    scheduledEnd: '2026-03-17T15:00:00Z',
    targetHours: 6,
    sponsoredHours: 3.5,
    progress: 0,
    sponsorCount: 7,
    resources: [
      'PDF Specification (ISO 32000)',
      'pdf-lib Documentation',
      'ClamAV Integration Guide',
    ],
    outcomes: [
      'Build PDF validation pipeline',
      'Implement malware scanning',
      'Create sanitization functions',
    ],
    createdAt: '2026-03-15T00:00:00Z',
    updatedAt: '2026-03-16T10:00:00Z',
  },
  {
    id: 'session_3',
    topic: 'LanceDB + MCP Integration',
    description: 'Vector database indexing with Model Context Protocol for efficient AI context retrieval.',
    category: 'ai-ml',
    status: 'planned',
    scheduledStart: '2026-03-18T09:00:00Z',
    scheduledEnd: '2026-03-18T17:00:00Z',
    targetHours: 8,
    sponsoredHours: 2,
    progress: 0,
    sponsorCount: 4,
    resources: [
      'LanceDB Documentation',
      'MCP Protocol Spec',
      'Vector Embeddings Guide',
    ],
    outcomes: [
      'Set up LanceDB instance',
      'Build MCP server integration',
      'Implement semantic search',
    ],
    createdAt: '2026-03-15T00:00:00Z',
    updatedAt: '2026-03-16T08:00:00Z',
  },
];

export const completedSessions: LearningSession[] = [
  {
    id: 'session_completed_1',
    topic: 'AI Agent Workflow Design',
    description: 'Learning to build autonomous AI agents with memory, planning, and tool use.',
    category: 'ai-ml',
    status: 'completed',
    scheduledStart: '2026-03-14T09:00:00Z',
    scheduledEnd: '2026-03-14T17:00:00Z',
    actualStart: '2026-03-14T09:00:00Z',
    actualEnd: '2026-03-14T18:30:00Z',
    targetHours: 8,
    sponsoredHours: 9.5,
    progress: 100,
    sponsorCount: 15,
    outcomes: [
      'Built working AI agent with memory',
      'Implemented tool integration',
      'Created agent orchestration system',
    ],
    createdAt: '2026-03-12T00:00:00Z',
    updatedAt: '2026-03-14T18:30:00Z',
  },
  {
    id: 'session_completed_2',
    topic: 'Cloudflare Workers Advanced Patterns',
    description: 'Edge computing, D1 database, KV storage, and Durable Objects.',
    category: 'web-dev',
    status: 'completed',
    scheduledStart: '2026-03-13T09:00:00Z',
    scheduledEnd: '2026-03-13T17:00:00Z',
    actualStart: '2026-03-13T09:00:00Z',
    actualEnd: '2026-03-13T16:45:00Z',
    targetHours: 8,
    sponsoredHours: 8,
    progress: 100,
    sponsorCount: 10,
    outcomes: [
      'Deployed Workers with D1',
      'Implemented KV caching',
      'Built Durable Objects prototype',
    ],
    createdAt: '2026-03-11T00:00:00Z',
    updatedAt: '2026-03-13T16:45:00Z',
  },
];

export const topSponsors: Sponsor[] = [
  {
    id: 'sponsor_1',
    name: 'TechCorp Inc.',
    avatarUrl: 'https://github.com/techcorp.png',
    totalSponsored: 2500,
    totalHours: 25,
    sessionsSponsored: ['session_1', 'session_completed_1', 'session_completed_2'],
    joinedAt: '2026-03-01',
    isAnonymous: false,
    badge: '🏆 Platinum Sponsor',
    rank: 1,
  },
  {
    id: 'sponsor_2',
    name: 'Alex Chen',
    avatarUrl: 'https://github.com/alexchen.png',
    totalSponsored: 1200,
    totalHours: 12,
    sessionsSponsored: ['session_1', 'session_2'],
    joinedAt: '2026-03-05',
    isAnonymous: false,
    badge: '🥈 Gold Sponsor',
    rank: 2,
  },
  {
    id: 'sponsor_3',
    name: 'Anonymous',
    avatarUrl: null,
    totalSponsored: 800,
    totalHours: 8,
    sessionsSponsored: ['session_completed_1'],
    joinedAt: '2026-03-08',
    isAnonymous: true,
    badge: '🥉 Silver Sponsor',
    rank: 3,
  },
  {
    id: 'sponsor_4',
    name: 'Sarah Miller',
    avatarUrl: 'https://github.com/sarahmiller.png',
    totalSponsored: 500,
    totalHours: 5,
    sessionsSponsored: ['session_3'],
    joinedAt: '2026-03-10',
    isAnonymous: false,
    badge: 'Bronze Sponsor',
    rank: 4,
  },
  {
    id: 'sponsor_5',
    name: 'DevTeam Labs',
    avatarUrl: null,
    totalSponsored: 350,
    totalHours: 3.5,
    sessionsSponsored: ['session_2'],
    joinedAt: '2026-03-12',
    isAnonymous: false,
    rank: 5,
  },
];

export const learningStats: LearningStats = {
  totalSessions: 15,
  totalHours: 120,
  totalSponsored: 5370,
  activeSponsors: 24,
  currentSession: currentSessions[0],
  nextSession: currentSessions[1],
  averageSessionLength: 8,
  completionRate: 95,
};

export const sessionMilestones: LearningMilestone[] = [
  {
    id: 'milestone_1',
    sessionId: 'session_1',
    title: 'Understand RLS Basics',
    description: 'Complete PostgreSQL RLS documentation and basic examples',
    completed: true,
    completedAt: '2026-03-16T11:00:00Z',
  },
  {
    id: 'milestone_2',
    sessionId: 'session_1',
    title: 'Build Multi-tenant Policies',
    description: 'Implement tenant isolation with RLS',
    completed: true,
    completedAt: '2026-03-16T13:30:00Z',
  },
  {
    id: 'milestone_3',
    sessionId: 'session_1',
    title: 'Performance Optimization',
    description: 'Benchmark and optimize RLS queries',
    completed: false,
  },
  {
    id: 'milestone_4',
    sessionId: 'session_1',
    title: 'Create Policy Templates',
    description: 'Build reusable policy library',
    completed: false,
  },
];

export const recentJournal: LearningJournal[] = [
  {
    id: 'journal_1',
    sessionId: 'session_1',
    timestamp: '2026-03-16T10:30:00Z',
    content: 'Just discovered that RLS policies can use JWT claims directly! This is a game changer for multi-tenant apps.',
    type: 'breakthrough',
    isPublic: true,
    likes: 5,
  },
  {
    id: 'journal_2',
    sessionId: 'session_1',
    timestamp: '2026-03-16T12:00:00Z',
    content: 'Taking a lunch break. The morning session was intense but productive. Afternoon will focus on performance tuning.',
    type: 'thought',
    isPublic: true,
  },
  {
    id: 'journal_3',
    sessionId: 'session_1',
    timestamp: '2026-03-16T14:15:00Z',
    content: 'Found a performance issue with cascading policies. Working on a solution using materialized views.',
    type: 'challenge',
    isPublic: true,
    likes: 2,
  },
];

export const hourlyRates = {
  standard: 50, // $50/hour for regular sessions
  premium: 100, // $100/hour for live interaction
  enterprise: 250, // $250/hour for team sessions
};

export const sponsorshipTiers = [
  {
    name: 'Coffee Break',
    amount: 10,
    hours: 0.2,
    description: 'Sponsor 15 minutes of learning',
    perk: 'Name in session chat',
  },
  {
    name: 'Hour Sponsor',
    amount: 50,
    hours: 1,
    description: 'Sponsor 1 full hour',
    perk: 'Name in journal + chat',
  },
  {
    name: 'Session Sponsor',
    amount: 200,
    hours: 4,
    description: 'Sponsor half a session',
    perk: 'Priority Q&A + journal mention',
  },
  {
    name: 'Full Session',
    amount: 400,
    hours: 8,
    description: 'Sponsor entire session',
    perk: 'All perks + 1:1 call option',
  },
];
