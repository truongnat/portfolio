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
    type LucideIcon,
} from 'lucide-react';

export interface SocialLink {
    platform: string;
    url: string;
    icon: LucideIcon;
}

export const personalInfo = {
    name: "Dao Quang Truong",
    role: "Full-Stack Developer",
    bio: "Building exceptional digital experiences",
    email: "contact@example.com",
    githubUsername: "yourusername", // Update this with actual username
    socials: [
        {
            platform: "GitHub",
            url: "https://github.com",
            icon: Github,
        },
        {
            platform: "LinkedIn",
            url: "https://linkedin.com",
            icon: Linkedin,
        },
        {
            platform: "Email",
            url: "mailto:contact@example.com",
            icon: Mail,
        },
    ],
    typingPhrases: [
        'AI & Machine Learning',
        'Full-Stack TypeScript',
        'System Design',
        'Cloud Architecture',
    ]
};

export const seo = {
    title: "Dao Quang Truong | Full-Stack Developer",
    description: "Modern developer portfolio showcasing full-stack development, AI/ML projects, and technical expertise.",
    keywords: [
        'portfolio',
        'developer',
        'full-stack',
        'TypeScript',
        'React',
        'Next.js',
        'AI',
        'Machine Learning',
    ],
    url: "https://portfolio.dev",
};

export type SkillCategory = 'Frontend' | 'Backend' | 'AI/ML' | 'DevOps' | 'Tools';

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

export const skillsConfig = {
    expertiseRings: [
        {
            id: 'ai-ml',
            label: 'AI & Machine Learning',
            percentage: 94,
            color: 'hsl(var(--primary))',
        },
        {
            id: 'fullstack-ts',
            label: 'Full-Stack TypeScript',
            percentage: 92,
            color: 'hsl(var(--accent))',
        },
        {
            id: 'system-design',
            label: 'System Design & Architecture',
            percentage: 90,
            color: 'hsl(var(--primary))',
        },
        {
            id: 'python-ds',
            label: 'Python & Data Science',
            percentage: 96,
            color: 'hsl(var(--accent))',
        },
        {
            id: 'devops-cloud',
            label: 'DevOps & Cloud',
            percentage: 85,
            color: 'hsl(var(--primary))',
        },
        {
            id: 'prompt-eng',
            label: 'Prompt Engineering & LLMs',
            percentage: 98,
            color: 'hsl(var(--accent))',
        },
    ] as ExpertiseRing[],
    skillPills: [
        // Frontend
        { id: 'react', name: 'React', icon: Code2, category: 'Frontend' },
        { id: 'nextjs', name: 'Next.js', icon: Rocket, category: 'Frontend' },
        { id: 'typescript', name: 'TypeScript', icon: Code2, category: 'Frontend' },
        { id: 'tailwind', name: 'Tailwind CSS', icon: Palette, category: 'Frontend' },
        { id: 'vue', name: 'Vue.js', icon: Code2, category: 'Frontend' },

        // Backend
        { id: 'nodejs', name: 'Node.js', icon: Server, category: 'Backend' },
        { id: 'python', name: 'Python', icon: Terminal, category: 'Backend' },
        { id: 'graphql', name: 'GraphQL', icon: Database, category: 'Backend' },
        { id: 'postgresql', name: 'PostgreSQL', icon: Database, category: 'Backend' },
        { id: 'mongodb', name: 'MongoDB', icon: Database, category: 'Backend' },

        // AI/ML
        { id: 'tensorflow', name: 'TensorFlow', icon: Brain, category: 'AI/ML' },
        { id: 'pytorch', name: 'PyTorch', icon: Brain, category: 'AI/ML' },
        { id: 'openai', name: 'OpenAI', icon: Sparkles, category: 'AI/ML' },
        { id: 'langchain', name: 'LangChain', icon: MessageSquare, category: 'AI/ML' },
        { id: 'huggingface', name: 'Hugging Face', icon: Brain, category: 'AI/ML' },

        // DevOps
        { id: 'docker', name: 'Docker', icon: Package, category: 'DevOps' },
        { id: 'kubernetes', name: 'Kubernetes', icon: Cloud, category: 'DevOps' },
        { id: 'aws', name: 'AWS', icon: Cloud, category: 'DevOps' },
        { id: 'cicd', name: 'CI/CD', icon: GitBranch, category: 'DevOps' },
        { id: 'terraform', name: 'Terraform', icon: Layers, category: 'DevOps' },

        // Tools
        { id: 'git', name: 'Git', icon: GitBranch, category: 'Tools' },
        { id: 'vscode', name: 'VS Code', icon: Code2, category: 'Tools' },
        { id: 'figma', name: 'Figma', icon: Palette, category: 'Tools' },
        { id: 'analytics', name: 'Analytics', icon: BarChart, category: 'Tools' },
        { id: 'seo', name: 'SEO', icon: Search, category: 'Tools' },
    ] as SkillPill[],
};
