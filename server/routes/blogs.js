const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const db = require('../db');
const { requireAdmin } = require('../middleware/auth');
const { uploadsDir, createImageUpload } = require('../middleware/upload');

const DEFAULT_AUTHOR = 'Ramson Colour Coaters';

const upload = createImageUpload((file) => {
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
  const ext = path.extname(file.originalname).toLowerCase();
  const baseName = path.basename(file.originalname, path.extname(file.originalname)).replace(/[^a-zA-Z0-9-_]/g, '_');
  return baseName + '-' + uniqueSuffix + ext;
});

// The cover image may arrive as `category-img` (legacy admin) or `image` (admin dashboard).
const uploadCover = upload.fields([
  { name: 'category-img', maxCount: 1 },
  { name: 'image', maxCount: 1 },
]);

function getUploadedCover(req) {
  const files = req.files || {};
  return (files['category-img'] && files['category-img'][0]) || (files.image && files.image[0]) || null;
}

// Accepts the field names used by every admin form:
//   title:   category-name | title
//   content: editor-content | description | content
function readBlogFields(body) {
  const first = (...keys) => {
    for (const key of keys) {
      if (typeof body[key] === 'string' && body[key].trim() !== '') return body[key];
    }
    return '';
  };
  return {
    title: first('category-name', 'title').trim(),
    description: first('editor-content', 'description', 'content'),
    author: first('author').trim(),
  };
}

// GET all blogs
router.get('/', async (req, res) => {
  try {
    const blogs = await db.all('SELECT * FROM blog ORDER BY id DESC');
    res.json({ success: true, blogs });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET single blog by ID
router.get('/:id', async (req, res) => {
  try {
    const blog = await db.get('SELECT * FROM blog WHERE id = ?', [req.params.id]);
    if (!blog) {
      return res.status(404).json({ success: false, error: 'Blog not found' });
    }
    res.json({ success: true, blog });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST create blog
router.post('/', requireAdmin, uploadCover, async (req, res) => {
  try {
    const { title, description, author } = readBlogFields(req.body);
    const file = getUploadedCover(req);
    const image = file ? file.filename : path.basename(String(req.body.image || ''));

    if (!title) {
      return res.status(400).json({ success: false, error: 'Title is required' });
    }

    const result = await db.run(
      'INSERT INTO blog (title, image, description, author) VALUES (?, ?, ?, ?)',
      [title, image, description, author || DEFAULT_AUTHOR]
    );

    res.status(201).json({
      success: true,
      message: 'Blog created successfully',
      blog: {
        id: result.insertId,
        title,
        image,
        description,
        author: author || DEFAULT_AUTHOR,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT update blog
router.put('/:id', requireAdmin, uploadCover, async (req, res) => {
  try {
    const id = req.params.id;
    const existing = await db.get('SELECT * FROM blog WHERE id = ?', [id]);
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Blog not found' });
    }

    const fields = readBlogFields(req.body);
    const file = getUploadedCover(req);

    const title = fields.title || existing.title;
    const description = fields.description || existing.description;
    const author = fields.author || existing.author || DEFAULT_AUTHOR;
    const image = file ? file.filename : existing.image;

    await db.run('UPDATE blog SET title = ?, image = ?, description = ?, author = ? WHERE id = ?', [
      title,
      image,
      description,
      author,
      id,
    ]);

    res.json({
      success: true,
      message: 'Blog updated successfully',
      blog: { id: Number(id), title, image, description, author },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE blog
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const id = req.params.id;
    const existing = await db.get('SELECT * FROM blog WHERE id = ?', [id]);
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Blog not found' });
    }

    await db.run('DELETE FROM blog WHERE id = ?', [id]);

    // Remove the uploaded cover image (basename only, so it can never leave /uploads)
    if (existing.image) {
      const filePath = path.join(uploadsDir, path.basename(existing.image));
      if (fs.existsSync(filePath)) {
        try { fs.unlinkSync(filePath); } catch (e) { /* ignore */ }
      }
    }

    res.json({ success: true, message: 'Blog deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
