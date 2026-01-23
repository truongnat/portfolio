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
  role: "Fullstack Developer & Engineering Leader",
  bio: "Fullstack Developer and Engineering Leader with over 3 years of professional experience and a strong focus on the next generation of software engineering via Agentic AI. Proven track record of leading cross-functional teams of 8+ engineers and delivering high-scale enterprise solutions for major clients like Viettel and Naver. Expert in cross-platform applications, and currently pioneering Agentic SDLC frameworks to automate and optimize the software development lifecycle.",
  location: "Ninh Binh, Vietnam",
  phone: "(+84) 96 906 9035",
  email: "truongdq.dev@gmail.com",
  website: "porfolio-truongdq.vercel.app",
  socials: [
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
    'Engineering Leader',
    'Agentic AI',
    'Cross-platform Architect',
    'AI-Powered SDLC Expert',
  ],
  resumeUrl: "/Dao_Quang_Truong_CV.pdf",
  stats: [
    { label: 'Years Experience', value: '3+' },
    { label: 'Team Members Led', value: '8+' },
    { label: 'AI Integration', value: 'Expert' },
    { label: 'API Optimization', value: '50%' }
  ]
};

export const seo = {
  title: "Dao Quang Truong | Fullstack Developer & AI Engineer",
  description: "Fullstack Developer and Engineering Leader with over 3 years of experience. Specializing in Agentic AI, cross-platform solutions, and building high-scale enterprise systems for Viettel and Naver.",
  keywords: [
    'portfolio',
    'developer',
    'full-stack',
    'TypeScript',
    'React',
    'React Native',
    'Node.js',
    'Team Leader',
    'CI/CD',
    'DevOps',
    'Viettel',
    'Naver',
    'Agentic AI',
    'SDLC Automation',
    'Multi-agent Systems',
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
      id: 'ai-agentic',
      title: 'AI & Agentic Systems',
      level: 'Advanced',
      icon: Brain,
      subSections: [
        {
          label: 'Agentic AI',
          skills: ['LLMs', 'LangGraph', 'CrewAI', 'Prompt Engineering', 'Multi-agent Orchestration'],
          highlight: 'Pioneering Agentic SDLC frameworks to automate coding tasks and system design.'
        },
        {
          label: 'AI Development',
          skills: ['Antigravity', 'Gemini', 'LangChain', 'OpenAI'],
          highlight: 'Building production-ready self-correcting code through AI feedback loops.'
        }
      ]
    },
    {
      id: 'frontend-crossplatform',
      title: 'Core Stack & Cross-Platform',
      level: 'Expert',
      icon: Layers,
      subSections: [
        {
          label: 'Core',
          skills: ['TypeScript', 'React Native', 'Electron.js', 'Vue.js'],
          highlight: 'Expert in building unified cross-platform solutions across Web, Mobile, and Desktop.'
        },
        {
          label: 'Data Visualization',
          skills: ['D3.js', 'ChartJS'],
          highlight: 'Complex geospatial data visualization and KPI dashboards.'
        }
      ]
    },
    {
      id: 'backend-devops',
      title: 'Backend & DevOps',
      level: 'Expert',
      icon: Server,
      subSections: [
        {
          label: 'Backend',
          skills: ['Node.js (NestJS/Express)', 'Python', 'Neo4j', 'PostgreSQL']
        },
        {
          label: 'Infrastructure',
          skills: ['Docker', 'Jenkins', 'GitLab CI/CD', 'GitHub Actions', 'Linux/Ubuntu', 'Nginx'],
          highlight: 'Architecting high-scale enterprise solutions with robust CI/CD pipelines.'
        }
      ]
    },
    {
      id: 'leadership',
      title: 'Engineering Leadership',
      icon: Users,
      subSections: [
        {
          label: 'Management',
          skills: ['Team Mentoring', 'Technical Interviewing', 'Agile/Scrum', 'System Architecture'],
          highlight: 'Led and mentored cross-functional teams of 8+ engineers.'
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
    id: 'ai',
    role: 'Lead Developer',
    company: 'AI & Agentic Systems',
    period: 'Jan 2024 – Present',
    achievements: [
      'Focus: Researching and developing autonomous AI agents to revolutionize the Software Development Life Cycle (SDLC).',
      'Key Achievement: Built and open-sourced Agentic-SDLC, a framework that automates coding tasks and system design using Multi-agent orchestration.',
    ],
  },
  {
    id: 'blameo',
    role: 'Software Engineer / Team Leader',
    company: 'Blameo (Outsourcing for Viettel Group)',
    period: 'Jun 2022 – Present',
    achievements: [
      'Engineering Leadership: Led and mentored a cross-functional team of 8 engineers. Scaled the engineering department by designing a rigorous technical interview framework and established a structured mentorship program for interns.',
      'Backend Architecture: Refactored legacy Node.js services reducing API latency by 50% and improving system reliability during peak loads.',
      'Full-stack Development: Architected a KPI tracking platform and Viettel Cloud features using React, TypeScript, and Node.js. Established high-level coding standards such as ESLint and Git flow.',
    ],
  },
  {
    id: 'cmc',
    role: 'Software Engineer',
    company: 'CMC Global',
    period: 'Oct 2021 – Jun 2022',
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
    id: 'agentic-sdlc',
    title: 'Agentic SDLC (Personal R&D)',
    role: 'AI Engineer',
    period: 'Jan 2024 – Present',
    description: 'Engineered a Multi-agent system using LangGraph/CrewAI to coordinate AI agents for requirement analysis, code generation, and automated testing.',
    techStack: ['Python', 'LangChain', 'Antigravity', 'Gemini', 'Neo4j', 'Docker'],
    achievements: [
      'Challenge: Reducing manual effort in repetitive coding tasks and system documentation.',
      'Action: Engineered a Multi-agent system using LangGraph/CrewAI to coordinate AI agents for requirement analysis, code generation, and automated testing.',
      'Result: Created a functional framework capable of generating production-ready boilerplate and self-correcting code through iterative AI feedback loops.',
    ],
  },
  {
    id: 'netbi',
    title: 'NetBI – KPI Management Platform',
    role: 'Software Engineer',
    period: 'Jan 2023 – Jan 2024',
    description: 'Build a unified web and mobile platform for enterprise KPI monitoring with complex data visualization needs.',
    techStack: ['React', 'React Native', 'ChartJS', 'GitLab CI/CD', 'Jenkins', 'Linux VPS', 'Nginx'],
    achievements: [
      'Challenge: Build a unified web and mobile platform for enterprise KPI monitoring with complex data visualization needs.',
      'Action: Led frontend development, building the foundational React and React Native codebases. Designed and implemented an interactive geospatial data visualization feature (Vietnam Map) for mobile.',
      'Result: Enabled real-time regional KPI tracking on mobile devices. Automated the build and deployment process for iOS and Android, significantly reducing manual release time.',
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
      'Action: Engineered real-time video features for web (Vue.js), desktop (Electron), and mobile (React Native) using the Jitsi Meet core.',
      'Result: Delivered a seamless cross-platform conferencing tool that maintained stable video quality.',
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
      'Result: Successfully launched the app, which handled complex exam flows smoothly.',
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
