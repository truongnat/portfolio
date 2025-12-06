import { ImageResponse } from 'next/og';

// Image metadata
export const size = {
    width: 180,
    height: 180,
};
export const contentType = 'image/png';

// Image generation
export default function Icon() {
    return new ImageResponse(
        (
            <div
                style={{
                    fontSize: 100,
                    background: '#020817',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    borderRadius: 36, // Apple-style rounded corners
                }}
            >
                <div style={{
                    display: 'flex',
                    background: 'linear-gradient(to bottom right, #3b82f6, #8b5cf6)', // Blue to Purple
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
