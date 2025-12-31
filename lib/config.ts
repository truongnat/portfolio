import {
  Code2,
  Brain,
  Layers,
  Database,
  Cloud,
  Sparkles,
  Rocket,
  Terminal,
  GitBranch,
  Package,
  Server,
  Palette,
  Search,
  BarChart,
  MessageSquare,
  Github,
  Linkedin,
  Mail,
  Smartphone,
  Monitor,
  Globe,
  Map,
  Video,
  FileText,
  Users,
  Cpu,
  type LucideIcon,
} from 'lucide-react';

export interface SocialLink {
  platform: string;
  url: string;
  icon: LucideIcon;
}

export const personalInfo = {
  name: "Dao Quang Truong",
  role: "Fullstack Developer",
  bio: "Full-stack developer with 3+ years of experience specializing in cross-platform (Web, Mobile, Desktop) solution architecture. Proven track record of leading engineering teams and delivering high-scale projects for major clients like Viettel and Naver. Combines strong technical expertise in modern JavaScript stacks with leadership skills in mentoring, code quality, and establishing efficient CI/CD pipelines.",
  location: "Hanoi, Vietnam",
  phone: "(+84) 96 906 9035",
  email: "truongdq.dev@gmail.com",
  website: "porfolio-truongdq.vercel.app",
  githubUsername: "truongnat",
  socials: [
    {
      platform: "GitHub",
      url: "https://github.com/truongnat",
      icon: Github,
    },
    {
      platform: "LinkedIn",
      url: "https://linkedin.com/in/truongdq",
      icon: Linkedin,
    },
    {
      platform: "Email",
      url: "mailto:truongdq.dev@gmail.com",
      icon: Mail,
    },
  ],
  typingPhrases: [
    'Fullstack Developer',
    'Team Leader',
    'Cross-platform Solutions',
    'Performance Optimization',
    'CI/CD Expert',
  ],
  resumeUrl: "/Dao_Quang_Truong_FE_CV.docx",
  stats: [
    { label: 'Years Experience', value: '3+' },
    { label: 'Projects Completed', value: '15+' },
    { label: 'Team Members Led', value: '8+' },
    { label: 'API Latency Reduced', value: '50%' }
  ]
};

export const seo = {
  title: "Dao Quang Truong | Fullstack Developer",
  description: "Full-stack developer with 3+ years of experience specializing in cross-platform solution architecture. Proven track record of leading engineering teams and delivering high-scale projects for Viettel and Naver.",
  keywords: [
    'portfolio',
    'developer',
    'full-stack',
    'TypeScript',
    'React',
    'React Native',
    'Next.js',
    'Node.js',
    'Team Leader',
    'CI/CD',
    'DevOps',
    'Viettel',
    'Naver',
    'Performance Optimization',
  ],
  url: "https://porfolio-truongdq.vercel.app",
  image: '/avatar.jpg',
};

export type SkillCategory = 'Frontend' | 'Backend' | 'Mobile' | 'DevOps' | 'Tools';

export interface ExpertiseRing {
  id: string;
  label: string;
  percentage: number;
  color: string;
}

export interface SkillPill {
  id: string;
  name: string;
  icon: LucideIcon;
  category: SkillCategory;
}

export interface SkillSubSection {
  label: string;
  skills: string[];
  highlight?: string;
}

export interface SkillCardData {
  id: string;
  title: string;
  level?: string;
  icon: LucideIcon;
  subSections: SkillSubSection[];
}

export const skillsConfig = {
  cards: [
    {
      id: 'frontend-crossplatform',
      title: 'Frontend & Cross-Platform',
      level: 'Expert',
      icon: Layers,
      subSections: [
        {
          label: 'Core',
          skills: ['TypeScript', 'Next.js', 'Nuxt.js', 'React Native', 'Electron.js'],
          highlight: 'Expert in building unified cross-platform solutions across Web, Mobile, and Desktop.'
        },
        {
          label: 'Data Visualization',
          skills: ['D3.js', 'ChartJS'],
          highlight: 'Complex geospatial data visualization and KPI dashboards.'
        },
        {
          label: 'State Management',
          skills: ['Redux', 'TanStack Query (React Query)']
        }
      ]
    },
    {
      id: 'backend-devops',
      title: 'Backend & DevOps',
      level: 'Proficient',
      icon: Server,
      subSections: [
        {
          label: 'Backend',
          skills: ['Node.js', 'Express', 'NestJS']
        },
        {
          label: 'DevOps & CI/CD',
          skills: ['Docker', 'Jenkins', 'GitLab CI/CD', 'GitHub Actions', 'Linux/Ubuntu', 'Nginx'],
          highlight: 'Built CI/CD pipelines from scratch, reducing deployment time significantly.'
        },
        {
          label: 'Cloud',
          skills: ['AWS (Basic)']
        }
      ]
    },
    {
      id: 'leadership',
      title: 'Engineering & Leadership',
      icon: Brain,
      subSections: [
        {
          label: 'Architecture',
          skills: ['System Architecture', 'Performance Optimization', 'CI/CD Pipeline Setup']
        },
        {
          label: 'Leadership',
          skills: ['Technical Mentoring', 'Code Review', 'Agile/Scrum', 'Technical Interviews']
        },
        {
          label: 'Modern Tools',
          skills: ['AI-Powered Development (GitHub Copilot, Cursor)']
        }
      ]
    }
  ] as SkillCardData[],
};

