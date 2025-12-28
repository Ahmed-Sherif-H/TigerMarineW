# Tiger Marine Website

Modern yacht showcase website with admin dashboard for managing boat models, images, and inquiries.

## 🚀 Quick Start

### Local Development

1. **Frontend:**
   ```bash
   cd frontend
   npm install
   cp .env.example .env
   npm run dev
   ```

2. **Backend:**
   ```bash
   cd backend
   npm install
   cp .env.example .env  # Configure database
   npm run prisma:generate
   npm run prisma:migrate
   npm run dev
   ```

3. **Access:**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:3001
   - Admin: http://localhost:5173/admin

## 📚 Documentation

- [Complete Setup Guide](./docs/SETUP.md) - Detailed setup instructions
- [Deployment Guide](./docs/DEPLOYMENT.md) - Deploy to Netlify & Render
- [Troubleshooting](./docs/TROUBLESHOOTING.md) - Common issues and solutions
- [Image Management](./docs/IMAGE_MANAGEMENT.md) - Managing images

## 🏗️ Project Structure

```
frontend/
├── src/
│   ├── components/     # React components
│   ├── pages/          # Page components
│   ├── services/       # API services
│   ├── utils/          # Utility functions
│   ├── config/         # Configuration files
│   └── context/        # React context
├── public/             # Static assets
└── docs/               # Documentation

backend/
├── routes/             # API routes
├── services/           # Business logic
├── controllers/        # Request handlers
├── config/             # Configuration
├── scripts/            # Utility scripts
├── public/             # Static files (images)
└── docs/               # Documentation
```

## 🛠️ Tech Stack

**Frontend:**
- React 18
- Vite
- Tailwind CSS
- React Router
- Framer Motion

**Backend:**
- Node.js + Express
- PostgreSQL
- Prisma ORM
- Multer (file uploads)
- Nodemailer (emails)

## 📝 Features

- ✅ Boat model showcase
- ✅ Admin dashboard for content management
- ✅ Image upload and management
- ✅ Contact form with email notifications
- ✅ Model customizer with inquiry system
- ✅ Responsive design

## 🔧 Environment Variables

See [SETUP.md](./docs/SETUP.md) for complete environment variable configuration.

## 📖 License

Private project - All rights reserved
