# Upload and Form Fix Guide

## Issues Fixed

1. **Image Upload Failures**
   - Added better error handling and logging
   - Fixed to use API service consistently
   - Added credentials for CORS
   - Improved error messages

2. **Image Path Issues**
   - Fixed BACKEND_URL to be calculated dynamically
   - Images now use correct backend URL at runtime

3. **Contact/Inquiry Forms**
   - Improved error handling
   - Better error messages

## Changes Made

### API Service (`src/services/api.js`)
- ✅ Added `credentials: 'include'` to upload requests for CORS
- ✅ Better error handling and logging
- ✅ Support for category uploads
- ✅ Support for subfolder parameter (Interior images)

### Image Path Utils (`src/utils/imagePathUtils.js`)
- ✅ Fixed BACKEND_URL to be calculated dynamically (not at module load)
- ✅ Images now use correct backend URL

### AdminDashboard
- ✅ All uploads now use API service (no direct fetch)
- ✅ Better error messages
- ✅ Interior uploads use subfolder parameter

## Testing

### Test Image Upload
1. Go to Admin Dashboard → Models
2. Select a model
3. Try uploading an image
4. Check browser console for detailed logs
5. Should see: `[API] Upload successful: {...}`

### Test Contact Form
1. Go to Contact page
2. Fill out form
3. Submit
4. Check console for any errors
5. Should see success message

### Test Inquiry Form
1. Go to Customizer
2. Click "Send Inquiry"
3. Fill out form
4. Submit
5. Check console for any errors

## Debugging

### If Upload Still Fails

1. **Check Browser Console:**
   - Look for `[API] Uploading file to: ...`
   - Check for CORS errors
   - Look for detailed error messages

2. **Check Network Tab:**
   - Open DevTools → Network
   - Try uploading
   - Check the request:
     - URL should be: `https://tigermarinewbackend.onrender.com/api/upload/single`
     - Status should be 200
     - Check Response tab for error details

3. **Check Backend Logs:**
   - Go to Render dashboard
   - Check logs for upload errors
   - Look for file system errors

### Common Issues

**CORS Error:**
- Backend CORS not configured correctly
- Check `FRONTEND_URL` in Render environment variables
- Verify backend is allowing Netlify origin

**File Too Large:**
- Backend limit is 50MB
- Check file size before uploading

**Invalid File Type:**
- Only images and videos allowed
- Check file extension

**Network Error:**
- Backend might be down
- Check Render service status
- Test: `https://tigermarinewbackend.onrender.com/api/health`

## Next Steps

1. **Deploy frontend changes:**
   ```bash
   git add .
   git commit -m "Fix upload and form issues"
   git push
   ```

2. **Test in production:**
   - Wait for Netlify deploy
   - Test uploads
   - Test forms
   - Check console for errors

3. **If still failing:**
   - Check browser console logs
   - Check Render backend logs
   - Verify environment variables are set

