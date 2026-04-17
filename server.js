const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const PDFDocument = require('pdfkit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Ensure data directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Database connection
const dbPath = path.join(dataDir, 'app.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Database error:', err);
  } else {
    console.log('Connected to SQLite database');
  }
});

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 // 24 hours
  }
}));

// Auth middleware
const isAdmin = (req, res, next) => {
  if (req.session.adminId) {
    next();
  } else {
    res.redirect('/admin/login');
  }
};

// ==================== PUBLIC ROUTES ====================

// Homepage
app.get('/', (req, res) => {
  db.all('SELECT * FROM products ORDER BY id', (err, products) => {
    if (err) {
      console.error(err);
      products = [];
    }
    res.render('index', { products });
  });
});

// Submit enquiry form
app.post('/submit-enquiry', (req, res) => {
  const { name, email, business_name, business_type, town } = req.body;

  // Basic validation
  if (!name || !email || !business_name || !business_type || !town) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  db.run(
    `INSERT INTO enquiries (name, email, business_name, business_type, town) 
     VALUES (?, ?, ?, ?, ?)`,
    [name, email, business_name, business_type, town],
    function(err) {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to submit enquiry' });
      }
      res.json({ success: true, message: 'Enquiry submitted successfully!' });
    }
  );
});

// ==================== ADMIN ROUTES ====================

// Admin login page
app.get('/admin/login', (req, res) => {
  if (req.session.adminId) {
    res.redirect('/admin');
  } else {
    res.render('admin/login', { error: null });
  }
});

// Admin login handler
app.post('/admin/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.render('admin/login', { error: 'Email and password are required' });
  }

  db.get('SELECT * FROM admins WHERE email = ?', [email], (err, admin) => {
    if (err || !admin) {
      return res.render('admin/login', { error: 'Invalid email or password' });
    }

    if (bcrypt.compareSync(password, admin.password_hash)) {
      req.session.adminId = admin.id;
      req.session.adminEmail = admin.email;
      res.redirect('/admin');
    } else {
      res.render('admin/login', { error: 'Invalid email or password' });
    }
  });
});

// Admin logout
app.get('/admin/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/admin/login');
});

// Admin dashboard
app.get('/admin', isAdmin, (req, res) => {
  db.all('SELECT * FROM products ORDER BY id', (err, products) => {
    if (err) {
      console.error(err);
      products = [];
    }
    res.render('admin/dashboard', { products, adminEmail: req.session.adminEmail });
  });
});

// New product form
app.get('/admin/products/new', isAdmin, (req, res) => {
  res.render('admin/products/new', { adminEmail: req.session.adminEmail });
});

// Create product
app.post('/admin/products', isAdmin, (req, res) => {
  const { name, category, pack_sizes, status } = req.body;

  if (!name || !category || !pack_sizes || !status) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  db.run(
    `INSERT INTO products (name, category, pack_sizes, status) 
     VALUES (?, ?, ?, ?)`,
    [name, category, pack_sizes, status],
    function(err) {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to create product' });
      }
      res.json({ success: true, productId: this.lastID });
    }
  );
});

// Edit product form
app.get('/admin/products/:id/edit', isAdmin, (req, res) => {
  const { id } = req.params;

  db.get('SELECT * FROM products WHERE id = ?', [id], (err, product) => {
    if (err || !product) {
      return res.status(404).render('404', { message: 'Product not found' });
    }
    res.render('admin/products/edit', { product, adminEmail: req.session.adminEmail });
  });
});

// Update product
app.post('/admin/products/:id', isAdmin, (req, res) => {
  const { id } = req.params;
  const { name, category, pack_sizes, status } = req.body;

  if (!name || !category || !pack_sizes || !status) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  db.run(
    `UPDATE products SET name = ?, category = ?, pack_sizes = ?, status = ? 
     WHERE id = ?`,
    [name, category, pack_sizes, status, id],
    function(err) {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to update product' });
      }
      res.json({ success: true });
    }
  );
});

// Delete product
app.post('/admin/products/:id/delete', isAdmin, (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM products WHERE id = ?', [id], function(err) {
    if (err) {
      console.error(err);
      return res.status(500).redirect('/admin?error=Failed to delete product');
    }
    res.redirect('/admin?success=Product deleted');
  });
});

// View enquiries
app.get('/admin/enquiries', isAdmin, (req, res) => {
  db.all('SELECT * FROM enquiries ORDER BY created_at DESC', (err, enquiries) => {
    if (err) {
      console.error(err);
      enquiries = [];
    }
    res.render('admin/enquiries', { enquiries, adminEmail: req.session.adminEmail });
  });
});

// ==================== PDF DOWNLOAD ====================

// Download trade list as PDF
app.get('/api/download-trade-list', (req, res) => {
  db.all('SELECT * FROM products WHERE status != "Unavailable" ORDER BY category, name', (err, products) => {
    if (err) {
      return res.status(500).send('Error generating PDF');
    }

    // Create PDF document
    const doc = new PDFDocument({ margin: 40 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="HighPeakHarvest_Trade_List.pdf"');

    doc.pipe(res);

    // Header
    doc.fontSize(24).font('Helvetica-Bold').text('HIGH PEAK HARVEST', { align: 'center' });
    doc.fontSize(12).font('Helvetica').text('Weekly Trade List', { align: 'center' });
    doc.fontSize(10).fillColor('#666').text(`Generated: ${new Date().toLocaleDateString('en-GB')}`, { align: 'center' });
    
    doc.moveDown();
    doc.moveTo(40, doc.y).lineTo(555, doc.y).stroke('#C9A84C');
    doc.moveDown();

    // Group products by category
    const categories = [...new Set(products.map(p => p.category))];
    
    categories.forEach(category => {
      const categoryProducts = products.filter(p => p.category === category);
      
      doc.fontSize(14).font('Helvetica-Bold').fillColor('#1B3A27').text(category, { underline: true });
      doc.moveDown(0.3);

      categoryProducts.forEach(product => {
        // Product name and status
        doc.fontSize(11).font('Helvetica-Bold').fillColor('#000').text(product.name);
        
        // Product details
        doc.fontSize(9).font('Helvetica').fillColor('#666');
        if (product.pack_sizes) {
          doc.text(`Pack sizes: ${product.pack_sizes}`);
        }
        
        // Status with color
        const statusColor = product.status === 'In stock' ? '#2D7A3E' : product.status === 'Limited' ? '#D4A574' : '#999';
        doc.fontSize(9).font('Helvetica-Bold').fillColor(statusColor).text(`Status: ${product.status}`);
        
        doc.moveDown(0.5);
      });

      doc.moveDown(0.5);
    });

    // Footer
    doc.moveDown();
    doc.moveTo(40, doc.y).lineTo(555, doc.y).stroke('#C9A84C');
    doc.moveDown();
    doc.fontSize(9).font('Helvetica').fillColor('#999').text('For questions or orders, contact us:', { align: 'center' });
    doc.fontSize(9).fillColor('#C9A84C').text('WhatsApp: +44 7445 337 461', { align: 'center' });
    doc.fontSize(9).fillColor('#666').text('This list is updated weekly', { align: 'center' });

    doc.end();
  });
});

// ==================== ERROR HANDLING ====================

// 404 handler
app.use((req, res) => {
  res.status(404).render('404', { message: 'Page not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🌱 High Peak Harvest server running on http://localhost:${PORT}`);
  console.log(`📊 Admin panel: http://localhost:${PORT}/admin/login`);
});
