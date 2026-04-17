# 🌱 High Peak Harvest — Implementation Summary

## What Was Built

A complete **Node.js + Express + SQLite** conversion of your High Peak Harvest website, preserving the original design while adding:

✅ **Backend**: Node.js server with Express  
✅ **Database**: SQLite with 3 tables (products, admins, enquiries)  
✅ **Admin Panel**: Secure login, product CRUD, enquiry viewing  
✅ **Frontend**: EJS templates reusing your CSS, dynamic product table  
✅ **Deployment**: Ready for Railway or any Node host  

---

## Project Structure Created

```
HighPeakHarvest/
├── server.js                 # Main Express app (routes, middleware)
├── db.js                     # Database setup
├── seed.js                   # Seed database with sample data
├── package.json              # Dependencies
├── .env.example              # Environment variables template
├── .gitignore                # Git ignore patterns
├── README.md                 # Full documentation
│
├── views/                    # EJS templates
│   ├── index.ejs             # Homepage (product table + form)
│   ├── 404.ejs               # Error page
│   └── admin/
│       ├── login.ejs         # Admin login
│       ├── dashboard.ejs     # Product management
│       ├── enquiries.ejs     # View submissions
│       └── products/
│           ├── new.ejs       # Create product
│           └── edit.ejs      # Edit product
│
├── public/                   # Static files
│   └── css/                  # (for future use)
│
└── data/                     # (created after seed)
    └── app.db                # SQLite database file
```

---

## Database Design

### Products Table
- `id`, `name`, `category`, `pack_sizes`, `status`, `created_at`
- Pre-seeded with 10 products matching your original inventory

### Admins Table
- `id`, `email`, `password_hash`, `created_at`
- Default: `admin@highpeakharvest.co.uk` / `admin123`

### Enquiries Table
- `id`, `name`, `email`, `business_name`, `business_type`, `town`, `created_at`
- Stores all form submissions from homepage

---

## Key Features Implemented

### 1. **Homepage** (`/`)
- Displays all products from database in a table
- Product availability section with status badges
- Trade account signup form
- Form submits to `/submit-enquiry` endpoint
- Preserves original design & styling

### 2. **Admin Login** (`/admin/login`)
- Secure bcrypt password hashing
- Session-based authentication
- Redirects unauthorized users
- Default credentials for testing

### 3. **Admin Dashboard** (`/admin`)
- View all products in a table
- Links to edit/delete each product
- Stats overview
- Link to view enquiries

### 4. **Product Management**
- **Create** (`/admin/products/new`) — Add new product
- **Read** (`/admin`) — View all products
- **Update** (`/admin/products/:id/edit`) — Modify product
- **Delete** (`/admin/products/:id/delete`) — Remove product

### 5. **Enquiry Viewing** (`/admin/enquiries`)
- Display all submitted form requests
- Shows name, business, type, location, email, date
- Clickable email links for contacting leads

---

## How To Run Locally

### Step 1: Install dependencies
```bash
cd HighPeakHarvest
npm install
```

### Step 2: Create `.env` file
```bash
cp .env.example .env
```

### Step 3: Seed database
```bash
npm run seed
```

Output:
```
Created new database
Products seeded successfully
Admin user created: admin@highpeakharvest.co.uk / admin123

Database seeded successfully!
Run: npm run dev
```

### Step 4: Start server
```bash
npm run dev
```

Output:
```
Connected to SQLite database
🌱 High Peak Harvest server running on http://localhost:3000
📊 Admin panel: http://localhost:3000/admin/login
```

### Step 5: Visit
- **Homepage**: http://localhost:3000
- **Admin**: http://localhost:3000/admin/login (admin123)

---

## How To Deploy

### Option A: Railway (Recommended)
1. Push repo to GitHub
2. Go to railway.app
3. **New Project** → **Deploy from GitHub**
4. Select repository
5. Add `NODE_ENV=production` and `SESSION_SECRET=<random-string>`
6. Deploy!

Railway handles everything automatically.

### Option B: Other Node Hosts (Heroku, etc.)
1. Use `npm start` to run
2. Set environment variables in host dashboard
3. Database file `/data/app.db` persists automatically

---

## Default Admin Credentials

**Email**: `admin@highpeakharvest.co.uk`  
**Password**: `admin123`

