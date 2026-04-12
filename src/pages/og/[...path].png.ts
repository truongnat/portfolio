import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { CANONICAL_SITE_URL } from '@/lib/config';

const OG_SITE_LABEL = new URL(CANONICAL_SITE_URL).hostname;

export const prerender = false;

export async function getStaticPaths() {
  const blogPosts = await getCollection('blog');
  const journalPosts = await getCollection('journal');

  const paths = [
    ...blogPosts.map((post) => ({
      params: { path: `blog/${post.id}` },
      props: { title: post.data.title, description: post.data.description, type: 'BLOG_POST' },
    })),
    ...journalPosts.map((post) => ({
      params: { path: `journal/${post.id}` },
      props: { title: post.data.title, description: post.data.summary || '', type: 'ENGINEERING_LOG' },
    })),
  ];

  return paths;
}

export const GET: APIRoute = async ({ props }) => {
  const { title, description, type } = props as { title: string; description: string; type: string };

  // Load font
  const fontData = await fetch(
    'https://fonts.gstatic.com/s/jetbrainsmono/v18/tueOakoa9rqPnbHLNoatpE_AS76DBHt7asE.woff'
  ).then((res) => res.arrayBuffer());

  const svg = await satori(
    // @ts-expect-error Satori intrinsic element object
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
          backgroundImage: 'radial-gradient(circle at 25px 25px, #27272a 2px, transparent 0)',
          backgroundSize: '50px 50px',
          padding: '80px',
          fontFamily: 'JetBrains Mono',
        },
        children: [
          // Border accent
          {
            type: 'div',
            props: {
              style: {
                position: 'absolute',
                top: 0,
                left: 0,
                bottom: 0,
                width: '12px',
                backgroundColor: type === 'BLOG_POST' ? '#3b82f6' : '#10b981',
              }
            }
          },
          // Header info
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '40px',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      padding: '6px 12px',
                      backgroundColor: type === 'BLOG_POST' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                      border: `1px solid ${type === 'BLOG_POST' ? 'rgba(59, 130, 246, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`,
                      borderRadius: '6px',
                      color: type === 'BLOG_POST' ? '#60a5fa' : '#34d399',
                      fontSize: '20px',
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                    },
                    children: type,
                  }
                }
              ]
            }
          },
          // Title
          {
            type: 'div',
            props: {
              style: {
                fontSize: '72px',
                fontWeight: 'bold',
                color: '#ffffff',
                lineHeight: '1.1',
                marginBottom: '24px',
                maxWidth: '900px',
              },
              children: title,
            }
          },
          // Description
          {
            type: 'div',
            props: {
              style: {
                fontSize: '32px',
                color: '#a1a1aa', // zinc-400
                lineHeight: '1.4',
                maxWidth: '800px',
                marginBottom: '60px',
              },
              children: description.length > 150 ? description.substring(0, 150) + '...' : description,
            }
          },
          // Footer
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                marginTop: 'auto',
                width: '100%',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      flexDirection: 'column',
                    },
                    children: [
                      {
                        type: 'span',
                        props: {
                          style: {
                            color: '#ffffff',
                            fontSize: '28px',
                            fontWeight: 'bold',
                          },
                          children: 'Dao Quang Truong',
                        }
                      },
                      {
                        type: 'span',
                        props: {
                          style: {
                            color: '#71717a',
                            fontSize: '20px',
                          },
                          children: OG_SITE_LABEL,
                        }
                      }
                    ]
                  }
                },
                // Avatar placeholder or simple circle
                {
                    type: 'div',
                    props: {
                        style: {
                            marginLeft: 'auto',
                            width: '80px',
                            height: '80px',
                            borderRadius: '40px',
                            border: '4px solid #27272a',
                            display: 'flex',
                            overflow: 'hidden'
                        },
                        children: [
                            {
                                type: 'img',
                                props: {
                                    src: 'https://github.com/truongdq01.png',
                                    width: 80,
                                    height: 80,
                                }
                            }
                        ]
                    }
                }
              ]
            }
          }
        ]
      }
    },
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'JetBrains Mono',
          data: fontData,
          style: 'normal',
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

  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();

  return new Response(new Uint8Array(pngBuffer), {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
