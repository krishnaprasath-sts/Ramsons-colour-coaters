const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const { requireAdmin } = require('../middleware/auth');

const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Services shown on the Home page, the Services page, the footer and the quote form.
// The order of this list is the order shown on the website.
const servicesFile = path.join(dataDir, 'services.json');

const LIMITS = {
  title: 80,
  tag: 40,
  summary: 400,
  description: 1500,
  buttonLabel: 60,
  specs: { items: 6, length: 40 },
  features: { items: 8, length: 200 },
};

const defaultServices = [
  {
    id: 1,
    title: 'MS Powder Coating',
    tag: 'Mild Steel',
    summary:
      'Industrial-grade powder coating for fabricated mild steel structures, enclosures, frames, panels, and machinery covers. Pretreated via full chemical immersion for superior corrosion resistance.',
    description:
      'High-durability powder coating engineered for all categories of mild steel components fabricated for machine covers, control panels, automotive brackets, and architectural metalwork. Resists scratching, UV degradation, and weather wear.',
    specs: ['Uniform 60-100 Microns', '7-Tank Treated'],
    features: [
      'Pre-treated through our 7-tank immersion system.',
      'Uniform dry film thickness of 60 to 100 microns.',
      'Available in matte, glossy, satin, texture, and metallic shades.',
    ],
    buttonLabel: 'Enquire for MS Coating',
  },
  {
    id: 2,
    title: 'Fusion Bonding (FBE)',
    tag: 'Heavy Duty',
    summary:
      'Specialized fusion-bonded coatings achieving 250 to 500+ microns thickness for components exposed to aggressive chemicals, moisture, valves, pumps, and underground pipeline fittings.',
    description:
      'We specialize in Fusion Bonding, an advanced process where a heavy coating thickness of <strong>250 to 500 microns or more</strong> is achieved. Creates an impenetrable shield against highly corrosive environments, soil moisture, and harsh industrial chemicals.',
    specs: ['250 - 500+ Microns', 'Severe Duty'],
    features: [
      'Exceptional dielectric strength and corrosion resistance.',
      'Ideal for industrial valves, pumps, pipes, and marine hardware.',
      'Superior adhesion withstands high operational pressures.',
    ],
    buttonLabel: 'Enquire for Fusion Bonding',
  },
  {
    id: 3,
    title: 'Aluminium Powder Coating',
    tag: 'Lightweight Alloys',
    summary:
      'Specialized powder application for Pressure Die Cast (PDC), Gravity Die Cast (GDC), and extruded architectural aluminium profiles with zero surface defects.',
    description:
      'Specialized surface finishing formulated for all kinds of aluminium substrates, including Pressure Die Cast (PDC), Gravity Die Cast (GDC), and extruded structural profiles. Prevents oxidation and delivers smooth, blemish-free finishes.',
    specs: ['4-Tank Chromated', 'PDC & GDC Ready'],
    features: [
      'Processed through a dedicated 4-tank chromating chemical bath.',
      'Eliminates pinholes, blisters, and surface outgassing defects.',
      'Full range of architectural RAL colors and metallic textures.',
    ],
    buttonLabel: 'Enquire for Aluminium Coating',
  },
  {
    id: 4,
    title: 'Pre-Treatment Process',
    tag: 'Crucial Foundation',
    summary:
      'Internationally acclaimed 7-tank degreasing, derusting, phosphating & passivation process for MS, and 4-tank chromating process ensuring lifelong chemical bonding.',
    description:
      'No powder coating lasts without meticulous surface preparation. We adhere strictly to the internationally acclaimed <strong>Seven-Tank Pretreatment Process</strong> for MS components and the <strong>Four-Tank Chromating Process</strong> for aluminium components.',
    specs: ['Chemical Immersion', 'Tanks up to 22ft'],
    features: [
      'Degreasing → Water Rinse → Derusting → Phosphating → Passivation.',
      'Accommodates components up to 22ft in length in chemical immersion tanks.',
      'Guarantees 500+ hours of salt spray resistance.',
    ],
    buttonLabel: 'Enquire for Pre-Treatment',
  },
];

