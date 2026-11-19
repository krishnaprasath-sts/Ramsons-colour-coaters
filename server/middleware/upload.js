const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif'];
const MAX_FILE_SIZE = 8 * 1024 * 1024; // 8 MB

// Only real image files may be stored in the public uploads folder.
function imageFileFilter(req, file, cb) {
  const ext = path.extname(file.originalname || '').toLowerCase();
  const isImage = ALLOWED_EXTENSIONS.includes(ext) && /^image\//.test(file.mimetype || '');
  if (isImage) return cb(null, true);

  const err = new Error('Only JPG, PNG, WEBP, GIF or AVIF images can be uploaded.');
  err.code = 'INVALID_FILE_TYPE';
  cb(err);
}

// Builds a multer instance that saves images into /uploads using `makeName(file)`.
function createImageUpload(makeName) {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadsDir),
    filename: (req, file, cb) => cb(null, makeName(file)),
  });
  return multer({ storage, fileFilter: imageFileFilter, limits: { fileSize: MAX_FILE_SIZE } });
}

module.exports = { uploadsDir, createImageUpload, MAX_FILE_SIZE };
