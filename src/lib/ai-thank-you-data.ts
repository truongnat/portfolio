import type { FortuneCookie, SSHMessage, GeneratedCode, ASCIIArt, ThankYouTemplate, AIThankYouStats } from '@/types/ai-thank-you';

/**
 * AI Thank You Data
 */

export const fortuneCookies: FortuneCookie[] = [
  {
    id: 'fortune_1',
    fortune: 'A bug avoided today is a feature tomorrow. Your code will run smoothly.',
    luckyNumbers: [7, 14, 23, 42, 69, 88],
    category: 'tech',
    language: 'en',
  },
  {
    id: 'fortune_2',
    fortune: 'The best time to deploy was yesterday. The second best time is after testing.',
    luckyNumbers: [3, 11, 27, 33, 55, 99],
    category: 'tech',
    language: 'en',
  },
  {
    id: 'fortune_3',
    fortune: 'Your merge conflicts will be few, and your tests will pass.',
    luckyNumbers: [1, 8, 15, 22, 36, 47],
    category: 'tech',
    language: 'en',
  },
  {
    id: 'fortune_4',
    fortune: 'Code review feedback is like pizza - even when it\'s critical, it nourishes you.',
    luckyNumbers: [5, 12, 19, 28, 41, 63],
    category: 'humor',
    language: 'en',
  },
  {
    id: 'fortune_5',
    fortune: 'The function you seek is already within you. Just add console.log.',
    luckyNumbers: [2, 17, 24, 35, 48, 71],
    category: 'tech',
    language: 'en',
  },
  {
    id: 'fortune_6',
    fortune: 'Stack Overflow will be kind to you this week. Bookmark wisely.',
    luckyNumbers: [9, 16, 25, 34, 52, 80],
    category: 'tech',
    language: 'en',
  },
  {
    id: 'fortune_7',
    fortune: 'Một dòng code hôm nay, cả hệ thống ngày mai. Sự kiên nhẫn của bạn sẽ được đền đáp.',
    luckyNumbers: [6, 13, 21, 38, 45, 67],
    category: 'motivation',
    language: 'vi',
  },
  {
    id: 'fortune_8',
    fortune: 'Debugging là cuộc phiêu lưu. Mỗi bug là một kho báu chờ khám phá.',
    luckyNumbers: [4, 18, 26, 39, 54, 72],
    category: 'motivation',
    language: 'vi',
  },
];

export const sshMessages: SSHMessage[] = [
  {
    id: 'ssh_1',
    message: `
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🎉  WELCOME BACK, VALUED SUPPORTER!  🎉                ║
║                                                           ║
║   Your generosity fuels this developer's journey.        ║
║   Thank you for believing in continuous learning.        ║
║                                                           ║
║   "Code is poetry written in logic."                     ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
    `,
    style: 'banner',
    colors: ['#22c55e', '#3b82f6', '#8b5cf6'],
    animation: false,
  },
  {
    id: 'ssh_2',
    message: `
    ╭──────────────────────────────────────────╮
    │  ❤  THANK YOU FOR YOUR SUPPORT  ❤       │
    │                                          │
    │  Sponsor: {name}                         │
    │  Contribution: {amount}                  │
    │  Impact: Priceless                       │
    │                                          │
    │  "The best investment is in yourself."   │
    ╰──────────────────────────────────────────╯
    `,
    style: 'minimal',
    colors: ['#f472b6', '#fb923c'],
    animation: false,
  },
  {
    id: 'ssh_3',
    message: `
██████╗ ███████╗███████╗████████╗    ███████╗
██╔══██╗██╔════╝██╔════╝╚══██╔══╝    ╚══███╔╝
██████╔╝█████╗  █████╗     ██║         ███╔╝ 
██╔══██╗██╔══╝  ██╔══╝     ██║        ███╔╝  
██║  ██║███████╗██║        ██║       ███████╗
╚═╝  ╚═╝╚══════╝╚═╝        ╚═╝       ╚══════╝
                                             
   Thank you for supporting this developer!
   Your contribution makes all the difference.
    `,
    style: 'fancy',
    colors: ['#60a5fa', '#a78bfa'],
    animation: false,
  },
];

