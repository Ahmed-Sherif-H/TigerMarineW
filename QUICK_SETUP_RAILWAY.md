# Quick Setup: Railway + Netlify

## 🚀 Quick Steps

### 1. Railway Backend (5 minutes)

1. **Get your Railway backend URL:**
   - Go to Railway dashboard → Your project
   - Copy the URL (e.g., `https://tigermarine-backend.up.railway.app`)

2. **Set Environment Variables in Railway:**
   ```
   FRONTEND_URL=https://tigermarineweb.netlify.app
   ```
   (Railway automatically sets `DATABASE_URL` and `PORT`)

3. **Test your backend:**
   - Visit: `https://your-railway-url.railway.app/api/health`
   - Should return: `{"status":"ok",...}`

---

### 2. Netlify Frontend (3 minutes)

1. **Go to Netlify Dashboard:**
   - Site settings → Environment variables

2. **Add this variable:**
   ```
   VITE_API_URL=https://your-railway-url.railway.app/api
   ```
   ⚠️ **Replace `your-railway-url.railway.app` with your actual Railway URL!**

3. **Redeploy:**
   - Deploys → Trigger deploy → Deploy site

---

## ✅ Done!

Your site should now work. Test it:
- Visit your Netlify site
- Check browser console (F12) for any errors
- Try navigating to different pages

---

## 🔧 If Something Doesn't Work

### Backend not responding?
- Check Railway logs: Railway Dashboard → Service → Logs
- Verify `FRONTEND_URL` is set correctly

### Frontend can't connect?
- Verify `VITE_API_URL` in Netlify matches your Railway URL
- Make sure you redeployed after setting the variable
- Check browser console for CORS errors

### Images not loading?
- Images should come from: `https://your-railway-url.railway.app/images/...`
- Verify images are in Railway backend's `public/images/` folder

---

## 📋 What Changed in Code?

✅ Removed Render-specific keep-alive ping code (Railway doesn't need it)
✅ Updated error messages to mention Railway instead of Render
✅ No code changes needed - just environment variables!
