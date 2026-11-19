const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Admin session tokens are HMAC-signed so they cannot be forged by a visitor.
//
// The signing secret must stay the same between server restarts, otherwise every
// restart signs all admins out. It comes from ADMIN_TOKEN_SECRET in server/.env
// when that is set; otherwise one is created once and kept in the data folder.
const SECRET_FILE = path.join(__dirname, '..', 'data', '.admin_token_secret');

function loadSecret() {
  if (process.env.ADMIN_TOKEN_SECRET) return process.env.ADMIN_TOKEN_SECRET;

  try {
    const saved = fs.readFileSync(SECRET_FILE, 'utf-8').trim();
    if (saved.length >= 32) return saved;
  } catch {
    // No saved secret yet: create one below
  }

  const secret = crypto.randomBytes(32).toString('hex');
  try {
    fs.mkdirSync(path.dirname(SECRET_FILE), { recursive: true });
    fs.writeFileSync(SECRET_FILE, secret, { mode: 0o600 });
  } catch (err) {
    console.warn('Could not save the admin session secret; admins will be signed out on restart:', err.message);
  }
  return secret;
}

const SECRET = loadSecret();
const TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000; // an admin stays signed in for 7 days
const PREFIX = 'token-';

function sign(payload) {
  return crypto.createHmac('sha256', SECRET).update(payload).digest('base64url');
}

function createToken(username) {
  const payload = Buffer.from(
    JSON.stringify({ u: username, exp: Date.now() + TOKEN_TTL_MS })
  ).toString('base64url');
  return `${PREFIX}${payload}.${sign(payload)}`;
}

// Returns the token payload ({ u, exp }) or null when missing, forged or expired.
function verifyToken(token) {
  if (typeof token !== 'string' || !token.startsWith(PREFIX)) return null;
  const [payload, signature] = token.slice(PREFIX.length).split('.');
  if (!payload || !signature) return null;

  const expected = Buffer.from(sign(payload));
  const received = Buffer.from(signature);
  if (expected.length !== received.length || !crypto.timingSafeEqual(expected, received)) {
    return null;
  }

  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf-8'));
    if (!data.u || typeof data.exp !== 'number' || data.exp < Date.now()) return null;
    return data;
  } catch {
    return null;
  }
}

function tokenFromRequest(req) {
  const header = req.headers.authorization || '';
  return header.startsWith('Bearer ') ? header.slice(7).trim() : '';
}

// Express middleware: only signed-in admins may continue.
function requireAdmin(req, res, next) {
  const session = verifyToken(tokenFromRequest(req));
  if (!session) {
    return res.status(401).json({ success: false, error: 'Please sign in to continue.' });
  }
  req.admin = { username: session.u };
  next();
}

module.exports = { createToken, verifyToken, tokenFromRequest, requireAdmin };
