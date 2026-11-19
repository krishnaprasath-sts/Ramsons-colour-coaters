const express = require('express');
const router = express.Router();
const db = require('../db');
const { createToken, verifyToken, tokenFromRequest } = require('../middleware/auth');

// POST /api/auth/login
router.post('/login', (req, res) => {
  try {
    const { username, password, name } = req.body;
    const loginUser = username || name;

    if (!loginUser || !password) {
      return res.status(400).json({ success: false, error: 'Please check empty fields...!' });
    }

    const row = db.prepare('SELECT id, username FROM login WHERE username = ? AND password = ?').get(loginUser, password);

    if (row) {
      res.json({
        success: true,
        message: 'Login successful',
        user: { id: row.id, username: row.username },
        token: createToken(row.username),
      });
    } else {
      res.status(401).json({ success: false, error: 'Please Enter correct username and password...!' });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/auth/verify
router.get('/verify', (req, res) => {
  // Confirms the token was issued by this server and has not expired
  const session = verifyToken(tokenFromRequest(req));
  if (session) {
    res.json({ success: true, valid: true, user: { username: session.u } });
  } else {
    res.status(401).json({ success: false, valid: false });
  }
});

module.exports = router;
