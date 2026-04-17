const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');

const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'app.db');

// Delete existing database to start fresh
if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath);
  console.log('Deleted existing database');
}

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err);
    process.exit(1);
  }
  console.log('Created new database');
});

db.serialize(() => {
  // Create tables
  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      pack_sizes TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'In stock',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS enquiries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      business_name TEXT NOT NULL,
      business_type TEXT NOT NULL,
      town TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Seed admin user
  const adminPassword = bcrypt.hashSync('admin123', 10);
  db.run(
    `INSERT INTO admins (email, password_hash) VALUES (?, ?)`,
    ['admin@highpeakharvest.co.uk', adminPassword],
    function(err) {
      if (err) {
        console.error('Error inserting admin:', err);
      } else {
        console.log('Admin user created: admin@highpeakharvest.co.uk / admin123');
      }
    }
  );

  // Seed products
  const products = [
    {
      name: 'Pea Shoots',
      category: 'Microgreens',
      pack_sizes: '100g · 250g',
      status: 'In stock'
    },
    {
      name: 'Sunflower',
      category: 'Microgreens',
      pack_sizes: '100g · 250g',
      status: 'In stock'
    },
    {
      name: 'Radish',
      category: 'Microgreens',
      pack_sizes: '50g · 100g',
      status: 'In stock'
    },
    {
      name: 'Broccoli / Kale',
      category: 'Microgreens',
      pack_sizes: '50g · 100g',
      status: 'Limited'
    },
    {
      name: 'Fresh Oyster Mushrooms',
      category: 'Mushrooms',
      pack_sizes: '500g · 1kg',
      status: 'In stock'
    },
    {
      name: 'Smoked Oyster Mushrooms',
      category: 'Smoked',
      pack_sizes: '100g · 200g',
      status: 'In stock'
    },
    {
      name: 'Smoked Garlic',
      category: 'Smoked',
      pack_sizes: '250g · 500g',
      status: 'Limited'
    },
    {
      name: 'Smoked Salt',
      category: 'Smoked',
      pack_sizes: '150g · 300g',
      status: 'In stock'
    },
    {
      name: 'Mushroom Jerky – Teriyaki',
      category: 'Snack',
      pack_sizes: '57g (2oz)',
      status: 'In stock'
    },
    {
      name: 'Seasonal Specialty',
      category: 'Limited edition',
      pack_sizes: 'Ask us',
      status: 'Ask us'
    }
  ];

  products.forEach(product => {
    db.run(
      `INSERT INTO products (name, category, pack_sizes, status) VALUES (?, ?, ?, ?)`,
      [product.name, product.category, product.pack_sizes, product.status],
      function(err) {
        if (err) {
          console.error('Error inserting product:', err);
        }
      }
    );
  });

  console.log('Products seeded successfully');
});

db.close((err) => {
  if (err) {
    console.error('Error closing database:', err);
    process.exit(1);
  }
  console.log('\nDatabase seeded successfully!');
  console.log('Run: npm run dev');
});
