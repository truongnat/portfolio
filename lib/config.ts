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
  bio: "Fullstack Developer with 3+ years of experience in building cross-platform solutions (Web, Mobile, Desktop). Proven track record of delivering high-scale projects for major enterprises like Viettel and Naver.",
  email: "truongdq.dev@gmail.com",
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
    'React & React Native',
    'Cross-platform Solutions',
    'System Optimization',
  ],
  resumeUrl: "/Dao_Quang_Truong_FE_CV.docx"
};

export const seo = {
  title: "Dao Quang Truong | Fullstack Developer",
  description: "Fullstack Developer with 3+ years of experience in building cross-platform solutions (Web, Mobile, Desktop).",
  keywords: [
    'portfolio',
    'developer',
    'full-stack',
    'TypeScript',
    'React',
    'React Native',
    'Next.js',
    'Node.js',
    'Viettel',
    'Naver',
  ],
  url: "https://portfolio.vercel.app",
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
      id: 'core-stack',
      title: 'Core Stack & Cross-Platform',
      level: 'Expert',
      icon: Layers,
      subSections: [
        {
          label: 'Languages',
          skills: ['TypeScript (Advanced)', 'JavaScript (ES6+)']
        },
        {
          label: 'Web Frontend',
          skills: ['React.js Ecosystem (Next.js, Redux/Context)', 'Vue.js (Legacy migration experience)'],
          highlight: 'Expert in building scalable/high-performance SPAs.'
        },
        {
          label: 'Mobile & Desktop',
          skills: ['React Native (OTA updates, Offline-first with Realm DB)', 'Electron.js'],
          highlight: 'Proven ability to unify codebases across Web, Mobile, and Desktop.'
        },
        {
          label: 'Visualization',
          skills: ['D3.js', 'ChartJS (Complex geospatial data & KPI dashboards)']
        }
      ]
    },
    {
      id: 'backend',
      title: 'Backend & Infrastructure',
      level: 'Proficient',
      icon: Server,
      subSections: [
        {
          label: 'Runtime & API',
          skills: ['Node.js', 'Express/NestJS (designing RESTful APIs)']
        },
        {
          label: 'DevOps & CI/CD',
          skills: ['Docker', 'Jenkins', 'GitLab CI/CD', 'GitHub Actions'],
          highlight: 'Experienced in setting up automated deployment pipelines from scratch on Linux VPS (Ubuntu/Nginx).'
        },
        {
          label: 'Cloud',
          skills: ['AWS (Basic resource management)']
        }
      ]
    },
    {
      id: 'leadership',
      title: 'Engineering Leadership & Architecture',
      icon: Brain,
      subSections: [
        {
          label: 'System Optimization',
          skills: ['Performance tuning (reduced API latency by 50%)', 'Media optimization for RTC/Video Conference']
        },
        {
          label: 'Quality Assurance',
          skills: ['Establishing Git Flow', 'Linting standards', 'TDD/Unit Testing integration']
        },
        {
          label: 'Team Management',
          skills: ['Technical Mentoring', 'Code Review', 'Recruitment (Technical Interviewer)']
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
    achievements: [
      'Led and mentored a cross-functional team of 8 engineers. Conducted technical interviews for Frontend candidates and supervised interns.',
      'Developed a KPI Tracking Platform and Viettel Cloud features using React, TypeScript, Node.js, and React Native, D3 charts.',
      'Established initial project structure and enforced coding standards (Linting, Git flow).',
      'Optimized core features, contributing to a 50% reduction in API latency.',
      'Established CI/CD pipelines using Jenkins, Gitlab Webhook, and Ubuntu Servers.',
      'Configured OTA (Over-The-Air) distribution for iOS apps.',
    ],
  },
  {
    id: 'cmc',
    role: 'Software Engineer',
    company: 'CMC Global',
    period: 'Oct 2021 – Jun 2022',
    achievements: [
      'Developed a comprehensive Video Conference solution working seamlessly across Web (Vue.js), Desktop (Electron.js), and Mobile (React Native).',
      'Researched and implemented complex real-time communication solutions (RTC).',
      'Active participant in code reviews, ensuring clean code architecture.',
    ],
  },
  {
    id: 'ntq',
    role: 'Frontend Developer',
    company: 'NTQ Solution',
    period: 'Oct 2020 – Oct 2021',
    achievements: [
      'Built core features for a dynamic platform capable of automatically generating mobile applications using React Native.',
      'Developed an Exam/E-learning mobile application, focusing on user experience and interactive testing interfaces.',
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
    title: 'NetBI',
    role: 'Software Engineer',
    period: 'Jan 2023 – Jan 2024',
    description: 'A comprehensive KPI management platform.',
    techStack: ['React', 'React Native', 'ChartJS', 'Gitlab CI/CD', 'Jenkins', 'VPS', 'Nginx', 'Telegram API'],
    achievements: [
      'Led frontend development for both Web and Mobile applications.',
      'Designed and implemented Geospatial Data Visualization (Vietnam Map) for monitoring regional KPIs.',
      'Streamlined deployment with GitLab CI/CD and Jenkins on Linux servers.',
      'Implemented CI/CD pipeline using GitHub Actions for Android APK generation.',
      'Acted as technical mentor for junior members.',
    ],
  },
  {
    id: 'naver-cloud',
    title: 'Naver Cloud Meeting',
    role: 'Software Engineer',
    period: 'Jun 2021 – Dec 2022',
    description: 'Real-time video conferencing ecosystem.',
    techStack: ['Vue.js', 'React Native', 'Electron.js', 'Jitsi Meet'],
    achievements: [
      'Engineered real-time video conferencing features across Web, Desktop, and Mobile.',
      'Implemented algorithms to sync and adapt media resolution between devices.',
      'Developed custom Native Notification system for Electron Desktop App.',
    ],
  },
  {
    id: 'gopass',
    title: 'GoPass',
    role: 'Mobile Developer',
    period: 'Oct 2020 – Jun 2021',
    description: 'Online Examination Application for the Japanese market.',
    techStack: ['React', 'React Native', 'Realm DB', 'PHP'],
    achievements: [
      'Implemented offline-first mechanism using Realm DB.',
      'Refactored legacy codebases and optimized application performance.',
      'Conducted regular demos with Japanese clients.',
    ],
  },
];
