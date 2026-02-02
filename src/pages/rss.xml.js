import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { seo } from '../lib/config';

export async function GET(context) {
  const posts = await getCollection('blog', ({ data }) => {
    return data.published === true;
  });

  return rss({
    title: seo.title,
    description: seo.description,
    site: context.site,
    items: posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf()).map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description,
      link: `/blog/${post.slug}/`,
    })),
    customData: `<language>en-us</language>`,
  });
}
