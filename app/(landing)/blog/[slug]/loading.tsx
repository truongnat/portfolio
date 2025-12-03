export default function BlogPostLoading() {
    return (
        <main className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto animate-pulse">
                <div className="h-8 bg-muted rounded w-32 mb-8" /> {/* Back link */}
                <div className="h-64 bg-muted rounded-lg mb-8" /> {/* Cover image */}
                <div className="h-12 bg-muted rounded w-3/4 mb-4" /> {/* Title */}
                <div className="flex gap-4 mb-8">
                    <div className="h-4 bg-muted rounded w-24" />
                    <div className="h-4 bg-muted rounded w-24" />
                </div>
                <div className="space-y-4">
                    <div className="h-4 bg-muted rounded w-full" />
                    <div className="h-4 bg-muted rounded w-full" />
                    <div className="h-4 bg-muted rounded w-2/3" />
                </div>
            </div>
        </main>
    );
}
