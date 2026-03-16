/**
 * Code Review Auction System Types
 */

export interface AuctionSlot {
  id: string;
  week: string; // ISO week format: 2026-W12
  startDate: string;
  endDate: string;
  totalSlots: number;
  availableSlots: number;
  basePrice: number; // USD per slot
  status: AuctionStatus;
  createdAt: string;
  updatedAt: string;
}

export type AuctionStatus = 
  | 'upcoming'    // Not yet open for bidding
  | 'active'      // Open for bidding
  | 'filled'      // All slots taken
  | 'closed';     // Week passed

export interface AuctionBid {
  id: string;
  slotId: string;
  bidderId: string;
  bidderName: string;
  bidderEmail: string;
  bidAmount: number;
  status: BidStatus;
  repoUrl?: string;
  repoDescription?: string;
  techStack?: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
  paidAt?: string;
  completedAt?: string;
  paymentMethod: 'stripe' | 'crypto' | 'manual';
  transactionId?: string;
}

export type BidStatus =
  | 'pending'     // Bid placed, awaiting payment
  | 'confirmed'   // Payment received, slot secured
  | 'cancelled'   // Bid cancelled by user
  | 'refunded'   // Refunded
  | 'completed'; // Code review completed

export interface AuctionLeaderboardEntry {
  rank: number;
  bidderId: string;
  bidderName: string;
  totalBids: number;
  totalAmount: number;
  completedReviews: number;
  avatarUrl?: string;
  badge?: string;
}

export interface CodeReviewPackage {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
  estimatedHours: number;
  popular?: boolean;
}

export interface AuctionStats {
  totalSlots: number;
  availableSlots: number;
  totalBids: number;
  totalRevenue: number;
  averageBid: number;
  nextAuctionDate: string;
}

export interface ReviewDeliverable {
  id: string;
  bidId: string;
  type: 'video' | 'document' | 'call' | 'github_pr';
  url?: string;
  notes?: string;
  deliveredAt: string;
}
