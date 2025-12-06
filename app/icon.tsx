import { ImageResponse } from 'next/og';

// Image metadata
export const size = {
    width: 32,
    height: 32,
};
export const contentType = 'image/png';

// Image generation
export default function Icon() {
    return new ImageResponse(
        (
            <div
                style={{
                    fontSize: 18,
                    background: '#020817',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    borderRadius: 8,
                    border: '1px solid #334155',
                }}
            >
                <div style={{
                    display: 'flex',
                    background: 'linear-gradient(to bottom right, #60a5fa, #a78bfa)',
                    backgroundClip: 'text',
                    color: 'transparent',
                }}>
                    DT
                </div>
            </div>
        ),
        { ...size }
    );
}
