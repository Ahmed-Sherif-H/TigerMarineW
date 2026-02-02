# Check Model Data Guide

## 🔍 What This Does

This script checks all your models in the database and reports:
- ✅ Which models have specs
- ✅ Which models have standard features  
- ✅ Which models have optional features
- ⚠️ Which models are missing data

## 🚀 How to Run

### Option 1: PowerShell Script (Easiest)

1. **Edit the script:**
   - Open: `scripts/check-model-data.ps1`
   - Update your email and password at the top

2. **Run it:**
   ```powershell
   .\scripts\check-model-data.ps1
   ```

### Option 2: Manual PowerShell

```powershell
$env:BACKEND_URL = "https://tigermarinewbackend-production.up.railway.app/api"
$env:ADMIN_EMAIL = "your-email@example.com"
$env:ADMIN_PASSWORD = "your-password"
node scripts/check-model-data.js
```

## 📊 What You'll See

The script will show:

```
🔍 Checking Model Data...

📝 Logging in...
✅ Login successful

📦 Fetching models...
Found 12 models

================================================================================
SUMMARY
================================================================================
Total models: 12

✅ Models with specs: 10/12
✅ Models with standard features: 8/12
✅ Models with optional features: 5/12
⚠️  Models with missing data: 4/12

================================================================================
DETAILED REPORT
================================================================================

✅ Open750 (ID: 1)
   Specs: ✅ 8
   Standard Features: ✅ 12
   Optional Features: ✅ 5

⚠️ TopLine950 (ID: 2)
   Specs: ✅ 8
   Standard Features: ❌ Missing
   Optional Features: ❌ Missing
   Issues:
     - No standard features
     - No optional features field
```

## 📄 Output File

The script also creates `model-data-check.json` with:
- Summary statistics
- Detailed data for each model
- List of issues

## 🎯 Next Steps

After running the check:

1. **Review the report:**
   - See which models are missing data
   - Note the specific issues

2. **Add missing data:**
   - Go to Admin Dashboard
   - Select each model with missing data
   - Add specs, features, or optional features

3. **Or export and fix:**
   - Use the JSON file as reference
   - Update models via Admin Dashboard
   - Or use a bulk update script (if needed)

## 💡 Tips

- Run this before major updates to see what's missing
- Use the JSON export as a backup of current state
- Check regularly to ensure data completeness
