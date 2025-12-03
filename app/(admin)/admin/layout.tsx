'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import '../../globals.css';


export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();

            if (!session && pathname !== '/admin/login') {
                router.push('/admin/login');
            } else if (session && pathname === '/admin/login') {
                router.push('/admin');
            }

            setLoading(false);
        };

        checkAuth();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (!session && pathname !== '/admin/login') {
                router.push('/admin/login');
            }
        });

        return () => subscription.unsubscribe();
    }, [pathname, router]);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    // Don't show admin sidebar/nav on login page
    if (pathname === '/admin/login') {
        return <>{children}</>;
    }

    return (
        <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
            {/* Sidebar */}
            <aside className="w-64 bg-white dark:bg-gray-800 shadow-md">
                <div className="p-6">
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Admin</h1>
                </div>
                <nav className="mt-6">
                    <Link
                        href="/admin"
                        className={`block px-6 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 ${pathname === '/admin' ? 'bg-gray-100 dark:bg-gray-700 font-semibold' : ''
                            }`}
                    >
                        Dashboard
                    </Link>
                    <Link
                        href="/admin/blog"
                        className={`block px-6 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 ${pathname.startsWith('/admin/blog') ? 'bg-gray-100 dark:bg-gray-700 font-semibold' : ''
                            }`}
                    >
                        Blog Posts
                    </Link>
                    <button
                        onClick={async () => {
                            await supabase.auth.signOut();
                            router.push('/admin/login');
                        }}
                        className="block w-full text-left px-6 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                        Sign Out
                    </button>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
