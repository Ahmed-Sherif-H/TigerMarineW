# Deployment Guide

## Frontend (Netlify)

### 1. Environment Variables

**CRITICAL:** Set in Netlify dashboard → Site settings → Environment variables:

```
VITE_API_URL=https://tigermarinewbackend.onrender.com/api
```

**IMPORTANT:** After setting the variable, you MUST redeploy for it to take effect!

### 2. Build Settings

- **Build command:** `npm run build`
- **Publish directory:** `dist`
- **Node version:** 18.x or higher

### 3. Required Files

- `public/_redirects` - Must contain: `/*    /index.html   200`

### 4. Deployment Steps

1. Push code to GitHub
2. Netlify auto-deploys from GitHub
3. Set environment variable `VITE_API_URL`
4. Trigger manual redeploy
5. Verify deployment

## Backend (Render)

### 1. Environment Variables

Set in Render dashboard → Your service → Environment:

```
DATABASE_URL=your-postgresql-connection-string
FRONTEND_URL=https://tigermarineweb.netlify.app
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
CONTACT_EMAIL=ahmed.sh.hammam@gmail.com
NODE_ENV=production
PORT=10000
```

### 2. Build Settings

- **Build command:** `npm install && npm run prisma:generate`
- **Start command:** `npm start`

### 3. Database

- Use Render PostgreSQL (or external database)
- Run migrations: `npm run prisma:migrate` (first deployment)

### 4. CORS Configuration

Backend automatically allows:
- `FRONTEND_URL` environment variable
- `https://tigermarineweb.netlify.app` (hardcoded)
- Local development URLs

## Verification Checklist

- [ ] Frontend loads without errors
- [ ] Backend health check: `https://tigermarinewbackend.onrender.com/api/health`
- [ ] Models load in frontend
- [ ] Images display correctly
- [ ] Admin Dashboard accessible
- [ ] Contact form works
- [ ] Image uploads work

## Troubleshooting

### API Connection Errors

1. Check `VITE_API_URL` in Netlify
2. Verify backend is running on Render
3. Check browser console for `[API]` logs

### CORS Errors

1. Verify `FRONTEND_URL` in Render
2. Check backend logs for CORS warnings
3. Ensure backend service is running

### Images Not Loading

1. Images served from backend: `backend/public/images/`
2. Use Admin Dashboard to upload/update images
3. Check image filenames in database

