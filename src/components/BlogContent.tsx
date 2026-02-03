'use client';

import { useState, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { PostCard } from './PostCard';
import type { BlogPostMetadata } from '@/types';

interface BlogContentProps {
    initialPosts: BlogPostMetadata[];
}

const POSTS_PER_PAGE = 12;

export function BlogContent({ initialPosts }: BlogContentProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [currentPage, setCurrentPage] = useState(1);

    // Extract all unique categories from tags
    // The first tag in our generated blogs is the "Skill Category" (e.g., AI & Agentic)
    const categories = useMemo(() => {
        const allCategories = new Set<string>();
        allCategories.add('All');
        initialPosts.forEach((post) => {
            if (post.tags && post.tags.length > 0) {
                allCategories.add(post.tags[0]);
            }
        });
        return Array.from(allCategories);
    }, [initialPosts]);

    // Filtering logic
    const filteredPosts = useMemo(() => {
        return initialPosts.filter((post) => {
            const matchesSearch =
                post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                post.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                post.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

            const matchesCategory = selectedCategory === 'All' || (post.tags && post.tags[0] === selectedCategory);

            return matchesSearch && matchesCategory;
        });
    }, [initialPosts, searchQuery, selectedCategory]);

    // Pagination logic
    const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
    const paginatedPosts = filteredPosts.slice(
        (currentPage - 1) * POSTS_PER_PAGE,
        currentPage * POSTS_PER_PAGE
    );

    // Reset page when filtering
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category);
        setCurrentPage(1);
    };

    return (
        <div className="space-y-16">
            {/* Search and Filters Section */}
            <div className="flex flex-col md:flex-row gap-8 items-center justify-between py-8 border-b border-border">
                {/* Search Input */}
                <div className="relative w-full md:max-w-xs group">
                    <Search className="absolute left-0 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground group-focus-within:text-foreground transition-colors" />
                    <input
                        type="text"
                        placeholder="SEARCH_ARTICLES..."
                        className="w-full pl-6 pr-4 py-2 border-b border-transparent focus:border-foreground/30 bg-transparent focus:outline-none transition-all font-mono text-sm uppercase tracking-widest"
                        value={searchQuery}
                        onChange={handleSearch}
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="absolute right-0 top-1/2 -translate-y-1/2 h-4 w-4 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <X className="h-3 w-3" />
                        </button>
                    )}
                </div>

                {/* Category Filters */}
                <div className="flex flex-nowrap md:flex-wrap items-center justify-start md:justify-end gap-2 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 scrollbar-hide w-full md:w-auto">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => handleCategoryChange(category)}
                            className={`px-4 py-1 rounded-md text-xs font-mono font-bold uppercase tracking-tighter transition-all duration-200 border ${selectedCategory === category
                                ? 'bg-foreground text-background border-foreground'
                                : 'bg-secondary/30 text-muted-foreground border-border hover:border-muted-foreground/50'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-between text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground px-1">
                <p>
                    RESULTS: {filteredPosts.length} {filteredPosts.length === 1 ? 'UNIT' : 'UNITS'}
                    {selectedCategory !== 'All' && <span> // CATEGORY: {selectedCategory}</span>}
                </p>
                {searchQuery && (
                    <p>
                        QUERY: "{searchQuery}"
                    </p>
                )}
            </div>

            {/* Grid */}
            {paginatedPosts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {paginatedPosts.map((post) => (
                        <PostCard key={post.slug} post={post} />
                    ))}
                </div>
            ) : (
                <div className="py-32 text-center border border-dashed border-border rounded-xl bg-muted/5">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-muted mb-6">
                        <Search className="h-6 w-6 text-muted-foreground opacity-50" />
                    </div>
                    <h3 className="text-base font-bold font-mono uppercase tracking-widest mb-2">Null result</h3>
                    <p className="text-sm text-muted-foreground font-mono uppercase tracking-tight max-w-xs mx-auto">
                        No articles matching current filter parameters found.
                    </p>
                    <button
                        onClick={() => {
                            setSearchQuery('');
                            setSelectedCategory('All');
                        }}
                        className="mt-8 text-xs font-bold font-mono uppercase tracking-[0.2em] text-primary hover:text-foreground transition-colors underline underline-offset-4 decoration-primary/30 hover:decoration-foreground"
                    >
                        RESET_FILTERS
                    </button>
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex flex-wrap items-center justify-center gap-4 pt-16 border-t border-border">
                    <button
                        onClick={() => {
                            setCurrentPage(p => Math.max(1, p - 1));
                            window.scrollTo({ top: 300, behavior: 'smooth' });
                        }}
                        disabled={currentPage === 1}
                        className="flex items-center gap-2 px-4 py-2 font-mono text-xs font-bold uppercase tracking-widest border border-border rounded-md hover:bg-secondary disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                        <ChevronLeft className="h-3 w-3" />
                        PREV
                    </button>

                    <div className="flex items-center gap-2">
                        {Array.from({ length: totalPages }).map((_, i) => {
                            const pageNum = i + 1;
                            if (
                                pageNum === 1 ||
                                pageNum === totalPages ||
                                (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                            ) {
                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => {
                                            setCurrentPage(pageNum);
                                            window.scrollTo({ top: 300, behavior: 'smooth' });
                                        }}
                                        className={`h-8 w-8 flex items-center justify-center rounded-md border font-mono text-xs font-bold transition-all ${currentPage === pageNum
                                            ? 'bg-foreground text-background border-foreground'
                                            : 'bg-transparent border-border hover:border-muted-foreground/50 text-muted-foreground'
                                            }`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            } else if (
                                (pageNum === 2 && currentPage > 3) ||
                                (pageNum === totalPages - 1 && currentPage < totalPages - 2)
                            ) {
                                return <span key={pageNum} className="text-muted-foreground font-mono text-xs">...</span>;
                            }
                            return null;
                        })}
                    </div>

                    <button
                        onClick={() => {
                            setCurrentPage(p => Math.min(totalPages, p + 1));
                            window.scrollTo({ top: 300, behavior: 'smooth' });
                        }}
                        disabled={currentPage === totalPages}
                        className="flex items-center gap-2 px-4 py-2 font-mono text-xs font-bold uppercase tracking-widest border border-border rounded-md hover:bg-secondary disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                        NEXT
                        <ChevronRight className="h-3 w-3" />
                    </button>
                </div>
            )}
        </div>
    );
}
