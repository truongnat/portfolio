/**
 * Learning Journey Sponsor System Types
 */

export interface LearningSession {
  id: string;
  topic: string;
  description: string;
  category: LearningCategory;
  status: SessionStatus;
  scheduledStart?: string;
  scheduledEnd?: string;
  actualStart?: string;
  actualEnd?: string;
  targetHours: number;
  sponsoredHours: number;
  progress: number; // 0-100
  sponsorCount: number;
  resources?: string[];
  outcomes?: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type LearningCategory =
  | 'ai-ml'
  | 'web-dev'
  | 'database'
  | 'devops'
  | 'security'
  | 'architecture'
  | 'soft-skills'
  | 'other';

export type SessionStatus =
  | 'planned'     // Scheduled for future
  | 'live'        // Currently learning
  | 'break'       // On break
  | 'completed'   // Session finished
  | 'cancelled';  // Cancelled

export interface Sponsor {
  id: string;
  name: string;
  email?: string;
  avatarUrl?: string;
  totalSponsored: number; // USD
  totalHours: number;
  sessionsSponsored: string[]; // Session IDs
  joinedAt: string;
  isAnonymous: boolean;
  badge?: string;
  rank?: number;
}

export interface Sponsorship {
  id: string;
  sessionId: string;
  sponsorId: string;
  sponsorName: string;
  amount: number; // USD
  hours: number; // Hours sponsored (amount / hourlyRate)
  message?: string;
  status: SponsorshipStatus;
  paymentMethod: 'stripe' | 'crypto' | 'manual';
  transactionId?: string;
  createdAt: string;
  completedAt?: string;
}

export type SponsorshipStatus =
  | 'pending'
  | 'active'
  | 'completed'
  | 'refunded';

export interface LearningMilestone {
  id: string;
  sessionId: string;
  title: string;
  description: string;
  completed: boolean;
  completedAt?: string;
  evidence?: string; // Link to project, blog post, etc.
}

export interface LearningJournal {
  id: string;
  sessionId: string;
  timestamp: string;
  content: string;
  type: 'thought' | 'breakthrough' | 'challenge' | 'resource';
  isPublic: boolean;
  likes?: number;
}

export interface LearningStats {
  totalSessions: number;
  totalHours: number;
  totalSponsored: number;
  activeSponsors: number;
  currentSession?: LearningSession;
  nextSession?: LearningSession;
  averageSessionLength: number;
  completionRate: number;
}

export interface HourlyRate {
  standard: number;
  premium: number; // Live session with interaction
  enterprise: number; // Team session
}

export interface LearningResource {
  id: string;
  sessionId: string;
  title: string;
  url: string;
  type: 'video' | 'article' | 'course' | 'documentation' | 'other';
  addedAt: string;
}
