// import SignInForm from '@/components/auth/SignInForm';
// import Link from 'next/link';

// export default function SignInPage() {
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
//       <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-2xl shadow-lg">
//         <div className="text-center">
//           <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
//           <p className="mt-2 text-gray-600">Sign in to your account</p>
//         </div>
        
//         <SignInForm />
        
//         <div className="text-center">
//           <p className="text-sm text-gray-600">
//             Don't have an account?{' '}
//             <Link href="/auth/signup" className="text-blue-600 hover:text-blue-500 font-medium">
//               Sign up here
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

// export const metadata = {
//   title: 'Sign In - E-Shop',
//   description: 'Sign in to your E-Shop account',
// };


// app/auth/signin/page.tsx
import SignInForm from '@/components/auth/SignInForm';
import Link from 'next/link';

export default function SignInPage() {
  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-violet-600 via-purple-600 to-blue-600">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Floating orbs */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/3 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
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
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-8 space-y-6">
          {/* Logo/Brand Area */}
          <div className="text-center space-y-2">
            <div className="mx-auto w-16 h-16 bg-gradient-to-tr from-white/20 to-white/5 rounded-2xl flex items-center justify-center mb-4 border border-white/20">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-white/70">Sign in to your account to continue</p>
          </div>

          {/* Sign In Form */}
          <SignInForm />

          {/* Sign Up Link */}
          <div className="text-center pt-4 border-t border-white/10">
            <p className="text-white/70 text-sm">
              Don't have an account?{' '}
              <Link href="/auth/signup" className="text-white font-semibold hover:text-white/80 transition-colors underline underline-offset-4">
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export const metadata = {
  title: 'Sign In - E-Shop',
  description: 'Sign in to your E-Shop account',
};