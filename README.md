# Ramson Colour Coaters — Full-Stack Web Application

Full-stack React.js + Express.js + Node.js + SQLite application with a standalone Admin Dashboard and Webuzo deployment bundle.

## Project Folder Structure

```text
.
├── client/                     # Public Website (React + Vite, Port 3000)
│   ├── public/                 # Static CSS, fonts, images, SEO files
│   ├── src/
│   │   ├── admin/              # Built-in legacy admin routes
│   │   ├── components/         # Header, Footer, Carousel, QuoteModal, ScrollToTop
│   │   │   └── ui/             # Reusable UI components (RevealText)
│   │   ├── hooks/              # Custom hooks (useInView)
│   │   ├── pages/              # Home, About, Services, Infrastructure, Blogs, ViewBlog, Contact
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── admin-dashboard/            # Standalone Admin Portal (React + Vite, Port 3001)
│   ├── public/                 # Admin static assets
│   ├── src/
│   │   ├── components/         # AdminLayout
│   │   ├── css/                # admin.css
│   │   ├── pages/              # Dashboard, HomeImages, Services, Enquiries, BlogList, BlogForm, Login
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── server/                     # Express + Node.js + SQLite Backend API (Port 5000)
│   ├── data/                   # SQLite DB & JSON configs (hero_banners.json, home_images.json, services.json)
│   ├── routes/                 # auth.js, banners.js, blogs.js, contact.js, homeImages.js, services.js
│   ├── uploads/                # Uploaded blog & hero banner images
│   ├── db.js
│   ├── server.js
│   └── package.json
│
├── deploy/                     # Production Deployment Artifacts
│   ├── webuzo_build/           # Ready-to-host Webuzo Node.js build directory
│   └── webuzo_deployment.zip   # Ready-to-upload Webuzo ZIP archive
│
├── package.json                # Root workspace scripts
├── .gitignore
└── README.md
```

## Quick Commands

```bash
# Install dependencies for all workspaces
npm run install:all

# Run backend API + public website + admin dashboard together
npm run dev:all

# Build both public website and admin dashboard
npm run build

# Start production Express server
npm start
```

## Admin Login Setup

There are no default credentials in the code. On first start with an empty database, the server creates one admin user from `server/.env`:

```env
ADMIN_USERNAME=your-admin-username
ADMIN_PASSWORD=a-long-strong-password
```

Use a strong password and never commit `server/.env`.

## Admin API Security

- Every admin action (reading or deleting enquiries, and creating, editing or deleting blogs, banners and home images) requires the signed token issued at login. Public pages and the contact / quote forms need no login.
- An admin stays signed in for 7 days, including across server restarts. The key that signs sessions is created automatically in `server/data/.admin_token_secret` (keep this file private and do not delete it; deleting it signs everyone out). To supply your own key instead, set `ADMIN_TOKEN_SECRET=<long random text>` in `server/.env`.
- Uploads accept images only (JPG, PNG, WEBP, GIF, AVIF) up to 8 MB.
