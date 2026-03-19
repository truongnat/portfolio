import { getCollection } from 'astro:content';

export interface GraphNode {
  id: string;
  name: string;
  type: 'blog' | 'journal' | 'tag';
  val: number; // For node size
  group: number; // For coloring
}

export interface GraphLink {
  source: string;
  target: string;
}

export async function getGraphData() {
  const blogPosts = await getCollection('blog');
  const journalPosts = await getCollection('journal');
  
  const nodes: GraphNode[] = [];
  const nodeIds = new Set<string>();
  const links: GraphLink[] = [];
  const tagSet = new Set<string>();

  // Helper to add nodes
  const addNode = (id: string, name: string, type: 'blog' | 'journal' | 'tag', val: number, group: number) => {
    if (!nodeIds.has(id)) {
      nodes.push({ id, name, type, val, group });
      nodeIds.add(id);
    }
  };

  // Process Blog Posts
  blogPosts.forEach(post => {
    addNode(post.id, post.data.title, 'blog', 15, 1);
    post.data.tags?.forEach(tag => {
      tagSet.add(tag);
      links.push({ source: post.id, target: `tag-${tag}` });
    });
  });

  // Process Journal Posts
  journalPosts.forEach(post => {
    addNode(post.id, post.data.title, 'journal', 10, 2);
    post.data.tags?.forEach(tag => {
      tagSet.add(tag);
      links.push({ source: post.id, target: `tag-${tag}` });
    });
  });

  // Add Tag Nodes
  tagSet.forEach(tag => {
    addNode(`tag-${tag}`, tag, 'tag', 8, 3);
  });

  return { nodes, links };
}