⚠️ **Change these immediately** before going live!

To change:
1. Log in
2. Edit `seed.js` with new credentials
3. Re-run `npm run seed`

Or create new admin via database if you forget password.

---

## API Endpoints

### Public
- `GET /` — Homepage
- `POST /submit-enquiry` — Submit form (JSON)

### Protected Admin Routes
- `GET /admin/login` — Login page
- `POST /admin/login` — Process login
- `GET /admin` — Dashboard
- `GET /admin/logout` — Logout
- `GET/POST /admin/products` — Create
- `GET/POST /admin/products/:id/edit` — Update
- `POST /admin/products/:id/delete` — Delete
- `GET /admin/enquiries` — View submissions

All admin routes require session authentication.

---

## Files Included

| File | Purpose |
|------|---------|
| `server.js` | Main Express application |
| `db.js` | Database initialization |
| `seed.js` | Sample data & admin user setup |
| `package.json` | npm dependencies |
| `.env.example` | Environment variables template |
| `.gitignore` | Git exclusions |
| `README.md` | Full documentation |
| `views/index.ejs` | Homepage template |
| `views/admin/login.ejs` | Admin login form |
| `views/admin/dashboard.ejs` | Product management |
| `views/admin/enquiries.ejs` | View form submissions |
| `views/admin/products/new.ejs` | Create product form |
| `views/admin/products/edit.ejs` | Edit product form |
| `views/404.ejs` | Error page |

---

## Dependencies Used

```json
{
  "express": "^4.18.2",           // Web framework
  "ejs": "^3.1.9",                // Template engine
  "sqlite3": "^5.1.6",            // Database driver
  "bcryptjs": "^2.4.3",           // Password hashing
  "express-session": "^1.17.3",   // Session management
  "dotenv": "^16.3.1"             // Environment variables
}
```

All packages are beginner-friendly and well-documented.

---

## Customization Guide

### Change Default Password
Edit `seed.js` line 68:
```javascript
const adminPassword = bcrypt.hashSync('NEW_PASSWORD', 10);
```

### Add Product Categories
Edit `views/admin/products/new.ejs` and `edit.ejs`:
```html
<option value="Your Category">Your Category</option>
```

### Change Colors
Edit `views/index.ejs` CSS variables:
```css
:root {
  --green-deep: #1B3A27;
  --gold: #C9A84C;
  /* ... */
}
```

### Change Session Timeout
Edit `server.js` line with `maxAge`:
```javascript
maxAge: 1000 * 60 * 60 * 24 // 24 hours
```

---

## Troubleshooting

### "Cannot find module sqlite3"
```bash
npm install sqlite3
```

### Database doesn't exist
```bash
npm run seed
```

### Admin login fails
Default password: `admin123`  
If lost, delete `/data/app.db` and re-seed.

### Port already in use
Change `PORT` in `.env` or kill process on 3000.

---

## Next Steps

1. ✅ Install dependencies: `npm install`
2. ✅ Seed database: `npm run seed`
3. ✅ Start locally: `npm run dev`
4. ✅ Test admin: http://localhost:3000/admin/login
5. ✅ Change admin password in production
6. ✅ Deploy to Railway or your host
7. ✅ Update WhatsApp numbers and contact info in `index.ejs`

---

## Support Resources

- **Node.js Docs**: https://nodejs.org/docs/
- **Express Guide**: https://expressjs.com/
- **SQLite Docs**: https://www.sqlite.org/docs.html
- **EJS Guide**: https://ejs.co/
- **Railway Docs**: https://docs.railway.app/

---

## What's Preserved from Original

✅ **Design**: Original HTML/CSS structure intact  
✅ **Branding**: Color scheme, typography, logo  
✅ **Layout**: Navigation, hero, sections  
✅ **Product List**: All original products pre-seeded  
✅ **Form**: Same fields and styling  

---

## What's New

✅ **Backend**: Node.js/Express instead of static HTML  
✅ **Database**: SQLite for dynamic content  
✅ **Admin Panel**: Complete product & enquiry management  
✅ **Sessions**: Secure login with password hashing  
✅ **Scalability**: Easy to add features, users, products  

---

**🌱 Your website is now fully dynamic and ready to scale!**

Questions? See README.md for complete documentation.
