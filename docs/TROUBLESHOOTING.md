# Troubleshooting Guide

## Common Issues

### 1. Images Disappear After Refresh

**Symptoms:** Images show initially but disappear after page refresh

**Causes:**
- Filenames stored as paths instead of just filenames
- Backend returning paths, frontend saving paths

**Solution:**
1. Check browser console for `[AdminDashboard]` logs
2. Verify filenames in database are just filenames (not paths)
3. Use Admin Dashboard to re-upload images
4. Check backend logs for `[ModelsService]` transformation logs

### 2. API Connection Errors

**Symptoms:** `Failed to fetch` or `ERR_CONNECTION_REFUSED`

**Solutions:**
1. **Local:** Ensure backend is running on port 3001
2. **Production:** Check `VITE_API_URL` in Netlify environment variables
3. **Render:** Verify backend service is running (not sleeping)
4. Check browser console for `[API] Backend URL:` log

### 3. CORS Errors

**Symptoms:** `Access-Control-Allow-Origin` errors

**Solutions:**
1. Verify `FRONTEND_URL` is set in Render
2. Check backend logs for CORS warnings
3. Ensure backend service is running
4. Test backend health: `https://tigermarinewbackend.onrender.com/api/health`

### 4. Image Upload Fails

**Symptoms:** Upload button doesn't work or returns error

**Solutions:**
1. Check file size (max 50MB)
2. Verify file type is allowed
3. Check backend logs on Render
4. Ensure model is selected in Admin Dashboard
5. Check browser console for upload errors

### 5. Contact Form Timeout

**Symptoms:** Form submission times out

**Solutions:**
1. Backend might be sleeping (Render free tier)
2. Wait 30-60 seconds and try again
3. Check backend logs for email errors
4. Verify email credentials in Render environment variables

### 6. Database Connection Errors

**Symptoms:** Backend can't connect to database

**Solutions:**
1. Verify `DATABASE_URL` in Render environment variables
2. Check database is running and accessible
3. Run `npm run test:db` to test connection
4. Check Prisma migrations are up to date

## Debugging Steps

### 1. Check Browser Console

Look for:
- `[API]` logs showing API URL
- Error messages with stack traces
- Network tab for failed requests

### 2. Check Backend Logs (Render)

Look for:
- `[ModelsService]` transformation logs
- `[API]` request logs
- Error stack traces
- CORS warnings

### 3. Test Backend Directly

```bash
# Health check
curl https://tigermarinewbackend.onrender.com/api/health

# Should return: {"status":"ok",...}
```

### 4. Verify Environment Variables

**Frontend (Netlify):**
- `VITE_API_URL` must be set
- Must redeploy after setting

**Backend (Render):**
- `DATABASE_URL`
- `FRONTEND_URL`
- `EMAIL_USER`
- `EMAIL_PASSWORD`
- `CONTACT_EMAIL`

## Getting Help

1. Check logs (browser console + Render logs)
2. Verify environment variables
3. Test backend health endpoint
4. Check this troubleshooting guide
5. Review [SETUP.md](./SETUP.md) for configuration

