import {
  Brain,
  Layers,
  Sparkles,
  Server,
  Linkedin,
  Mail,
  Users,
  type LucideIcon,
} from 'lucide-react';
import type { ProjectCategory } from '@/types';

export const projectCategories: ProjectCategory[] = ['All', 'AI', 'Web', 'Mobile', 'Open Source', 'Product'];

export const personalInfo = {
  name: "Dao Quang Truong",
  role: "Fullstack Developer",
  bio: "Fullstack Developer specializing in cross-platform architecture and Agentic AI . Proven track record of leading engineering teams and delivering high-scale enterprise solutions for Viettel and Naver.",
  location: "Ninh Binh, Vietnam",
  phone: "(+84) 96 906 9035",
  email: "truongdq.dev@gmail.com",
  website: "porfolio-truongdq.vercel.app",
  socials: [
    {
      platform: "LinkedIn",
      url: "https://linkedin.com/in/truongdq01",
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
    'Agentic AI',
    'Cross-platform Architect',
    'AI-Powered SDLC',
  ],
  resumeUrl: "/Dao_Quang_Truong_CV.pdf",
  stats: [
    { label: 'Years Experience', value: '4' },
    { label: 'Team Members Led', value: '8+' },
    { label: 'AI Integration', value: 'Advanced' },
    { label: 'API Optimization', value: '50%' }
  ]
};

export const liveWork = {
  company: 'Viet IS',
  url: 'https://vietis.com.vn/en/',
  location: 'Vietnam',
  label: 'Current Workplace',
} as const;

export const appInfo = {
  version: import.meta.env.APP_VERSION || '0.0.1',
  hash: import.meta.env.APP_HASH || 'unknown',
  license: {
    name: import.meta.env.APP_LICENSE || 'MIT License',
    year: new Date().getFullYear().toString(),
    copyright: `Copyright © ${new Date().getFullYear()} Dao Quang Truong`,
    fullText: `${import.meta.env.APP_LICENSE || 'MIT License'} - Copyright © ${new Date().getFullYear()} Dao Quang Truong`
  }
};

export const seo = {
  title: "Dao Quang Truong | Fullstack Developer",
  description: "Fullstack Developer specializing in cross-platform solutions, Agentic AI, and high-scale enterprise systems.",
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
  url: "https://truongdq.com",
  image: '/avatar.jpg',
};


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
          skills: ['LLMs', 'LangGraph', 'Neo4j', 'Prompt Engineering', 'Multi-agent Orchestration'],
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
      level: 'Advanced',
      icon: Layers,
      subSections: [
        {
          label: 'Core',
          skills: ['TypeScript', 'React Native', 'Electron.js', 'Vue.js', 'Flutter', 'Nuxt.js', 'Next.js'],
          highlight: 'Advanced in building unified cross-platform solutions across Web, Mobile, and Desktop.'
        },
        {
          label: 'Data Visualization',
          skills: ['D3.js', 'ChartJS', 'Leaflet.js'],
          highlight: 'Complex geospatial data visualization and KPI dashboards.'
        }
      ]
    },
    {
      id: 'backend-devops',
      title: 'Backend & DevOps',
      level: 'Advanced',
      icon: Server,
      subSections: [
        {
          label: 'Backend',
          skills: ['Node.js (NestJS/Express)', 'Python', 'PostgreSQL']
        },
        {
          label: 'Infrastructure',
          skills: ['Docker', 'Jenkins', 'GitLab CI/CD', 'GitHub Actions', 'Linux/Ubuntu', 'Nginx', 'AWS'],
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
    role: 'AI Engineer',
    company: 'Self-employed',
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
  categories: ProjectCategory[];
  achievements: string[];
  link?: string;
}

export const projectsConfig: Project[] = [
  {
    id: 'example-react',
    title: 'TanStack Full Demo',
    role: 'Fullstack Developer',
    period: 'Present',
    description: 'A beginner-friendly dashboard showcasing all major TanStack libraries working together in a real app — Query, Table, Virtual, Form, Store, and Router. Built with TanStack Start (SSR), shadcn/ui, and Tailwind CSS v4, deployed on Vercel.',
    techStack: ['React 19', 'TypeScript', 'TanStack Start', 'TanStack Query', 'TanStack Table', 'TanStack Virtual', 'TanStack Form', 'TanStack Store', 'TanStack Router', 'shadcn/ui', 'Tailwind CSS v4', 'Vite', 'Nitro', 'Vercel'],
    categories: ['Web', 'Open Source'],
    achievements: [
      'Challenge: Demonstrating all major TanStack libraries in a single cohesive app that beginners can learn from.',
      'Action: Built a 3-page dashboard — Todos (Query + Form + Store with optimistic updates), Posts (Table with sort/filter/pagination + Virtual list for 100 rows), Users (Table + Form dialog with mutations).',
      'Result: A production-ready SSR app on Vercel showcasing real-world patterns: optimistic updates, cache invalidation, virtualization, headless UI, and SSR-safe global state.',
    ],
    link: 'https://example-react-brown.vercel.app'
  },
  {
    id: 'agentic-sdlc-product',
    title: 'Agentic SDLC',
    role: 'Systems Engineer',
    period: 'Present',
    description: 'Deterministic local execution runtime for AI agent workflows. Define workflows in Markdown, execute under policy guardrails, persist state, and replay LLM responses for perfect reproducibility. Built in Rust for performance and reliability.',
    techStack: ['Rust', 'Tokio', 'Clap', 'SQLite (rusqlite)', 'PostgreSQL + pgvector', 'git2', 'AWS Bedrock', 'OpenAI', 'Anthropic', 'Gemini', 'Azure OpenAI', 'Ollama', 'ed25519-dalek', 'OpenTelemetry'],
    categories: ['AI', 'Open Source'],
    achievements: [
      'Challenge: Building a reliable, auditable runtime for AI agent workflows that eliminates non-determinism and enables safe execution of untrusted code.',
      'Action: Implemented deterministic workflow engine with trace IDs, replay store for LLM responses (record/replay mode), process isolation sandbox with CPU/memory limits, 6 LLM provider backends, and Git integration design with crash recovery via persistent state.',
      'Result: 183 tests passing with 100% pass rate. Supports resumable workflows, idempotent steps, policy-enforced trust tiers, and audit-ready timeline traces — deployable as a local CLI tool or CI/CD component.',
    ],
    link: 'https://agentic-sdlc-truongdqdev-9126s-projects.vercel.app'
  },
  {
    id: 'agentic-sdlc',
    title: 'Agentic SDLC (Personal R&D)',
    role: 'AI Engineer',
    period: 'Jan 2024 – Present',
    description: 'AI-powered Software Development Lifecycle framework providing tools for orchestrating agents, managing workflows, and building intelligent automation systems. Features clean public API, modular architecture, and extensibility through plugins.',
    techStack: ['Python', 'LangChain', 'OpenAI', 'Anthropic', 'DSPy', 'Autogen', 'Neo4j', 'Docker', 'Pydantic', 'Streamlit'],
    categories: ['AI', 'Open Source'],
    achievements: [
      'Challenge: Building a comprehensive AI-powered framework for automating the software development lifecycle with clean architecture and extensibility.',
      'Action: Developed a production-ready Python SDK with configuration management, agent orchestration, workflow automation, intelligence features (learning, monitoring, reasoning), and a plugin system. Implemented CLI tools, comprehensive testing, and documentation.',
      'Result: Created a 100%-complete framework with 15+ CLI commands, full test coverage, and production-ready code that enables AI agents to collaborate on software development tasks with learning and adaptation capabilities.',
    ],
    link: 'https://agentic-sdlc-truongdqdev-9126s-projects.vercel.app'
  },
  {
    id: 'universal-music-downloader',
    title: 'Universal Music Downloader',
    role: 'Fullstack Developer',
    period: 'Present',
    description: 'Web app for downloading music and playlists from YouTube and SoundCloud as MP3 files. Runs entirely in the browser — audio conversion powered by ffmpeg.wasm (no server-side binaries). Clean developer-aesthetic UI aligned with portfolio design system.',
    techStack: ['Next.js 15', 'TypeScript', 'Tailwind CSS', 'shadcn/ui', 'ffmpeg.wasm', '@ffmpeg/ffmpeg', 'TanStack Query', 'yt-dlp', 'Bun', 'Vercel'],
    categories: ['Web', 'Open Source'],
    achievements: [
      'Challenge: Building a practical music downloader that works without server-side binaries, deployable on serverless platforms like Vercel.',
      'Action: Replaced server-side ffmpeg-static with ffmpeg.wasm for client-side audio conversion; built unified input that auto-detects SoundCloud vs YouTube URLs; redesigned UI to match portfolio dark zinc aesthetic with JetBrains Mono typography.',
      'Result: A fully serverless music downloader supporting single tracks, playlists, and MP3 quality selection — deployed on Vercel with zero native dependencies.',
    ],
    link: 'https://universal-music-downloader-truongdqdev-9126s-projects.vercel.app'
  },
  {
    id: 'netbi',
    title: 'NetBI – KPI Management Platform',
    role: 'Software Engineer',
    period: 'Jan 2023 – Jan 2024',
    description: 'Build a unified web and mobile platform for enterprise KPI monitoring with complex data visualization needs.',
    techStack: ['React', 'React Native', 'ChartJS', 'GitLab CI/CD', 'Jenkins', 'Linux VPS', 'Nginx'],
    categories: ['Web', 'Mobile'],
    achievements: [
      'Challenge: Build a unified web and mobile platform for enterprise KPI monitoring with complex data visualization needs.',
      'Action: Led frontend development, building the foundational React and React Native codebases. Designed and implemented an interactive geospatial data visualization feature (Vietnam Map) for mobile.',
      'Result: Enabled real-time regional KPI tracking on mobile devices. Automated the build and deployment process for iOS and Android, significantly reducing manual release time.',
    ]
  },
  {
    id: 'naver-cloud',
    title: 'Naver Cloud Meeting',
    role: 'Software Engineer',
    period: 'Jun 2021 – Dec 2022',
    description: 'Develop a stable, multi-platform video conferencing solution with consistent user experience.',
    techStack: ['Vue.js', 'React Native', 'Electron.js', 'Jitsi Meet'],
    categories: ['Web', 'Mobile'],
    achievements: [
      'Challenge: Develop a stable, multi-platform video conferencing solution with consistent user experience.',
      'Action: Engineered real-time video features for web (Vue.js), desktop (Electron), and mobile (React Native) using the Jitsi Meet core.',
      'Result: Delivered a seamless cross-platform conferencing tool that maintained stable video quality.',
    ]
  },
  {
    id: 'gopass',
    title: 'GoPass – Online Exam Platform',
    role: 'Mobile Developer',
    period: 'Oct 2020 – Jun 2021',
    description: 'Create a stable, user-friendly exam application for the Japanese market with offline functionality.',
    techStack: ['React Native', 'Realm DB', 'PHP'],
    categories: ['Mobile'],
    achievements: [
      'Challenge: Create a stable, user-friendly exam application for the Japanese market with offline functionality.',
      'Action: Developed the mobile app using React Native and implemented an offline-first architecture using Realm DB for local data caching and synchronization.',
      'Result: Successfully launched the app, which handled complex exam flows smoothly.',
    ]
  },
];

export interface Award {
  id: string;
  title: string;
  organization: string;
  date: string;
  icon?: LucideIcon;
}

export interface Certificate {
  title: string;
  issuer: string;
  year: string;
  description: string;
  credentialId?: string;
  credentialUrl?: string;
}

export const certificatesData: Certificate[] = [
  {
    title: 'Employee of the Year',
    issuer: 'Blameo Company',
    year: 'May 2023',
    description: 'Recognized for exceptional performance and contributions to the company.',
    credentialId: 'EOTY-2023-001'
  }
  /*
  {
    title: 'AWS Certified Solutions Architect',
    issuer: 'Amazon Web Services',
    year: '2022',
    description: 'Demonstrated ability to design distributed systems on AWS platform with best practices for security and scalability.',
    credentialId: 'AWS-SA-2022-12345',
    credentialUrl: 'https://www.credly.com/badges/abc123'
  },
  {
    title: 'Google Cloud Professional Data Engineer',
    issuer: 'Google Cloud',
    year: '2023',
    description: 'Validated expertise in designing and implementing data processing systems on Google Cloud Platform.',
    credentialId: 'GCP-DATA-2023-67890'
  },
  {
    title: 'Microsoft Certified: Azure Developer Associate',
    issuer: 'Microsoft',
    year: '2023',
    description: 'Demonstrated ability to design and build cloud applications using Microsoft Azure services.',
    credentialId: 'AZURE-DEV-2023-54321'
  },
  {
    title: 'AI & Machine Learning Specialization',
    issuer: 'Coursera (DeepLearning.AI)',
    year: '2023',
    description: 'Completed specialization courses in AI, neural networks, and machine learning engineering with focus on practical applications.'
  }
  */
];

export interface Testimonial {
  quote: string;
  author: string;
  role: string;
  avatar?: string;
}

export const testimonialsData: Testimonial[] = [
  {
    quote: "Truong is an exceptional engineer who brings both technical depth and leadership skills to every project. His ability to architect scalable solutions while mentoring junior developers is impressive.",
    author: "Nguyen Van An",
    role: "PM at Viettel Net"
  },
  {
    quote: "Working with Truong on the AI automation project was transformative for our team. He not only delivered ahead of schedule but also elevated the entire team's technical capabilities.",
    author: "Vu Thanh Dat",
    role: "CTO at Blameo"
  },
  {
    quote: "Truong's expertise in cross-platform development helped us deliver a seamless video conferencing solution across web, mobile, and desktop. His attention to detail and problem-solving skills are outstanding.",
    author: "Vu Ba Huan",
    role: "Director at CMC"
  }
];

export const awards: Award[] = [
  {
    id: 'employee-of-year-2023',
    title: 'Employee of the Year',
    organization: 'Blameo Company',
    date: 'May 2023',
    icon: Sparkles,
  },
];

export const navLinks = [
  //{ label: 'About', href: '/#about' },
  { label: 'Now', href: '/now/' },
  { label: 'Uses', href: '/uses/' },
  { label: 'Journal', href: '/journal/' },
  { label: 'Graph', href: '/graph/' },
  //{ label: 'Skills', href: '/#skills' },
  { label: 'Tech Radar', href: '/tech-radar/' },
  //{ label: 'Experience', href: '/#experience' },
  //{ label: 'Certificates', href: '/#certificates' },
  //{ label: 'GitHub Stats', href: '/#github-stats' },
  //{ label: 'Testimonials', href: '/#testimonials' },
  //{ label: 'Projects', href: '/#projects' },
  { label: 'Blog', href: '/blog/' },
  { label: 'Contact', href: '/#contact' },
];

export const uiStrings = {
  common: {
    logo: 'TRUONG.DEV',
  },
  hero: {
    cta: {
      projects: 'View Projects',
      cv: 'Download CV',
      contact: 'Contact Me',
    },
  },
  skills: {
    title: 'Technical Stack',
    subtitle: 'Fullstack Development & AI Systems',
  },
  experience: {
    title: 'Experience',
    subtitle: 'Professional Journey',
    achievementsTitle: 'Major Achievements',
  },
  projects: {
    title: 'Selected Works',
    subtitle: 'Technical Case Studies & Products',
    emptyMessage: 'NO_PROJECTS_FOUND',
    viewLive: 'VIEW_LIVE',
  },
  contact: {
    title: 'Get In Touch',
    subtitle: 'Let\'s build something together',
    form: {
      nameLabel: '01 // Name',
      namePlaceholder: 'ENTER_NAME',
      emailLabel: '02 // Email',
      emailPlaceholder: 'ENTER_EMAIL',
      messageLabel: '03 // Message',
      messagePlaceholder: 'TYPE_MESSAGE...',
      submitButton: 'SEND_MESSAGE',
      submittingButton: 'SENDING...',
    },
    messages: {
      success: 'Thank you! Your message has been sent successfully.',
      error: 'Failed to send message. Please try again.',
    }
  }
};
