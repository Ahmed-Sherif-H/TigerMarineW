# Quick Fix: Backend Connection Issue

## The Problem

You're seeing `ERR_CONNECTION_REFUSED` because the frontend is trying to connect to `localhost:3001` instead of your Render backend.

## The Solution

### Step 1: Set Environment Variable in Netlify

1. **Go to Netlify Dashboard:**
   - https://app.netlify.com
   - Select your site: **tigermarineweb**

2. **Add Environment Variable:**
   - Click **Site settings** (gear icon)
   - Click **Environment variables** (left sidebar)
   - Click **Add variable**
   - **Key:** `VITE_API_URL`
   - **Value:** `https://tigermarinewbackend.onrender.com/api`
   - Click **Save**

### Step 2: Redeploy (CRITICAL!)

**You MUST redeploy after setting the variable:**

1. Go to **Deploys** tab
2. Click **Trigger deploy** → **Deploy site**
3. Wait for build to complete (2-3 minutes)

### Step 3: Verify

1. Open your site: https://tigermarineweb.netlify.app
2. Open browser console (F12)
3. Look for these logs:
   ```
   [API] Backend URL: https://tigermarinewbackend.onrender.com/api
   [API] VITE_API_URL env var: https://tigermarinewbackend.onrender.com/api
   ```

If you see `localhost:3001`, the variable is NOT set correctly or the site wasn't redeployed.

## For Local Development

Create a `.env` file in the `frontend` folder:

```env
VITE_API_URL=http://localhost:3001/api
```

Then restart your dev server:
```bash
npm run dev
```

## Verify Backend is Running

Test your backend directly:
- https://tigermarinewbackend.onrender.com/api/health

Should return: `{"status":"ok","timestamp":"..."}`

If this doesn't work, your backend might be down or the URL is wrong.

## Still Not Working?

1. **Check Netlify Build Logs:**
   - Deploys → Latest deploy → Build log
   - Look for any errors

2. **Check Browser Console:**
   - F12 → Console tab
   - Look for `[API]` logs
   - Check what URL is being used

3. **Verify Environment Variable:**
   - Netlify → Site settings → Environment variables
   - Make sure `VITE_API_URL` exists
   - Value should be: `https://tigermarinewbackend.onrender.com/api`

4. **Clear Cache:**
   - Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
   - Or clear browser cache completely

## Common Mistakes

❌ **Setting variable but not redeploying** - Variables are baked into the build, you MUST redeploy

❌ **Wrong URL format** - Should be `https://tigermarinewbackend.onrender.com/api` (with `/api` at the end)

❌ **Typo in variable name** - Must be exactly `VITE_API_URL` (case-sensitive)

✅ **Correct:** Set variable → Redeploy → Test

