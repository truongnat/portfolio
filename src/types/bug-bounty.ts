/**
 * Bug Bounty System Types
 */

export interface BugBountyProgram {
  id: string;
  name: string;
  description: string;
  status: ProgramStatus;
  startDate: string;
  endDate?: string;
  totalBudget: number;
  remainingBudget: number;
  rules: string[];
  outOfScope: string[];
  createdAt: string;
  updatedAt: string;
}

export type ProgramStatus = 'active' | 'paused' | 'ended';

export interface BugReport {
  id: string;
  reporterId: string;
  reporterName: string;
  reporterEmail: string;
  title: string;
  description: string;
  severity: Severity;
  category: BugCategory;
  affectedComponent?: string;
  stepsToReproduce: string;
  expectedBehavior: string;
  actualBehavior: string;
  proofOfConcept?: string; // Code, screenshot URL, video URL
  isPublic: boolean; // Show in Hall of Fame
  status: ReportStatus;
  submittedAt: string;
  updatedAt: string;
  resolvedAt?: string;
  bountyAmount: number;
  paidAt?: string;
  notes?: string; // Internal notes
}

export type Severity = 
  | 'critical'  // Remote code execution, auth bypass
  | 'high'      // XSS, CSRF, SQL injection
  | 'medium'    // Information disclosure
  | 'low'       // Minor bugs, typos
  | 'info';     // Suggestions

export type BugCategory =
  | 'security'
  | 'functionality'
  | 'performance'
  | 'ui-ux'
  | 'content'
  | 'other';

export type ReportStatus =
  | 'submitted'   // New report
  | 'triage'      // Under review
  | 'confirmed'   // Valid bug, bounty awarded
  | 'fixing'      // Being fixed
  | 'resolved'    // Fixed and verified
  | 'duplicate'   // Already reported
  | 'invalid'     // Not a bug / out of scope
  | 'withdrawn'; // Reporter withdrew

export interface BountyReward {
  severity: Severity;
  minAmount: number;
  maxAmount: number;
  description: string;
}

export interface HallOfFameEntry {
  id: string;
  reporterName: string;
  reporterAvatar?: string;
  totalBugs: number;
  totalBounty: number;
  rank: number;
  badge?: string;
  joinedDate: string;
  resolvedBugs: BugReportSummary[];
}

export interface BugReportSummary {
  id: string;
  title: string;
  severity: Severity;
  bountyAmount: number;
  resolvedAt: string;
  component: string;
}

export interface BugBountyStats {
  totalReports: number;
  resolvedReports: number;
  totalBountyPaid: number;
  activeResearchers: number;
  averageResolutionTime: string; // e.g., "3.5 days"
  topSeverity: Severity;
}

export interface KnownQuirk {
  id: string;
  title: string;
  description: string;
  severity: 'known' | 'wontfix' | 'planned';
  component: string;
  reportedAt: string;
  upvotes: number;
}
