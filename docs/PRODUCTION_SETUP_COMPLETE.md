# Complete Production Setup Guide

## 🎯 Your Questions Answered

### Q1: Why do images work locally but not online?

**Answer:** The database on Render is likely not populated with image filenames, OR the images haven't been uploaded to Render's backend.

**Solution:**
1. Check database: `npm run check:db` (on Render Shell)
2. Upload images via Admin Dashboard
3. Or run: `npm run populate:images` (if images already exist)

### Q2: Does Render sleeping affect all functions?

**Answer:** YES! On Render free tier:
- Service sleeps after 15 minutes of inactivity
- First request takes 30-60 seconds to wake up
- ALL functions are affected (API, images, uploads, forms)
- After wake-up, everything works normally

**Solution:** 
- ✅ **Keep-alive ping is now enabled** in frontend (pings every 10 min)
- OR use UptimeRobot (free) to ping every 5 minutes
- OR upgrade to Render Starter ($7/month) - never sleeps

## 🚀 Quick Fix Steps

### Step 1: Check Database Population

**On Render Dashboard:**
1. Go to your backend service
2. Click "Shell" tab
3. Run:
   ```bash
   npm run check:db
   ```

**What you'll see:**
- ✅ Models with images in database
- ❌ Models missing images
- Total counts for gallery/interior/videos

### Step 2: Populate Database

**Option A: Admin Dashboard (Recommended)**
1. Go to: https://tigermarineweb.netlify.app/admin
2. Select each model
3. Upload images → Click "Save Changes"
4. Images are saved to Render automatically

**Option B: Manual Filename Entry**
If images already exist on Render but database is empty:
1. Go to Admin Dashboard
2. For each model:
   - Select model
   - Manually type filenames in input fields
   - Click "Save Changes"

**Note:** Render free tier doesn't provide shell access, so you can't run `populate:images` script. Use Admin Dashboard instead!

### Step 3: Verify Environment Variables

**Netlify:**
- `VITE_API_URL` = `https://tigermarinewbackend.onrender.com/api`
- **Must redeploy after setting!**

**Render:**
- `FRONTEND_URL` = `https://tigermarineweb.netlify.app`
- `DATABASE_URL` = Your PostgreSQL connection

### Step 4: Test Everything

1. **Backend health:**
   ```
   https://tigermarinewbackend.onrender.com/api/health
   ```

2. **Check images:**
   - Visit production site
   - Open browser console
   - Image URLs should be: `https://tigermarinewbackend.onrender.com/images/...`

3. **Test upload:**
   - Admin Dashboard → Upload image → Save
   - Refresh page → Image should persist

## 🔄 Render Sleeping - What's Fixed

### Before:
- ❌ Backend sleeps after 15 min
- ❌ First user waits 30-60 seconds
- ❌ Timeout errors common

### After (Now Fixed):
- ✅ Frontend pings backend every 10 minutes
- ✅ Backend stays awake
- ✅ No more sleeping issues
- ✅ All functions work immediately

**Note:** Keep-alive ping is automatic - no setup needed!

## 📋 Complete Checklist

### Database
- [ ] Run `npm run check:db` on Render
- [ ] All models have image filenames
- [ ] Categories have images

### Images
- [ ] Images uploaded to Render backend
- [ ] Images accessible via direct URL
- [ ] Admin Dashboard can upload images

### Environment
- [ ] `VITE_API_URL` set in Netlify
- [ ] `FRONTEND_URL` set in Render
- [ ] Netlify redeployed after env changes

### Testing
- [ ] Backend health check works
- [ ] Images load on production site
- [ ] Admin Dashboard works
- [ ] Image uploads work
- [ ] Contact form works

## 🆘 Still Having Issues?

1. **Check Render logs** for errors
2. **Check browser console** for failed requests
3. **Verify backend is awake:**
   - Quick response (< 2s) = Awake ✅
   - Slow response (30-60s) = Waking up ⏳
4. **Test database:**
   ```bash
   npm run check:db
   ```

## 📚 Related Documentation

- [PRODUCTION_IMAGES.md](./PRODUCTION_IMAGES.md) - Detailed image setup
- [RENDER_SLEEPING.md](./RENDER_SLEEPING.md) - Render sleeping explained
- [QUICK_FIX_PRODUCTION.md](./QUICK_FIX_PRODUCTION.md) - Quick troubleshooting
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - Common issues

## ✅ Summary

**Images not showing?**
→ Database not populated → Use Admin Dashboard or `populate:images`

**Render sleeping?**
→ Fixed! Keep-alive ping enabled automatically

**Everything works locally?**
→ Great! Now populate production database and upload images

