import type { APIContext } from 'astro';
import { getCollection, type CollectionEntry } from 'astro:content';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

type Props = CollectionEntry<'blog'>;

const fetchFont = async () => {
  const response = await fetch('https://cdn.jsdelivr.net/fontsource/fonts/jetbrains-mono@latest/latin-700-normal.woff');
  return await response.arrayBuffer();
};

const fontData = await fetchFont();

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map((post) => ({
    params: { slug: post.slug },
    props: post,
  }));
}

export async function GET({ props }: APIContext<Props>) {
  const { data } = props;

  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          backgroundColor: '#09090b', // zinc-950
          color: '#f4f4f5', // zinc-100
          padding: '80px',
          fontFamily: 'JetBrains Mono',
        },
        children: [
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                marginBottom: '40px',
                fontSize: '24px',
                color: '#a1a1aa', // zinc-400
                textTransform: 'uppercase',
                letterSpacing: '4px',
              },
              children: 'TRUONG.DEV // BLOG',
            },
          },
          {
            type: 'div',
            props: {
              style: {
                fontSize: '64px',
                fontWeight: 700,
                lineHeight: 1.1,
                marginBottom: '40px',
                background: 'linear-gradient(to right, #ffffff, #a1a1aa)',
                backgroundClip: 'text',
                color: 'transparent',
              },
              children: data.title,
            },
          },
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                gap: '20px',
                fontSize: '20px',
                color: '#a1a1aa',
              },
              children: [
                data.tags?.[0] && {
                  type: 'div',
                  props: {
                    style: {
                      padding: '8px 16px',
                      border: '1px solid #3f3f46', // zinc-700
                      borderRadius: '8px',
                      backgroundColor: '#18181b', // zinc-900
                    },
                    children: data.tags[0],
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      padding: '8px 16px',
                    },
                    children: new Date(data.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    }),
                  },
                },
              ].filter(Boolean),
            },
          },
        ],
      },
    } as any,
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'JetBrains Mono',
          data: fontData,
          style: 'normal',
          weight: 700,
        },
      ],
    }
  );

  const resvg = new Resvg(svg, {
    fitTo: {
      mode: 'width',
      value: 1200,
    },
  });

  const image = resvg.render();

  return new Response(image.asPng() as any, {
    headers: {
      'Content-Type': 'image/png',
    },
  });
}
