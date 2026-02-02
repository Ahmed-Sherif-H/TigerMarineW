# Migration Guide for Windows

## 🪟 Windows PowerShell Instructions

### Option 1: Use the PowerShell Script (Easiest) ✅

1. **Open the script file:**
   - Navigate to: `scripts/migrate-cloudinary-to-local.ps1`
   - Right-click → **Edit** (or open in Notepad/VS Code)

2. **Edit the configuration at the top:**
   ```powershell
   $BACKEND_URL = "https://tigermarinewbackend-production.up.railway.app/api"
   $ADMIN_EMAIL = "your-actual-email@example.com"    # <-- CHANGE THIS
   $ADMIN_PASSWORD = "your-actual-password"            # <-- CHANGE THIS
   ```

3. **Save the file**

4. **Open PowerShell:**
   - Press `Win + X`
   - Select **Windows PowerShell** or **Terminal**
   - Navigate to your project folder:
     ```powershell
     cd "E:\Tiger Marine\tigermarine2\frontend"
     ```

5. **Run the script:**
   ```powershell
   .\scripts\migrate-cloudinary-to-local.ps1
   ```

   If you get an execution policy error, run this first:
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

---

### Option 2: Manual PowerShell Commands

1. **Open PowerShell** in your project folder:
   ```powershell
   cd "E:\Tiger Marine\tigermarine2\frontend"
   ```

2. **Set environment variables** (PowerShell syntax):
   ```powershell
   $env:BACKEND_URL = "https://tigermarinewbackend-production.up.railway.app/api"
   $env:ADMIN_EMAIL = "your-actual-email@example.com"
   $env:ADMIN_PASSWORD = "your-actual-password"
   ```

3. **Run the migration script:**
   ```powershell
   node scripts/migrate-cloudinary-to-local.js
   ```

---

### Option 3: Using Command Prompt (CMD)

1. **Open Command Prompt:**
   - Press `Win + R`
   - Type `cmd` and press Enter
   - Navigate to your project:
     ```cmd
     cd "E:\Tiger Marine\tigermarine2\frontend"
     ```

2. **Set environment variables** (CMD syntax):
   ```cmd
   set BACKEND_URL=https://tigermarinewbackend-production.up.railway.app/api
   set ADMIN_EMAIL=your-actual-email@example.com
   set ADMIN_PASSWORD=your-actual-password
   ```

3. **Run the migration script:**
   ```cmd
   node scripts/migrate-cloudinary-to-local.js
   ```

---

## 🔍 What You'll See

When the script runs, you'll see output like:

```
🚀 Starting Cloudinary to Local Migration...

Backend URL: https://tigermarinewbackend-production.up.railway.app/api

📝 Logging in...
✅ Login successful

📦 Fetching models...
Found 12 models

🔄 Migrating model: Open750 (ID: 1)
  - imageFile: https://res.cloudinary.com/... → DJI_0014.webp
  - galleryFiles: 5 files migrated
✅ Model Open750 updated

...

🎉 Migration complete!

Summary:
  - Models updated: 12/12
  - Categories updated: 5/5
```

---

## ⚠️ Troubleshooting

### "node is not recognized"

**Problem:** Node.js is not installed or not in PATH

**Solution:**
1. Install Node.js from: https://nodejs.org/
2. Restart PowerShell after installation
3. Verify: `node --version`

### "Execution Policy" Error

**Problem:** PowerShell blocks script execution

**Solution:**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Then try running the script again.

### "Cannot connect to backend"

**Problem:** Backend URL is wrong or backend is down

**Solution:**
1. Verify backend URL is correct
2. Check if backend is running
3. Test in browser: `https://tigermarinewbackend-production.up.railway.app/api/health`

### "Login failed"

**Problem:** Email or password is incorrect

**Solution:**
1. Double-check your admin email and password
2. Make sure there are no extra spaces
3. Try logging in via Admin Dashboard first to verify credentials

---

## ✅ After Migration

1. **Test locally:**
   ```powershell
   npm run dev
   ```
   - Visit model pages
   - Verify images load correctly

2. **Check browser console:**
   - No 404 errors
   - Images load from `/images/...` paths

3. **Deploy:**
   ```powershell
   git add .
   git commit -m "Migrate images to frontend"
   git push
   ```

---

## 📝 Quick Reference

**PowerShell:**
```powershell
$env:VARIABLE = "value"
node script.js
```

**Command Prompt:**
```cmd
set VARIABLE=value
node script.js
```

**Bash (Linux/Mac):**
```bash
export VARIABLE="value"
node script.js
```
