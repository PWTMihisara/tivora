# TIVORA — Considered Clothing

**A luxury fashion e-commerce store built with modern full-stack technologies**

<div align="center">
  <img src="./public/tivora-logo.png" alt="TIVORA Logo" height="80"/>
</div>

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-FF6B35?style=for-the-badge&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Resend](https://img.shields.io/badge/Resend-000000?style=for-the-badge&logoColor=white)

</div>

---

## 📌 Overview

TIVORA is a full-stack luxury clothing e-commerce platform featuring a refined shopping experience, real-time inventory management, customer accounts, and a powerful admin dashboard — all in a single-page application with smooth view transitions.

The storefront is built around a minimal editorial aesthetic with dark mode support, full mobile responsiveness, and a seamless checkout flow powered by Supabase with real email confirmations via Resend.

---

## ✨ Features

**🛍️ Storefront**
- 3-variant home hero with marquee scroll and animated CTA
- Product listing with gender + category filters, sort, and live search
- Product detail pages with image gallery, size selector, and accordion specs
- Slide-in cart drawer with line quantity controls
- Wishlist drawer with persistent state
- Smooth SPA view transitions — no page reloads

**👤 Customer Accounts**
- Sign up / Sign in via Supabase Auth
- Order history with icon tabs — All, Processing, Shipped, Delivered, Returns
- Multiple saved addresses with default selection
- Address autofill at checkout including phone number
- Profile name editing

**🛒 Checkout & Orders**
- Saved address picker with one-click autofill
- Order confirmation page with itemised summary
- Automatic order confirmation email to customer
- Admin alert email on every new order via Resend

**🌙 Dark Mode**
- Toggle on desktop (right nav) and mobile (beside cart icon)
- Persists across sessions via localStorage
- Full CSS invert — works seamlessly across all pages

**📦 Admin Dashboard** *(protected route — `/admin`)*
- KPI cards: Total Orders, Revenue, Active Customers, Avg Order Value
- Orders table with status management and detailed order panel
- Inventory management with per-variant stock and restock functionality
- Analytics with 30-day revenue and order trend charts
- Customer panel with full profile and order history
- Collections management with image upload

---

## 📂 Folder Structure

```
tivora/
├── public/                    # Static assets (logo, product images)
├── src/
│   ├── app/
│   │   ├── admin/             # Admin dashboard (protected)
│   │   ├── api/
│   │   │   ├── account/       # Customer orders & addresses API
│   │   │   ├── collections/   # Collections CRUD API
│   │   │   ├── inventory/     # Inventory management API
│   │   │   ├── orders/        # Order creation & management API
│   │   │   ├── products/      # Products & image upload API
│   │   │   └── upload/        # File upload handler
│   │   ├── globals.css        # Global styles + responsive breakpoints
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # SPA router — view switcher
│   ├── components/
│   │   ├── account/           # Account view (orders, addresses, profile)
│   │   ├── auth/              # Sign in / Sign up modal
│   │   ├── checkout/          # Checkout form with saved address picker
│   │   ├── collections/       # Collections browse view
│   │   ├── confirmation/      # Order confirmation page
│   │   ├── home/              # Home hero (3 variants) + featured grid
│   │   ├── pdp/               # Product detail page
│   │   ├── plp/               # Product listing with filters
│   │   ├── CartDrawer.tsx     # Slide-in cart
│   │   ├── Footer.tsx         # Dark 4-col footer
│   │   ├── Header.tsx         # Sticky header with dark mode toggle
│   │   ├── ProductCard.tsx    # Card with wishlist + quick-add hover
│   │   ├── SearchOverlay.tsx  # Full-screen search overlay
│   │   └── WishlistDrawer.tsx # Slide-in wishlist drawer
│   ├── data/
│   │   └── products.ts        # Product seed data
│   ├── lib/
│   │   ├── email.ts           # Resend email helpers
│   │   └── supabase.ts        # Supabase client + admin client
│   ├── store/
│   │   └── useStore.ts        # Zustand store — all state + actions
│   └── types/
│       └── index.ts           # TypeScript type definitions
```

---

## 🚀 Quick Start

### ✅ Prerequisites
- Node.js 18+
- A [Supabase](https://supabase.com) project
- A [Resend](https://resend.com) account for transactional emails

### ⚙️ Setup

```bash
git clone https://github.com/PWTMihisara/tivora.git
cd tivora
npm install
```

Create a `.env.local` file in the root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
RESEND_API_KEY=your_resend_api_key
ADMIN_EMAIL=your_admin_email
ADMIN_PASSWORD=your_admin_password
```

### ▶️ Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the storefront.
Admin dashboard at [http://localhost:3000/admin](http://localhost:3000/admin).

### 📦 Build for Production

```bash
npm run build
```

---

## 🗄️ Database Setup

Run the following in your Supabase SQL Editor:

```sql
-- Orders
create table orders (
  id text primary key,
  customer text, email text, phone text,
  address text, status text default 'Pending',
  payment text, subtotal numeric, shipping numeric,
  tax numeric, total numeric,
  created_at timestamptz default now()
);

-- Order items
create table order_items (
  id uuid default gen_random_uuid() primary key,
  order_id text references orders(id),
  product_name text, size text, qty int, price numeric
);

-- Inventory
create table products (id text primary key, name text, category text);
create table inventory (
  id uuid default gen_random_uuid() primary key,
  product_id text references products(id),
  variant text, stock int default 0
);

-- Customer addresses
create table addresses (
  id uuid default gen_random_uuid() primary key,
  user_id uuid, label text, name text,
  address text, city text, zip text, phone text,
  is_default boolean default false
);
```

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Background | `#fdfdfc` |
| Primary text | `#0a0a0a` |
| Muted text | `#6b6b6b` / `#9a9a96` |
| Accent light | `#e7e5e0` / `#dcd9d2` |
| Footer background | `#0a0a0a` |
| Heading font | Archivo (500–900) |
| Body font | Inter (400–700) |
| Accent font | Playfair Display (italic) |

---

## 👤 Author

- [@PWTMihisara](https://github.com/PWTMihisara)

---

## 📫 Contact

For feedback or questions, reach out via GitHub — [@PWTMihisara](https://github.com/PWTMihisara)
