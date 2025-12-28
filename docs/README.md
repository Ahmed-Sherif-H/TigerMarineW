# Tiger Marine Documentation

## Quick Links

- [Setup Guide](./SETUP.md) - Complete setup instructions
- [Deployment Guide](./DEPLOYMENT.md) - Deploy to Netlify & Render
- [Image Management](./IMAGE_MANAGEMENT.md) - How to manage images
- [Troubleshooting](./TROUBLESHOOTING.md) - Common issues and solutions

## Project Structure

### Frontend
- **React + Vite** - Modern frontend framework
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Framer Motion** - Animations

### Backend
- **Node.js + Express** - API server
- **PostgreSQL** - Database
- **Prisma** - ORM
- **Multer** - File uploads
- **Nodemailer** - Email sending

## Development

### Local Setup

1. **Frontend:**
   ```bash
   cd frontend
   npm install
   cp .env.example .env  # Configure API URL
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

### Testing

- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:3001
- **Admin Dashboard:** http://localhost:5173/admin

## Environment Variables

See [SETUP.md](./SETUP.md) for complete environment variable configuration.

