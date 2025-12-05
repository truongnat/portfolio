import { revalidateTag, revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

/**
 * API endpoint for cache revalidation
 * POST /api/revalidate
 * Body: { tags?: string[], paths?: string[] }
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { tags, paths } = body;

        // Revalidate tags
        if (tags && Array.isArray(tags)) {
            tags.forEach((tag: string) => {
                revalidateTag(tag);
            });
        }

        // Revalidate paths
        if (paths && Array.isArray(paths)) {
            paths.forEach((path: string) => {
                revalidatePath(path);
            });
        }

        return NextResponse.json({
            revalidated: true,
            tags: tags || [],
            paths: paths || [],
            now: Date.now()
        });
    } catch (error) {
        console.error('Revalidation error:', error);
        return NextResponse.json(
            {
                revalidated: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}
