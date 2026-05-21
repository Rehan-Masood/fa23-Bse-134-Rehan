#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🚀 Food Express Setup Script${NC}\n"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js v18+${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Node.js $(node -v) installed${NC}"

# Check if PostgreSQL is installed or running
if ! command -v psql &> /dev/null; then
    echo -e "${RED}❌ PostgreSQL is not installed. Please install PostgreSQL${NC}"
    exit 1
fi

echo -e "${GREEN}✓ PostgreSQL installed${NC}\n"

# Create database
echo -e "${YELLOW}Creating database...${NC}"
createdb food_express 2>/dev/null || true

# Install frontend dependencies
echo -e "${YELLOW}Installing frontend dependencies...${NC}"
cd frontend
npm install
cd ..

echo -e "${GREEN}✓ Frontend dependencies installed${NC}\n"

# Install backend dependencies
echo -e "${YELLOW}Installing backend dependencies...${NC}"
cd backend
npm install

# Setup .env file
if [ ! -f .env ]; then
    echo -e "${YELLOW}Creating .env file...${NC}"
    cp .env.example .env
    echo -e "${GREEN}✓ Created .env file (please update with your database credentials)${NC}"
fi

# Generate Prisma Client
echo -e "${YELLOW}Generating Prisma Client...${NC}"
npx prisma generate

# Run migrations
echo -e "${YELLOW}Running database migrations...${NC}"
npx prisma migrate deploy || npx prisma migrate dev --skip-generate
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Migration failed. Ensure PostgreSQL is running at 127.0.0.1:5432${NC}"
    exit 1
fi

# Seed database
echo -e "${YELLOW}Seeding database...${NC}"
npx prisma db seed || echo -e "${YELLOW}⚠️ Database may already be seeded, continuing...${NC}"

cd ..

echo -e "${GREEN}✓ Backend setup complete${NC}\n"

echo -e "${GREEN}═══════════════════════════════════════════${NC}"
echo -e "${GREEN}✓ Setup Complete!${NC}"
echo -e "${GREEN}═══════════════════════════════════════════${NC}\n"

echo -e "Next steps:\n"
echo -e "${YELLOW}1. Start the backend:${NC}"
echo "   cd backend && npm run dev"
echo ""
echo -e "${YELLOW}2. In another terminal, start the frontend:${NC}"
echo "   cd frontend && npm run dev"
echo ""
echo -e "${YELLOW}3. Open your browser:${NC}"
echo "   Frontend: http://localhost:3000"
echo "   Backend: http://localhost:3001"
echo "   Admin: http://localhost:3000/admin"
echo ""
echo -e "${YELLOW}Test Credentials:${NC}"
echo "   Email: customer@example.com"
echo "   Password: password123"
echo ""
