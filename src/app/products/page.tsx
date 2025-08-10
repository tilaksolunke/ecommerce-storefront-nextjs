// import Link from 'next/link';
// import Image from 'next/image';
// import SearchFilters from '@/components/product/SearchFilters';
// import Pagination from '@/components/ui/Pagination';
// import SeedProductsButton from '@/components/product/SeedProductsButton';
// import QuickAddToCart from '@/components/product/QuickAddToCart';
// import CartButton from '@/components/ui/CartButton';
// import styles from './products.module.css';

// interface Product {
//   _id: string;
//   name: string;
//   description: string;
//   price: number;
//   category: string;
//   stock: number;
//   images: string[];
//   featured: boolean;
//   createdAt?: string;
// }

// interface ProductsPageProps {
//   searchParams: Promise<{
//     category?: string;
//     search?: string;
//     page?: string;
//     sort?: string;
//     order?: string;
//     view?: string;
//   }>;
// }

// // Server-side data fetching - Fixed for Next.js 15
// async function getProducts(resolvedSearchParams: any) {
//   const params = new URLSearchParams();
  
//   if (resolvedSearchParams.category) params.append('category', resolvedSearchParams.category);
//   if (resolvedSearchParams.search) params.append('search', resolvedSearchParams.search);
//   if (resolvedSearchParams.page) params.append('page', resolvedSearchParams.page);
//   if (resolvedSearchParams.sort) params.append('sort', resolvedSearchParams.sort);
//   if (resolvedSearchParams.order) params.append('order', resolvedSearchParams.order);

//   const baseUrl = process.env.NODE_ENV === 'production' 
//     ? 'https://your-domain.com' 
//     : 'http://localhost:3000';

//   try {
//     const res = await fetch(`${baseUrl}/api/products?${params}`, {
//       next: { revalidate: 60 }
//     });

//     if (!res.ok) {
//       throw new Error('Failed to fetch products');
//     }

//     return res.json();
//   } catch (error) {
//     console.error('Error fetching products:', error);
//     return { products: [], pagination: { current: 1, pages: 1, total: 0, hasNext: false, hasPrev: false } };
//   }
// }

// // Get categories for quick filter
// async function getCategories() {
//   const baseUrl = process.env.NODE_ENV === 'production' 
//     ? 'https://your-domain.com' 
//     : 'http://localhost:3000';

//   try {
//     const res = await fetch(`${baseUrl}/api/categories`, {
//       next: { revalidate: 300 }
//     });
    
//     if (res.ok) {
//       return res.json();
//     }
//   } catch (error) {
//     console.error('Error fetching categories:', error);
//   }
  
//   // Fallback categories
//   return [
//     'Electronics', 'Clothing', 'Books', 'Home & Garden', 
//     'Sports', 'Beauty', 'Automotive', 'Toys'
//   ];
// }

// export default async function ProductsPage({ searchParams }: ProductsPageProps) {
//   const resolvedSearchParams = await searchParams;
//   const { products, pagination } = await getProducts(resolvedSearchParams);
//   const categories = await getCategories();
//   const viewMode = resolvedSearchParams.view || 'grid';

//   return (
//     <>
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
//         {/* Enhanced Hero Section */}
//         <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white py-20 mb-12 relative overflow-hidden">
//           {/* Floating circles with CSS modules */}
//           <div className={`absolute top-10 left-10 w-20 h-20 bg-white bg-opacity-10 rounded-full ${styles.floatingAnimation}`}></div>
//           <div className={`absolute top-20 right-20 w-16 h-16 bg-white bg-opacity-5 rounded-full ${styles.floatingAnimation}`} style={{animationDelay: '1s'}}></div>
//           <div className={`absolute bottom-20 left-1/4 w-12 h-12 bg-white bg-opacity-10 rounded-full ${styles.floatingAnimation}`} style={{animationDelay: '2s'}}></div>
          
