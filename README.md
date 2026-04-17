# High Peak Harvest — Full Stack Farm Website

A modern Node.js + Express + SQLite website for **High Peak Harvest** — a microgreens and mushroom farm. Features a public-facing homepage displaying weekly product availability, plus a secure admin dashboard for managing inventory and trade enquiries.

## Features

✅ **Homepage**
- Responsive design preserving original aesthetic
- Dynamic product availability table (pulls from database)
- Trade account signup form with validation
- Admin dashboard link

✅ **Admin Dashboard**
- Secure login with bcrypt password hashing
- Product management (Create, Read, Update, Delete)
- View all trade enquiries
- Real-time inventory status updates

✅ **Database**
- SQLite (file-based, no external database needed)
- Three tables: `products`, `admins`, `enquiries`
- Pre-seeded with sample data
- Includes default admin user for testing

✅ **Deployment Ready**
- Works perfectly on Railway, Heroku, or any Node.js host
- Includes `.env.example` for easy configuration
- Database stored in `/data/app.db`
- Seed script for fresh database

---

## Quick Start (Local Development)

### Prerequisites
- **Node.js** 14+ and npm
- **Git** (optional)

### 1. Clone or download this project
```bash
cd HighPeakHarvest
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
```bash
cp .env.example .env
```
Edit `.env` if needed (default values are fine for local dev):
```
NODE_ENV=development
PORT=3000
SESSION_SECRET=your-super-secret-session-key-change-this
```

### 4. Seed the database
```bash
npm run seed
```

This creates `/data/app.db` with:
- 10 sample products
- Admin user: `admin@highpeakharvest.co.uk` / `admin123`
- Empty enquiries table ready to receive form submissions

### 5. Start the server
```bash
npm run dev
```

Output:
```
🌱 High Peak Harvest server running on http://localhost:3000
📊 Admin panel: http://localhost:3000/admin/login
```

### 6. Visit the site
- **Homepage**: http://localhost:3000
- **Admin**: http://localhost:3000/admin/login
  - Email: `admin@highpeakharvest.co.uk`
  - Password: `admin123`

---

## Project Structure

```
HighPeakHarvest/
├── server.js                  # Main Express server
├── db.js                      # Database initialization
├── seed.js                    # Database seeding script
├── package.json
├── .env.example
├── README.md
├── data/
│   └── app.db                 # SQLite database (auto-created)
├── public/                    # Static assets
│   └── css/
├── views/
│   ├── index.ejs              # Homepage
│   ├── 404.ejs                # Not found page
│   └── admin/
│       ├── login.ejs          # Admin login page
│       ├── dashboard.ejs      # Product management
│       ├── enquiries.ejs      # View enquiries
│       └── products/
│           ├── new.ejs        # Create product form
│           └── edit.ejs       # Edit product form
```

---

## Routes & Endpoints

### **Public Routes**

| Route | Method | Description |
|-------|--------|-------------|
| `/` | GET | Homepage with product availability table |
| `/submit-enquiry` | POST | Submit trade account signup form |

### **Admin Routes**

| Route | Method | Description |
|-------|--------|-------------|
| `/admin/login` | GET | Login page |
| `/admin/login` | POST | Process login |
| `/admin` | GET | Dashboard (protected) |
| `/admin/logout` | GET | Logout |
| `/admin/products/new` | GET | New product form (protected) |
| `/admin/products` | POST | Create product (protected) |
| `/admin/products/:id/edit` | GET | Edit product form (protected) |
| `/admin/products/:id` | POST | Update product (protected) |
| `/admin/products/:id/delete` | POST | Delete product (protected) |
| `/admin/enquiries` | GET | View all enquiries (protected) |

---

## Database Schema

### `products` table
```sql
CREATE TABLE products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  pack_sizes TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'In stock',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

### `admins` table
```sql
CREATE TABLE admins (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

### `enquiries` table
```sql
CREATE TABLE enquiries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  business_name TEXT NOT NULL,
  business_type TEXT NOT NULL,
  town TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

---

## Environment Variables

Create a `.env` file (copy from `.env.example`):

```env
NODE_ENV=development          # or 'production'
PORT=3000                     # Server port
SESSION_SECRET=change-me      # Session encryption key
ADMIN_EMAIL=admin@...         # (optional) Admin credentials
ADMIN_PASSWORD=change-me      # (optional) Pre-configured at seed time
```

---

## Deployment to Railway

Railway is the easiest option for deployment.

### 1. Push to GitHub (if not already)
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/high-peak-harvest.git
git push -u origin main
```

### 2. Deploy on Railway
1. Go to [railway.app](https://railway.app)
2. Sign up/log in
3. Click **New Project** → **Deploy from GitHub**
4. Select this repository
5. Railway auto-detects Node.js and creates a `Procfile`
6. Add environment variables:
   - `NODE_ENV=production`
   - `SESSION_SECRET=<generate-a-strong-random-string>`
7. Deploy!

Railway automatically:
- Installs dependencies (`npm install`)
- Runs seed script on first deploy (if configured)
- Manages the SQLite database file
- Provides a public URL

### Access After Deployment
- **Homepage**: `https://your-railway-url.railway.app`
- **Admin**: `https://your-railway-url.railway.app/admin/login`

---

## Adding a New Admin User

### Option 1: Via seed script (development)
Edit `seed.js` to add more admin users, then run:
```bash
npm run seed
```

### Option 2: Via database directly
Connect to SQLite and run:
```sql
INSERT INTO admins (email, password_hash) 
VALUES ('newadmin@example.com', '<bcrypt-hash>');
```

Generate a bcrypt hash using Node.js:
```bash
node -e "console.log(require('bcryptjs').hashSync('your_password', 10))"
```

---

## Customization

### Change Default Admin Credentials
Edit `seed.js` before running:
```javascript
const adminPassword = bcrypt.hashSync('YOUR_NEW_PASSWORD', 10);
db.run(
  `INSERT INTO admins (email, password_hash) VALUES (?, ?)`,
  ['your_email@example.com', adminPassword]
);
```

### Add More Product Categories
Edit the product form in `views/admin/products/new.ejs`:
```html
<option value="New Category">New Category</option>
```

### Customize Homepage Styling
Edit `views/index.ejs` CSS variables in the `<style>` tag:
```css
:root {
  --green-deep: #1B3A27;
  --gold: #C9A84C;
  /* etc */
}
```

---

## Troubleshooting

### **"Port 3000 is already in use"**
Change PORT in `.env` or kill the process:
```bash
# macOS/Linux
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### **"Database not found" error**
Ensure `/data/` directory exists and database is seeded:
```bash
npm run seed
```

### **Admin login doesn't work**
Check the default credentials in the login form or `seed.js`. If lost, re-seed the database.

### **enquiry form submits but doesn't appear in admin panel**
Check browser console for errors. Ensure the fetch request to `/submit-enquiry` returns 200 status.

---

## Technologies Used

- **Node.js** – JavaScript runtime
- **Express.js** – Web framework
- **SQLite** – Lightweight database
- **EJS** – Template engine
- **bcryptjs** – Password hashing
- **express-session** – Session management
- **dotenv** – Environment variables

---

## License & Credits

This is a custom build for **High Peak Harvest**. Preserve branding and design.

---

## Support

For issues or questions:
1. Check the **Troubleshooting** section above
2. Review **server.js** and **db.js** for database issues
3. Check browser console for client-side errors
4. Verify `.env` configuration

---

**🌱 Happy harvesting! 🌱**
