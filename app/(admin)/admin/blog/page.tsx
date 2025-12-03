'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Post } from '@/types';
import { Loader2, Plus, Pencil, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function AdminBlogPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const { toast } = useToast();

    const fetchPosts = async () => {
        const { data, error } = await supabase
            .from('posts')
            .select('*')
            .order('published_at', { ascending: false });

        if (error) {
            console.error('Error fetching posts:', error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to fetch posts.",
            });
        } else {
            setPosts(data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleDelete = async (slug: string) => {
        if (!confirm('Are you sure you want to delete this post?')) return;

        const { error } = await supabase
            .from('posts')
            .delete()
            .eq('slug', slug);

        if (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: 'Error deleting post: ' + error.message,
            });
        } else {
            toast({
                title: "Success",
                description: "Post deleted successfully.",
            });
            fetchPosts();
        }
    };

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Blog Posts</h2>
                <Link href="/admin/blog/create">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        New Post
                    </Button>
                </Link>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {posts.map((post) => (
                            <TableRow key={post.id}>
                                <TableCell className="font-medium">
                                    <div className="text-sm font-medium text-gray-900 dark:text-white">{post.title}</div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">{post.slug}</div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={post.published_at && new Date(post.published_at) <= new Date() ? "default" : "secondary"}>
                                        {post.published_at && new Date(post.published_at) <= new Date() ? 'Published' : 'Draft'}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    {post.published_at ? new Date(post.published_at).toLocaleDateString() : '-'}
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end space-x-2">
                                        <Link href={`/admin/blog/${post.slug}`}>
                                            <Button variant="ghost" size="icon">
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                        <Button variant="ghost" size="icon" onClick={() => handleDelete(post.slug)} className="text-red-600 hover:text-red-900 hover:bg-red-50 dark:hover:bg-red-900/20">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