//           <div className="container mx-auto px-4 text-center relative">
//             <div className="max-w-5xl mx-auto">
//               <h1 className={`text-5xl md:text-7xl font-bold mb-6 ${styles.animateFadeInDown}`}>
//                 <span className="bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
//                   Discover Amazing Products
//                 </span>
//               </h1>
//               <p className={`text-xl md:text-2xl opacity-90 mb-10 ${styles.animateFadeInUp} ${styles.stagger1}`}>
//                 Find exactly what you are looking for from our curated collection of{' '}
//                 <span className="font-bold text-yellow-300">{pagination.total}+</span> premium products
//               </p>
              
//               {/* Enhanced Action Buttons */}
//               <div className={`flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6 ${styles.animateFadeInUp} ${styles.stagger2}`}>
//                 <a 
//                   href="#products-section"
//                   className="bg-white text-blue-600 px-10 py-5 rounded-full font-bold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 hover:scale-105 group cursor-pointer inline-block"
//                 >
//                   <span className="flex items-center space-x-2">
//                     <svg className="w-5 h-5 group-hover:translate-y-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
//                     </svg>
//                     <span>Browse Categories</span>
//                   </span>
//                 </a>
//               </div>

//               {/* Enhanced Quick Stats with better visibility */}
//               <div className={`grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-3xl mx-auto ${styles.animateFadeInUp} ${styles.stagger3}`}>
//                 <div className="text-center p-4 bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl hover:bg-opacity-30 transition-all duration-300 transform hover:-translate-y-1 border border-white border-opacity-30">
//                   <div className="text-4xl font-black text-white drop-shadow-lg">{pagination.total}+</div>
//                   <div className="text-base font-semibold text-white opacity-90">Products</div>
//                 </div>
//                 <div className="text-center p-4 bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl hover:bg-opacity-30 transition-all duration-300 transform hover:-translate-y-1 border border-white border-opacity-30">
//                   <div className="text-4xl font-black text-white drop-shadow-lg">{categories.length}</div>
//                   <div className="text-base font-semibold text-white opacity-90">Categories</div>
//                 </div>
//                 <div className="text-center p-4 bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl hover:bg-opacity-30 transition-all duration-300 transform hover:-translate-y-1 border border-white border-opacity-30">
//                   <div className="text-4xl font-black text-white drop-shadow-lg">24/7</div>
//                   <div className="text-base font-semibold text-white opacity-90">Support</div>
//                 </div>
//                 <div className="text-center p-4 bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl hover:bg-opacity-30 transition-all duration-300 transform hover:-translate-y-1 border border-white border-opacity-30">
//                   <div className="text-4xl font-black text-white drop-shadow-lg">Free</div>
//                   <div className="text-base font-semibold text-white opacity-90">Shipping</div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="container mx-auto px-4" id="products-section">
//           {/* Search and Filters */}
//           <div className={styles.animateFadeInUp}>
//             <SearchFilters />
//           </div>

//           {/* Quick Category Filter Chips */}
//           <div className={`mb-12 ${styles.animateFadeInUp} ${styles.stagger1}`}>
//             <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Filters</h3>
//             <div className="flex flex-wrap gap-3">
//               <Link
//                 href="/products"
//                 className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 ${
//                   !resolvedSearchParams.category 
//                     ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg animate-pulse-gentle' 
//                     : 'bg-white text-gray-700 hover:bg-blue-50 border-2 border-gray-200 hover:border-blue-300 shadow-sm'
//                 }`}
//               >
//                 All Products
//               </Link>
//               {categories.slice(0, 6).map((category: string, index: number) => (
//                 <Link
//                   key={category}
//                   href={`/products?category=${encodeURIComponent(category)}`}
//                   className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 ${styles.animateSlideInLeft} ${
//                     resolvedSearchParams.category === category
//                       ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg animate-pulse-gentle'
//                       : 'bg-white text-gray-700 hover:bg-blue-50 border-2 border-gray-200 hover:border-blue-300 shadow-sm'
//                   }`}
//                   style={{ animationDelay: `${index * 0.1}s` }}
//                 >
//                   {category}
//                 </Link>
//               ))}
//             </div>
//           </div>

