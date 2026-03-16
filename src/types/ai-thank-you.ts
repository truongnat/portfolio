/**
 * AI-Powered Thank You System Types
 */

export interface AIThankYouMessage {
  id: string;
  donatorId: string;
  donatorName: string;
  donationAmount: number;
  messageType: MessageMediaType;
  content: string; // Generated message/code/art
  metadata?: {
    codeSnippet?: string;
    artUrl?: string;
    fortuneCookie?: string;
    sshMessage?: string;
    videoScript?: string;
  };
  createdAt: string;
  expiresAt?: string;
  isPublic: boolean;
  views: number;
}

export type MessageMediaType = 
  | 'text'           // Simple text message
  | 'code'           // Generated code snippet
  | 'ascii-art'      // ASCII art
  | 'fortune'        // Fortune cookie style
  | 'ssh-banner'     // SSH login message
  | 'poem'           // Generated poem
  | 'story'          // Micro story
  | 'quote';         // Custom inspirational quote

export interface FortuneCookie {
  id: string;
  fortune: string;
  luckyNumbers: number[];
  category: FortuneCategory;
  language: 'en' | 'vi';
}

export type FortuneCategory =
  | 'wisdom'
  | 'humor'
  | 'tech'
  | 'motivation'
  | 'love'
  | 'career';

export interface SSHMessage {
  id: string;
  message: string;
  style: SSHStyle;
  colors: string[];
  animation?: boolean;
}

export type SSHStyle =
  | 'banner'      // Simple ASCII banner
  | 'matrix'      // Matrix-style rain
  | 'retro'       // 80s terminal style
  | 'minimal'     // Clean, simple
  | 'fancy';      // Elaborate ASCII art

export interface GeneratedCode {
  id: string;
  language: string;
  title: string;
  description: string;
  code: string;
  tags: string[];
  complexity: 'simple' | 'intermediate' | 'advanced';
}

export interface ASCIIArt {
  id: string;
  art: string;
  title: string;
  width: number;
  height: number;
  style: 'text' | 'image' | 'logo';
}

export interface ThankYouTemplate {
  id: string;
  name: string;
  description: string;
  promptTemplate: string;
  parameters: {
    donatorName: string;
    amount: number;
    date: string;
    customMessage?: string;
  };
  examples: string[];
}

export interface AIThankYouStats {
  totalMessages: number;
  totalViews: number;
  favoriteType: MessageMediaType;
  averageGenerationTime: number; // seconds
  topDonator: {
    name: string;
    messagesReceived: number;
  };
}

export interface DonatorPreference {
  donatorId: string;
  preferredType: MessageMediaType;
  preferredLanguage: 'en' | 'vi' | 'both';
  favoriteThemes: string[];
  optInPublic: boolean;
  customInstructions?: string;
}
