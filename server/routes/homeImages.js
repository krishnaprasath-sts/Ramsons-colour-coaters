const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const { requireAdmin } = require('../middleware/auth');
const { createImageUpload } = require('../middleware/upload');

const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const homeImagesConfigFile = path.join(dataDir, 'home_images.json');

// Default home images configuration
const defaultHomeImages = {
  aboutPreview: {
    key: 'aboutPreview',
    name: 'About Section Facility Image',
    section: 'About Ramson Preview Section',
    src: '/images/w6.jpg',
    description: 'Main facility showcase photo displayed next to Ramson Colour Coaters history and core features.',
  },
  headerLogo: {
    key: 'headerLogo',
    name: 'Website Header Brand Logo',
    section: 'Global Navigation Header',
    src: '/images/logo.jpg',
    description: 'Official Ramson Colour Coaters logo shown across the navigation header.',
  },
};

function getHomeImages() {
  if (fs.existsSync(homeImagesConfigFile)) {
    try {
      const data = fs.readFileSync(homeImagesConfigFile, 'utf-8');
      return JSON.parse(data);
    } catch {
      return defaultHomeImages;
    }
  }
  fs.writeFileSync(homeImagesConfigFile, JSON.stringify(defaultHomeImages, null, 2));
  return defaultHomeImages;
}

function saveHomeImages(images) {
  fs.writeFileSync(homeImagesConfigFile, JSON.stringify(images, null, 2));
}

// Image upload for home images
const upload = createImageUpload(
  (file) => 'home_' + Date.now() + '_' + Math.round(Math.random() * 1e4) + path.extname(file.originalname).toLowerCase()
);

// GET /api/home-images
router.get('/', (req, res) => {
  try {
    const images = getHomeImages();
    res.json({ success: true, images });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/home-images/update (Update specific image by key)
router.post('/update', requireAdmin, upload.single('image'), (req, res) => {
  try {
    const { key, name, description } = req.body;
    if (!key) {
      return res.status(400).json({ success: false, error: 'Image key is required.' });
    }

    const images = getHomeImages();
    let currentSrc = images[key] ? images[key].src : '/images/w6.jpg';

    if (req.file) {
      currentSrc = `/uploads/${req.file.filename}`;
    }

    images[key] = {
      ...(images[key] || {}),
      key,
      name: name || (images[key] ? images[key].name : key),
      description: description || (images[key] ? images[key].description : ''),
      src: currentSrc,
      updated_at: new Date().toISOString(),
    };

    saveHomeImages(images);
    res.json({ success: true, image: images[key] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/home-images/reset (Reset specific or all to defaults)
router.post('/reset', requireAdmin, (req, res) => {
  try {
    const { key } = req.body;
    const images = getHomeImages();
    if (key && defaultHomeImages[key]) {
      images[key] = { ...defaultHomeImages[key] };
      saveHomeImages(images);
      return res.json({ success: true, image: images[key] });
    }
    saveHomeImages(defaultHomeImages);
    res.json({ success: true, images: defaultHomeImages });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
