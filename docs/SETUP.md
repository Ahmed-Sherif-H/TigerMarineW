# Complete Setup Guide

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (local or cloud)
- Git

## Frontend Setup

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Environment Configuration

Create `.env` file in `frontend/`:

```env
# Local development
VITE_API_URL=http://localhost:3001/api

# Production (set in Netlify)
# VITE_API_URL=https://tigermarinewbackend.onrender.com/api
```

### 3. Run Development Server

```bash
npm run dev
```

Frontend will be available at: http://localhost:5173

## Backend Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Configuration

Create `.env` file in `backend/`:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/tigermarine

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173

# Email Configuration (for contact forms)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
CONTACT_EMAIL=ahmed.sh.hammam@gmail.com

# Server
PORT=3001
NODE_ENV=development
```

### 3. Database Setup

```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# (Optional) Seed database
npm run prisma:seed
```

### 4. Run Development Server

```bash
npm run dev
```

Backend will be available at: http://localhost:3001

## Testing Locally

### 1. Start Both Servers

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

### 2. Test Endpoints

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3001/api/health
- **Admin Dashboard:** http://localhost:5173/admin

### 3. Verify Connection

1. Open browser console
2. Look for `[API] Backend URL: http://localhost:3001/api`
3. Check that models load correctly
4. Test image uploads in Admin Dashboard

## Production Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## Troubleshooting

See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for common issues and solutions.

