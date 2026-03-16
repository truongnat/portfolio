/**
 * Skill Tree Donation System Types
 */

export interface SkillNode {
  id: string;
  name: string;
  description: string;
  icon: string; // Lucide icon name
  category: SkillCategory;
  cost: number; // USD amount to unlock
  currency?: string; // Alternative crypto amount
  status: SkillStatus;
  prerequisites: string[]; // Array of skill IDs that must be unlocked first
  position: {
    x: number; // Percentage for positioning (0-100)
    y: number;
  };
  color: string; // Tailwind color class
  unlockedBy?: string[]; // Array of donator IDs/names
  totalDonated: number;
  progress: number; // 0-100 percentage
  metadata?: {
    resources?: string[];
    milestones?: Milestone[];
    estimatedHours?: number;
  };
}

export type SkillCategory = 
  | 'frontend'
  | 'backend'
  | 'database'
  | 'devops'
  | 'ai-ml'
  | 'mobile'
  | 'security'
  | 'architecture';

export type SkillStatus = 
  | 'locked'      // Not yet funded
  | 'funding'     // Partially funded
  | 'unlocked'    // Fully funded, in progress
  | 'completed'   // Learning completed
  | 'mastered';   // Deep expertise achieved

export interface Milestone {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  completedAt?: string;
}

export interface Donation {
  id: string;
  donatorId: string;
  donatorName: string;
  donatorEmail?: string;
  amount: number;
  currency: string;
  skillId: string;
  status: DonationStatus;
  createdAt: string;
  updatedAt: string;
  paymentMethod: 'stripe' | 'crypto' | 'paypal' | 'manual';
  transactionId?: string;
  message?: string; // Optional message from donator
  isAnonymous: boolean;
  badgeEarned?: Badge;
}

export type DonationStatus = 
  | 'pending'
  | 'completed'
  | 'failed'
  | 'refunded';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  requirement: {
    type: 'single' | 'category' | 'total';
    amount: number;
    skillId?: string;
    category?: SkillCategory;
  };
}

export interface SkillTreeData {
  skills: SkillNode[];
  categories: {
    id: SkillCategory;
    name: string;
    color: string;
    description: string;
  }[];
  stats: {
    totalSkills: number;
    unlockedSkills: number;
    totalDonated: number;
    totalDonators: number;
    completionPercentage: number;
  };
}

export interface DonatorProfile {
  id: string;
  name: string;
  email?: string;
  totalDonated: number;
  skillsUnlocked: string[];
  badges: Badge[];
  joinedAt: string;
  isAnonymous: boolean;
  leaderboardRank?: number;
}

export interface Certificate {
  id: string;
  donatorId: string;
  donatorName: string;
  skillId: string;
  skillName: string;
  issuedAt: string;
  certificateUrl: string;
  verificationHash: string;
}
