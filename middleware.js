// import { auth } from '@/lib/auth';
// import { NextResponse } from 'next/server';

// export default auth((req) => {
//   const { pathname } = req.nextUrl;
//   const isLoggedIn = !!req.auth;
//   const userRole = req.auth?.user?.role;

//   // Define route patterns
//   const isAuthRoute = pathname.startsWith('/auth');
//   const isAdminRoute = pathname.startsWith('/admin');
//   const isProtectedRoute = ['/profile', '/orders', '/checkout'].some(
//     route => pathname.startsWith(route)
//   );

//   // Redirect logged-in users away from auth pages
//   if (isAuthRoute && isLoggedIn) {
//     if (userRole === 'admin') {
//       return NextResponse.redirect(new URL('/admin', req.url));
//     }
//     return NextResponse.redirect(new URL('/profile', req.url));
//   }

//   // Protect admin routes
//   if (isAdminRoute) {
//     if (!isLoggedIn) {
//       return NextResponse.redirect(
//         new URL('/auth/signin?callbackUrl=' + pathname, req.url)
//       );
//     }
//     if (userRole !== 'admin') {
//       return NextResponse.redirect(new URL('/profile', req.url));
//     }
//   }

//   // Protect user routes
//   if (isProtectedRoute && !isLoggedIn) {
//     return NextResponse.redirect(
//       new URL('/auth/signin?callbackUrl=' + pathname, req.url)
//     );
//   }

//   return NextResponse.next();
// });

// export const config = {
//   matcher: [
//     '/((?!api|_next/static|_next/image|favicon.ico).*)',
//   ],
// };


// import { auth } from '@/lib/auth';
// import { NextResponse } from 'next/server';

// export default auth((req) => {
//   const { pathname } = req.nextUrl;
//   const isLoggedIn = !!req.auth;

//   // Redirect root to signin if not logged in
//   if (pathname === '/' && !isLoggedIn) {
//     return NextResponse.redirect(new URL('/auth/signin', req.url));
//   }

//   // Redirect authenticated users away from auth pages
//   if (pathname.startsWith('/auth/') && isLoggedIn) {
//     return NextResponse.redirect(new URL('/products', req.url));
//   }

//   return NextResponse.next();
// });

// export const config = {
//   matcher: [
//     '/((?!api|_next/static|_next/image|favicon.ico).*)',
//   ],
// };

// import { auth } from '@/lib/auth';
// import { NextResponse } from 'next/server';

// export default auth((req) => {
//   const { pathname } = req.nextUrl;
//   const isLoggedIn = !!req.auth;
//   const userRole = req.auth?.user?.role;

//   // Define route patterns
//   const isAuthRoute = pathname.startsWith('/auth');
//   const isAdminRoute = pathname.startsWith('/admin');
  
//   // ✅ UPDATED: Require authentication for products and other routes
//   const isProtectedRoute = ['/products', '/profile', '/orders', '/checkout'].some(
//     route => pathname.startsWith(route)
//   );

//   // Root path handling - redirect to authentication if not logged in
//   if (pathname === '/' && !isLoggedIn) {
//     return NextResponse.redirect(new URL('/auth/signin', req.url));
//   }

//   // Redirect authenticated users from root to appropriate dashboard
//   if (pathname === '/' && isLoggedIn) {
//     if (userRole === 'admin') {
//       return NextResponse.redirect(new URL('/admin', req.url));
//     }
//     return NextResponse.redirect(new URL('/products', req.url));
//   }

//   // Redirect logged-in users away from auth pages
//   if (isAuthRoute && isLoggedIn) {
//     if (userRole === 'admin') {
//       return NextResponse.redirect(new URL('/admin', req.url));
//     }
//     return NextResponse.redirect(new URL('/products', req.url));
//   }

//   // Protect admin routes
//   if (isAdminRoute && !isLoggedIn) {
//     return NextResponse.redirect(
//       new URL('/auth/signin?callbackUrl=' + pathname, req.url)
//     );
//   }

//   if (isAdminRoute && userRole !== 'admin') {
//     return NextResponse.redirect(new URL('/auth/signin', req.url));
//   }

//   // ✅ UPDATED: Protect all routes including products
//   if (isProtectedRoute && !isLoggedIn) {
//     return NextResponse.redirect(
//       new URL('/auth/signin?callbackUrl=' + pathname, req.url)
//     );
//   }

//   return NextResponse.next();
// });

// export const config = {
//   matcher: [
//     '/((?!api|_next/static|_next/image|favicon.ico).*)',
//   ],
// };


// middleware.ts
import { auth } from '@/lib/auth';

export default auth((req) => {
  // Add your middleware logic here
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  
  const isOnAdminPage = nextUrl.pathname.startsWith('/admin');
  const isOnProfilePage = nextUrl.pathname.startsWith('/profile');
  const isOnCheckout = nextUrl.pathname.startsWith('/checkout');
  
  if ((isOnAdminPage || isOnProfilePage || isOnCheckout) && !isLoggedIn) {
    return Response.redirect(new URL('/auth/signin', nextUrl));
  }
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
