'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PageView {
    path: string;
    view_count: number;
    last_viewed: string;
}

export default function AdminDashboard() {
    const [data, setData] = useState<PageView[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const { data: pageViews, error } = await supabase
                .from('page_views')
                .select('*')
                .order('view_count', { ascending: false })
                .limit(20);

            if (error) {
                console.error('Error fetching analytics:', error);
            } else {
                setData(pageViews || []);
            }
            setLoading(false);
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Dashboard Analytics</h2>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Page Views</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {data.reduce((acc, curr) => acc + curr.view_count, 0)}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Most Visited Page</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm font-bold truncate" title={data[0]?.path}>
                            {data[0]?.path || 'N/A'}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="col-span-4">
                <CardHeader>
                    <CardTitle>Top Pages</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                    <div className="h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="path" />
                                <YAxis />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Bar dataKey="view_count" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