// A fresh copy each time, so edits never change the built-in defaults
const cloneDefaults = () => JSON.parse(JSON.stringify(defaultServices));

function getServices() {
  if (fs.existsSync(servicesFile)) {
    try {
      const parsed = JSON.parse(fs.readFileSync(servicesFile, 'utf-8'));
      if (Array.isArray(parsed)) return parsed;
    } catch {
      // Unreadable file: fall back to the defaults below
    }
    return cloneDefaults();
  }
  fs.writeFileSync(servicesFile, JSON.stringify(defaultServices, null, 2));
  return cloneDefaults();
}

function saveServices(services) {
  fs.writeFileSync(servicesFile, JSON.stringify(services, null, 2));
}

const text = (value) => (typeof value === 'string' ? value.trim() : '');

// Accepts an array, or one item per line, and returns a clean list of short strings.
function cleanList(value, { items, length }) {
  const list = Array.isArray(value) ? value : String(value || '').split(/\r?\n/);
  return list
    .map((item) => text(String(item)))
    .filter(Boolean)
    .map((item) => item.slice(0, length))
    .slice(0, items);
}

// Validates the request body. Returns { error } or { value }.
function readService(body) {
  const title = text(body.title);
  const summary = text(body.summary);
  const description = text(body.description);

  if (!title) return { error: 'Service name is required.' };
  if (title.length > LIMITS.title) return { error: `Service name must be ${LIMITS.title} characters or fewer.` };
  if (!summary) return { error: 'Short summary is required.' };
  if (summary.length > LIMITS.summary) return { error: `Short summary must be ${LIMITS.summary} characters or fewer.` };
  if (description.length > LIMITS.description) {
    return { error: `Full description must be ${LIMITS.description} characters or fewer.` };
  }

  return {
    value: {
      title,
      tag: text(body.tag).slice(0, LIMITS.tag),
      summary,
      description: description || summary,
      specs: cleanList(body.specs, LIMITS.specs),
      features: cleanList(body.features, LIMITS.features),
      buttonLabel: text(body.buttonLabel).slice(0, LIMITS.buttonLabel),
    },
  };
}

// GET /api/services (public)
router.get('/', (req, res) => {
  try {
    res.json({ success: true, services: getServices() });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/services (add a service at the end of the list)
router.post('/', requireAdmin, (req, res) => {
  try {
    const { error, value } = readService(req.body || {});
    if (error) return res.status(400).json({ success: false, error });

    const services = getServices();
    const service = { id: Date.now(), ...value };
    services.push(service);
    saveServices(services);

    res.status(201).json({ success: true, service });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /api/services/reorder  { ids: [3, 1, 2] }  (must stay above "/:id")
router.put('/reorder', requireAdmin, (req, res) => {
  try {
    const ids = Array.isArray(req.body && req.body.ids) ? req.body.ids.map(Number) : null;
    const services = getServices();

    const sameItems =
      ids &&
      ids.length === services.length &&
      new Set(ids).size === ids.length &&
      services.every((service) => ids.includes(service.id));
    if (!sameItems) {
      return res.status(400).json({ success: false, error: 'The new order must list every service exactly once.' });
    }

    const reordered = ids.map((id) => services.find((service) => service.id === id));
    saveServices(reordered);
    res.json({ success: true, services: reordered });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /api/services/:id (update a service)
router.put('/:id', requireAdmin, (req, res) => {
  try {
    const id = Number(req.params.id);
    const services = getServices();
    const index = services.findIndex((service) => service.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Service not found' });
    }

    const { error, value } = readService(req.body || {});
    if (error) return res.status(400).json({ success: false, error });

    services[index] = { id, ...value };
    saveServices(services);
    res.json({ success: true, service: services[index] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/services/:id
router.delete('/:id', requireAdmin, (req, res) => {
  try {
    const id = Number(req.params.id);
    const services = getServices();
    if (!services.some((service) => service.id === id)) {
      return res.status(404).json({ success: false, error: 'Service not found' });
    }

    saveServices(services.filter((service) => service.id !== id));
    res.json({ success: true, message: 'Service deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
