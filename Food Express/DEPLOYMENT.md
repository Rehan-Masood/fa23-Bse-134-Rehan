# Deployment Guide

This guide covers deploying Food Express to production environments.

## Prerequisites

- Docker and Docker Compose
- A PostgreSQL database (managed or self-hosted)
- Server with Node.js runtime (for non-Docker deployments)
- Domain name and SSL certificate

## Deployment Options

### Option 1: Docker Compose (Recommended)

#### Step 1: Clone Repository

```bash
git clone <repository-url>
cd Food Express
```

#### Step 2: Configure Environment

Create `.env.production` with production variables:

```bash
# Database
DATABASE_URL=postgresql://user:password@db.example.com:5432/food_express_prod

# JWT
JWT_SECRET=your-long-random-secret-key-here
JWT_EXPIRATION=7d

# API
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://foodexpress.com

# Database
DB_USER=postgres
DB_PASSWORD=your-secure-password
```

#### Step 3: Build and Deploy

```bash
# Build Docker images
docker-compose -f docker-compose.yml build

# Start services
docker-compose up -d

# Check logs
docker-compose logs -f
```

#### Step 4: Run Migrations

```bash
docker-compose exec backend npx prisma migrate deploy
```

### Option 2: Cloud Deployment (Vercel + Render)

#### Frontend (Vercel)

1. Push code to GitHub
2. Connect to Vercel
3. Set environment variables
4. Deploy automatically on push

```bash
npm run build
vercel deploy --prod
```

#### Backend (Render)

1. Create new Web Service on Render
2. Connect GitHub repository
3. Set build command: `npm run build`
4. Set start command: `npm start`
5. Add environment variables
6. Deploy

### Option 3: Traditional VPS (Ubuntu/CentOS)

#### Step 1: Server Setup

```bash
# Update system
sudo apt update && apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install nodejs -y

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# Install Nginx
sudo apt install nginx -y
```

#### Step 2: Create Application User

```bash
sudo useradd -m -s /bin/bash foodexpress
sudo su - foodexpress
```

#### Step 3: Clone and Setup

```bash
git clone <repository-url>
cd Food Express
cp .env.example .env

# Edit .env with production values
nano .env

# Install dependencies
npm install
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
```

#### Step 4: Setup Database

```bash
# Create PostgreSQL user
sudo -u postgres createuser foodexpress_user
sudo -u postgres createdb -O foodexpress_user food_express_prod

# Run migrations
cd backend
npx prisma migrate deploy
cd ..
```

#### Step 5: Configure Nginx

```bash
# Create Nginx config
sudo nano /etc/nginx/sites-available/foodexpress
```

Add this configuration:

```nginx
server {
    listen 80;
    server_name foodexpress.com www.foodexpress.com;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### Step 6: Enable SSL (Let's Encrypt)

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d foodexpress.com -d www.foodexpress.com
```

#### Step 7: Process Manager (PM2)

```bash
npm install -g pm2

# Start applications
cd backend && pm2 start npm --name food-express-api -- run start
cd ../frontend && pm2 start npm --name food-express-web -- run start

# Save PM2 configuration
pm2 save

# Enable on reboot
pm2 startup
```

## Monitoring & Maintenance

### Health Checks

```bash
# Check application status
curl http://localhost:3001/health

# Check database connection
npm run healthcheck
```

### Backup Database

```bash
# Daily backup script
0 2 * * * /home/foodexpress/backup-db.sh
```

Create `backup-db.sh`:

```bash
#!/bin/bash
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
pg_dump food_express_prod | gzip > /backups/food_express_$TIMESTAMP.sql.gz
```

### Log Rotation

Configure logrotate for application logs:

```bash
sudo nano /etc/logrotate.d/foodexpress
```

```
/home/foodexpress/.pm2/logs/*.log {
    daily
    rotate 14
    compress
    delaycompress
    notifempty
    create 640 foodexpress foodexpress
}
```

## Performance Optimization

### CDN Setup

Use CloudFront or Cloudflare for:
- Static asset caching
- Image optimization
- DDoS protection

### Database Optimization

```bash
# Index frequently queried columns
npx prisma db execute < create-indexes.sql

# Monitor slow queries
sudo nano /etc/postgresql/13/main/postgresql.conf
# Uncomment: log_min_duration_statement = 1000
```

### Caching Strategy

Use Redis for:
- Session storage
- Rate limiting
- Order cache

```bash
# Install Redis
sudo apt install redis-server -y

# Start Redis
sudo systemctl start redis-server
```

## Security Checklist

- [ ] Change default passwords
- [ ] Enable SSL/TLS certificates
- [ ] Configure firewall rules
- [ ] Setup DDoS protection
- [ ] Enable database backups
- [ ] Configure log aggregation
- [ ] Setup monitoring alerts
- [ ] Regular security updates
- [ ] API rate limiting
- [ ] Input validation

## Troubleshooting

### Application Won't Start

```bash
# Check logs
pm2 logs food-express-api

# Verify environment variables
env | grep DATABASE_URL
```

### Database Connection Issues

```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Test connection
psql -U foodexpress_user -d food_express_prod
```

### SSL Certification Issues

```bash
# Renew certificate
sudo certbot renew --dry-run

# Renew manually
sudo certbot renew --force-renewal
```

## Performance Metrics

Monitor these key metrics:

- Response time (< 500ms target)
- Error rate (< 0.1% target)
- Database queries/sec
- Memory usage
- CPU usage
- Uptime (99.9% target)

## Rollback Procedure

```bash
# If deployment fails
git revert <commit-hash>
npm run build
pm2 reload food-express-api food-express-web
```

## Support

For deployment issues, refer to:
- NestJS Deployment: https://docs.nestjs.com/deployment
- Next.js Deployment: https://nextjs.org/docs/deployment
- Prisma Deployment: https://www.prisma.io/docs/guides/deployment