export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  description?: string;
  achievements: string[];
}

export const workExperience: Experience[] = [
  {
    id: 'blameo',
    role: 'Software Engineer / Team Leader',
    company: 'Blameo (Outsourcing for Viettel Group)',
    period: 'Jun 2022 – Present',
    description: 'Hanoi',
    achievements: [
      'Leadership: Led and mentored a cross-functional team of 8 engineers. Conducted technical interviews for frontend candidates and supervised interns, improving overall team code quality.',
      'Product Development: Architected and developed a KPI tracking platform and Viettel Cloud features using React, TypeScript, Node.js, and React Native. Established initial project structure, enforced coding standards (ESLint, Git flow), and implemented D3.js for complex data visualizations.',
      'Performance & DevOps: Optimized core API features, reducing latency by 50%. Built CI/CD pipelines from scratch using Jenkins, GitLab Webhooks, and Ubuntu servers. Configured Over-The-Air (OTA) updates for iOS to streamline internal testing.',
    ],
  },
  {
    id: 'cmc',
    role: 'Software Engineer',
    company: 'CMC Global',
    period: 'Oct 2021 – Jun 2022',
    description: 'Hanoi',
    achievements: [
      'Cross-Platform Development: Engineered a unified video conference solution across Web (Vue.js), Desktop (Electron.js), and Mobile (React Native) platforms.',
      'Real-Time Communication (RTC): Researched and implemented media synchronization algorithms to stabilize video quality and connection across different devices and bandwidths.',
      'Code Quality: Actively participated in code reviews and architectural discussions to ensure clean code and minimize production bugs.',
    ],
  },
  {
    id: 'ntq',
    role: 'Frontend Developer',
    company: 'NTQ Solution',
    period: 'Oct 2020 – Oct 2021',
    description: 'Hanoi',
    achievements: [
      'Low-Code Platform Development: Built core features for a mobile app generation platform using React Native, focusing on automation and dynamic functionality.',
      'E-Learning Application: Developed an exam and e-learning mobile app with a focus on intuitive user interfaces and smooth interactive flows.',
    ],
  },
];

export interface Project {
  id: string;
  title: string;
  role: string;
  period: string;
  description: string;
  techStack: string[];
  achievements: string[];
  link?: string;
}

export const projectsConfig: Project[] = [
  {
    id: 'netbi',
    title: 'NetBI – KPI Management Platform',
    role: 'Software Engineer',
    period: 'Jan 2023 – Jan 2024',
    description: 'Build a unified web and mobile platform for enterprise KPI monitoring with complex data visualization needs.',
    techStack: ['React', 'React Native', 'ChartJS', 'GitLab CI/CD', 'Jenkins', 'Linux VPS', 'Nginx'],
    achievements: [
      'Challenge: Build a unified web and mobile platform for enterprise KPI monitoring with complex data visualization needs.',
      'Action: Led frontend development, building the foundational React and React Native codebases. Designed and implemented an interactive geospatial data visualization feature (Vietnam Map) for mobile. Established the full CI/CD pipeline using GitLab CI/CD, Jenkins, and Linux VPS (Nginx).',
      'Result: Enabled real-time regional KPI tracking on mobile devices. Automated the build and deployment process for iOS and Android, significantly reducing manual release time. Acted as a technical mentor for junior team members.',
    ],
  },
  {
    id: 'naver-cloud',
    title: 'Naver Cloud Meeting',
    role: 'Software Engineer',
    period: 'Jun 2021 – Dec 2022',
    description: 'Develop a stable, multi-platform video conferencing solution with consistent user experience.',
    techStack: ['Vue.js', 'React Native', 'Electron.js', 'Jitsi Meet'],
    achievements: [
      'Challenge: Develop a stable, multi-platform video conferencing solution with consistent user experience.',
      'Action: Engineered real-time video features for web (Vue.js), desktop (Electron), and mobile (React Native) using the Jitsi Meet core. Conducted R&D to implement custom media resolution adaptation algorithms. Built a native notification system for the Electron desktop app to overcome web API limitations.',
      'Result: Delivered a seamless cross-platform conferencing tool that maintained stable video quality. Improved user engagement with a reliable desktop notification system.',
    ],
  },
  {
    id: 'gopass',
    title: 'GoPass – Online Exam Platform',
    role: 'Mobile Developer',
    period: 'Oct 2020 – Jun 2021',
    description: 'Create a stable, user-friendly exam application for the Japanese market with offline functionality.',
    techStack: ['React Native', 'Realm DB', 'PHP'],
    achievements: [
      'Challenge: Create a stable, user-friendly exam application for the Japanese market with offline functionality.',
      'Action: Developed the mobile app using React Native and implemented an offline-first architecture using Realm DB for local data caching and synchronization.',
      'Result: Successfully launched the app, which handled complex exam flows smoothly. The offline capability ensured uninterrupted user experience, directly addressing client requirements.',
    ],
  },
];

export interface Award {
  id: string;
  title: string;
  organization: string;
  date: string;
  icon?: LucideIcon;
}

export const awards: Award[] = [
  {
    id: 'employee-of-year-2023',
    title: 'Employee of the Year',
    organization: 'Blameo Company',
    date: 'May 2023',
    icon: Sparkles,
  },
];
