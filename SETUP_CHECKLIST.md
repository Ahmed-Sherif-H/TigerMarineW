# Setup Checklist

## ✅ Frontend (Netlify)

- [ ] `VITE_API_URL` environment variable set to `https://tigermarinewbackend.onrender.com/api`
- [ ] Site redeployed after setting environment variable
- [ ] `public/_redirects` file exists with content: `/*    /index.html   200`
- [ ] Build command: `npm run build`
- [ ] Publish directory: `dist`

## ✅ Backend (Render)

- [ ] `DATABASE_URL` set (PostgreSQL connection string)
- [ ] `FRONTEND_URL` set to `https://tigermarineweb.netlify.app`
- [ ] `EMAIL_USER` set (for nodemailer)
- [ ] `EMAIL_PASSWORD` set (Gmail app password)
- [ ] `CONTACT_EMAIL` set to `ahmed.sh.hammam@gmail.com`
- [ ] Backend service is running (status: Live)
- [ ] CORS configured correctly

## ✅ Testing

- [ ] Backend health check works: `https://tigermarinewbackend.onrender.com/api/health`
- [ ] Frontend loads without errors
- [ ] Models load in dashboard
- [ ] Images display correctly
- [ ] Contact form submits successfully
- [ ] Inquiry form submits successfully
- [ ] Image uploads work in Admin Dashboard

## 🔍 Debugging

If something doesn't work:

1. **Check browser console:**
   - Look for `[API]` logs
   - Check what URL is being used
   - Look for error messages

2. **Check Netlify:**
   - Environment variables are set
   - Site has been redeployed
   - Build logs show no errors

3. **Check Render:**
   - Backend service is running
   - Environment variables are set
   - Logs show no errors
   - CORS is configured

4. **Test backend directly:**
   - `https://tigermarinewbackend.onrender.com/api/health`
   - Should return JSON with status: "ok"

