# Environment Variables Setup Guide

## ⚠️ CRITICAL: Backend Connection Issue

If you're seeing `ERR_CONNECTION_REFUSED` or `localhost:3001` errors, the `VITE_API_URL` environment variable is **NOT SET** in Netlify.

## Quick Fix

### Step 1: Set Environment Variable in Netlify

1. Go to your Netlify dashboard: https://app.netlify.com
2. Select your site: **tigermarineweb**
3. Go to **Site settings** → **Environment variables**
4. Click **Add variable**
5. Add:
   - **Key:** `VITE_API_URL`
   - **Value:** `https://tigermarinewbackend.onrender.com/api`
6. Click **Save**

### Step 2: Redeploy Your Site

**IMPORTANT:** After adding the environment variable, you **MUST redeploy** for it to take effect!

1. Go to **Deploys** tab in Netlify
2. Click **Trigger deploy** → **Deploy site**
3. Wait for the build to complete

### Step 3: Verify

1. Open your site: https://tigermarineweb.netlify.app
2. Open browser console (F12)
3. You should see: `[API] Using backend URL: https://tigermarinewbackend.onrender.com/api`
4. If you see `localhost:3001`, the environment variable is still not set correctly

## Environment Variables Checklist

### Frontend (Netlify)

✅ **Required:**
- `VITE_API_URL` = `https://tigermarinewbackend.onrender.com/api`

### Backend (Render)

✅ **Required:**
- `DATABASE_URL` = Your PostgreSQL connection string
- `FRONTEND_URL` = `https://tigermarineweb.netlify.app`
- `EMAIL_USER` = Your email (for nodemailer)
- `EMAIL_PASSWORD` = Your email app password
- `CONTACT_EMAIL` = `ahmed.sh.hammam@gmail.com`

## How to Verify Environment Variables

### In Netlify:
1. Site settings → Environment variables
2. Check that `VITE_API_URL` is listed
3. Value should be: `https://tigermarinewbackend.onrender.com/api`

### In Browser Console:
1. Open DevTools (F12)
2. Go to Console tab
3. Look for: `[API] Using backend URL: ...`
4. Should show Render URL, NOT localhost

## Common Issues

### Issue: Still seeing localhost:3001

**Cause:** Environment variable not set or site not redeployed

**Fix:**
1. Verify variable exists in Netlify
2. **Redeploy the site** (this is critical!)
3. Clear browser cache
4. Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

### Issue: CORS errors

**Cause:** Backend `FRONTEND_URL` not set correctly

**Fix:**
1. Go to Render dashboard
2. Check `FRONTEND_URL` = `https://tigermarineweb.netlify.app`
3. Restart the backend service

### Issue: API calls return 404

**Cause:** Backend URL incorrect or backend not running

**Fix:**
1. Verify backend is running on Render
2. Check backend URL: `https://tigermarinewbackend.onrender.com/api/health`
3. Should return: `{"status":"ok","timestamp":"..."}`

## Testing Locally

For local development, create a `.env` file in the frontend root:

```env
VITE_API_URL=http://localhost:3001/api
```

**Note:** `.env` files are NOT deployed to Netlify. You must set environment variables in the Netlify dashboard.

## Why This Happens

Vite (the build tool) bakes environment variables into the JavaScript at **build time**. This means:

1. If `VITE_API_URL` is not set when you build, it uses the fallback (`localhost:3001`)
2. Setting it in Netlify dashboard **after** deployment won't help
3. You **must redeploy** after setting the variable

## Verification Commands

After redeploying, check the built files:

1. In Netlify, go to Deploys → Latest deploy
2. Check the build logs for any errors
3. The build should complete successfully

If you see `localhost:3001` in the browser console after redeploying, the environment variable is still not set correctly.

