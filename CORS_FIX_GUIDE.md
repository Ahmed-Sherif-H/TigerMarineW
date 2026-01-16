# CORS Error Fix Guide

## Problem
You're getting CORS errors because the backend doesn't allow requests from `https://tigermarine.com`.

## Solution: Update Railway Backend CORS Settings

### Step 1: Update Railway Environment Variables

1. Go to **Railway Dashboard**: https://railway.app
2. Select your backend service (`tigermarinewbackend-production`)
3. Go to **Variables** tab
4. Find or add these variables:

#### Required Variable:
```
FRONTEND_URL=https://tigermarine.com
```

**OR** if your backend uses `allowedOrigins` or `CORS_ORIGINS`:
```
CORS_ORIGINS=https://tigermarine.com,https://www.tigermarine.com
```

### Step 2: Check Backend CORS Configuration

The backend needs to allow requests from your new domain. Common variable names:
- `FRONTEND_URL`
- `CORS_ORIGINS`
- `ALLOWED_ORIGINS`
- `ORIGIN`

### Step 3: Restart Backend

After updating the variable:
1. Railway should auto-restart, but if not:
2. Go to **Deployments** tab
3. Click **Redeploy** or **Restart**

### Step 4: Verify

1. Wait 1-2 minutes for Railway to restart
2. Clear browser cache
3. Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
4. Check if errors are gone

---

## If You Still Get CORS Errors

### Check Backend Code (if you have access):

The backend should have CORS middleware configured. Common patterns:

**Express.js example:**
```javascript
const allowedOrigins = process.env.CORS_ORIGINS?.split(',') || 
  [process.env.FRONTEND_URL].filter(Boolean) || 
  ['http://localhost:5173'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
```

### Common Issues:

1. **Missing `https://`**: Make sure the URL includes the protocol
   - ✅ Correct: `https://tigermarine.com`
   - ❌ Wrong: `tigermarine.com`

2. **Trailing slash**: Usually doesn't matter, but try without
   - ✅ Correct: `https://tigermarine.com`
   - ⚠️ Might work: `https://tigermarine.com/`

3. **www vs non-www**: If you use both, add both:
   ```
   CORS_ORIGINS=https://tigermarine.com,https://www.tigermarine.com
   ```

4. **Variable not being read**: Check backend logs in Railway to see if the variable is being used

---

## Quick Checklist

- [ ] Updated `FRONTEND_URL` or `CORS_ORIGINS` in Railway
- [ ] Value includes `https://` protocol
- [ ] No trailing slash (or consistent with backend code)
- [ ] Backend restarted/redeployed
- [ ] Waited 1-2 minutes for restart
- [ ] Cleared browser cache
- [ ] Hard refreshed the page

---

## Still Not Working?

1. **Check Railway Logs:**
   - Go to Railway → Your service → **Deployments** → Click latest deployment → **View Logs**
   - Look for CORS-related messages or errors

2. **Test Backend Directly:**
   - Visit: `https://tigermarinewbackend-production.up.railway.app/api/health`
   - Should return: `{"status":"ok"}`

3. **Check Browser Network Tab:**
   - Open DevTools → Network tab
   - Look at the failed request
   - Check Response Headers - should see `Access-Control-Allow-Origin: https://tigermarine.com`

4. **Contact Backend Developer:**
   - If you can't access backend code, ask them to update CORS settings
   - Provide them with: `https://tigermarine.com`
