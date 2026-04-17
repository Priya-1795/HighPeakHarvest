# Deploying to Railway - Step by Step Guide

## **Step 1: Create Railway Account** (2 minutes)
1. Go to [railway.app](https://railway.app)
2. Click **"Start a Project"** 
3. Sign up with GitHub (easiest) or Email

---

## **Step 2: Create New Project**
1. Click **"Create New Project"**
2. Select **"Deploy from GitHub"** OR **"Create Empty Project"**

### **Option A: If you have GitHub** (Recommended)
1. Push your code to GitHub
2. Select your repository
3. Railway auto-deploys on each push ✓

### **Option B: If NO GitHub** (What we'll do)
1. Click **"Create Empty Project"**
2. Follow steps below...

---

## **Step 3: Configure Your App**

### **If using GitHub:**
- Railway auto-reads your `package.json`
- Detects it's a Node.js app
- Auto-runs `npm install && npm start`
- Done! ✓

### **If uploading manually:**
1. In Railway, click **"Add Service"** → **"GitHub"** → **"Create from Template"** → Search "Node.js"
2. OR click **"Dockerfile"** and I'll provide one

---

## **Step 4: Set Environment Variables** (Important!)
In Railway dashboard:
1. Click your Project → Settings
2. Add these variables:
   ```
   NODE_ENV=production
   PORT=3000
   SESSION_SECRET=your-random-secret-key-here-make-it-long
   ```

---

## **Step 5: Deploy & Get Your URL**
1. Railway automatically deploys
2. You'll get a URL like: `https://highpeakharvest-production.up.railway.app`
3. Your site is LIVE! 🎉

---

## **After Deployment:**

### **Test it:**
- Visit your Railway URL in browser
- Test the form submission
- Check admin panel works
- Download PDF

### **Connect Custom Domain (Optional):**
1. In Railway: Settings → Domains
2. Add `highpeakharvest.co.uk`
3. Update your domain's DNS records (I can guide this)

### **Monitor Your App:**
- Railway dashboard shows logs
- See form submissions in admin panel
- Database persists automatically

---

## **Quick Troubleshooting:**

| Issue | Solution |
|-------|----------|
| App won't start | Check logs in Railway → your service |
| Database errors | Railway auto-backs up SQLite |
| Forms not working | Verify SESSION_SECRET is set |
| PDF download fails | Check file permissions |

---

## **Next: What to Do NOW**

1. ✅ Go to [railway.app](https://railway.app)
2. ✅ Create account
3. ✅ Tell me if you chose GitHub or Manual upload
4. ✅ Send me your error logs if any issues

**Then I'll guide you through the exact next steps!**

---

## **Support:**
- Railway Docs: [docs.railway.app](https://docs.railway.app)
- Need help? Just screenshot the error and I'll fix it
