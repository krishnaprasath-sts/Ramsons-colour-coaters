const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const { requireAdmin } = require('../middleware/auth');
const { createImageUpload } = require('../middleware/upload');

// Banners configuration JSON file to persist hero banner sliders
const bannerConfigFile = path.join(__dirname, '..', 'data', 'hero_banners.json');

const defaultBanners = [
  {
    id: 1,
    src: '/images/banner-1.jpeg',
    title: 'High-Quality Industrial Powder Coating Specialists',
    subtitle: 'Equipped with Swiss GEMA & Turkish ELECTRON systems, 7-tank pretreatment, and ovens up to 25ft for unmatched durability & finish.',
  },
  {
    id: 2,
    src: '/images/banner-2.jpeg',
    title: 'Fusion Bonding & Heavy-Duty Metal Surface Finishing',
    subtitle: '',
  },
];

function getBanners() {
  if (fs.existsSync(bannerConfigFile)) {
    try {
      const data = fs.readFileSync(bannerConfigFile, 'utf-8');
      return JSON.parse(data);
    } catch {
      return defaultBanners;
    }
  }
  fs.writeFileSync(bannerConfigFile, JSON.stringify(defaultBanners, null, 2));
  return defaultBanners;
}

function saveBanners(banners) {
  fs.writeFileSync(bannerConfigFile, JSON.stringify(banners, null, 2));
}

// Image upload for banners
const upload = createImageUpload(
  (file) => 'banner_' + Date.now() + path.extname(file.originalname).toLowerCase()
);

// GET /api/banners
router.get('/', (req, res) => {
  try {
    const banners = getBanners();
    res.json({ success: true, banners });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/banners (Add new banner slide)
router.post('/', requireAdmin, upload.single('image'), (req, res) => {
  try {
    const { title, subtitle } = req.body;
    const banners = getBanners();

    let imageSrc = '/images/banner-1.jpeg';
    if (req.file) {
      imageSrc = `/uploads/${req.file.filename}`;
    }

    const newBanner = {
      id: Date.now(),
      src: imageSrc,
      title: title || 'Industrial Powder Coating Specialists',
      subtitle: subtitle || '',
    };

    banners.push(newBanner);
    saveBanners(banners);

    res.json({ success: true, banner: newBanner });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /api/banners/:id (Update banner)
router.put('/:id', requireAdmin, upload.single('image'), (req, res) => {
  try {
    const id = Number(req.params.id);
    const { title, subtitle } = req.body;
    let banners = getBanners();

    const index = banners.findIndex((b) => b.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Banner not found' });
    }

    let imageSrc = banners[index].src;
    if (req.file) {
      imageSrc = `/uploads/${req.file.filename}`;
    }

    banners[index] = {
      ...banners[index],
      title: title !== undefined ? title : banners[index].title,
      subtitle: subtitle !== undefined ? subtitle : banners[index].subtitle,
      src: imageSrc,
    };

    saveBanners(banners);
    res.json({ success: true, banner: banners[index] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/banners/:id
router.delete('/:id', requireAdmin, (req, res) => {
  try {
    const id = Number(req.params.id);
    let banners = getBanners();
    if (!banners.some((b) => b.id === id)) {
      return res.status(404).json({ success: false, error: 'Banner not found' });
    }
    banners = banners.filter((b) => b.id !== id);
    saveBanners(banners);
    res.json({ success: true, message: 'Banner deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
