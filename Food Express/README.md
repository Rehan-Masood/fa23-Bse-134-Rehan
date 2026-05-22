# Food Express

Food Express is a food delivery project with a Next.js frontend, NestJS backend, Prisma ORM, and PostgreSQL. The current standard setup is:

- Frontend: Next.js on `http://localhost:3000`
- Backend: NestJS on `http://localhost:3001/api`
- API docs: `http://localhost:3001/api/docs`
- Database: PostgreSQL through Prisma, ready for Neon

## Live Demo
 [Food Express](./Food%20Express)   | [Live Demo](https://web-technologies-o4aw.vercel.app) |

## Screenshots
1.
![1.](./Screenshots/1.png)
2.
![2.](./Screenshots/2.png)
3.
![3.](./Screenshots/3.png)
4.1
![4.1](./Screenshots/4.1.png)
4.2
![4.2](./Screenshots/4.2.png)
5.
![5.](./Screenshots/5.png)
6.
![6.](./Screenshots/6.png)
7.
![7.](./Screenshots/7.png)
8.
![8.](./Screenshots/8.png)
9.
![9.](./Screenshots/9.png)
10.
![10.](./Screenshots/10.png)
11.
![11.](./Screenshots/11.png)
12.
![12.](./Screenshots/12.png)
13.
![13.](./Screenshots/13.png)
14.
![14.](./Screenshots/14.png)
15.
![15.](./Screenshots/15.png)
16.
![16.](./Screenshots/16.png)
17.
![17.](./Screenshots/17.png)
18.
![18.](./Screenshots/18.png)
19.
![19.](./Screenshots/19.png)
20.
![20.](./Screenshots/20.png)
21.
![21.](./Screenshots/21.png)
22.
![22.](./Screenshots/22.png)
23.
![23.](./Screenshots/23.png)
24.
![24.](./Screenshots/24.png)
25.
![26.](./Screenshots/26.png)
27.
![27.](./Screenshots/27.png)

## Project Structure

```text
Food Express/
  backend/
    src/
    prisma/
      schema.prisma
      migrations/
      seed.ts
    .env.example
    Dockerfile
  frontend/
    app/
    components/
    hooks/
    lib/
    stores/
    types/
    .env.example
    next.config.js
  docker-compose.yml
  README.md
```

## Local Setup

Backend:

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
npm run dev
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Production build checks:

```bash
cd backend && npm run build
cd frontend && npm run build
```

## Environment Variables

`backend/.env`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST/neondb?sslmode=require"
JWT_SECRET="strong-secret"
JWT_EXPIRATION="7d"
PORT=3001
NODE_ENV="development"
FRONTEND_URL="http://localhost:3000"
```

`frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL="http://localhost:3001/api"
```

Do not expose `DATABASE_URL`, `JWT_SECRET`, or other backend secrets in frontend files.

## Test Accounts

Seed creates these users:

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@foodexpress.com` | `admin123` |
| Customer | `customer@example.com` | `password123` |
| Delivery person | `delivery@foodexpress.com` | `delivery123` |

## Main API Routes

- Auth: `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/profile`
- Restaurants: `GET /api/restaurants`, `GET /api/restaurants/:id`, `GET /api/restaurants/:id/menu`
- Menu items: `GET /api/menu-items`, `GET /api/menu-items/:id`
- Cart: `GET /api/cart`, `POST /api/cart/add`, `PATCH /api/cart/:id`, `DELETE /api/cart/:id`
- Orders: `GET /api/orders`, `POST /api/orders`, `GET /api/orders/:id`, `PATCH /api/orders/:id/status`
- Reviews: `GET /api/reviews`, `POST /api/reviews`
- Admin: `GET /api/admin/dashboard`, `GET /api/admin/orders`, `GET /api/admin/users`, `GET /api/admin/restaurants`
- Delivery: `GET /api/delivery/orders`, `POST /api/delivery/orders/:id/accept`, `POST /api/delivery/orders/:id/reject`, `PATCH /api/delivery/orders/:id/status`, `GET /api/delivery/earnings`, `GET /api/delivery/history`, `GET /api/delivery/profile`

## Completed Features

- JWT login, signup, logout, profile, and role-based guards.
- Prisma PostgreSQL schema with customer, admin, and delivery-person roles.
- Cart, restaurant, menu, order, review, promotion, admin, and delivery API surfaces.
- Seeded restaurants, menu items, orders, promotions, reviews, and delivery assignment data.
- Premium orange Food Express UI direction with customer discovery, cart, checkout, orders, admin dashboard, and delivery app screens.
- Vercel-ready frontend build using `NEXT_PUBLIC_API_URL`.
- Backend build and production start script for Render/Railway/Fly.io style hosting.

## Known Limitations

- Admin CRUD is API-ready for restaurants and order status; full UI CRUD for menu items, categories, promotions, reviews, reports, and settings is not complete.
- Favorites and saved address management exist in the schema but do not yet have complete frontend management screens.
- Payment is checkout metadata only; no real payment provider is integrated.
- Delivery route/map sections are styled placeholders; no live map provider is integrated.
- Email verification, password reset, and refresh-token rotation are not implemented.

## Vercel Frontend Deployment

Use these Vercel settings:

- Root directory: `frontend`
- Install command: `npm install`
- Build command: `npm run build`
- Environment variable: `NEXT_PUBLIC_API_URL=https://YOUR-BACKEND-URL.com/api`

## Backend Deployment

Use these settings on Render, Railway, Fly.io, or another Node backend host:

- Root directory: `backend`
- Build command: `npm install && npx prisma generate && npm run build`
- Start command: `npm run start:prod`
- Production migration command: `npx prisma migrate deploy`

Production environment variables:

```env
DATABASE_URL="Neon PostgreSQL connection string"
JWT_SECRET="strong-production-secret"
JWT_EXPIRATION="7d"
PORT=3001
NODE_ENV="production"
FRONTEND_URL="https://YOUR-VERCEL-FRONTEND.vercel.app"
```

## Verification Checklist

- `npm install` passes in `backend` and `frontend`.
- `npx prisma generate` passes.
- `npx prisma migrate dev --name init` passes locally after the database is in sync.
- `npx prisma db seed` creates all test accounts.
- `npm run build` passes in `backend` and `frontend`.
- Backend starts at `http://localhost:3001/api`.
- Frontend starts at `http://localhost:3000`.
- Customer login, restaurant loading, cart, checkout, and orders work.
- Admin login and dashboard API work.
- Delivery login, available orders, and earnings API work.
