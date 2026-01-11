# Railway + Netlify Deployment Guide

This guide explains how to configure your application after deploying the backend to Railway and frontend to Netlify.

## 🚂 Railway Backend Configuration

### 1. Environment Variables in Railway

In your Railway project dashboard, go to **Variables** tab and add these environment variables:

```bash
# Database (Railway automatically provides this, but verify it exists)
DATABASE_URL=postgresql://user:password@host:port/database

# Server Port (Railway sets this automatically, but you can override)
PORT=3001

# Frontend URL (your Netlify domain)
FRONTEND_URL=https://tigermarineweb.netlify.app

# Node Environment
NODE_ENV=production
```

**Important Notes:**
- Railway automatically provides `DATABASE_URL` when you add a PostgreSQL service
- Railway automatically sets `PORT` - you usually don't need to set it manually
- Make sure `FRONTEND_URL` matches your exact Netlify domain (no trailing slash)

### 2. Get Your Railway Backend URL

After deploying to Railway, you'll get a URL like:
- `https://your-project-name.up.railway.app`

**Important:** Railway URLs typically don't include `/api` - your backend should be accessible at:
- `https://your-project-name.up.railway.app/api/health`

### 3. Verify Backend is Running

1. Go to your Railway project dashboard
2. Check the **Deployments** tab to ensure deployment succeeded
3. Click on the service and check **Logs** for any errors
4. Test the health endpoint: `https://your-railway-url.railway.app/api/health`

---

## 🌐 Netlify Frontend Configuration

### 1. Environment Variables in Netlify

1. Go to your Netlify site dashboard
2. Navigate to **Site configuration** → **Environment variables**
3. Add the following variable:

```bash
VITE_API_URL=https://your-railway-url.railway.app/api
```

**Replace `your-railway-url.railway.app` with your actual Railway backend URL!**

### 2. Important Notes

- **No trailing slash** on the URL: `https://...railway.app/api` ✅ (not `/api/`)
- The variable name **must** be `VITE_API_URL` (Vite requires the `VITE_` prefix)
- After adding/updating environment variables, you **must redeploy** your site

### 3. Redeploy After Environment Variable Changes

1. Go to **Deploys** tab in Netlify
2. Click **Trigger deploy** → **Deploy site**
3. Or push a new commit to trigger automatic deployment

---

## ✅ Verification Checklist

### Backend (Railway)
- [ ] Backend is deployed and running
- [ ] `DATABASE_URL` is set (automatically by Railway)
- [ ] `FRONTEND_URL` is set to your Netlify domain
- [ ] Health endpoint works: `https://your-railway-url.railway.app/api/health`
- [ ] CORS is configured correctly (check backend logs)

### Frontend (Netlify)
- [ ] `VITE_API_URL` is set to `https://your-railway-url.railway.app/api`
- [ ] Site has been redeployed after setting environment variable
- [ ] Frontend can connect to backend (check browser console)
- [ ] Images load correctly from backend

---

## 🔍 Troubleshooting

### Frontend can't connect to backend

1. **Check environment variable:**
   - Go to Netlify → Environment variables
   - Verify `VITE_API_URL` is set correctly
   - Make sure there's no trailing slash

2. **Check backend URL:**
   - Test backend directly: `https://your-railway-url.railway.app/api/health`
   - Should return JSON: `{"status":"ok",...}`

3. **Check CORS:**
   - Open browser console on your Netlify site
   - Look for CORS errors
   - Verify `FRONTEND_URL` in Railway matches your Netlify domain exactly

4. **Redeploy:**
   - After changing environment variables, always redeploy Netlify site

### Images not loading

1. **Check image paths:**
   - Images should be served from: `https://your-railway-url.railway.app/images/...`
   - Check browser Network tab to see actual image requests

2. **Verify backend static files:**
   - Ensure images are uploaded to Railway backend's `public/images/` folder
   - Railway should serve static files automatically

### Database connection issues

1. **Check Railway database:**
   - Go to Railway → Your PostgreSQL service
   - Verify it's running
   - Check connection string in `DATABASE_URL`

2. **Run migrations:**
   ```bash
   # In Railway, you can run commands via the CLI or in a one-off container
   npx prisma migrate deploy
   npx prisma generate
   ```

---

## 📝 Quick Reference

### Railway Backend URL Format
```
https://your-project-name.up.railway.app
```

### Netlify Environment Variable
```
VITE_API_URL=https://your-project-name.up.railway.app/api
```

### Railway Environment Variables
```
FRONTEND_URL=https://tigermarineweb.netlify.app
DATABASE_URL=postgresql://... (auto-provided by Railway)
NODE_ENV=production
```

---

## 🆘 Need Help?

1. Check Railway logs: Railway Dashboard → Your Service → Logs
2. Check Netlify logs: Netlify Dashboard → Deploys → Click on a deploy → View logs
3. Check browser console: Open DevTools → Console tab
4. Test backend directly: Use Postman or curl to test API endpoints



hii