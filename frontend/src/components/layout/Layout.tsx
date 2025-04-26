import { ReactNode } from 'react';
import { Navigation } from './Navigation';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 flex justify-center">
        <div className="w-full max-w-5xl">
          {children}
        </div>
      </main>
    </div>
  );
} 