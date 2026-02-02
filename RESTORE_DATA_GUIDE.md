# Restore Model Data Guide

## 🔄 What This Does

This script restores **specs**, **standardFeatures**, and **optionalFeatures** from your exported JSON file (`tiger-marine-data-2026-02-01.json`) back to the database.

## 🚀 How to Run

### Step 1: Edit the Script

1. **Open:** `scripts/restore-model-data.ps1`
2. **Update your credentials:**
   ```powershell
   $ADMIN_EMAIL = "your-actual-email@example.com"  # <-- CHANGE THIS
   $ADMIN_PASSWORD = "your-actual-password"         # <-- CHANGE THIS
   ```
3. **Save the file**

### Step 2: Run the Script

```powershell
.\scripts\restore-model-data.ps1
```

## 📊 What You'll See

The script will:
1. Load the exported JSON file
2. Login to your backend
3. Fetch all models from database
4. Match models by name
5. Restore specs, standardFeatures, and optionalFeatures
6. Show progress for each model

Example output:
```
🔄 Restoring Model Data...

📂 Loading exported data...
✅ Loaded 12 models from export

📝 Logging in...
✅ Login successful

📦 Fetching models from database...
✅ Found 12 models in database

🔄 Processing: Open750 (ID: 1)
  - Specs: 15 entries
  - Standard Features: 25 items
  - Optional Features: 12 items
  💾 Updating database...
  ✅ Restored successfully

...

================================================================================
RESTORE SUMMARY
================================================================================
Total models in database: 12
Total models in export: 12
✅ Restored: 12
⏭️  Skipped: 0
⚠️  Not found in export: 0

✅ Restore complete!
```

## ✅ After Restore

1. **Verify in Admin Dashboard:**
   - Go to Admin Dashboard
   - Select a model
   - Check that specs, features, and optional features are restored

2. **Check the frontend:**
   - Visit model detail pages
   - Verify specs display correctly
   - Verify features list shows
   - Verify optional features show

## ⚠️ Important Notes

1. **Model Names Must Match:**
   - The script matches models by name (e.g., "Open750", "TopLine950")
   - If names don't match, those models will be skipped

2. **Only Restores Missing Data:**
   - The script only restores specs, standardFeatures, and optionalFeatures
   - Other data (images, descriptions, etc.) is NOT changed

3. **Backup First:**
   - The script updates the database
   - Make sure you have a backup if needed

## 🆘 Troubleshooting

### "Data file not found"

**Problem:** The JSON file is not in the root directory

**Solution:**
- Make sure `tiger-marine-data-2026-02-01.json` is in the root folder
- Or set `DATA_FILE` environment variable to the correct path

### "No matching data found in export"

**Problem:** Model name in database doesn't match export

**Solution:**
- Check model names match exactly (case-sensitive)
- Example: "Open750" not "open750" or "Open 750"

### "Login failed"

**Problem:** Wrong credentials

**Solution:**
- Double-check email and password
- Make sure there are no extra spaces

## 📋 What Gets Restored

✅ **Specs** - All specification data (length, beam, etc.)  
✅ **Standard Features** - Array of standard features  
✅ **Optional Features** - Array of optional features with name, description, category, price

## ❌ What Does NOT Get Restored

❌ Image files (already handled by migration)  
❌ Descriptions (not changed)  
❌ Other model properties (not changed)

## 🎯 Quick Checklist

- [ ] Exported JSON file is in root directory
- [ ] Script credentials are updated
- [ ] Run the restore script
- [ ] Verify data in Admin Dashboard
- [ ] Check frontend displays correctly
