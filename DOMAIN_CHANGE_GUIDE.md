# Domain Change Guide: tigermarine.com

## ⚠️ CRITICAL: Update These Settings

After changing your domain from Netlify to `tigermarine.com`, you need to update environment variables in both **Netlify** and **Railway** (backend).

---

## 1. Netlify Frontend Configuration

### Update Environment Variable:

1. Go to **Netlify Dashboard** → Your site → **Site settings** → **Environment variables**
2. Find or add `VITE_API_URL`
3. Set it to your Railway backend URL:
   ```
   VITE_API_URL=https://your-railway-backend.railway.app/api
   ```
   (Replace `your-railway-backend.railway.app` with your actual Railway URL)

4. **IMPORTANT:** After updating, you **MUST redeploy** your Netlify site:
   - Go to **Deploys** tab
   - Click **Trigger deploy** → **Clear cache and deploy site**

---

## 2. Railway Backend Configuration

### Update CORS Settings:

1. Go to **Railway Dashboard** → Your backend service → **Variables** tab
2. Find or add `FRONTEND_URL`
3. Update it to your new domain:
   ```
   FRONTEND_URL=https://tigermarine.com
   ```
   (Or `https://www.tigermarine.com` if you use www)

4. **IMPORTANT:** Railway will automatically restart your backend after saving

---

## 3. Verify Settings

### Check Frontend:
1. Visit `https://tigermarine.com`
2. Open browser console (F12)
3. Look for any errors about image loading
4. Check Network tab - images should load from your Railway backend URL

### Check Backend:
1. Visit `https://your-railway-backend.railway.app/api/health`
2. Should return: `{"status":"ok"}`

---

## 4. Common Issues

### Images Not Loading:
- ✅ Verify `VITE_API_URL` is set correctly in Netlify
- ✅ Verify you **redeployed** Netlify after changing the variable
- ✅ Check browser console for CORS errors
- ✅ Verify `FRONTEND_URL` in Railway matches your domain exactly

### CORS Errors:
- ✅ Make sure `FRONTEND_URL` in Railway includes `https://` and no trailing slash
- ✅ Example: `https://tigermarine.com` (NOT `https://tigermarine.com/`)

### Still Using Old Domain:
- ✅ Clear browser cache
- ✅ Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
- ✅ Check Netlify deploy logs to confirm the new variable was used

---

## 5. Quick Checklist

- [ ] `VITE_API_URL` updated in Netlify to Railway backend URL
- [ ] Netlify site redeployed (with cache cleared)
- [ ] `FRONTEND_URL` updated in Railway to `https://tigermarine.com`
- [ ] Backend restarted (automatic in Railway)
- [ ] Tested images loading on `https://tigermarine.com`
- [ ] No CORS errors in browser console

---

## Need Help?

If images still don't work:
1. Check browser console for specific error messages
2. Check Network tab to see what URLs are being requested
3. Verify both environment variables are set correctly
4. Make sure you cleared cache and redeployed Netlify
