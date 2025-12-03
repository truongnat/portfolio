export default function BlogLoading() {
    return (
        <main className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header Skeleton */}
                <div className="text-center mb-16 animate-pulse">
                    <div className="h-12 bg-muted rounded w-48 mx-auto mb-4" />
                    <div className="h-6 bg-muted rounded w-96 mx-auto" />
                </div>

                {/* Posts Grid Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="bg-card border border-border rounded-lg overflow-hidden h-[400px] animate-pulse">
                            <div className="h-48 bg-muted" />
                            <div className="p-6 space-y-4">
                                <div className="h-8 bg-muted rounded w-3/4" />
                                <div className="flex gap-4">
                                    <div className="h-4 bg-muted rounded w-24" />
                                    <div className="h-4 bg-muted rounded w-24" />
                                </div>
                                <div className="flex gap-2 pt-4">
                                    <div className="h-6 bg-muted rounded-full w-16" />
                                    <div className="h-6 bg-muted rounded-full w-16" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
