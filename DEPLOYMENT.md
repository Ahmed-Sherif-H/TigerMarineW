# Deployment Guide

## Frontend (Netlify)

### Environment Variables

**CRITICAL:** Set this in Netlify dashboard → Site settings → Environment variables:

```
VITE_API_URL=https://tigermarinewbackend.onrender.com/api
```

**IMPORTANT:** After setting the variable, you MUST redeploy for it to take effect!

### Build Settings

- **Build command:** `npm run build`
- **Publish directory:** `dist`

### Required Files

- `public/_redirects` - Handles SPA routing (redirects all routes to index.html)

## Backend (Render)

### Environment Variables

Set in Render dashboard → Your service → Environment:

```
DATABASE_URL=your-postgresql-connection-string
FRONTEND_URL=https://tigermarineweb.netlify.app
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
CONTACT_EMAIL=ahmed.sh.hammam@gmail.com
```

### CORS Configuration

Backend is configured to allow requests from:
- `FRONTEND_URL` environment variable
- `https://tigermarineweb.netlify.app` (hardcoded)
- Local development URLs

## Local Development

### Frontend

1. Create `.env` file:
```env
VITE_API_URL=http://localhost:3001/api
```

2. Install and run:
```bash
npm install
npm run dev
```

### Backend

1. Create `.env` file:
```env
DATABASE_URL=your-local-postgres-url
FRONTEND_URL=http://localhost:5173
```

2. Install and run:
```bash
npm install
npm run dev
```

## Troubleshooting

### API Connection Errors

1. **Check environment variables:**
   - Frontend: `VITE_API_URL` in Netlify
   - Backend: `FRONTEND_URL` in Render

2. **Verify backend is running:**
   - Test: `https://tigermarinewbackend.onrender.com/api/health`
   - Should return: `{"status":"ok",...}`

3. **Check browser console:**
   - Look for `[API]` logs
   - Check what URL is being used

### CORS Errors

1. Verify `FRONTEND_URL` is set in Render
2. Check backend logs for CORS warnings
3. Ensure backend service is running

### Images Not Loading

1. Images are served from backend: `backend/public/images/`
2. Use Admin Dashboard to upload/update images
3. Check image filenames in database match actual files
