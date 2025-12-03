'use client';

import { useEffect, useState, use } from 'react';
import { PostEditor } from '@/components/admin/PostEditor';
import { supabase } from '@/lib/supabase';
import { Post } from '@/types';
import { Loader2 } from 'lucide-react';
import { notFound } from 'next/navigation';

export default function EditPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            const { data, error } = await supabase
                .from('posts')
                .select('*')
                .eq('slug', slug)
                .single();

            if (error) {
                console.error('Error fetching post:', error);
            } else {
                setPost(data);
            }
            setLoading(false);
        };

        fetchPost();
    }, [slug]);

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    if (!post) {
        notFound();
    }

    return <PostEditor post={post} />;
}