//           {/* Products Section */}
//           {products.length === 0 ? (
//             <div className={`text-center py-24 ${styles.animateFadeInUp}`}>
//               <div className="max-w-md mx-auto">
//                 <div className="mb-8">
//                   <svg className="w-40 h-40 mx-auto text-gray-300 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
//                   </svg>
//                 </div>
//                 <h3 className="text-4xl font-bold text-gray-900 mb-6">No Products Found</h3>
//                 <p className="text-gray-600 mb-10 text-lg leading-relaxed">
//                   {resolvedSearchParams.search 
//                     ? `No products match "${resolvedSearchParams.search}". Try a different search term.`
//                     : resolvedSearchParams.category
//                     ? `No products found in "${resolvedSearchParams.category}" category.`
//                     : "We couldn't find any products. Get started by adding some products."
//                   }
//                 </p>
//                 <div className="space-y-6">
//                   <div className="animate-bounce">
//                     <SeedProductsButton />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ) : (
//             <>
//               {/* Enhanced Products Stats with View Toggle */}
//               <div className={`flex flex-col md:flex-row justify-between items-start md:items-center mb-10 bg-white p-8 rounded-3xl shadow-lg border border-gray-100 ${styles.animateFadeInUp}`}>
//                 <div className="mb-4 md:mb-0">
//                   <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
//                     {resolvedSearchParams.search 
//                       ? `Search Results for "${resolvedSearchParams.search}"` 
//                       : resolvedSearchParams.category
//                       ? `${resolvedSearchParams.category} Products`
//                       : 'All Products'
//                     }
//                   </h2>
//                   <p className="text-gray-600 mt-2 text-lg">
//                     Showing {products.length} of {pagination.total} products
//                     {pagination.pages > 1 && ` • Page ${pagination.current} of ${pagination.pages}`}
//                   </p>
//                 </div>
                
//                 <div className="flex items-center space-x-4">
//                   {/* View Cart Button */}
//                   <div className={styles.animatePulseGentle}>
//                     <CartButton showText={true} />
//                   </div>
                  
//                   {/* Enhanced View Mode Toggle */}
//                   <div className="flex items-center bg-gray-100 rounded-xl p-1 shadow-inner">
//                     <Link
//                       href={`/products?${new URLSearchParams({...resolvedSearchParams, view: 'grid'}).toString()}`}
//                       className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
//                         viewMode === 'grid' ? 'bg-white text-gray-900 shadow-md' : 'text-gray-600 hover:text-gray-900'
//                       }`}
//                     >
//                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
//                       </svg>
//                     </Link>
//                     <Link
//                       href={`/products?${new URLSearchParams({...resolvedSearchParams, view: 'list'}).toString()}`}
//                       className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
//                         viewMode === 'list' ? 'bg-white text-gray-900 shadow-md' : 'text-gray-600 hover:text-gray-900'
//                       }`}
//                     >
//                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
//                       </svg>
//                     </Link>
//                   </div>
//                 </div>
//               </div>

//               {/* Enhanced Products Grid */}
//               <div className={`mb-16 ${viewMode === 'list' ? 'space-y-8' : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10'}`}>
//                 {products.map((product: Product, index: number) => (
//                   <div 
//                     key={product._id} 
//                     className={`bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden group border border-gray-100 ${styles.animateFadeInUp} transform hover:-translate-y-3 hover:scale-102 ${
//                       viewMode === 'list' ? 'flex flex-row' : ''
//                     }`}
//                     style={{ animationDelay: `${index * 0.1}s` }}
//                   >
//                     <Link href={`/products/${product._id}`} className={viewMode === 'list' ? 'flex-shrink-0' : ''}>
//                       <div className={`relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 ${
//                         viewMode === 'list' ? 'w-56 h-56' : 'aspect-square'
//                       }`}>
//                         {product.images && product.images.length > 0 ? (
//                           <Image
//                             src={product.images[0]}
//                             alt={product.name}
//                             fill
//                             sizes={viewMode === 'list' ? '224px' : '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw'}
//                             className="object-cover group-hover:scale-125 transition-transform duration-700 ease-out"
//                           />
//                         ) : (
//                           <div className="flex items-center justify-center h-full text-gray-400">
//                             <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                             </svg>
//                           </div>
//                         )}
                        
