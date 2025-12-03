'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Post, PostInsert } from '@/types';
import { Loader2, Save, ArrowLeft, Eye, Code } from 'lucide-react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';

const formSchema = z.object({
    title: z.string().min(1, "Title is required"),
    slug: z.string().min(1, "Slug is required"),
    content: z.string().min(1, "Content is required"),
    published_at: z.string().optional(),
    reading_time: z.number().min(0).optional(),
    cover_image: z.string().optional(),
    tags: z.string().optional(),
    published: z.boolean(),
});

interface PostEditorProps {
    post?: Post;
    isNew?: boolean;
}

export function PostEditor({ post, isNew = false }: PostEditorProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: post?.title || '',
            slug: post?.slug || '',
            content: post?.content || '',
            published_at: post?.published_at ? new Date(post.published_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            reading_time: post?.reading_time || 5,
            cover_image: post?.cover_image || '',
            tags: post?.tags?.join(', ') || '',
            published: post?.published ?? false,
        },
    });

    // Auto-generate slug from title for new posts
    useEffect(() => {
        if (isNew) {
            const subscription = form.watch((value, { name }) => {
                if (name === 'title' && value.title) {
                    const slug = value.title
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, '-')
                        .replace(/(^-|-$)+/g, '');
                    form.setValue('slug', slug);
                }
            });
            return () => subscription.unsubscribe();
        }
    }, [form, isNew]);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true);

        try {
            const postData: PostInsert = {
                title: values.title,
                slug: values.slug,
                content: values.content,
                cover_image: values.cover_image || null,
                reading_time: values.reading_time ?? null,
                tags: values.tags ? values.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
                updated_at: new Date().toISOString(),
                published_at: values.published_at ? new Date(values.published_at).toISOString() : null,
                published: values.published,
            };

            if (isNew) {
                const { error } = await supabase.from('posts').insert([postData]);
                if (error) throw error;
                toast({
                    title: "Success",
                    description: "Post created successfully.",
                });
            } else {
                if (!post?.id) {
                    throw new Error("Post ID is missing for update");
                }

                const { error } = await supabase
                    .from('posts')
                    .update(postData)
                    .eq('id', post.id);
                if (error) throw error;
                toast({
                    title: "Success",
                    description: "Post updated successfully.",
                });
            }

            router.push('/admin/blog');
            router.refresh();
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error.message,
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-5xl mx-auto">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Link href="/admin/blog">
                            <Button variant="ghost" size="icon">
                                <ArrowLeft className="h-6 w-6" />
                            </Button>
                        </Link>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            {isNew ? 'Create New Post' : 'Edit Post'}
                        </h1>
                    </div>
                    <Button type="submit" disabled={loading}>
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        Save Post
                    </Button>
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    <div className="lg:col-span-2 space-y-6">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Post title" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="slug"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Slug</FormLabel>
                                    <FormControl>
                                        <Input placeholder="post-slug" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        The URL-friendly version of the title.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Content (Markdown)</FormLabel>
                                    <FormControl>
                                        <Tabs defaultValue="edit" className="w-full">
                                            <TabsList className="grid w-full grid-cols-2">
                                                <TabsTrigger value="edit" className="flex items-center gap-2">
                                                    <Code className="h-4 w-4" />
                                                    Edit
                                                </TabsTrigger>
                                                <TabsTrigger value="preview" className="flex items-center gap-2">
                                                    <Eye className="h-4 w-4" />
                                                    Preview
                                                </TabsTrigger>
                                            </TabsList>
                                            <TabsContent value="edit" className="mt-2">
                                                <Textarea
                                                    placeholder="Write your post content here..."
                                                    className="min-h-[500px] font-mono"
                                                    {...field}
                                                />
                                            </TabsContent>
                                            <TabsContent value="preview" className="mt-2">
                                                <div className="min-h-[500px] rounded-md border border-input bg-background px-4 py-3 overflow-auto">
                                                    <div className="prose prose-sm dark:prose-invert max-w-none">
                                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                            {field.value || '*No content to preview*'}
                                                        </ReactMarkdown>
                                                    </div>
                                                </div>
                                            </TabsContent>
                                        </Tabs>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardContent className="p-6 space-y-6">
                                <FormField
                                    control={form.control}
                                    name="published"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                            <div className="space-y-0.5">
                                                <FormLabel className="text-base">
                                                    Publish Status
                                                </FormLabel>
                                                <FormDescription>
                                                    {field.value ? 'Post is published and visible to everyone' : 'Post is private (draft)'}
                                                </FormDescription>
                                            </div>
                                            <FormControl>
                                                <Switch
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="published_at"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Publish Date</FormLabel>
                                            <FormControl>
                                                <Input type="date" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="reading_time"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Reading Time (minutes)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    {...field}
                                                    value={field.value ?? ''}
                                                    onChange={(e) => {
                                                        const val = e.target.value === '' ? undefined : Number(e.target.value);
                                                        field.onChange(val);
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="cover_image"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Cover Image URL</FormLabel>
                                            <FormControl>
                                                <Input placeholder="https://..." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                            {field.value && (
                                                <div className="mt-2 relative aspect-video w-full overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                                                    <img
                                                        src={field.value}
                                                        alt="Cover"
                                                        className="h-full w-full object-cover"
                                                    />
                                                </div>
                                            )}
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="tags"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Tags (comma separated)</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Next.js, React, Supabase" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </form>
        </Form>
    );
}
