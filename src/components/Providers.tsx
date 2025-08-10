'use client';

interface ProvidersProps {
  children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  // Temporarily bypass authentication to focus on core features
  return <>{children}</>;
}
