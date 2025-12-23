# Deployment Guide

## Frontend (Netlify)

### Environment Variables

⚠️ **CRITICAL:** This must be set BEFORE building, or you must redeploy after setting it!

In your Netlify dashboard, go to **Site settings > Environment variables** and add:

```
VITE_API_URL=https://tigermarinewbackend.onrender.com/api
```

**IMPORTANT:** After adding this variable, you **MUST redeploy** your site for it to take effect!

1. Go to **Deploys** tab
2. Click **Trigger deploy** → **Deploy site**
3. Wait for build to complete

### Build Settings

- **Build command**: `npm run build`
- **Publish directory**: `dist`

### Important Files

- `public/_redirects` - This file handles SPA routing. It redirects all routes to `index.html` so React Router can handle them.

## Backend (Render)

### Environment Variables

In your Render dashboard, go to your service **Environment** tab and add:

```
DATABASE_URL=your-postgresql-connection-string
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
CONTACT_EMAIL=ahmed.sh.hammam@gmail.com
FRONTEND_URL=https://tigermarineweb.netlify.app
```

### CORS Configuration

The backend is configured to allow requests from:
- `FRONTEND_URL` environment variable
- `http://localhost:5173` (for local development)

Make sure `FRONTEND_URL` is set to `https://tigermarineweb.netlify.app` in Render.

## Troubleshooting

### `/admin` route not working

1. Make sure `public/_redirects` file exists with content: `/*    /index.html   200`
2. Redeploy on Netlify after adding the `_redirects` file
3. Clear browser cache and try again

### API calls failing

1. Check that `VITE_API_URL` is set in Netlify environment variables
2. Verify the backend URL is correct: `https://tigermarinewbackend.onrender.com/api`
3. Check browser console for CORS errors
4. Verify `FRONTEND_URL` is set in Render environment variables

### Database connection issues

1. Verify `DATABASE_URL` is correctly set in Render
2. Check that your PostgreSQL database is running on Render
3. Ensure the connection string format is correct

