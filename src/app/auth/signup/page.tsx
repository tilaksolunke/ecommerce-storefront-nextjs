// app/auth/signup/page.tsx
import SignUpForm from '@/components/auth/SignUpForm';
import Link from 'next/link';

export default function SignUpPage() {
  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Floating orbs with different colors for signup */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-emerald-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-cyan-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/3 w-72 h-72 bg-teal-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}
      />

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-lg mx-4">
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-8 space-y-6">
          {/* Logo/Brand Area */}
          <div className="text-center space-y-2">
            <div className="mx-auto w-16 h-16 bg-gradient-to-tr from-white/20 to-white/5 rounded-2xl flex items-center justify-center mb-4 border border-white/20">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
            <p className="text-white/70">Join our shopping community today</p>
          </div>

          {/* Sign Up Form */}
          <SignUpForm />

          {/* Sign In Link */}
          <div className="text-center pt-4 border-t border-white/10">
            <p className="text-white/70 text-sm">
              Already have an account?{' '}
              <Link href="/auth/signin" className="text-white font-semibold hover:text-white/80 transition-colors underline underline-offset-4">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export const metadata = {
  title: 'Sign Up - E-Shop',
  description: 'Create your E-Shop account',
};