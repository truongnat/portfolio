/**
 * Terminal Takeover System Types
 */

export interface TerminalCommand {
  id: string;
  command: string;
  description: string;
  category: CommandCategory;
  cost: number; // Donation amount to unlock
  usage: string;
  examples: string[];
  output: string | ((args: string[]) => string);
  isUnlocked: boolean;
  unlockCount: number;
}

export type CommandCategory =
  | 'basic'       // Free commands
  | 'fun'         // Entertainment
  | 'info'        // Information display
  | 'interactive' // Interactive commands
  | 'premium'     // High-tier donations
  | 'admin';      // Special access

export interface TerminalSession {
  id: string;
  userId: string;
  history: CommandExecution[];
  startedAt: string;
  lastActiveAt: string;
  totalCommands: number;
  unlockedCommands: string[];
  donationTotal: number;
}

export interface CommandExecution {
  id: string;
  sessionId: string;
  command: string;
  args: string[];
  output: string;
  executedAt: string;
  duration: number; // ms
}

export interface TerminalUser {
  id: string;
  name: string;
  displayName: string;
  avatarUrl?: string;
  totalDonated: number;
  unlockedCommands: string[];
  commandExecutions: number;
  favoriteCommand?: string;
  rank: TerminalRank;
  badges: string[];
  joinedAt: string;
}

export type TerminalRank =
  | 'newbie'      // $0+
  | 'explorer'    // $10+
  | 'hacker'      // $50+
  | 'wizard'      // $100+
  | 'legend'      // $500+
  | 'god';        // $1000+

export interface TerminalStats {
  totalUsers: number;
  activeUsers: number;
  totalExecutions: number;
  popularCommand: string;
  totalDonations: number;
  averageDonation: number;
}

export interface EasterEgg {
  id: string;
  trigger: string; // Command or phrase that triggers it
  message: string;
  effect?: 'matrix' | 'confetti' | 'glitch' | 'rainbow';
  isDiscovered: boolean;
  discoveredBy?: string[];
}

export interface TerminalTheme {
  id: string;
  name: string;
  background: string;
  foreground: string;
  accent: string;
  cursor: string;
  selection: string;
  font: string;
}
