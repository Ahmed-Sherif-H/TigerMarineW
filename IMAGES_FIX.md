# Images Setup Fix

## Issues Found:

1. **Backend images folder doesn't exist** - The folder `backend/images/` is missing
2. **React Hooks Error** - Fixed conditional useMemo in ModelDetail.jsx

## Solution:

### Option 1: Keep images in frontend (RECOMMENDED)
- Images stay in `frontend/public/images/`
- Frontend serves images directly (faster, simpler)
- Update `src/utils/imagePathUtils.js` to use frontend paths

### Option 2: Move images to backend
- Create `backend/images/` folder
- Copy all images from `frontend/public/images/` to `backend/images/`
- Backend will serve them

## Quick Fix:

Since the backend images folder doesn't exist, let's revert to frontend images:

1. Update `imagePathUtils.js` to use `/images/` instead of backend URL
2. Images will be served from `frontend/public/images/` (Vite serves public folder automatically)