//                         {/* Enhanced Badges */}
//                         <div className="absolute top-4 left-4 flex flex-col space-y-2">
//                           {product.featured && (
//                             <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 text-xs font-bold rounded-full shadow-lg animate-pulse transform hover:scale-110 transition-transform">
//                               ⭐ Featured
//                             </div>
//                           )}
//                           {product.stock < 10 && product.stock > 0 && (
//                             <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 text-xs font-bold rounded-full shadow-lg animate-bounce">
//                               Only {product.stock} left!
//                             </div>
//                           )}
//                           {product.stock === 0 && (
//                             <div className="bg-gradient-to-r from-gray-600 to-gray-800 text-white px-4 py-2 text-xs font-bold rounded-full shadow-lg">
//                               Out of Stock
//                             </div>
//                           )}
//                         </div>

//                         {/* Enhanced Quick Actions */}
//                         <div className="absolute top-4 right-4 flex flex-col space-y-3 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-4 group-hover:translate-x-0">
//                           <button className="bg-white bg-opacity-95 p-3 rounded-full shadow-xl hover:shadow-2xl hover:bg-opacity-100 transition-all duration-300 transform hover:scale-110 backdrop-blur-sm">
//                             <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
//                             </svg>
//                           </button>
//                           <button className="bg-white bg-opacity-95 p-3 rounded-full shadow-xl hover:shadow-2xl hover:bg-opacity-100 transition-all duration-300 transform hover:scale-110 backdrop-blur-sm">
//                             <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
//                             </svg>
//                           </button>
//                         </div>

//                         {/* Gradient Overlay on Hover */}
//                         <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
//                       </div>
//                     </Link>
                    
//                     <div className={`p-8 ${viewMode === 'list' ? 'flex-1 flex flex-col justify-between' : ''}`}>
//                       <div>
//                         <Link href={`/products/${product._id}`}>
//                           <h3 className={`font-bold mb-3 text-gray-900 hover:text-blue-600 transition-colors line-clamp-2 group-hover:text-blue-600 ${
//                             viewMode === 'list' ? 'text-2xl' : 'text-xl'
//                           }`}>
//                             {product.name}
//                           </h3>
//                         </Link>
                        
//                         <p className={`text-gray-600 mb-6 line-clamp-2 leading-relaxed ${
//                           viewMode === 'list' ? 'text-lg' : 'text-base'
//                         }`}>
//                           {product.description}
//                         </p>
//                       </div>
                      
//                       {/* Enhanced Price and Stock */}
//                       <div className={`mb-6 ${viewMode === 'list' ? 'flex items-center justify-between' : 'flex justify-between items-center'}`}>
//                         <div className="flex flex-col">
//                           <span className={`font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent ${viewMode === 'list' ? 'text-4xl' : 'text-3xl'}`}>
//                             ${product.price.toFixed(2)}
//                           </span>
//                           <span className={`text-gray-500 font-medium ${viewMode === 'list' ? 'text-lg' : 'text-base'}`}>
//                             {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
//                           </span>
//                         </div>
//                         <div className={viewMode === 'list' ? 'text-left' : 'text-right'}>
//                           <span className="inline-block bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 px-4 py-2 rounded-full text-sm font-bold shadow-sm border border-blue-200">
//                             {product.category}
//                           </span>
//                         </div>
//                       </div>
                      
