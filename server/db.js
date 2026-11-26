// Database access for the API.
//
// Production (Webuzo): MySQL / MariaDB, used when DB_NAME is set in server/.env
//   DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD
// Local development: when DB_NAME is not set, the SQLite file server/data/ramsoncolour.sqlite is used.
//
// Every helper is async and takes `?` placeholders, so routes work the same with both databases:
//   all(sql, params)  -> array of rows
//   get(sql, params)  -> first row or undefined
//   run(sql, params)  -> { insertId, changes }
const path = require('path');
const fs = require('fs');

const DEFAULT_AUTHOR = 'Ramson Colour Coaters';

const MYSQL_SCHEMA = [
  `CREATE TABLE IF NOT EXISTS blog (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    image VARCHAR(255) NOT NULL,
    description LONGTEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    author VARCHAR(255) DEFAULT 'Ramson Colour Coaters'
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
  `CREATE TABLE IF NOT EXISTS login (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
  `CREATE TABLE IF NOT EXISTS contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    companyname VARCHAR(255),
    email VARCHAR(255) NOT NULL,
    message TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    phone VARCHAR(50) DEFAULT '',
    source VARCHAR(100) DEFAULT 'Contact Form'
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
];

const SQLITE_SCHEMA = [
  `CREATE TABLE IF NOT EXISTS blog (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    image TEXT NOT NULL,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    author TEXT DEFAULT 'Ramson Colour Coaters'
  )`,
  `CREATE TABLE IF NOT EXISTS login (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    companyname TEXT,
    email TEXT NOT NULL,
    message TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    phone TEXT DEFAULT '',
    source TEXT DEFAULT 'Contact Form'
  )`,
];

function createMysqlDriver() {
  const mysql = require('mysql2');
  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    charset: 'utf8mb4',
    waitForConnections: true,
    connectionLimit: 10,
    // Return DATETIME as "YYYY-MM-DD HH:MM:SS" text in UTC, exactly like SQLite did
    dateStrings: true,
  });
  pool.on('connection', (conn) => conn.query("SET time_zone = '+00:00'"));
  const promisePool = pool.promise();

  return {
    name: 'MySQL',
    schema: MYSQL_SCHEMA,
    async all(sql, params = []) {
      const [rows] = await promisePool.query(sql, params);
      return rows;
    },
    async run(sql, params = []) {
      const [result] = await promisePool.query(sql, params);
      return { insertId: Number(result.insertId), changes: Number(result.affectedRows) };
    },
  };
}

function createSqliteDriver() {
  const { DatabaseSync } = require('node:sqlite');
  const dataDir = path.join(__dirname, 'data');
  fs.mkdirSync(dataDir, { recursive: true });
  const sqlite = new DatabaseSync(path.join(dataDir, 'ramsoncolour.sqlite'));

  return {
    name: 'SQLite',
    schema: SQLITE_SCHEMA,
    async all(sql, params = []) {
      return sqlite.prepare(sql).all(...params);
    },
    async run(sql, params = []) {
      const result = sqlite.prepare(sql).run(...params);
      return { insertId: Number(result.lastInsertRowid), changes: Number(result.changes) };
    },
  };
}

const driver = process.env.DB_NAME ? createMysqlDriver() : createSqliteDriver();

const all = (sql, params) => driver.all(sql, params);
const get = async (sql, params) => (await driver.all(sql, params))[0];
const run = (sql, params) => driver.run(sql, params);

async function countRows(table) {
  const row = await get(`SELECT COUNT(*) AS count FROM ${table}`);
  return Number(row.count);
}

async function initialize() {
  for (const statement of driver.schema) {
    await run(statement);
  }

  // Seed the first admin user from server/.env (ADMIN_USERNAME, ADMIN_PASSWORD) if none exist
  if ((await countRows('login')) === 0) {
    const { ADMIN_USERNAME, ADMIN_PASSWORD } = process.env;
    if (ADMIN_USERNAME && ADMIN_PASSWORD) {
      await run('INSERT INTO login (username, password) VALUES (?, ?)', [ADMIN_USERNAME, ADMIN_PASSWORD]);
      console.log(`Seeded initial admin user "${ADMIN_USERNAME}".`);
    } else {
      console.warn('No admin users exist. Set ADMIN_USERNAME and ADMIN_PASSWORD in server/.env and restart to create one.');
    }
  }

  // Seed default blogs if empty
  if ((await countRows('blog')) === 0) {
    const insertBlog = 'INSERT INTO blog (title, image, description, author) VALUES (?, ?, ?, ?)';
    await run(insertBlog, [
      'Quality Powder Coating for Industrial Applications',
      'banner-1.jpeg',
      '<p>Ramson Colour Coaters provides top-tier powder coating services for various metal fabrications. Powder coating provides a durable, high-quality finish that withstands extreme environmental conditions.</p><p>We specialize in MS Powder Coating, Fusion Bonding, and Aluminium Powder Coating using state of the art equipment from GEMA (Switzerland) and ELECTRON (Turkey).</p>',
      DEFAULT_AUTHOR,
    ]);
    await run(insertBlog, [
      'Why Seven Tank Pretreatment Process Matters',
      'w6.jpg',
      '<p>Pretreatment is the most critical stage of the powder coating process. At Ramson Colour Coaters, we employ an internationally recognized 7-tank pretreatment system for mild steel bodies and a 4-tank chromating process for aluminum components.</p><p>This ensures superior adhesion, corrosion resistance, and longevity of the coating.</p>',
      DEFAULT_AUTHOR,
    ]);
    console.log('Seeded initial blog entries.');
  }

  console.log(`Database ready (${driver.name}).`);
}

// Resolves once tables exist; server.js waits for it before accepting requests
const ready = initialize();

module.exports = { all, get, run, ready, MYSQL_SCHEMA };
