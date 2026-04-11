import type { SkillTreeData } from '@/types/skill-tree';

/**
 * Initial Skill Tree Data
 * This represents the learning roadmap that donators can sponsor
 */

export const skillTreeData: SkillTreeData = {
  skills: [
    // AI/ML Skills
    {
      id: 'ai-agent-advanced',
      name: 'Advanced AI Agents',
      description: 'Build autonomous AI agents with memory, planning, and tool use capabilities',
      icon: 'Bot',
      category: 'ai-ml',
      cost: 500,
      status: 'unlocked',
      prerequisites: [],
      position: { x: 50, y: 10 },
      color: 'violet',
      totalDonated: 500,
      progress: 100,
      metadata: {
        estimatedHours: 40,
        resources: ['LangChain', 'AutoGen', 'CrewAI'],
        milestones: [
          { id: '1', title: 'Memory System', description: 'Implement vector-based memory', completed: true },
          { id: '2', title: 'Tool Integration', description: 'Connect to external APIs', completed: true },
          { id: '3', title: 'Multi-Agent System', description: 'Build agent collaboration', completed: false },
        ],
      },
      unlockedBy: ['Anonymous', 'TechCorp Inc.'],
    },
    {
      id: 'lancedb-mcp',
      name: 'LanceDB + MCP Integration',
      description: 'Vector database indexing with Model Context Protocol for efficient AI context retrieval',
      icon: 'Database',
      category: 'ai-ml',
      cost: 300,
      status: 'funding',
      prerequisites: ['ai-agent-advanced'],
      position: { x: 30, y: 25 },
      color: 'blue',
      totalDonated: 120,
      progress: 40,
      metadata: {
        estimatedHours: 20,
        resources: ['LanceDB', 'MCP Protocol', 'Embeddings'],
        milestones: [
          { id: '1', title: 'LanceDB Setup', description: 'Configure vector database', completed: true },
          { id: '2', title: 'MCP Server', description: 'Build MCP integration', completed: false },
          { id: '3', title: 'Context Optimization', description: 'Implement smart retrieval', completed: false },
        ],
      },
    },
    {
      id: 'rag-pipeline',
      name: 'RAG Pipeline',
      description: 'Retrieval-Augmented Generation for accurate, context-aware AI responses',
      icon: 'Search',
      category: 'ai-ml',
      cost: 400,
      status: 'locked',
      prerequisites: ['lancedb-mcp'],
      position: { x: 70, y: 25 },
      color: 'purple',
      totalDonated: 0,
      progress: 0,
      metadata: {
        estimatedHours: 30,
        resources: ['RAG', 'Embeddings', 'Re-ranking'],
      },
    },

    // Database Skills
    {
      id: 'postgresql-rls',
      name: 'PostgreSQL RLS Mastery',
      description: 'Row Level Security for multi-tenant, secure database architectures',
      icon: 'Shield',
      category: 'database',
      cost: 250,
      status: 'unlocked',
      prerequisites: [],
      position: { x: 20, y: 40 },
      color: 'orange',
      totalDonated: 250,
      progress: 100,
      metadata: {
        estimatedHours: 15,
        resources: ['PostgreSQL', 'RLS Policies', 'JWT Auth'],
        milestones: [
          { id: '1', title: 'Basic Policies', description: 'SELECT/INSERT policies', completed: true },
          { id: '2', title: 'Advanced RLS', description: 'Complex multi-tenant rules', completed: true },
          { id: '3', title: 'Performance', description: 'Query optimization', completed: false },
        ],
      },
      unlockedBy: ['Database Fan'],
    },
    {
      id: 'neo4j-graph',
      name: 'Graph Database with Neo4j',
      description: 'Model complex relationships and traverse graphs efficiently',
      icon: 'Network',
      category: 'database',
      cost: 350,
      status: 'locked',
      prerequisites: ['postgresql-rls'],
      position: { x: 40, y: 55 },
      color: 'yellow',
      totalDonated: 0,
      progress: 0,
      metadata: {
        estimatedHours: 25,
        resources: ['Neo4j', 'Cypher Query', 'Graph Algorithms'],
      },
    },

    // Security Skills
    {
      id: 'pdf-validation',
      name: 'PDF Security & Validation',
      description: 'Comprehensive file validation, malware scanning, and secure processing',
      icon: 'FileCheck',
      category: 'security',
      cost: 200,
      status: 'funding',
      prerequisites: [],
      position: { x: 60, y: 40 },
      color: 'red',
      totalDonated: 80,
      progress: 40,
      metadata: {
        estimatedHours: 12,
        resources: ['pdf-lib', 'ClamAV', 'Sandboxing'],
        milestones: [
          { id: '1', title: 'Structure Validation', description: 'Header/EOF checks', completed: true },
          { id: '2', title: 'Malware Detection', description: 'Script scanning', completed: false },
          { id: '3', title: 'Sanitization', description: 'Safe processing pipeline', completed: false },
        ],
      },
    },
    {
      id: 'oauth-security',
      name: 'OAuth 2.0 & OIDC Security',
      description: 'Implement secure authentication flows and token management',
      icon: 'Lock',
      category: 'security',
      cost: 300,
      status: 'locked',
      prerequisites: ['pdf-validation'],
      position: { x: 80, y: 55 },
      color: 'rose',
      totalDonated: 0,
      progress: 0,
      metadata: {
        estimatedHours: 20,
        resources: ['OAuth 2.0', 'OpenID Connect', 'JWT'],
      },
    },

    // DevOps Skills
    {
      id: 'kubernetes-prod',
      name: 'Kubernetes Production',
      description: 'Deploy and manage containerized apps at scale with K8s',
      icon: 'Container',
      category: 'devops',
      cost: 450,
      status: 'locked',
      prerequisites: [],
      position: { x: 15, y: 70 },
      color: 'cyan',
      totalDonated: 0,
      progress: 0,
      metadata: {
        estimatedHours: 35,
        resources: ['Kubernetes', 'Helm', 'Istio'],
      },
    },
    {
      id: 'terraform-iac',
      name: 'Terraform IaC',
      description: 'Infrastructure as Code for reproducible cloud deployments',
      icon: 'Cloud',
      category: 'devops',
      cost: 350,
      status: 'locked',
      prerequisites: ['kubernetes-prod'],
      position: { x: 35, y: 85 },
      color: 'sky',
      totalDonated: 0,
      progress: 0,
      metadata: {
        estimatedHours: 25,
        resources: ['Terraform', 'AWS/Azure', 'Modules'],
      },
    },

    // Architecture Skills
    {
      id: 'event-driven',
      name: 'Event-Driven Architecture',
      description: 'Build scalable systems with message queues and event sourcing',
      icon: 'Zap',
      category: 'architecture',
      cost: 400,
      status: 'locked',
      prerequisites: [],
      position: { x: 50, y: 70 },
      color: 'amber',
      totalDonated: 0,
      progress: 0,
      metadata: {
        estimatedHours: 30,
        resources: ['Kafka', 'RabbitMQ', 'Event Sourcing'],
      },
    },
    {
      id: 'microservices',
      name: 'Microservices Patterns',
      description: 'Decompose monoliths and manage distributed systems',
      icon: 'Layers',
      category: 'architecture',
      cost: 500,
      status: 'locked',
      prerequisites: ['event-driven'],
      position: { x: 65, y: 85 },
      color: 'emerald',
      totalDonated: 0,
      progress: 0,
      metadata: {
        estimatedHours: 40,
        resources: ['Saga Pattern', 'CQRS', 'API Gateway'],
      },
    },

    // Frontend Skills
    {
      id: 'webgl-three',
      name: 'WebGL with Three.js',
      description: 'Create immersive 3D experiences in the browser',
      icon: 'Box',
      category: 'frontend',
      cost: 350,
      status: 'locked',
      prerequisites: [],
      position: { x: 85, y: 70 },
      color: 'pink',
      totalDonated: 0,
      progress: 0,
      metadata: {
        estimatedHours: 30,
        resources: ['Three.js', 'WebGL', 'Shaders'],
      },
    },
  ],

  categories: [
    { id: 'ai-ml', name: 'AI & Machine Learning', color: 'violet', description: 'Intelligent systems and automation' },
    { id: 'database', name: 'Database', color: 'orange', description: 'Data storage and retrieval' },
    { id: 'security', name: 'Security', color: 'red', description: 'Protection and validation' },
    { id: 'devops', name: 'DevOps', color: 'cyan', description: 'Deployment and infrastructure' },
    { id: 'architecture', name: 'Architecture', color: 'amber', description: 'System design patterns' },
    { id: 'frontend', name: 'Frontend', color: 'pink', description: 'User interfaces and experiences' },
  ],

  stats: {
    totalSkills: 12,
    unlockedSkills: 2,
    totalDonated: 950,
    totalDonators: 5,
    completionPercentage: 17,
  },
};

export const badges: Array<{
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  requirement: {
    type: 'single' | 'category' | 'total';
    amount: number;
    skillId?: string;
    category?: string;
  };
}> = [
  {
    id: 'first-unlock',
    name: 'First Unlock',
    description: 'Unlock your first skill',
    icon: 'Unlock',
    color: 'green',
    requirement: { type: 'single', amount: 1 },
  },
  {
    id: 'ai-sponsor',
    name: 'AI Sponsor',
    description: 'Sponsor $100+ in AI/ML skills',
    icon: 'Bot',
    color: 'violet',
    requirement: { type: 'category', amount: 100, category: 'ai-ml' },
  },
  {
    id: 'generous-learner',
    name: 'Generous Learner',
    description: 'Donate $500+ total',
    icon: 'Heart',
    color: 'rose',
    requirement: { type: 'total', amount: 500 },
  },
  {
    id: 'skill-master',
    name: 'Skill Master',
    description: 'Fully fund a $300+ skill',
    icon: 'Crown',
    color: 'yellow',
    requirement: { type: 'single', amount: 300 },
  },
];
