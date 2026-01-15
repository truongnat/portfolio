'use client';

import { useState, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { PostCard } from './PostCard';
import type { BlogPostMetadata } from '@/lib/blog';

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
        <div className="space-y-12">
            {/* Search and Filters Section */}
            <div className="flex flex-col md:flex-row gap-6 items-center justify-between sticky top-20 z-30 py-4 bg-background/80 backdrop-blur-md px-4 rounded-2xl border border-border/40 shadow-sm">
                {/* Search Input */}
                <div className="relative w-full md:max-w-md group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="Search articles, skills, or tags..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border/50 bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        value={searchQuery}
                        onChange={handleSearch}
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
                        >
                            <X className="h-3 w-3" />
                        </button>
                    )}
                </div>

                {/* Category Filters */}
                <div className="flex flex-wrap items-center justify-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => handleCategoryChange(category)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap border ${selectedCategory === category
                                    ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20 scale-105'
                                    : 'bg-muted/40 text-muted-foreground border-transparent hover:bg-muted hover:border-border/50'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-between text-muted-foreground text-sm px-2">
                <p>
                    Showing {filteredPosts.length} {filteredPosts.length === 1 ? 'article' : 'articles'}
                    {selectedCategory !== 'All' && <span> in <span className="text-foreground font-medium">{selectedCategory}</span></span>}
                </p>
                {searchQuery && (
                    <p>
                        Results for "<span className="text-foreground font-medium">{searchQuery}</span>"
                    </p>
                )}
            </div>

            {/* Grid */}
            {paginatedPosts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 blog-animate">
                    {paginatedPosts.map((post) => (
                        <PostCard key={post.slug} post={post} />
                    ))}
                </div>
            ) : (
                <div className="py-24 text-center">
                    <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-6">
                        <Search className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">No articles found</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                        We couldn't find any articles matching your search or filter criteria. Try a different term or category.
                    </p>
                    <button
                        onClick={() => {
                            setSearchQuery('');
                            setSelectedCategory('All');
                        }}
                        className="mt-6 text-primary hover:underline font-medium"
                    >
                        Clear all filters
                    </button>
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex flex-wrap items-center justify-center gap-3 pt-12 border-t border-border/40">
                    <button
                        onClick={() => {
                            setCurrentPage(p => Math.max(1, p - 1));
                            window.scrollTo({ top: 300, behavior: 'smooth' });
                        }}
                        disabled={currentPage === 1}
                        className="flex items-center gap-1 px-4 py-2 rounded-lg border border-border/50 hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                    </button>

                    <div className="flex items-center gap-2">
                        {Array.from({ length: totalPages }).map((_, i) => {
                            const pageNum = i + 1;
                            // Simple pagination logic to show only neighbors for large page counts
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
                                        className={`h-10 w-10 flex items-center justify-center rounded-lg border transition-all ${currentPage === pageNum
                                                ? 'bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20'
                                                : 'bg-background border-border/50 hover:bg-muted'
                                            }`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            } else if (
                                (pageNum === 2 && currentPage > 3) ||
                                (pageNum === totalPages - 1 && currentPage < totalPages - 2)
                            ) {
                                return <span key={pageNum} className="text-muted-foreground px-1">...</span>;
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
                        className="flex items-center gap-1 px-4 py-2 rounded-lg border border-border/50 hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                        Next
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </div>
            )}
        </div>
    );
}
