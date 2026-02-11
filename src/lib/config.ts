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

export type SkillCategory = 'Frontend' | 'Backend' | 'Mobile' | 'DevOps' | 'Tools';

export const projectCategories: ProjectCategory[] = ['All', 'AI', 'Web', 'Mobile', 'Open Source', 'Product'];

export interface SocialLink {
  platform: string;
  url: string;
  icon: LucideIcon;
}

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
    { label: 'Years Experience', value: '3+' },
    { label: 'Team Members Led', value: '8+' },
    { label: 'AI Integration', value: 'Advanced' },
    { label: 'API Optimization', value: '50%' }
  ]
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
  url: "https://porfolio-truongdq.vercel.app",
  image: '/avatar.jpg',
};

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
      level: 'Advanced',
      icon: Layers,
      subSections: [
        {
          label: 'Core',
          skills: ['TypeScript', 'React Native', 'Electron.js', 'Vue.js'],
          highlight: 'Advanced in building unified cross-platform solutions across Web, Mobile, and Desktop.'
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
      level: 'Advanced',
      icon: Server,
      subSections: [
        {
          label: 'Backend',
          skills: ['Node.js (NestJS/Express)', 'Python', 'PostgreSQL']
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
    title: 'MERN Stack Monorepo 2025',
    role: 'Fullstack Developer',
    period: 'Present',
    description: 'Production-ready MERN stack monorepo featuring modern development practices, clean architecture, and comprehensive tooling. Built with TypeScript throughout, demonstrating best practices for full-stack development in 2025.',
    techStack: ['React 19', 'TypeScript', 'Node.js', 'Express', 'MongoDB', 'Socket.io', 'TanStack Router', 'Tailwind CSS', 'Docker'],
    categories: ['Web', 'Open Source'],
    achievements: [
      'Challenge: Creating a comprehensive full-stack application with modern development practices and clean architecture.',
      'Action: Developed a sophisticated monorepo with authentication system, real-time chat, todo management, and comprehensive testing strategies.',
      'Result: Delivered a production-ready application serving as a learning resource for modern full-stack development with features like JWT authentication, real-time communication, and clean architecture principles.',
    ],
    link: 'https://peanut-example-react.vercel.app/'
  },
  {
    id: 'agentic-sdlc-product',
    title: 'Agentic SDLC Framework',
    role: 'AI Engineer',
    period: 'Present',
    description: 'Production-ready AI-powered Software Development Lifecycle framework that demonstrates comprehensive product development with clean architecture, extensibility, and real-world applicability.',
    techStack: ['Python', 'LangChain', 'OpenAI', 'Anthropic', 'DSPy', 'Autogen', 'Neo4j', 'Docker', 'Pydantic', 'Streamlit'],
    categories: ['AI', 'Product'],
    achievements: [
      'Challenge: Building a comprehensive AI-powered framework for automating the software development lifecycle with clean architecture and extensibility.',
      'Action: Developed a production-ready Python SDK with configuration management, agent orchestration, workflow automation, intelligence features (learning, monitoring, reasoning), and a plugin system. Implemented CLI tools, comprehensive testing, and documentation.',
      'Result: Created a 100%-complete framework with 15+ CLI commands, full test coverage, and production-ready code that enables AI agents to collaborate on software development tasks with learning and adaptation capabilities.',
    ],
    link: 'https://agentic-sdlc-sigma.vercel.app/'
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
    link: 'https://agentic-sdlc-sigma.vercel.app/'
  },
  {
    id: 'universal-music-downloader',
    title: 'Universal Music Downloader',
    role: 'Fullstack Developer',
    period: 'Present',
    description: 'Full-stack web application that allows users to download music and playlists from YouTube and SoundCloud as audio files, handling URL input, metadata extraction, audio streaming, and file downloading through backend APIs.',
    techStack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Bun', 'Vercel'],
    categories: ['Web', 'Open Source'],
    achievements: [
      'Challenge: Building a practical tool that allows users to download music without installing additional software.',
      'Action: Designed and implemented frontend UI/UX for a smooth download flow, built backend API endpoints to handle YouTube and SoundCloud downloads, and integrated client-server communication for streaming and file delivery.',
      'Result: Delivered a user-friendly application that demonstrates strong full-stack development skills and experience integrating third-party platforms.',
    ],
    link: 'https://universal-music-downloader.vercel.app/'
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
    ],
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
    ],
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

export const navLinks = [
  { label: 'About', href: '/#about' },
  { label: 'Now', href: '/now' },
  { label: 'Skills', href: '/#skills' },
  { label: 'Tech Radar', href: '/tech-radar' },
  { label: 'Experience', href: '/#experience' },
  { label: 'Projects', href: '/#projects' },
  { label: 'Blog', href: '/blog' },
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
