# 🚀 High Peak Harvest — Complete Deployment Guide

## How Everything Connects

Your website is a full-stack application with three layers that work together:

```
Frontend (Browser)
       ↓
Backend (Node.js/Express Server)
       ↓
Database (SQLite)
```

---

## 📋 System Architecture

### **Layer 1: Frontend** 
- **Homepage** (`views/index.ejs`)
  - Displays products from database
  - Shows availability table (dynamic)
  - Signup form that submits data to backend

- **Admin Pages** (`views/admin/`)
  - Login page (secure authentication)
  - Dashboard (product management)
  - Product forms (create/edit)
  - Enquiry viewer

### **Layer 2: Backend Server** (`server.js`)
- Express.js web server on **port 3000**
- Routes requests from frontend to database
- Handles authentication (bcrypt password hashing)
- Manages sessions (express-session)
- API endpoints for form submissions

### **Layer 3: Database** (`/data/app.db`)
- SQLite file-based database
- 3 tables: `products`, `admins`, `enquiries`
- Stores all data persistently
- No external database service needed

---

## 🔄 How Data Flows

### **Scenario 1: Viewing Homepage**
```
1. User visits http://localhost:3000
2. Server receives GET request at route /
3. Server queries: SELECT * FROM products
4. Database returns all products
5. Server renders views/index.ejs with product data
6. Browser displays homepage with live product table
```

### **Scenario 2: Submitting Enquiry Form**
```
1. User fills signup form on homepage
2. User clicks "Send me the list"
3. JavaScript sends POST to /submit-enquiry with form data
4. Server validates data
5. Server executes: INSERT INTO enquiries (...)
6. Database stores the enquiry
7. User sees confirmation message
```

### **Scenario 3: Admin Adds New Product**
```
1. Admin logs in at /admin/login
2. Enters email + password
3. Server checks: SELECT * FROM admins WHERE email = ?
4. Server compares bcrypt hashes
5. Session created (admin authenticated)
6. Admin clicks "+ Add New Product"
7. Admin fills form and clicks "Create"
8. Server executes: INSERT INTO products (...)
9. Database stores new product
10. Admin dashboard refreshes showing new product
11. Homepage automatically shows new product (no restart needed!)
```

---

## 💻 Local Development (Current Setup)

### **Currently Running:**
✅ Server: `npm run dev` (running on port 3000)
✅ Database: `/data/app.db` (created and seeded)
✅ All files: Created and working

### **To Keep It Running:**
1. Keep the terminal with `npm run dev` open
2. Access: http://localhost:3000
3. Changes to database (new products, enquiries) are **instant**
4. Changes to code files require **server restart**

### **To Restart Server:**
```bash
# Stop current server: Ctrl+C
# Restart:
npm run dev
```

---

## 🌍 Deploy to Production (Railway)

Railway is the easiest way to host your website live on the internet.

### **Step 1: Push Code to GitHub**

```bash
# In your HighPeakHarvest folder:
git init
git add .
git commit -m "High Peak Harvest - Initial deployment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/high-peak-harvest.git
git push -u origin main
```

(Replace `YOUR_USERNAME` with your actual GitHub username)

### **Step 2: Create Railway Account**
1. Go to https://railway.app
2. Sign up with GitHub (easiest option)
3. Click "New Project"

### **Step 3: Connect GitHub Repository**
1. Select "Deploy from GitHub"
2. Select your `high-peak-harvest` repository
3. Railway auto-detects Node.js project

### **Step 4: Configure Environment Variables**
In Railway dashboard, set these variables:

```
NODE_ENV=production
PORT=3000
SESSION_SECRET=your-super-secret-key-change-this-to-something-random
```

Generate a random SESSION_SECRET:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### **Step 5: Deploy**
- Click "Deploy"
- Wait 2-3 minutes for build to complete
- Railway gives you a live URL like: `https://high-peak-harvest-production.up.railway.app`

### **Step 6: Your Site is Live!**
- **Homepage**: `https://your-railway-url.up.railway.app`
- **Admin**: `https://your-railway-url.up.railway.app/admin/login`
- Same credentials: `admin@highpeakharvest.co.uk` / `admin123`

---

## 🔐 Security Checklist Before Going Live

### **Critical - Change These:**
- [ ] Change admin password in database (run seed.js with new password)
- [ ] Change SESSION_SECRET in .env (use random string)
- [ ] Update WhatsApp phone numbers (grep for 447700000000 in views/index.ejs)
- [ ] Update contact email addresses
- [ ] Remove test/demo products if needed

### **Optional - Recommended:**
- [ ] Enable HTTPS (Railway does this automatically)
- [ ] Set up email notifications for enquiries
- [ ] Add Google Analytics tracking code
- [ ] Create privacy policy page
- [ ] Set up backup of database

---

## 📊 Database Management

### **Current Status:**
- **Location**: `g:\HighPeakHarvest\data\app.db`
- **Size**: Small (< 1MB with sample data)
- **Backup**: Automatically backed up by Railway

### **To View Database Contents (Local)**
```bash
# Using SQLite CLI (if installed):
sqlite3 data/app.db
> SELECT * FROM products;
> SELECT * FROM enquiries;
> .quit
```

### **To Change Admin Password:**
Edit `seed.js` line ~68:
```javascript
const adminPassword = bcrypt.hashSync('NEW_PASSWORD_HERE', 10);
```

Then run:
```bash
npm run seed
```

(This clears all data and resets, so only do on local dev)

