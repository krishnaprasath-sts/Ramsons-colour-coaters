const { DatabaseSync } = require('node:sqlite');
const path = require('path');
const fs = require('fs');

const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'ramsoncolour.sqlite');
const db = new DatabaseSync(dbPath);

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS blog (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    image TEXT NOT NULL,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS login (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    companyname TEXT,
    email TEXT NOT NULL,
    phone TEXT DEFAULT '',
    message TEXT,
    source TEXT DEFAULT 'Contact Form',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Ensure new columns exist for existing databases
try {
  db.exec(`ALTER TABLE contacts ADD COLUMN phone TEXT DEFAULT ''`);
} catch {
  // Column already exists
}
try {
  db.exec(`ALTER TABLE contacts ADD COLUMN source TEXT DEFAULT 'Contact Form'`);
} catch {
  // Column already exists
}

try {
  db.exec(`ALTER TABLE blog ADD COLUMN author TEXT DEFAULT 'Ramson Colour Coaters'`);
} catch {
  // Column already exists
}

// Seed the first admin user from server/.env (ADMIN_USERNAME, ADMIN_PASSWORD) if none exist
const userCount = db.prepare('SELECT COUNT(*) as count FROM login').get().count;
if (userCount === 0) {
  const { ADMIN_USERNAME, ADMIN_PASSWORD } = process.env;
  if (ADMIN_USERNAME && ADMIN_PASSWORD) {
    db.prepare('INSERT INTO login (username, password) VALUES (?, ?)').run(ADMIN_USERNAME, ADMIN_PASSWORD);
    console.log(`Seeded initial admin user "${ADMIN_USERNAME}".`);
  } else {
    console.warn('No admin users exist. Set ADMIN_USERNAME and ADMIN_PASSWORD in server/.env and restart to create one.');
  }
}

// Seed default blogs if empty
const blogCount = db.prepare('SELECT COUNT(*) as count FROM blog').get().count;
if (blogCount === 0) {
  const insertBlog = db.prepare('INSERT INTO blog (title, image, description) VALUES (?, ?, ?)');
  insertBlog.run(
    'Quality Powder Coating for Industrial Applications',
    'banner-1.jpeg',
    '<p>Ramson Colour Coaters provides top-tier powder coating services for various metal fabrications. Powder coating provides a durable, high-quality finish that withstands extreme environmental conditions.</p><p>We specialize in MS Powder Coating, Fusion Bonding, and Aluminium Powder Coating using state of the art equipment from GEMA (Switzerland) and ELECTRON (Turkey).</p>'
  );
  insertBlog.run(
    'Why Seven Tank Pretreatment Process Matters',
    'w6.jpg',
    '<p>Pretreatment is the most critical stage of the powder coating process. At Ramson Colour Coaters, we employ an internationally recognized 7-tank pretreatment system for mild steel bodies and a 4-tank chromating process for aluminum components.</p><p>This ensures superior adhesion, corrosion resistance, and longevity of the coating.</p>'
  );
  console.log('Seeded initial blog entries.');
}

module.exports = db;
