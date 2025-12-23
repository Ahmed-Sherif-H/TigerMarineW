# Tiger Marine Frontend

## Setup

### Environment Variables

**For Local Development:**
Create a `.env` file in the root:
```env
VITE_API_URL=http://localhost:3001/api
```

**For Production (Netlify):**
Set in Netlify dashboard → Site settings → Environment variables:
```
VITE_API_URL=https://tigermarinewbackend.onrender.com/api
```

### Install Dependencies
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```

## Deployment

### Netlify

1. **Build Settings:**
   - Build command: `npm run build`
   - Publish directory: `dist`

2. **Environment Variables:**
   - `VITE_API_URL` = `https://tigermarinewbackend.onrender.com/api`

3. **Important Files:**
   - `public/_redirects` - Handles SPA routing

## Project Structure

```
frontend/
├── src/
│   ├── components/     # Reusable components
│   ├── pages/          # Page components
│   ├── services/       # API service
│   ├── utils/          # Utility functions
│   └── context/        # React context
├── public/             # Static files
└── dist/              # Build output
```

## API Configuration

The frontend connects to the backend API. The API URL is configured via `VITE_API_URL` environment variable.

- **Local:** `http://localhost:3001/api`
- **Production:** `https://tigermarinewbackend.onrender.com/api`

## Troubleshooting

### Images Not Loading
- Check that images exist in backend `public/images/` folder
- Verify image filenames in database match actual files
- Use Admin Dashboard to upload/update images

### API Errors
- Verify `VITE_API_URL` is set correctly
- Check backend is running (test: `/api/health`)
- Check browser console for detailed error messages

### CORS Errors
- Verify backend `FRONTEND_URL` is set to Netlify URL
- Check backend CORS configuration
