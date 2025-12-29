# Quick Fix: Production Images Not Showing

## Immediate Steps

### 1. Check Database Population

**On Render Dashboard:**
1. Go to your backend service
2. Click "Shell" tab
3. Run:
   ```bash
   npm run check:db
   ```

**What to look for:**
- Models with ✅ = Have images in database
- Models with ❌ = Missing images in database

### 2. If Database is Empty

**Option A: Use Admin Dashboard (Easiest)**
1. Go to: https://tigermarineweb.netlify.app/admin
2. For each model:
   - Select model from dropdown
   - Upload images using upload buttons
   - Click "Save Changes"

**Option B: Manual Filename Entry**
If images already exist on Render:
1. Go to Admin Dashboard
2. For each model:
   - Select model
   - Manually type filenames (must match exactly)
   - Click "Save Changes"

**Note:** Render free tier doesn't provide shell access. Use Admin Dashboard instead!

### 3. Verify Environment Variables

**Netlify:**
- Site settings → Environment variables
- `VITE_API_URL` = `https://tigermarinewbackend.onrender.com/api`
- **Must redeploy** after setting!

**Render:**
- Environment tab
- `FRONTEND_URL` = `https://tigermarineweb.netlify.app`

### 4. Test Image URLs

Open browser console on production site and check:
- Image URLs should be: `https://tigermarinewbackend.onrender.com/images/...`
- If you see `localhost`, environment variable is wrong!

## Render Sleeping Issue

**Problem:** Backend sleeps after 15 min inactivity → first request takes 30-60 seconds

**Solution:** Keep-alive ping is now enabled in frontend code. It pings backend every 10 minutes.

**Alternative:** Use UptimeRobot (free) to ping:
- URL: `https://tigermarinewbackend.onrender.com/api/health`
- Interval: 5 minutes

See [RENDER_SLEEPING.md](./RENDER_SLEEPING.md) for details.

## Still Not Working?

1. **Check Render logs** for errors
2. **Check browser console** for failed requests
3. **Test backend directly:**
   ```
   https://tigermarinewbackend.onrender.com/api/health
   ```
4. **Verify images exist:**
   - Render Shell: `ls public/images/[ModelName]/`

## Common Issues

| Issue | Solution |
|-------|----------|
| Images work locally but not online | Database not populated or images not on Render |
| Upload fails | Backend sleeping or CORS issue |
| Images disappear after refresh | Filenames not saved to database |
| Timeout errors | Backend is sleeping (wait 30-60s) |

