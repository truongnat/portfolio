/**
 * Open Source Roadmap Voting System Types
 */

export interface RoadmapFeature {
  id: string;
  title: string;
  description: string;
  category: FeatureCategory;
  status: FeatureStatus;
  votes: number;
  targetAmount: number;
  currentAmount: number;
  estimatedHours: number;
  complexity: Complexity;
  tags: string[];
  author?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  voters: string[]; // Voter IDs
  comments: RoadmapComment[];
  updates: FeatureUpdate[];
}

export type FeatureCategory =
  | 'feature'
  | 'improvement'
  | 'bugfix'
  | 'documentation'
  | 'performance'
  | 'security'
  | 'refactor';

export type FeatureStatus =
  | 'proposed'     // New feature request
  | 'voting'       // Open for voting
  | 'funded'       // Fully funded
  | 'in-progress'  // Being developed
  | 'review'       // Code review
  | 'completed'    // Done
  | 'rejected';    // Won't implement

export type Complexity =
  | 'trivial'   // < 1 hour
  | 'small'     // 1-4 hours
  | 'medium'    // 4-16 hours
  | 'large'     // 16-40 hours
  | 'xl'        // 40+ hours

export interface RoadmapComment {
  id: string;
  featureId: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  upvotes: number;
  isSolution?: boolean;
}

export interface FeatureUpdate {
  id: string;
  featureId: string;
  type: UpdateType;
  message: string;
  authorId: string;
  createdAt: string;
  metadata?: {
    prUrl?: string;
    commitHash?: string;
    demoUrl?: string;
  };
}

export type UpdateType =
  | 'progress'
  | 'blocker'
  | 'milestone'
  | 'release'
  | 'announcement';

export interface Vote {
  id: string;
  featureId: string;
  voterId: string;
  voterName: string;
  amount: number;
  message?: string;
  isAnonymous: boolean;
  createdAt: string;
  paymentMethod: 'stripe' | 'crypto' | 'manual';
  transactionId?: string;
}

export interface RoadmapStats {
  totalFeatures: number;
  completedFeatures: number;
  totalVotes: number;
  totalFunded: number;
  activeVoters: number;
  averageCompletionTime: string;
}

export interface RoadmapCategory {
  id: FeatureCategory;
  name: string;
  color: string;
  icon: string;
  description: string;
  featureCount: number;
}

export interface Backer {
  id: string;
  name: string;
  avatarUrl?: string;
  totalBacked: number;
  featuresBacked: string[]; // Feature IDs
  votes: number;
  rank: BackerRank;
  badges: string[];
  joinedAt: string;
}

export type BackerRank =
  | 'supporter'   // $10+
  | 'bronze'      // $50+
  | 'silver'      // $100+
  | 'gold'        // $500+
  | 'platinum'    // $1000+
  | 'legendary';  // $5000+

export interface Milestone {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  features: string[]; // Feature IDs
  progress: number; // 0-100
  isCompleted: boolean;
  completedAt?: string;
}
