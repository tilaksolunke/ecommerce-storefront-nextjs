# E-Commerce Storefront - Next.js + MongoDB

A modern, full-featured e-commerce storefront built with Next.js 15, MongoDB, and Stripe integration.

## 🚀 Features

### Customer Features
- **Product Browsing**: Server-side rendered product catalog with pagination
- **Advanced Search**: Search by name, description, or category
- **Smart Filtering**: Filter by categories and price ranges
- **Product Sorting**: Sort by price, name, or newest additions
- **Shopping Cart**: Add, update, and remove items with persistent storage
- **Multi-step Checkout**: Complete checkout flow with Stripe payment integration
- **User Authentication**: Secure login/registration with NextAuth.js
- **Order History**: View complete purchase history and order details
- **Profile Management**: Update personal information

### Admin Features
- **Product Management**: Complete CRUD operations for products
- **Order Management**: View and update all customer orders
- **Inventory Tracking**: Monitor stock levels and availability
- **Role-based Access**: Secure admin-only functionality

## 🛠 Technology Stack

### Frontend/Backend
- **Next.js 15**: Latest App Router with TypeScript
- **React 18**: Server and client components
- **Tailwind CSS**: Modern styling with custom animations
- **NextAuth.js v5**: Authentication and session management

### Database & APIs
- **MongoDB Atlas**: Cloud database with Mongoose ODM
- **Stripe**: Payment processing integration
- **API Routes**: RESTful API endpoints

### UI/UX
- **Responsive Design**: Mobile-first approach
- **Glassmorphism Effects**: Modern visual design
- **Smooth Animations**: Enhanced user experience
- **Professional Typography**: Optimized readability

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ and npm
- MongoDB Atlas account
- Stripe account (for payments)

### 1. Clone Repository
git clone https://github.com/yourusername/ecommerce-storefront-nextjs.git
cd ecommerce-storefront-nextjs

### 2. Install Dependencies
npm install


### 3. Environment Variables
Create `.env.local` file in root directory:
Database
MONGODB_URI=your_mongodb_connection_string

NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
AUTH_SECRET=your_auth_secret

Stripe Keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000

### 4. Run Development Server
npm run dev

Visit `http://localhost:3000` to see the application.
