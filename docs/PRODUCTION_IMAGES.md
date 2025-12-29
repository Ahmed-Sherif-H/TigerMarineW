# Production Images Setup Guide

## Problem: Images Work Locally But Not Online

This usually means:
1. **Database not populated** with image filenames
2. **Images not uploaded** to Render's backend
3. **Environment variables** not set correctly

## Solution Steps

### Step 1: Verify Database Population

**On Render:**
1. Go to Render dashboard → Your backend service
2. Open Shell/Console
3. Run:
   ```bash
   npm run check:db
   ```

This will show:
- Which models have images in database
- Which models are missing images
- Total image counts

### Step 2: Upload Images to Render

**Option A: Use Admin Dashboard (Recommended)**

1. Go to: https://tigermarineweb.netlify.app/admin
2. Select each model
3. Upload images using the upload buttons
4. Click "Save Changes"
5. Images are automatically saved to Render's backend

**Option B: Manual Upload via Git**

1. **Local:** Copy images to `backend/public/images/`
2. **Commit and push:**
   ```bash
   cd backend
   git add public/images/
   git commit -m "Add production images"
   git push
   ```
3. **Render auto-deploys** and images are available

### Step 3: Populate Database with Existing Images

**Note:** Render free tier doesn't provide shell access. Use Admin Dashboard instead!

**Option A: Admin Dashboard (Recommended - No Shell Needed)**
1. Go to: https://tigermarineweb.netlify.app/admin
2. For each model:
   - Select model → Upload images → Save Changes
   - This uploads files AND saves filenames to database

**Option B: Manual Filename Entry**
If images already exist on Render:
1. Go to Admin Dashboard
2. For each model:
   - Select model
   - Manually type filenames (e.g., `850TL - 1.jpg`)
   - Click "Save Changes"

See [POPULATE_IMAGES_NO_SHELL.md](./POPULATE_IMAGES_NO_SHELL.md) for detailed instructions.

### Step 4: Verify Environment Variables

**Netlify:**
- `VITE_API_URL` = `https://tigermarinewbackend.onrender.com/api`

**Render:**
- `FRONTEND_URL` = `https://tigermarineweb.netlify.app`
- `DATABASE_URL` = Your PostgreSQL connection string

### Step 5: Test

1. **Check backend health:**
   ```
   https://tigermarinewbackend.onrender.com/api/health
   ```

2. **Check images load:**
   - Visit: https://tigermarineweb.netlify.app
   - Open browser console
   - Look for image URLs
   - Should be: `https://tigermarinewbackend.onrender.com/images/...`

3. **Test image upload:**
   - Go to Admin Dashboard
   - Upload a test image
   - Verify it appears

## Troubleshooting

### Images Still Not Showing

1. **Check database:**
   ```bash
   npm run check:db
   ```

2. **Check image files exist:**
   - Render Shell: `ls -la public/images/[ModelName]/`

3. **Check browser console:**
   - Look for 404 errors
   - Check image URLs
   - Verify they point to Render backend

4. **Check CORS:**
   - Verify `FRONTEND_URL` is set in Render
   - Check backend logs for CORS errors

### Database Empty

Run population script:
```bash
npm run populate:images
```

### Images Upload But Don't Persist

1. Check backend logs for save errors
2. Verify database connection
3. Check file permissions on Render
4. Ensure "Save Changes" is clicked after upload

## Best Practice Workflow

1. **Develop locally** with all images
2. **Test locally** - verify everything works
3. **Upload via Admin Dashboard** to production
4. **Verify on production** - check images load
5. **Monitor logs** - watch for errors

## Quick Checklist

- [ ] Database populated with image filenames
- [ ] Images uploaded to Render backend
- [ ] Environment variables set correctly
- [ ] CORS configured properly
- [ ] Backend service is awake (not sleeping)
- [ ] Images accessible via direct URL
- [ ] Admin Dashboard can upload images

