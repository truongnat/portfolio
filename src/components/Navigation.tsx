import { cn } from '@/lib/utils';

export default function Navigation() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/60 backdrop-blur-xl shadow-2xl">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <a href="/" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70 hover:to-primary transition-all duration-300">
              Portfolio
            </a>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-6">
              {[
                ['About', '/#about'],
                ['Skills', '/#skills'],
                ['Experience', '/#experience'],
                ['Projects', '/#projects'],
                ['Blog', '/blog'],
                ['Contact', '/#contact'],
              ].map(([label, href]) => (
                <a
                  key={label}
                  href={href}
                  className="relative text-sm font-medium text-foreground/70 hover:text-primary transition-colors group"
                >
                  {label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary rounded-full transition-all duration-300 group-hover:w-full" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}