### **To Add More Admins (Production):**
Use SQL commands (contact support for Railway database access) or add via code in a one-time migration script.

---

## 🔗 Understanding the File Structure

```
HighPeakHarvest/
├── server.js                  # Express app - listens on port 3000
│   ├── GET /                 → Serves homepage with products
│   ├── POST /submit-enquiry  → Saves form data to database
│   ├── GET/POST /admin/*     → Admin routes (login, CRUD)
│
├── db.js                      # Database setup
│   └── Creates tables: products, admins, enquiries
│
├── seed.js                    # Initial data
│   └── Inserts 10 sample products + admin user
│
├── views/                     # HTML templates
│   ├── index.ejs             # Homepage (EJS template)
│   └── admin/
│       ├── login.ejs         # Login form
│       ├── dashboard.ejs     # Product management
│       └── products/
│           ├── new.ejs       # Create product
│           └── edit.ejs      # Edit product
│
├── data/
│   └── app.db                # SQLite database file
│
├── package.json              # Dependencies
├── .env.example              # Environment variables template
├── README.md                 # Full documentation
└── DEPLOYMENT_GUIDE.md       # This file
```

---

## 🎯 Key Connection Points

### **Frontend → Backend**
1. **Form Submission**: JavaScript fetch() sends JSON
2. **Navigation**: Links point to backend routes
3. **API Calls**: AJAX requests to /submit-enquiry, /admin/products, etc.

### **Backend → Database**
1. **Query Execution**: SQLite3 module executes SQL
2. **Callbacks**: Results returned asynchronously
3. **Rendering**: Data passed to EJS templates

### **Admin Authentication**
1. User logs in with email/password
2. Server checks bcrypt hash
3. Session created and stored in memory (Railway: in-memory)
4. Subsequent requests verified via session cookie

---

## 🚨 Troubleshooting Connection Issues

### **"Cannot GET /admin"**
- Make sure you're visiting: http://localhost:3000/admin/login
- First must log in before accessing dashboard

### **"Database error" on homepage**
```bash
# Reset database:
npm run seed

# Restart server:
npm run dev
```

### **Form doesn't submit**
- Check browser console (F12) for JavaScript errors
- Verify server is running (`npm run dev`)
- Check network tab to see if POST request succeeds

### **Products don't appear on homepage**
- Check admin dashboard to see if products exist
- If empty, run: `npm run seed`
- Make sure server.js is serving views/index.ejs (not old static file)

### **Admin login fails**
- Use exact credentials: `admin@highpeakharvest.co.uk` / `admin123`
- If lost, delete `/data/app.db` and run `npm run seed` again

---

## 📱 What Users See

### **Public Users (Homepage)**
```
GET http://localhost:3000
↓ (server queries products)
↓ (renders index.ejs with data)
Shows:
- Navigation
- Hero section
- Product availability table (live from database)
- Signup form
- Testimonials
- Footer
```

### **Trade Account Holders (Form)**
```
Fill form → Submit → POST /submit-enquiry
↓ (server saves to database)
↓ (sends response)
Shows: "✓ You're on the list!"
(Data saved in enquiries table)
```

### **Admin Users (Dashboard)**
```
Login → POST /admin/login → Check credentials
↓ (session created)
GET /admin → Shows dashboard
Actions:
- View all products
- Edit product
- Delete product
- Add new product
- View enquiries
```

---

## 🔄 Development Workflow

### **Local Changes**
1. Edit code files (server.js, views/*.ejs, etc.)
2. Save file
3. Restart server: `npm run dev`
4. Refresh browser
5. See changes

### **Database Changes**
1. Add/edit products via admin dashboard
2. Changes appear **immediately** (no restart)
3. Refresh homepage to see new products

### **Production Changes**
1. Make code changes locally
2. Test locally with `npm run dev`
3. Commit to Git: `git add . && git commit -m "..."` 
4. Push to GitHub: `git push`
5. Railway **auto-deploys** (2-3 min wait)
6. See changes live at railway.app URL

---

## 📞 Support

### **Common Questions**

**Q: Can I have multiple admin users?**
A: Yes! Add to database with bcrypt-hashed passwords. (See `seed.js` for example)

**Q: How do I add new product categories?**
A: Edit `views/admin/products/new.ejs` and `edit.ejs` dropdown

**Q: Can I change product images?**
A: Images are embedded as base64 in the original index.html CSS. To change, edit those styles.

**Q: How often does the database backup?**
A: Railway auto-backs up daily. For critical data, download manually.

**Q: Can I use a different database?**
A: Yes, replace SQLite with PostgreSQL (modify db.js and package.json)

---

## ✅ Launch Checklist

- [ ] Server running locally: `npm run dev`
- [ ] Homepage loads: http://localhost:3000
- [ ] Admin logs in: http://localhost:3000/admin/login
- [ ] Products display on homepage
- [ ] Form submits and saves enquiries
- [ ] Add/edit products work in admin
- [ ] Password changed from default
- [ ] Repository pushed to GitHub
- [ ] Railway account created
- [ ] Environment variables set in Railway
- [ ] Deployed and live URL works
- [ ] Domain custom configured (optional)

---

## 🌱 You're Ready to Launch!

Your High Peak Harvest website is now **fully connected and ready to use**. 

Start with local testing, then deploy to Railway for your live website.

**Support**: Reference this guide or the README.md for detailed instructions.

**Questions?** Check the code comments in server.js and seed.js for implementation details.

Happy harvesting! 🌱