export const generatedCodeExamples: GeneratedCode[] = [
  {
    id: 'code_1',
    language: 'typescript',
    title: 'Gratitude Function',
    description: 'A function that never stops returning thanks',
    code: `function thankYou(sponsor: string): string {
  const gratitude = Infinity;
  const appreciation = [];
  
  for (let i = 0; i < gratitude; i++) {
    appreciation.push(\`Thank you, \${sponsor}!\`);
  }
  
  return appreciation.join('\\n');
}

// Output: Thank you, [Sponsor]! (∞ times)`,
    tags: ['typescript', 'infinity', 'gratitude'],
    complexity: 'simple',
  },
  {
    id: 'code_2',
    language: 'python',
    title: 'Appreciation Class',
    description: 'OOP approach to saying thanks',
    code: `class Appreciation:
    def __init__(self, sponsor, amount):
        self.sponsor = sponsor
        self.amount = amount
        self.gratitude_level = "maximum"
    
    def __str__(self):
        return f"Deep gratitude to {self.sponsor}"
    
    def __repr__(self):
        return f"Appreciation(sponsor='{self.sponsor}', forever=True)"
    
    def is_appreciated(self):
        return True  # Always!

# Usage: thanks = Appreciation("{name}", {amount})`,
    tags: ['python', 'oop', 'class'],
    complexity: 'intermediate',
  },
  {
    id: 'code_3',
    language: 'sql',
    title: 'Gratitude Query',
    description: 'Database-driven appreciation',
    code: `-- Create a table for endless thanks
CREATE TABLE gratitude (
    id SERIAL PRIMARY KEY,
    sponsor_name VARCHAR(100) NOT NULL,
    amount DECIMAL(10,2),
    thanked_at TIMESTAMP DEFAULT NOW(),
    appreciation_level INT CHECK (appreciation_level > 0)
);

-- Insert infinite gratitude
INSERT INTO gratitude (sponsor_name, amount, appreciation_level)
VALUES ('{name}', {amount}, 9999);

-- Query: SELECT * FROM gratitude WHERE sponsor_name = '{name}';
-- Result: Endless appreciation ❤`,
    tags: ['sql', 'database', 'table'],
    complexity: 'simple',
  },
  {
    id: 'code_4',
    language: 'rust',
    title: 'Memory-Safe Thanks',
    description: 'Rust ensures your appreciation lives forever',
    code: `fn generate_gratitude<'a>(sponsor: &'a str) -> Result<String, &'a str> {
    let thanks = format!("Thank you, {}!", sponsor);
    
    // This gratitude is owned and will live forever
    Ok(thanks)
}

fn main() {
    let sponsor = "{name}";
    match generate_gratitude(sponsor) {
        Ok(thanks) => println!("{}", thanks),
        Err(e) => eprintln!("Error: {}", e),
    }
}

// Output: Thank you, {name}! (guaranteed by Rust)`,
    tags: ['rust', 'memory-safe', 'ownership'],
    complexity: 'advanced',
  },
];

export const asciiArtExamples: ASCIIArt[] = [
  {
    id: 'ascii_1',
    title: 'Heart',
    art: `
       ****       ****
     **    **   **    **
    **      ** **      **
    **       ***       **
     **               **
       **           **
         **       **
           **   **
             *
    `,
    width: 25,
    height: 10,
    style: 'text',
  },
  {
    id: 'ascii_2',
    title: 'Star',
    art: `
          *
         * *
        *   *
       *     *
      *       *
     *    *    *
    *     *     *
   *      *      *
  *       *       *
 *        *        *
*         *         *
    `,
    width: 25,
    height: 11,
    style: 'text',
  },
  {
    id: 'ascii_3',
    title: 'Trophy',
    art: `
          ___
         |   |
         | * |
         |   |
        _|___|_
       |       |
       |  ***  |
       |  ***  |
       |_______|
        |     |
        |_____|
    `,
    width: 15,
    height: 11,
    style: 'text',
  },
];

export const thankYouTemplates: ThankYouTemplate[] = [
  {
    id: 'template_1',
    name: 'Classic Thank You',
    description: 'Simple and heartfelt appreciation',
    promptTemplate: 'Write a heartfelt thank you message to {donatorName} who donated ${amount} on {date}. Keep it warm and genuine, around 2-3 sentences.',
    parameters: {
      donatorName: '',
      amount: 0,
      date: '',
    },
    examples: [
      'Dear {name}, your generous support of ${amount} means the world to me. Thank you for believing in my journey!',
    ],
  },
  {
    id: 'template_2',
    name: 'Developer Humor',
    description: 'Tech-themed appreciation with humor',
    promptTemplate: 'Create a funny developer-themed thank you for {donatorName} (${amount}). Include programming jokes, memes, or tech references.',
    parameters: {
      donatorName: '',
      amount: 0,
      date: '',
    },
    examples: [
      'Your donation compiled successfully on the first try! That\'s how amazing you are, {name}!',
    ],
  },
  {
    id: 'template_3',
    name: 'Poetry Mode',
    description: 'Generate a poem for the donator',
    promptTemplate: 'Write a short poem (4-6 lines) thanking {donatorName} for their ${amount} support. Theme: gratitude and learning journey.',
    parameters: {
      donatorName: '',
      amount: 0,
      date: '',
    },
    examples: [
      'Code by code and line by line,\\nYour support makes this journey shine.\\nThank you, {name}, for being here,\\nMaking every bug disappear.',
    ],
  },
  {
    id: 'template_4',
    name: 'Inspirational Quote',
    description: 'Custom quote with donator\'s name',
    promptTemplate: 'Create an inspirational quote about generosity and learning, incorporating {donatorName}\'s contribution of ${amount}.',
    parameters: {
      donatorName: '',
      amount: 0,
      date: '',
    },
    examples: [
      '"In the garden of knowledge, {name} planted seeds of generosity that will bloom forever." - Today\'s Fortune',
    ],
  },
];

export const aiStats: AIThankYouStats = {
  totalMessages: 156,
  totalViews: 2847,
  favoriteType: 'code',
  averageGenerationTime: 2.3,
  topDonator: {
    name: 'TechCorp Inc.',
    messagesReceived: 12,
  },
};

export const messageTypes = [
  { id: 'fortune', name: 'Fortune Cookie', icon: '🥠', description: 'Wisdom + lucky numbers' },
  { id: 'ssh-banner', name: 'SSH Banner', icon: '💻', description: 'Terminal welcome message' },
  { id: 'code', name: 'Code Snippet', icon: '📝', description: 'Personalized code art' },
  { id: 'ascii-art', name: 'ASCII Art', icon: '🎨', description: 'Text-based artwork' },
  { id: 'poem', name: 'Poem', icon: '📜', description: 'Custom poetry' },
  { id: 'quote', name: 'Inspirational Quote', icon: '💡', description: 'Motivational message' },
];
