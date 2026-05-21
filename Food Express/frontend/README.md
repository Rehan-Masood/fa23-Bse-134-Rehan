# Food Express Frontend

Next.js 14 frontend for Food Express.

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Environment

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL="http://localhost:3001/api"
```

## Build

```bash
npm run build
npm start
```

## Vercel

- Root directory: `frontend`
- Install command: `npm install`
- Build command: `npm run build`
- Environment variable: `NEXT_PUBLIC_API_URL=https://YOUR-BACKEND-URL.com/api`
