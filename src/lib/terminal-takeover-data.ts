import type { TerminalCommand, TerminalTheme, EasterEgg, TerminalStats } from '@/types/terminal-takeover';

/**
 * Terminal Takeover Data
 */

export const terminalCommands: TerminalCommand[] = [
  // Basic (Free)
  {
    id: 'help',
    command: 'help',
    description: 'Show available commands',
    category: 'basic',
    cost: 0,
    usage: 'help [command]',
    examples: ['help', 'help echo'],
    output: `
Available commands:
  help     - Show this help message
  echo     - Print text to terminal
  clear    - Clear terminal screen
  whoami   - Display current user info
  date     - Show current date/time
  donate   - Support this project

Type 'help [command]' for more info.
    `,
    isUnlocked: true,
    unlockCount: 9999,
  },
  {
    id: 'echo',
    command: 'echo',
    description: 'Print text to terminal',
    category: 'basic',
    cost: 0,
    usage: 'echo [text]',
    examples: ['echo Hello World', 'echo $USER'],
    output: (args) => args.join(' '),
    isUnlocked: true,
    unlockCount: 9999,
  },
  {
    id: 'clear',
    command: 'clear',
    description: 'Clear terminal screen',
    category: 'basic',
    cost: 0,
    usage: 'clear',
    examples: ['clear'],
    output: '[CLEAR]',
    isUnlocked: true,
    unlockCount: 9999,
  },
  {
    id: 'whoami',
    command: 'whoami',
    description: 'Display current user info',
    category: 'basic',
    cost: 0,
    usage: 'whoami',
    examples: ['whoami'],
    output: `
Guest User
Rank: newbie
Donated: $0
Commands Unlocked: 4/20

Type 'donate' to unlock more commands!
    `,
    isUnlocked: true,
    unlockCount: 9999,
  },
  {
    id: 'date',
    command: 'date',
    description: 'Show current date/time',
    category: 'basic',
    cost: 0,
    usage: 'date',
    examples: ['date'],
    output: () => new Date().toString(),
    isUnlocked: true,
    unlockCount: 9999,
  },
  {
    id: 'donate',
    command: 'donate',
    description: 'Support this project',
    category: 'basic',
    cost: 0,
    usage: 'donate [amount]',
    examples: ['donate 10', 'donate 50'],
    output: `
Thank you for your interest in donating!

Donation tiers:
  $10  - Unlock fun commands
  $50  - Unlock interactive commands  
  $100 - Unlock premium commands
  $500 - Unlock admin commands

Visit /donate to complete your donation.
    `,
    isUnlocked: true,
    unlockCount: 9999,
  },

  // Fun Commands ($10+)
  {
    id: 'cowsay',
    command: 'cowsay',
    description: 'Make a cow say things',
    category: 'fun',
    cost: 10,
    usage: 'cowsay [text]',
    examples: ['cowsay Hello!', 'cowsay Moo!'],
    output: (args) => {
      const text = args.join(' ') || 'Moo!';
      return `
 _______________
< ${text.padEnd(text.length + 10)} >
 ---------------
        \\   ^__^
         \\  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||
      `.trim();
    },
    isUnlocked: false,
    unlockCount: 156,
  },
  {
    id: 'matrix',
    command: 'matrix',
    description: 'Enter the matrix',
    category: 'fun',
    cost: 10,
    usage: 'matrix',
    examples: ['matrix'],
    output: `
Wake up, Neo...
The Matrix has you...
Follow the white rabbit.
Knock, knock.

[Matrix effect activated 🟢]
    `,
    isUnlocked: false,
    unlockCount: 89,
  },
  {
    id: 'fortune',
    command: 'fortune',
    description: 'Get a random fortune',
    category: 'fun',
    cost: 10,
    usage: 'fortune',
    examples: ['fortune'],
    output: `
Your code will compile without errors today.
But only if you test it first.

🥠 Lucky numbers: 7, 14, 23, 42, 69, 88
    `,
    isUnlocked: false,
    unlockCount: 234,
  },
  {
    id: 'joke',
    command: 'joke',
    description: 'Tell a programming joke',
    category: 'fun',
    cost: 10,
    usage: 'joke',
    examples: ['joke'],
    output: `
Why do programmers prefer dark mode?

Because light attracts bugs! 🐛

[Type 'joke' again for another one]
    `,
    isUnlocked: false,
    unlockCount: 312,
  },

  // Info Commands ($25+)
  {
    id: 'neofetch',
    command: 'neofetch',
    description: 'Display system info',
    category: 'info',
    cost: 25,
    usage: 'neofetch',
    examples: ['neofetch'],
    output: `
       _____                    _____
      / ____/__________________/ ____/
     / /_  / ___/ ___/ ___/ __/ /_    
    / __/ / /  / /  / /  / /_/ __/    
   /_/   /_/  /_/  /_/   \\____/_/     

OS: Portfolio Terminal v1.0
Uptime: Since 2024
Shell: zsh 5.9
Resolution: ∞ x ∞
DE: Astro + React
WM: TailwindCSS
Font: JetBrains Mono
CPU: Neural Networks
GPU: Imagination
Memory: Unlimited

Commands Executed: 1,337
Donations Received: 42
Coffee Consumed: ∞
    `,
    isUnlocked: false,
    unlockCount: 78,
  },
  {
    id: 'stats',
    command: 'stats',
    description: 'Show terminal statistics',
    category: 'info',
    cost: 25,
    usage: 'stats',
    examples: ['stats'],
    output: `
Terminal Statistics:
━━━━━━━━━━━━━━━━━━━━━━━━━━
Total Users: 1,234
Active Today: 89
Total Commands: 5,678
Most Popular: cowsay
Total Donations: $3,456
Average Donation: $47

Your Stats:
━━━━━━━━━━━━━━━━━━━━━━━━━━
Commands Used: 0
Time Spent: 0m
Donation Tier: $0
    `,
    isUnlocked: false,
    unlockCount: 145,
  },

  // Interactive Commands ($50+)
  {
    id: 'chat',
    command: 'chat',
    description: 'Chat with AI assistant',
    category: 'interactive',
    cost: 50,
    usage: 'chat [message]',
    examples: ['chat Hello!', 'chat Tell me about yourself'],
    output: `
[AI Assistant activated]
Hello! I'm the Portfolio AI. Ask me anything!

Type 'chat [your message]' to start chatting.
Type 'chat exit' to end the conversation.
    `,
    isUnlocked: false,
    unlockCount: 67,
  },
  {
    id: 'game',
    command: 'game',
    description: 'Play a mini game',
    category: 'interactive',
    cost: 50,
    usage: 'game [name]',
    examples: ['game snake', 'game guess'],
    output: `
Available Games:
  snake  - Classic snake game
  guess  - Number guessing game
  quiz   - Tech trivia quiz

Type 'game [name]' to start playing!
    `,
    isUnlocked: false,
    unlockCount: 45,
  },
  {
    id: 'fetch',
    command: 'fetch',
    description: 'Fetch content from URL',
    category: 'interactive',
    cost: 50,
    usage: 'fetch [url]',
    examples: ['fetch https://example.com'],
    output: `
[Fetch Command]
Enter a URL to fetch content from.

Note: Only whitelisted URLs are allowed.
Type 'fetch help' for more info.
    `,
    isUnlocked: false,
    unlockCount: 34,
  },

  // Premium Commands ($100+)
  {
    id: 'sudo',
    command: 'sudo',
    description: 'Execute command with elevated privileges',
    category: 'premium',
    cost: 100,
    usage: 'sudo [command]',
    examples: ['sudo rm -rf /bugs', 'sudo fix everything'],
    output: `
[sudo] password for user: ********

Nice try! 😄 This is a safe space.
But you now have access to premium commands!

Try: sudo compliment
    `,
    isUnlocked: false,
    unlockCount: 23,
  },
  {
    id: 'hack',
    command: 'hack',
    description: 'Initiate totally real hacking sequence',
    category: 'premium',
    cost: 100,
    usage: 'hack [target]',
    examples: ['hack the planet', 'hack bugs'],
    output: `
Initializing hack sequence...
[████████████] 100%

Just kidding! 🎉 
No actual hacking here.
But you're awesome for donating $100+!
    `,
    isUnlocked: false,
    unlockCount: 18,
  },
  {
    id: 'deploy',
    command: 'deploy',
    description: 'Deploy to production (simulated)',
    category: 'premium',
    cost: 100,
    usage: 'deploy [environment]',
    examples: ['deploy production', 'deploy staging'],
    output: `
Building... ✓
Testing... ✓
Deploying to production... ✓

Deployment successful! 🚀
(Just kidding, this is a simulation)
    `,
    isUnlocked: false,
    unlockCount: 31,
  },

  // Admin Commands ($500+)
  {
    id: 'rm -rf /bugs',
    command: 'rm -rf /bugs',
    description: 'Remove all bugs (simulated)',
    category: 'admin',
    cost: 500,
    usage: 'rm -rf /bugs',
    examples: ['rm -rf /bugs'],
    output: `
Removing all bugs...
Found 42 bugs.
Deleting... ✓

All bugs removed! 🎉
(Wish this was real!)
    `,
    isUnlocked: false,
    unlockCount: 5,
  },
  {
    id: 'fix everything',
    command: 'fix everything',
    description: 'Fix all problems',
    category: 'admin',
    cost: 500,
    usage: 'fix everything',
    examples: ['fix everything'],
    output: `
Analyzing problems...
Found 1337 problems.

Fixing...
[████████████] 100%

Everything is fixed! ✨
You're now a legend!
    `,
    isUnlocked: false,
    unlockCount: 3,
  },
];

