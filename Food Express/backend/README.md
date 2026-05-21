# Food Express Backend

NestJS backend for Food Express food delivery application.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
DATABASE_URL="postgresql://user:password@localhost:5432/food_express"
JWT_SECRET="your-secret-key-here"
JWT_EXPIRATION="7d"
PORT=3001
NODE_ENV=development
```

3. Setup database:
```bash
npx prisma migrate dev --name init
npm run seed
```

4. Start development server:
```bash
npm run dev
```

## API Endpoints

### Auth
- POST `/auth/register` - Register user
- POST `/auth/login` - Login user
- POST `/auth/refresh` - Refresh token

### Restaurants
- GET `/restaurants` - List all restaurants
- GET `/restaurants/:id` - Get restaurant details
- POST `/restaurants` - Create restaurant (admin)
- PUT `/restaurants/:id` - Update restaurant (admin)

### Menu Items
- GET `/restaurants/:id/menu` - Get restaurant menu
- POST `/menu-items` - Create menu item (admin)
- PUT `/menu-items/:id` - Update menu item (admin)

### Orders
- GET `/orders` - Get user orders
- POST `/orders` - Create order
- GET `/orders/:id` - Get order details
- PUT `/orders/:id/status` - Update order status (admin)

### Reviews
- POST `/reviews` - Create review
- GET `/reviews/:type/:id` - Get reviews

### Admin
- GET `/admin/dashboard` - Dashboard stats
- GET `/admin/orders` - All orders
- GET `/admin/users` - All users
