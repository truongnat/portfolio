import { Resvg } from '@resvg/resvg-js';
import satori from 'satori';

/**
 * Generate SVG certificate for a donation
 * Uses React.createElement for Satori compatibility
 */
export async function generateCertificateSvg(params: {
  donatorName: string;
  skillName: string;
  amount: number;
  date: string;
  certificateId: string;
}) {
  const { donatorName, skillName, amount, date, certificateId } = params;

  // Use Inter font from Google Fonts
  const interFont = await fetch(
    'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff'
  ).then((res) => res.arrayBuffer());

  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          width: '800px',
          height: '600px',
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px',
          fontFamily: 'Inter',
          position: 'relative',
          overflow: 'hidden',
        },
        children: [
          // Decorative elements
          {
            type: 'div',
            props: {
              style: {
                position: 'absolute',
                top: '-100px',
                right: '-100px',
                width: '400px',
                height: '400px',
                background: 'radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)',
                borderRadius: '50%',
              },
            },
          },
          {
            type: 'div',
            props: {
              style: {
                position: 'absolute',
                bottom: '-100px',
                left: '-100px',
                width: '400px',
                height: '400px',
                background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
                borderRadius: '50%',
              },
            },
          },
          // Border frame
          {
            type: 'div',
            props: {
              style: {
                position: 'absolute',
                top: '20px',
                left: '20px',
                right: '20px',
                bottom: '20px',
                border: '3px solid rgba(139, 92, 246, 0.3)',
                borderRadius: '12px',
              },
            },
          },
          // Title
          {
            type: 'h1',
            props: {
              style: {
                fontSize: '48px',
                fontWeight: 'bold',
                background: 'linear-gradient(90deg, #a78bfa, #60a5fa)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '10px',
                zIndex: 1,
              },
              children: 'Certificate of Support',
            },
          },
          // Subtitle
          {
            type: 'p',
            props: {
              style: {
                fontSize: '18px',
                color: '#9ca3af',
                marginBottom: '40px',
                zIndex: 1,
              },
              children: 'This certifies that',
            },
          },
          // Donator name
          {
            type: 'div',
            props: {
              style: {
                fontSize: '42px',
                fontWeight: 'bold',
                color: '#ffffff',
                padding: '20px 60px',
                background: 'rgba(139, 92, 246, 0.1)',
                borderRadius: '12px',
                border: '2px solid rgba(139, 92, 246, 0.3)',
                marginBottom: '30px',
                zIndex: 1,
              },
              children: donatorName,
            },
          },
          // Description
          {
            type: 'p',
            props: {
              style: {
                fontSize: '18px',
                color: '#9ca3af',
                marginBottom: '10px',
                zIndex: 1,
              },
              children: 'has generously supported the development of',
            },
          },
          // Skill name
          {
            type: 'div',
            props: {
              style: {
                fontSize: '32px',
                fontWeight: 'bold',
                color: '#60a5fa',
                marginBottom: '20px',
                zIndex: 1,
              },
              children: skillName,
            },
          },
          // Amount and Date badges
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                gap: '20px',
                marginTop: '30px',
                zIndex: 1,
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      padding: '15px 30px',
                      background: 'rgba(16, 185, 129, 0.1)',
                      borderRadius: '8px',
                      border: '2px solid rgba(16, 185, 129, 0.3)',
                    },
                    children: [
                      {
                        type: 'p',
                        props: {
                          style: { fontSize: '14px', color: '#9ca3af', marginBottom: '5px' },
                          children: 'Amount',
                        },
                      },
                      {
                        type: 'p',
                        props: {
                          style: { fontSize: '24px', fontWeight: 'bold', color: '#10b981' },
                          children: `$${amount}`,
                        },
                      },
                    ],
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      padding: '15px 30px',
                      background: 'rgba(139, 92, 246, 0.1)',
                      borderRadius: '8px',
                      border: '2px solid rgba(139, 92, 246, 0.3)',
                    },
                    children: [
                      {
                        type: 'p',
                        props: {
                          style: { fontSize: '14px', color: '#9ca3af', marginBottom: '5px' },
                          children: 'Date',
                        },
                      },
                      {
                        type: 'p',
                        props: {
                          style: { fontSize: '24px', fontWeight: 'bold', color: '#a78bfa' },
                          children: date,
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
          // Certificate ID
          {
            type: 'p',
            props: {
              style: {
                position: 'absolute',
                bottom: '40px',
                fontSize: '12px',
                color: '#6b7280',
                zIndex: 1,
              },
              children: `Certificate ID: ${certificateId}`,
            },
          },
          // Verification QR placeholder
          {
            type: 'div',
            props: {
              style: {
                position: 'absolute',
                bottom: '40px',
                right: '40px',
                width: '80px',
                height: '80px',
                background: 'white',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1,
              },
              children: {
                type: 'div',
                props: {
                  style: {
                    fontSize: '10px',
                    color: '#1a1a2e',
                    textAlign: 'center',
                    padding: '5px',
                  },
                  children: ['Verify at', { type: 'br' }, 'skill-tree.dev'],
                },
              },
            },
          },
        ],
      },
    },
    {
      width: 800,
      height: 600,
      fonts: [
        {
          name: 'Inter',
          data: interFont,
          weight: 400,
          style: 'normal',
        },
      ],
    }
  );

  return svg;
}

/**
 * Generate PNG certificate from SVG
 */
export async function generateCertificatePng(params: {
  donatorName: string;
  skillName: string;
  amount: number;
  date: string;
  certificateId: string;
}) {
  const svg = await generateCertificateSvg(params);
  const resvg = new Resvg(svg, {
    fitTo: {
      mode: 'width',
      value: 1600,
    },
  });

  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();

  return pngBuffer;
}