export const terminalThemes: TerminalTheme[] = [
  {
    id: 'default',
    name: 'Default',
    background: '#0a0a0a',
    foreground: '#ffffff',
    accent: '#22c55e',
    cursor: '#22c55e',
    selection: 'rgba(34, 197, 94, 0.3)',
    font: 'JetBrains Mono',
  },
  {
    id: 'matrix',
    name: 'Matrix',
    background: '#000000',
    foreground: '#00ff00',
    accent: '#00ff00',
    cursor: '#00ff00',
    selection: 'rgba(0, 255, 0, 0.3)',
    font: 'JetBrains Mono',
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    background: '#0d0221',
    foreground: '#00f0ff',
    accent: '#ff00ff',
    cursor: '#ff00ff',
    selection: 'rgba(255, 0, 255, 0.3)',
    font: 'JetBrains Mono',
  },
  {
    id: 'gruvbox',
    name: 'Gruvbox',
    background: '#282828',
    foreground: '#ebdbb2',
    accent: '#fabd2f',
    cursor: '#fabd2f',
    selection: 'rgba(250, 189, 47, 0.3)',
    font: 'JetBrains Mono',
  },
  {
    id: 'dracula',
    name: 'Dracula',
    background: '#282a36',
    foreground: '#f8f8f2',
    accent: '#bd93f9',
    cursor: '#bd93f9',
    selection: 'rgba(189, 147, 249, 0.3)',
    font: 'JetBrains Mono',
  },
];

