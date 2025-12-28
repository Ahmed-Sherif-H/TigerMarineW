# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### 1. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env  # Edit with your API URL
npm run dev
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env  # Edit with your database URL
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

### 3. Test Everything
```bash
# Windows
.\scripts\test-local.ps1

# Linux/Mac
./scripts/test-local.sh
```

## 📚 Full Documentation

- **Setup:** [docs/SETUP.md](./docs/SETUP.md)
- **Deployment:** [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md)
- **Troubleshooting:** [docs/TROUBLESHOOTING.md](./docs/TROUBLESHOOTING.md)
- **Testing:** [docs/TESTING.md](./docs/TESTING.md)

## 🔧 Environment Variables

**Frontend (.env):**
```
VITE_API_URL=http://localhost:3001/api
```

**Backend (.env):**
```
DATABASE_URL=postgresql://...
FRONTEND_URL=http://localhost:5173
EMAIL_USER=...
EMAIL_PASSWORD=...
```

## ✅ Verify Setup

1. Backend running: http://localhost:3001/api/health
2. Frontend running: http://localhost:5173
3. Admin Dashboard: http://localhost:5173/admin

## 🆘 Need Help?

Check [docs/TROUBLESHOOTING.md](./docs/TROUBLESHOOTING.md) for common issues.

