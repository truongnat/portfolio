export interface ILink {
  name: string;
  path: string;
}

export const LINKS: ILink[] = [
  {
    name: 'Home',
    path: '/',
  },
  {
    name: 'Art',
    path: '/art',
  },
  {
    name: 'About',
    path: '/about',
  },
  {
    name: 'Contact',
    path: '/contact',
  },
];
