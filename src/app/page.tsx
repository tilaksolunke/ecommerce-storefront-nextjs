import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function HomePage() {
  const session = await auth();

  // If user is not authenticated, redirect to sign-in
  if (!session) {
    redirect('/auth/signin');
  }

  // If authenticated, redirect based on role
  if (session.user?.role === 'admin') {
    redirect('/admin');
  } else {
    redirect('/auth/signin');
  }
}

export const metadata = {
  title: 'E-Shop - Premium Shopping Experience',
  description: 'Welcome to E-Shop - Your premium e-commerce destination',
};
