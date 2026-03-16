import type { AuctionSlot, CodeReviewPackage, AuctionLeaderboardEntry } from '@/types/code-review-auction';

/**
 * Code Review Auction Initial Data
 */

export const auctionSlots: AuctionSlot[] = [
  {
    id: 'week-2026-12',
    week: '2026-W12',
    startDate: '2026-03-16',
    endDate: '2026-03-22',
    totalSlots: 3,
    availableSlots: 1,
    basePrice: 199,
    status: 'active',
    createdAt: '2026-03-01T00:00:00Z',
    updatedAt: '2026-03-15T12:00:00Z',
  },
  {
    id: 'week-2026-13',
    week: '2026-W13',
    startDate: '2026-03-23',
    endDate: '2026-03-29',
    totalSlots: 3,
    availableSlots: 3,
    basePrice: 199,
    status: 'upcoming',
    createdAt: '2026-03-01T00:00:00Z',
    updatedAt: '2026-03-01T00:00:00Z',
  },
  {
    id: 'week-2026-14',
    week: '2026-W14',
    startDate: '2026-03-30',
    endDate: '2026-04-05',
    totalSlots: 3,
    availableSlots: 3,
    basePrice: 199,
    status: 'upcoming',
    createdAt: '2026-03-01T00:00:00Z',
    updatedAt: '2026-03-01T00:00:00Z',
  },
];

export const reviewPackages: CodeReviewPackage[] = [
  {
    id: 'standard',
    name: 'Standard Review',
    description: 'Comprehensive code review with written feedback',
    price: 199,
    estimatedHours: 2,
    features: [
      'Up to 500 lines of code',
      'Written feedback document',
      'Security & best practices check',
      'Performance recommendations',
      '48-hour turnaround',
    ],
  },
  {
    id: 'premium',
    name: 'Premium Review',
    description: 'Deep dive review with video call session',
    price: 399,
    estimatedHours: 4,
    popular: true,
    features: [
      'Up to 1500 lines of code',
      '1-hour video call session',
      'Recorded walkthrough video',
      'Architecture review',
      'Follow-up Q&A support',
      'Priority scheduling',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise Review',
    description: 'Full project audit with team session',
    price: 999,
    estimatedHours: 10,
    features: [
      'Unlimited code review',
      '2-hour team workshop',
      'Detailed architecture report',
      'Security audit',
      'Performance optimization plan',
      '30-day support window',
      'Team Q&A session',
    ],
  },
];

export const leaderboardData: AuctionLeaderboardEntry[] = [
  {
    rank: 1,
    bidderId: 'bidder_1',
    bidderName: 'Sarah Chen',
    totalBids: 5,
    totalAmount: 1995,
    completedReviews: 4,
    badge: '🏆 Gold Reviewee',
  },
  {
    rank: 2,
    bidderId: 'bidder_2',
    bidderName: 'Alex Rivera',
    totalBids: 3,
    totalAmount: 1197,
    completedReviews: 3,
    badge: '🥈 Silver Reviewee',
  },
  {
    rank: 3,
    bidderId: 'bidder_3',
    bidderName: 'DevCorp Inc.',
    totalBids: 2,
    totalAmount: 1998,
    completedReviews: 2,
    badge: '🥉 Bronze Reviewee',
  },
  {
    rank: 4,
    bidderId: 'bidder_4',
    bidderName: 'John Doe',
    totalBids: 1,
    totalAmount: 399,
    completedReviews: 1,
  },
  {
    rank: 5,
    bidderId: 'bidder_5',
    bidderName: 'StartupXYZ',
    totalBids: 1,
    totalAmount: 999,
    completedReviews: 0,
  },
];

export const auctionStats = {
  totalSlots: 9,
  availableSlots: 7,
  totalBids: 12,
  totalRevenue: 6588,
  averageBid: 549,
  nextAuctionDate: '2026-03-16',
};

export const faqData = [
  {
    question: 'What do I get in a code review?',
    answer: 'You receive comprehensive feedback on your code including security analysis, performance recommendations, best practices suggestions, and architecture review. Premium packages include video calls and recorded walkthroughs.',
  },
  {
    question: 'How do I submit my code?',
    answer: 'After securing a slot, you will receive instructions to submit your GitHub/GitLab repository or code archive. Include context about your project and specific areas you want reviewed.',
  },
  {
    question: 'What is the turnaround time?',
    answer: 'Standard reviews are completed within 48 hours of the scheduled week. Premium and Enterprise reviews may take longer due to their comprehensive nature.',
  },
  {
    question: 'Can I get a refund?',
    answer: 'Yes, full refunds are available up to 7 days before the scheduled review week. After that, refunds are handled case-by-case.',
  },
  {
    question: 'What technologies do you review?',
    answer: 'I specialize in: TypeScript/JavaScript, React, Next.js, Node.js, Python, Astro, TailwindCSS, PostgreSQL, and cloud infrastructure (AWS, Cloudflare).',
  },
];
