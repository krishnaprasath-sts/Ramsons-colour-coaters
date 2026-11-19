const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static file uploads directory
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));
app.use('/dashboard/uploads', express.static(uploadsDir));
 
// API Routes
app.use('/api/blogs', require('./routes/blogs'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/banners', require('./routes/banners'));
app.use('/api/home-images', require('./routes/homeImages'));
app.use('/api/services', require('./routes/services'));
// Legacy route support
app.use('/sendMail.php', require('./routes/contact'));

// Unknown API routes answer with JSON instead of the website HTML
app.use('/api', (req, res) => {
  res.status(404).json({ success: false, error: 'API route not found' });
});

// Serve React production build if dist exists
const distCandidate1 = path.join(__dirname, 'dist');
const distCandidate2 = path.join(__dirname, '..', 'client', 'dist');
const clientDist = fs.existsSync(distCandidate1) ? distCandidate1 : (fs.existsSync(distCandidate2) ? distCandidate2 : null);

if (clientDist) {
  app.use(express.static(clientDist));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads') || req.path.startsWith('/dashboard/uploads')) {
      return next();
    }
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

// Central error handler: always answer with JSON (never an HTML stack trace)
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);

  let status = err.status || err.statusCode || 500;
  let message = 'Something went wrong on the server. Please try again.';

  if (err.code === 'INVALID_FILE_TYPE') {
    status = 400;
    message = err.message;
  } else if (err.code === 'LIMIT_FILE_SIZE') {
    status = 400;
    message = 'Image is too large. Please upload a file under 8 MB.';
  } else if (err.name === 'MulterError') {
    status = 400;
    message = 'Upload failed: ' + err.message + '.';
  } else if (status >= 400 && status < 500) {
    message = 'The request could not be understood by the server.';
  } else {
    console.error('Unhandled server error:', err);
  }

  res.status(status).json({ success: false, error: message });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

module.exports = app;
