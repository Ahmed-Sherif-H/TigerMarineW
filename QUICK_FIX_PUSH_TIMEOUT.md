# 🚨 Quick Fix for Push Timeout (HTTP 408)

## Problem

You're getting:
```
error: RPC failed; HTTP 408
fatal: the remote end hung up unexpectedly
```

This happens because:
- You're trying to push **1.26 GiB** of data
- Large files are still in **Git history** (even if in .gitignore)
- GitHub times out after ~5-10 minutes

## ✅ Solution Options

### Option 1: Remove Large Files from History (Recommended)

**Best tool: git filter-repo**

```powershell
# 1. Install git-filter-repo
pip install git-filter-repo

# 2. Remove all video files from history
git filter-repo --path-glob 'public/images/**/*.mp4' --invert-paths
git filter-repo --path-glob 'public/images/**/*.mov' --invert-paths
git filter-repo --path-glob 'public/images/**/*.MP4' --invert-paths
git filter-repo --path-glob 'public/images/**/*.MOV' --invert-paths

# 3. Clean up
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# 4. Force push (WARNING: rewrites history!)
git push --force
```

### Option 2: Use BFG Repo-Cleaner (Easier)

```powershell
# 1. Download BFG: https://rtyley.github.io/bfg-repo-cleaner/
# 2. Run:
java -jar bfg.jar --strip-blobs-bigger-than 50M

# 3. Clean up
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# 4. Force push
git push --force
```

### Option 3: Start Fresh (If you don't need history)

```powershell
# 1. Create a new orphan branch (no history)
git checkout --orphan new-main
git add .
git commit -m "Initial commit without large files"

# 2. Delete old branch and rename
git branch -D main  # or master
git branch -m main

# 3. Force push
git push -f origin main
```

### Option 4: Push in Smaller Chunks (Temporary workaround)

```powershell
# Push only recent commits
git push origin HEAD~10:main  # Push last 10 commits
# Then gradually push more
```

## 🎯 Recommended: Use git filter-repo

### Step-by-Step:

1. **Install Python** (if not installed):
   ```powershell
   # Check if Python is installed
   python --version
   
   # If not, install from: https://www.python.org/downloads/
   ```

2. **Install git-filter-repo**:
   ```powershell
   pip install git-filter-repo
   ```

3. **Run the script to see what needs cleaning**:
   ```powershell
   .\clean-git-history.ps1 -DryRun
   ```

4. **Remove video files from history**:
   ```powershell
   git filter-repo --path-glob 'public/images/**/*.mp4' --invert-paths
   git filter-repo --path-glob 'public/images/**/*.mov' --invert-paths
   git filter-repo --path-glob 'public/images/**/*.MP4' --invert-paths
   git filter-repo --path-glob 'public/images/**/*.MOV' --invert-paths
   ```

5. **Clean up Git**:
   ```powershell
   git reflog expire --expire=now --all
   git gc --prune=now --aggressive
   ```

6. **Check size**:
   ```powershell
   git count-objects -vH
   # Should show much smaller size now
   ```

7. **Force push**:
   ```powershell
   git push --force
   ```

## ⚠️ Important Warnings

1. **Force push rewrites history** - Others will need to re-clone
2. **Make a backup first** - Copy your repo folder
3. **Work on a branch** - Don't do this on main if others are using it
4. **After cleaning** - Make sure `.gitignore` has the large files

## 📊 Expected Results

- **Before**: 1.26 GiB (times out)
- **After**: ~50-200 MB (pushes successfully)
- **Time**: 5-30 minutes depending on history size

## 🔄 After Success

1. ✅ Large files removed from history
2. ✅ Push should work now
3. ✅ Files still on your disk (in .gitignore)
4. ✅ Optimize files later or host externally

---

**Need help?** Run `.\clean-git-history.ps1 -DryRun` to see what needs cleaning.

