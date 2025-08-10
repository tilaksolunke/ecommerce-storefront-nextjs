// import SessionProvider from '@/components/providers/SessionProvider';
// import './globals.css'  // This line is crucial!

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="en">
//       <body>
//         <SessionProvider>
//           {children}
//         </SessionProvider>
//       </body>
//     </html>
//   );
// }

// src/app/layout.tsx
import { SessionProvider } from 'next-auth/react';
import { CartProvider } from '@/contexts/CartContext';
import CartDrawer from '@/components/cart/CartDrawer';
import Link from 'next/link';
import './globals.css'  


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <CartProvider> {/* Make sure this wraps everything */}
            <div className="relative">
              <nav className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex justify-between h-16">
                    <div className="flex items-center">
                      <Link href="/" className="text-xl font-bold text-blue-600">
                        Your Store
                      </Link>
                    </div>
                    <div className="flex items-center space-x-4">
                      <CartDrawer />
                    </div>
                  </div>
                </div>
              </nav>
              
              {children}
            </div>
          </CartProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
