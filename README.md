# 🛍️ ShopHub — Full-Stack E-Commerce Platform

> **Live Site:** [https://shop-hub-e-commerce-hoid.vercel.app](https://shop-hub-e-commerce-hoid.vercel.app)
> **GitHub:** [https://github.com/AbdullahK29/ShopHub-E-commerce](https://github.com/AbdullahK29/ShopHub-E-commerce)

A production-deployed, full-stack e-commerce platform built from scratch with Next.js 14, Express.js, PostgreSQL, and Prisma. Features real-time order notifications, JWT authentication, a multi-step checkout flow, and a fully responsive product catalog.

---

## 🔑 Demo Account

You can log in and explore the full site without creating an account:

| Field    | Value             |
|----------|-------------------|
| Email    | `aa@gmail.com`    |
| Password | `Azsxdcfv12@`     |

---

## 📸 Screenshots


| Homepage | Products | Checkout | Orders | Settings |
|----------|----------|----------|--------|----------|
| ![Homepage](public/screenshots/homepage.png) | ![Products](public/screenshots/products.png) | ![Checkout](public/screenshots/checkout.png) | ![Orders](public/screenshots/orders.png) | ![Settings](public/screenshots/settings.png) |

---

## ⚙️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **Next.js 14+** | React framework with App Router, server components, and `'use client'` boundaries |
| **TypeScript** | Full type safety across all components, hooks, and API calls |
| **Tailwind CSS** | Utility-first styling with responsive grid layouts |
| **Redux Toolkit** | Global state management for cart, auth, and UI state |
| **Formik + Yup** | Multi-step form handling with schema-based validation |
| **Axios** | HTTP client with request/response interceptors and auto token injection |
| **Socket.IO Client** | Real-time order status updates via WebSocket |

### Backend
| Technology | Purpose |
|---|---|
| **Node.js + Express.js** | REST API server with modular route/controller/middleware architecture |
| **TypeScript** | Typed request handlers, middleware, and service layer |
| **PostgreSQL** | Relational database hosted on Railway |
| **Prisma ORM** | Type-safe database queries, migrations, and seeding |
| **JWT (jsonwebtoken)** | Stateless authentication with access tokens stored in localStorage |
| **bcryptjs** | Password hashing with salt rounds |
| **Zod** | Request body validation middleware on all routes |
| **Socket.IO** | Real-time WebSocket server for order notifications |

### Infrastructure & Deployment
| Service | Role |
|---|---|
| **Vercel** | Frontend deployment with automatic CI/CD from GitHub |
| **Railway** | Backend (Express) + PostgreSQL database hosting |
| **GitHub** | Version control and source of truth for both deployments |

---

## 🗂️ Project Structure

```
ShopHub-E-commerce/
├── src/                          # Frontend (Next.js)
│   ├── app/                      # App Router pages
│   │   ├── page.tsx              # Homepage
│   │   ├── products/             # Product listing + detail pages
│   │   ├── checkout/             # Multi-step checkout (shipping → payment → review)
│   │   ├── login/                # Auth pages
│   │   └── dashboard/            # User order history
│   ├── components/
│   │   ├── common/               # Button, Input, Badge, Toast, Modal
│   │   └── Product/              # ProductCard component
│   ├── store/
│   │   ├── index.ts              # Redux store configuration
│   │   └── slices/
│   │       ├── cartSlice.ts      # Cart state: items, total, itemCount
│   │       ├── authSlice.ts      # Auth state: user, token
│   │       └── uiSlice.ts        # UI state: modals, search
│   ├── services/
│   │   ├── api.ts                # Axios instance with auth interceptor
│   │   ├── productService.ts     # Product API calls
│   │   └── cartService.ts        # Cart sync utilities
│   ├── hooks/
│   │   ├── useAppSelector.ts     # Typed Redux selector hook
│   │   ├── useAppDispatch.ts     # Typed Redux dispatch hook
│   │   └── useDebounce.ts        # Search input debounce
│   └── types/
│       └── index.ts              # Shared TypeScript interfaces
│
├── backend/                      # Backend (Express.js)
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── authController.ts
│   │   │   ├── productController.ts
│   │   │   ├── orderController.ts
│   │   │   └── cartController.ts
│   │   ├── routes/               # Express routers per resource
│   │   ├── middleware/
│   │   │   ├── auth.ts           # JWT verification middleware
│   │   │   └── validate.ts       # Zod schema validation middleware
│   │   ├── utils/
│   │   │   ├── AppError.ts       # Custom error classes
│   │   │   ├── response.ts       # Standardised API response helpers
│   │   │   └── pagination.ts     # Reusable pagination utility
│   │   └── index.ts              # Express + Socket.IO server entry point
│   └── prisma/
│       ├── schema.prisma         # Database schema
│       └── seed.ts               # Seed script (15 real products)
```

---

## ✨ Features

### Shopping
- Browse **15 products** across 6 categories: Laptops, Audio, Phones, Tablets, Wearables, Monitors
- Real-time search with **400ms debounce** — no API spam
- Filter by category with instant UI feedback
- Discount pricing with percentage badges (`-8%`, `-15%` etc.)
- Out-of-stock detection and low-stock warnings (`Only 3 left!`)
- Wishlist toggle per product card

### Cart
- Add/remove/update quantity — all managed in Redux
- Cart persists during the session across page navigation
- Cart drawer with live item count in navbar
- Automatic total, tax (8%), and shipping calculation (free over $50)

### Checkout
- **3-step flow:** Shipping Address → Payment Details → Order Review
- Form validation at every step with Formik + Yup
- Test card support: `4242 4242 4242 4242`
- Order placed via REST API — items sent from Redux cart directly to backend
- Cart cleared automatically after successful order

### Authentication
- Register and login with JWT tokens
- Token stored in `localStorage`, auto-injected into every API request via Axios interceptor
- Auto-redirect to `/login` on 401 responses
- Role-based access: `CUSTOMER` and `ADMIN`

### Orders
- Full order history in user dashboard
- Order detail page with status tracking
- Cancel orders in `PENDING` or `PROCESSING` status
- Real-time `orderCreated` event via Socket.IO after successful checkout

---

## 🚀 Running Locally

### Prerequisites
- Node.js 18+
- PostgreSQL database (or use Railway)
- npm or yarn

### 1. Clone the repo
```bash
git clone https://github.com/AbdullahK29/ShopHub-E-commerce.git
cd ShopHub-E-commerce
```

### 2. Install frontend dependencies
```bash
npm install
```

### 3. Set up frontend environment
Create `.env.local` in the root:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 4. Install backend dependencies
```bash
cd backend
npm install
```

### 5. Set up backend environment
Create `.env` in `backend/`:
```env
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
FRONTEND_URL=http://localhost:3000
```

### 6. Run Prisma migrations and seed
```bash
cd backend
npx prisma migrate deploy
npx prisma db seed
```

### 7. Start both servers

**Backend** (from `backend/`):
```bash
npm run dev
```

**Frontend** (from root):
```bash
npm run dev
```

Frontend runs at `http://localhost:3000`, backend at `http://localhost:5000`.

---

## 🗄️ Database Schema (Key Tables)

| Table | Description |
|---|---|
| `User` | Customers and admins with hashed passwords |
| `Product` | 15 seeded products with images, pricing, stock, ratings |
| `Category` | 6 categories linked to products |
| `Order` | Order header with totals, status, shipping address |
| `OrderItem` | Line items per order (productId, quantity, unitPrice) |
| `Cart` | Per-user cart (DB-side, for future sync features) |
| `CartItem` | Items inside a DB cart |
| `Payment` | Payment records linked to orders |
| `Shipment` | Shipping tracking info per order |

---

## 🔌 API Endpoints

### Auth
```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me
```

### Products
```
GET    /api/products              # All products (supports ?limit=&category=&search=)
GET    /api/products/:id          # Single product detail
```

### Orders
```
POST   /api/orders                # Create order (requires auth)
GET    /api/orders                # User's order history (requires auth)
GET    /api/orders/:id            # Single order detail (requires auth)
PATCH  /api/orders/:id/cancel     # Cancel order (requires auth)
```

### Cart
```
GET    /api/cart                  # Get user's DB cart
POST   /api/cart/items            # Add item to DB cart
PUT    /api/cart/items/:productId # Update quantity
DELETE /api/cart/items/:productId # Remove item
DELETE /api/cart                  # Clear cart
```

---

## 🐛 Key Bugs Solved During Development

| Bug | Root Cause | Fix |
|---|---|---|
| Double `/api/api/` in URLs | `baseURL` already included `/api` but routes also added it | Removed `/api` prefix from all route calls |
| Cart always empty at checkout | Backend read from DB cart; frontend used Redux cart | Changed backend to accept `items[]` in request body |
| Zod stripping `items` field | `CreateOrderSchema` didn't include `items` | Added `items` array to Zod schema |
| Login 500 error after hook fix | `useAppSelector` called inside event handler (breaks Rules of Hooks) | Moved selector to top level of component |
| Prisma v7 incompatibility | Breaking changes in Prisma v7 adapter API | Pinned compatible Prisma version |
| Next.js async params | Next.js 16 made route params async | Awaited `params` in dynamic route pages |
| Tailwind v4 syntax errors | v4 changed config and utility class syntax | Migrated to v4-compatible syntax |
| Railway DB not connecting | Database not linked to backend service in Railway | Linked via Railway's internal `DATABASE_URL` variable |

---

## 👤 Author

**Abdullah Khan**
BSCS Student — Bahria University Islamabad, Semester 5

- GitHub: [@AbdullahK29](https://github.com/AbdullahK29)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