export const easterEggs: EasterEgg[] = [
  {
    id: 'konami',
    trigger: '↑↑↓↓←→←→BA',
    message: '🎮 Konami Code! You found the secret!',
    effect: 'rainbow',
    isDiscovered: false,
    discoveredBy: [],
  },
  {
    id: 'hello',
    trigger: 'hello world',
    message: '👋 Hello to you too!',
    isDiscovered: false,
    discoveredBy: [],
  },
  {
    id: 'sudo',
    trigger: 'sudo make me a sandwich',
    message: '🥪 Okay, here\'s your sandwich!',
    isDiscovered: false,
    discoveredBy: [],
  },
  {
    id: 'matrix',
    trigger: 'follow the white rabbit',
    message: '🐇 Knock, knock. The Matrix has you...',
    effect: 'matrix',
    isDiscovered: false,
    discoveredBy: [],
  },
  {
    id: 'starwars',
    trigger: 'use the force',
    message: '🌟 These aren\'t the droids you\'re looking for.',
    isDiscovered: false,
    discoveredBy: [],
  },
];

export const terminalStats: TerminalStats = {
  totalUsers: 1234,
  activeUsers: 89,
  totalExecutions: 5678,
  popularCommand: 'cowsay',
  totalDonations: 3456,
  averageDonation: 47,
};

export const commandCategories = [
  { id: 'basic', name: 'Basic', icon: '📌', color: 'green', minCost: 0 },
  { id: 'fun', name: 'Fun', icon: '🎮', color: 'yellow', minCost: 10 },
  { id: 'info', name: 'Info', icon: '📊', color: 'blue', minCost: 25 },
  { id: 'interactive', name: 'Interactive', icon: '💬', color: 'purple', minCost: 50 },
  { id: 'premium', name: 'Premium', icon: '⭐', color: 'pink', minCost: 100 },
  { id: 'admin', name: 'Admin', icon: '🔐', color: 'red', minCost: 500 },
];

export const ranks = [
  { id: 'newbie', name: 'Newbie', icon: '🌱', minDonation: 0 },
  { id: 'explorer', name: 'Explorer', icon: '🗺️', minDonation: 10 },
  { id: 'hacker', name: 'Hacker', icon: '💻', minDonation: 50 },
  { id: 'wizard', name: 'Wizard', icon: '🧙', minDonation: 100 },
  { id: 'legend', name: 'Legend', icon: '🏆', minDonation: 500 },
  { id: 'god', name: 'God Mode', icon: '⚡', minDonation: 1000 },
];