//                       {/* Enhanced Action Buttons */}
//                       <div className={`flex space-x-3 ${viewMode === 'list' ? 'mt-6' : ''}`}>
//                         <div className="flex-1 transform hover:scale-105 transition-transform duration-200">
//                           <QuickAddToCart product={product} />
//                         </div>
//                         <Link 
//                           href={`/products/${product._id}`}
//                           className="px-6 py-3 border-2 border-blue-200 rounded-xl text-blue-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-300 flex items-center justify-center font-medium shadow-sm hover:shadow-lg transform hover:-translate-y-1"
//                         >
//                           <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//                           </svg>
//                           {viewMode === 'list' ? 'View Details' : ''}
//                         </Link>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               {/* Enhanced Pagination */}
//               <div className={styles.animateFadeInUp}>
//                 <Pagination pagination={pagination} />
//               </div>
//             </>
//           )}
//         </div>
//       </div>

//       {/* Enhanced Floating Cart Button for Mobile */}
//       <div className="fixed bottom-8 right-8 lg:hidden z-50">
//         <div className="animate-bounce hover:animate-none">
//           <CartButton floating={true} />
//         </div>
//       </div>
//     </>
//   );
// }

// // Generate metadata for SEO - Fixed for Next.js 15
// export async function generateMetadata({ searchParams }: ProductsPageProps) {
//   const resolvedSearchParams = await searchParams;
//   const category = resolvedSearchParams.category;
//   const search = resolvedSearchParams.search;
  
//   let title = 'Products - E-Shop | Discover Amazing Deals';
//   let description = 'Browse our curated collection of high-quality products at unbeatable prices. Find electronics, clothing, books, and more.';
  
//   if (category) {
//     title = `${category} Products - E-Shop | Best ${category} Deals`;
//     description = `Shop the best ${category} products at amazing prices. Quality guaranteed with fast shipping.`;
//   }
  
//   if (search) {
//     title = `Search: "${search}" - E-Shop`;
//     description = `Find "${search}" products at E-Shop. Quality products with competitive pricing.`;
//   }

//   return {
//     title,
//     description,
//     openGraph: {
//       title,
//       description,
//       type: 'website',
//     },
//     twitter: {
//       card: 'summary_large_image',
//       title,
//       description,
//     },
//   };
// }


import Link from 'next/link';
import Image from 'next/image';
import SearchFilters from '@/components/product/SearchFilters';
import Pagination from '@/components/ui/Pagination';
import SeedProductsButton from '@/components/product/SeedProductsButton';
import QuickAddToCart from '@/components/product/QuickAddToCart';
import CartButton from '@/components/ui/CartButton';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  images: string[];
  featured: boolean;
  createdAt?: string;
}

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
    page?: string;
    sort?: string;
    order?: string;
    view?: string;
  }>;
}

// Server-side data fetching
async function getProducts(resolvedSearchParams: any) {
  const params = new URLSearchParams();
  
  if (resolvedSearchParams.category) params.append('category', resolvedSearchParams.category);
  if (resolvedSearchParams.search) params.append('search', resolvedSearchParams.search);
  if (resolvedSearchParams.page) params.append('page', resolvedSearchParams.page);
  if (resolvedSearchParams.sort) params.append('sort', resolvedSearchParams.sort);
  if (resolvedSearchParams.order) params.append('order', resolvedSearchParams.order);

  const baseUrl = process.env.NODE_ENV === 'production' 
    ? 'https://your-domain.com' 
    : 'http://localhost:3000';

  try {
    const res = await fetch(`${baseUrl}/api/products?${params}`, {
      next: { revalidate: 60 }
    });

    if (!res.ok) {
      throw new Error('Failed to fetch products');
    }

    return res.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    return { 
      products: [], 
      pagination: { current: 1, pages: 1, total: 0, hasNext: false, hasPrev: false } 
    };
  }
}

