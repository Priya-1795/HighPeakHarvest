# How to Push Your Project to GitHub - Complete Guide

## **Step 1: Install Git** (If you don't have it)

### Windows:
1. Go to [git-scm.com](https://git-scm.com)
2. Click **"Download for Windows"**
3. Run the installer, click "Next" through everything
4. Restart your computer

**Verify installation:**
```
git --version
```
You should see something like: `git version 2.40.0`

---

## **Step 2: Create GitHub Account** (If you don't have one)

1. Go to [github.com](https://github.com)
2. Click **"Sign up"**
3. Enter email, password, username
4. Verify email
5. Done! ✓

---

## **Step 3: Create a New Repository on GitHub**

1. Log into [github.com](https://github.com)
2. Click **"+"** icon (top right) → **"New repository"**
3. Fill in:
   - **Repository name:** `HighPeakHarvest` (or anything you want)
   - **Description:** `High Peak Harvest - Microgreens & Mushrooms Trade Platform`
   - **Public** or **Private** (your choice)
4. **DO NOT** check "Initialize with README" (we have our own)
5. Click **"Create repository"**

You'll see a page with commands. **COPY the HTTPS URL** (looks like: `https://github.com/YOUR-USERNAME/HighPeakHarvest.git`)

---

## **Step 4: Initialize Git in Your Project**

Open PowerShell in your project folder:

```powershell
cd g:\HighPeakHarvest

# Initialize git
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit: High Peak Harvest - Node.js/Express/SQLite app"

# Add GitHub as remote (PASTE YOUR GITHUB URL HERE)
git remote add origin https://github.com/YOUR-USERNAME/HighPeakHarvest.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**Replace:** `YOUR-USERNAME` with your actual GitHub username!

---

## **Step 5: Enter GitHub Credentials**

When prompted:
- **Username:** Your GitHub username
- **Password:** Your GitHub personal access token (NOT your password!)

### Getting Personal Access Token:
1. Log into GitHub
2. Settings → Developer settings → **Personal access tokens**
3. Click **"Generate new token"**
4. Select: `repo` (full control of private repositories)
5. Copy the token
6. Paste when Git asks for password

---

## **Step 6: Verify on GitHub**

1. Go to your GitHub repository page
2. You should see all your files there! ✓
3. Click on files to view code

---

## **What Gets Uploaded:**

✅ `server.js` - Backend code  
✅ `views/` - HTML templates  
✅ `package.json` - Dependencies  
✅ `seed.js` - Database seeding  
✅ `.env.example` - Environment template  
✅ `README.md` - Documentation  
✅ `DEPLOYMENT_GUIDE.md` - Deploy instructions  

❌ `node_modules/` - NOT uploaded (too big)  
❌ `.env` - NOT uploaded (has secrets)  
❌ `data/app.db` - NOT uploaded (will be created fresh on Railway)  

---

## **After GitHub: Deploy to Railway**

Once your code is on GitHub, Railway can auto-deploy:

1. Go to [railway.app](https://railway.app)
2. Click "Deploy from GitHub"
3. Connect GitHub account
4. Select `HighPeakHarvest` repo
5. Railway auto-deploys! ✓

Every time you push to GitHub, Railway auto-updates! 🚀

---

## **Quick Commands Reference**

```powershell
# Check status
git status

# See what changed
git diff

# Add changes
git add .

# Commit changes
git commit -m "Your message here"

# Push to GitHub
git push

# Pull latest (if working on multiple computers)
git pull
```

---

## **Common Issues & Fixes**

| Issue | Fix |
|-------|-----|
| "git: command not found" | Git not installed. Download from git-scm.com |
| "permission denied" | Use HTTPS URL, not SSH |
| "fatal: not a git repository" | Run `git init` first |
| "fatal: Could not read Username" | Use personal access token, not password |

---

## **Next Steps**

1. ✅ Install Git (if needed)
2. ✅ Create GitHub account
3. ✅ Create new repository on GitHub
4. ✅ Copy HTTPS URL from GitHub
5. ✅ Run the commands from Step 4 above
6. ✅ Verify files appear on GitHub
7. ✅ Then deploy to Railway!

**Let me know when you've pushed to GitHub! Then I'll help deploy to Railway.**
