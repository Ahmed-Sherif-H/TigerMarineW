# Testing Guide

## Local Testing

### Quick Test Script

**Windows (PowerShell):**
```powershell
.\scripts\test-local.ps1
```

**Linux/Mac:**
```bash
chmod +x scripts/test-local.sh
./scripts/test-local.sh
```

### Manual Testing

1. **Start Backend:**
   ```bash
   cd backend
   npm run dev
   ```
   Should see: `🚀 Backend running on port 3001`

2. **Start Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```
   Should see: `Local: http://localhost:5173`

3. **Test Endpoints:**
   - Backend health: http://localhost:3001/api/health
   - Models API: http://localhost:3001/api/models
   - Categories API: http://localhost:3001/api/categories

4. **Test Frontend:**
   - Home page: http://localhost:5173
   - Admin Dashboard: http://localhost:5173/admin
   - Models page: http://localhost:5173/models

## Production Testing

### Backend (Render)

1. **Health Check:**
   ```bash
   curl https://tigermarinewbackend.onrender.com/api/health
   ```
   Should return: `{"status":"ok",...}`

2. **Test Endpoints:**
   - Models: `https://tigermarinewbackend.onrender.com/api/models`
   - Categories: `https://tigermarinewbackend.onrender.com/api/categories`

### Frontend (Netlify)

1. Visit: https://tigermarineweb.netlify.app
2. Check browser console for errors
3. Verify API calls are using production URL
4. Test Admin Dashboard functionality

## Test Checklist

### Functionality Tests

- [ ] Models load correctly
- [ ] Images display properly
- [ ] Admin Dashboard accessible
- [ ] Image uploads work
- [ ] Contact form submits
- [ ] Customizer inquiry works
- [ ] Navigation works
- [ ] Responsive design works

### API Tests

- [ ] GET /api/health - Returns status
- [ ] GET /api/models - Returns models
- [ ] GET /api/categories - Returns categories
- [ ] POST /api/inquiries/contact - Submits contact
- [ ] POST /api/inquiries/customizer - Submits inquiry
- [ ] POST /api/upload/single - Uploads file

### Debugging

1. **Browser Console:**
   - Look for `[API]` logs
   - Check for errors
   - Verify API URL

2. **Backend Logs (Render):**
   - Check service logs
   - Look for errors
   - Verify database connections

3. **Network Tab:**
   - Check request/response
   - Verify status codes
   - Check CORS headers

## Common Test Scenarios

### 1. Image Upload Test

1. Go to Admin Dashboard
2. Select a model
3. Upload an image
4. Save changes
5. Refresh page
6. Verify image persists

### 2. Contact Form Test

1. Fill out contact form
2. Submit
3. Check email received
4. Verify inquiry in database

### 3. Customizer Test

1. Select a model
2. Customize colors/features
3. Submit inquiry
4. Check email received
5. Verify inquiry in database