// Get categories for quick filter
async function getCategories() {
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? 'https://your-domain.com' 
    : 'http://localhost:3000';

  try {
    const res = await fetch(`${baseUrl}/api/categories`, {
      next: { revalidate: 300 }
    });
    
    if (res.ok) {
      return res.json();
    }
  } catch (error) {
    console.error('Error fetching categories:', error);
  }
  
  // Fallback categories
  return [
    'Electronics', 'Clothing', 'Books', 'Home & Garden', 
    'Sports', 'Beauty', 'Automotive', 'Toys'
  ];
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const resolvedSearchParams = await searchParams;
  const { products, pagination } = await getProducts(resolvedSearchParams);
  const categories = await getCategories();
  const viewMode = resolvedSearchParams.view || 'grid';

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Modern Hero Section */}
        <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 text-white">
          <div className="container mx-auto px-4 py-16 lg:py-24">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                <span className="bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  Discover Amazing Products
                </span>
              </h1>
              <p className="text-lg md:text-xl text-blue-100 mb-8">
                Find exactly what you're looking for from our curated collection of{' '}
                <span className="font-semibold text-yellow-300">{pagination.total}+</span> premium products
              </p>
              
              {/* Call to Action */}
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                <a 
                  href="#products-section"
                  className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Browse Products
                </a>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 max-w-2xl mx-auto">
                <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                  <div className="text-3xl font-bold text-white">{pagination.total}+</div>
                  <div className="text-sm text-blue-200">Products</div>
                </div>
                <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                  <div className="text-3xl font-bold text-white">{categories.length}</div>
                  <div className="text-sm text-blue-200">Categories</div>
                </div>
                <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                  <div className="text-3xl font-bold text-white">24/7</div>
                  <div className="text-sm text-blue-200">Support</div>
                </div>
                <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                  <div className="text-3xl font-bold text-white">Free</div>
                  <div className="text-sm text-blue-200">Shipping</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8" id="products-section">
          {/* Search and Filters */}
          <div className="mb-8">
            <SearchFilters />
          </div>

          {/* Category Filter Chips */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Filters</h3>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/products"
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  !resolvedSearchParams.category 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-white text-gray-700 hover:bg-blue-50 border border-gray-200 hover:border-blue-300'
                }`}
              >
                All Products
              </Link>
              {categories.slice(0, 6).map((category: string) => (
                <Link
                  key={category}
                  href={`/products?category=${encodeURIComponent(category)}`}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    resolvedSearchParams.category === category
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-white text-gray-700 hover:bg-blue-50 border border-gray-200 hover:border-blue-300'
                  }`}
                >
                  {category}
                </Link>
              ))}
            </div>
          </div>

          {/* Products Section */}
          {products.length === 0 ? (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="mb-6">
                  <svg className="w-24 h-24 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">No Products Found</h3>
                <p className="text-gray-600 mb-8">
                  {resolvedSearchParams.search 
                    ? `No products match "${resolvedSearchParams.search}". Try a different search term.`
                    : resolvedSearchParams.category
                    ? `No products found in "${resolvedSearchParams.category}" category.`
                    : "We couldn't find any products. Get started by adding some products."
                  }
                </p>
                <SeedProductsButton />
              </div>
            </div>
          ) : (
            <>
              {/* Products Header with View Toggle */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="mb-4 md:mb-0">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {resolvedSearchParams.search 
                      ? `Search Results for "${resolvedSearchParams.search}"` 
                      : resolvedSearchParams.category
                      ? `${resolvedSearchParams.category} Products`
                      : 'All Products'
                    }
                  </h2>
                  <p className="text-gray-600 mt-1">
                    Showing {products.length} of {pagination.total} products
                    {pagination.pages > 1 && ` • Page ${pagination.current} of ${pagination.pages}`}
                  </p>
                </div>
                
                <div className="flex items-center space-x-4">
                  <CartButton showText={true} />
                  
                  {/* View Mode Toggle */}
                  <div className="flex items-center bg-gray-100 rounded-lg p-1">
                    <Link
                      href={`/products?${new URLSearchParams({...resolvedSearchParams, view: 'grid'}).toString()}`}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        viewMode === 'grid' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                    </Link>
                    <Link
                      href={`/products?${new URLSearchParams({...resolvedSearchParams, view: 'list'}).toString()}`}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        viewMode === 'list' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Products Grid */}
              <div className={`mb-12 ${viewMode === 'list' ? 'space-y-6' : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'}`}>
                {products.map((product: Product) => (
                  <div 
                    key={product._id} 
                    className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-200 group ${
                      viewMode === 'list' ? 'flex flex-row' : ''
                    }`}
                  >
                    <Link href={`/products/${product._id}`} className={viewMode === 'list' ? 'flex-shrink-0' : ''}>
                      <div className={`relative overflow-hidden bg-gray-100 ${
                        viewMode === 'list' ? 'w-48 h-48' : 'aspect-square'
                      }`}>
                        {product.images && product.images.length > 0 ? (
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            sizes={viewMode === 'list' ? '192px' : '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw'}
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-gray-400">
                            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                        
                        {/* Product Badges */}
                        <div className="absolute top-3 left-3 flex flex-col space-y-2">
                          {product.featured && (
                            <div className="bg-red-500 text-white px-2 py-1 text-xs font-semibold rounded">
                              Featured
                            </div>
                          )}
                          {product.stock < 10 && product.stock > 0 && (
                            <div className="bg-orange-500 text-white px-2 py-1 text-xs font-semibold rounded">
                              Low Stock
                            </div>
                          )}
                          {product.stock === 0 && (
                            <div className="bg-gray-600 text-white px-2 py-1 text-xs font-semibold rounded">
                              Out of Stock
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                    
                    <div className={`p-4 ${viewMode === 'list' ? 'flex-1 flex flex-col justify-between' : ''}`}>
                      <div>
                        <Link href={`/products/${product._id}`}>
                          <h3 className={`font-semibold mb-2 text-gray-900 hover:text-blue-600 transition-colors line-clamp-2 ${
                            viewMode === 'list' ? 'text-xl' : 'text-lg'
                          }`}>
                            {product.name}
                          </h3>
                        </Link>
                        
                        <p className={`text-gray-600 mb-3 line-clamp-2 ${
                          viewMode === 'list' ? 'text-base' : 'text-sm'
                        }`}>
                          {product.description}
                        </p>
                      </div>
                      
                      {/* Price and Category */}
                      <div className={`mb-4 ${viewMode === 'list' ? 'flex items-center justify-between' : 'space-y-2'}`}>
                        <div>
                          <span className={`font-bold text-blue-600 ${viewMode === 'list' ? 'text-2xl' : 'text-xl'}`}>
                            ${product.price.toFixed(2)}
                          </span>
                          <div className="text-sm text-gray-500">
                            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                          </div>
                        </div>
                        <div className={viewMode === 'list' ? '' : 'text-right'}>
                          <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                            {product.category}
                          </span>
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex space-x-2">
                        <div className="flex-1">
                          <QuickAddToCart product={product} />
                        </div>
                        <Link 
                          href={`/products/${product._id}`}
                          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors flex items-center justify-center"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <Pagination pagination={pagination} />
            </>
          )}
        </div>
      </div>

      {/* Mobile Floating Cart Button */}
      <div className="fixed bottom-6 right-6 lg:hidden z-50">
        <CartButton floating={true} />
      </div>
    </>
  );
}

// Generate metadata for SEO
export async function generateMetadata({ searchParams }: ProductsPageProps) {
  const resolvedSearchParams = await searchParams;
  const category = resolvedSearchParams.category;
  const search = resolvedSearchParams.search;
  
  let title = 'Products - E-Shop | Discover Amazing Deals';
  let description = 'Browse our curated collection of high-quality products at unbeatable prices. Find electronics, clothing, books, and more.';
  
  if (category) {
    title = `${category} Products - E-Shop | Best ${category} Deals`;
    description = `Shop the best ${category} products at amazing prices. Quality guaranteed with fast shipping.`;
  }
  
  if (search) {
    title = `Search: "${search}" - E-Shop`;
    description = `Find "${search}" products at E-Shop. Quality products with competitive pricing.`;
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}