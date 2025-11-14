# Tiger Marine - Luxury Yacht Website

A modern and elegant React website for Tiger Marine, a luxury boat manufacturer. Built with React, Vite, Tailwind CSS, and Framer Motion for smooth animations.

## Features

- **Elegant Design**: Sophisticated design with improved visual hierarchy and better backgrounds
- **Boat Categories**: Five distinct categories (Maxline, Topline, Proline, Sportline, Open) with dedicated pages
- **Enhanced Navigation**: Logo-centered navbar with left-side burger menu and side panel navigation
- **Interactive Hover Effects**: Category previews with images on hover in navigation
- **Responsive Layout**: Fully responsive design that works on all devices
- **Smooth Animations**: Framer Motion animations for page transitions and hover effects
- **Complete Page Set**: All required pages including Categories, Models, Professional, Dealers, etc.
- **Model Customization**: Color and fabric selection interface
- **Contact Forms**: Professional contact forms with validation
- **SEO Optimized**: Proper meta tags and semantic HTML structure

## Pages

- **Home**: Hero section with boat categories showcase and company highlights
- **Categories**: Overview of all five boat categories with comparison table
- **Category Detail**: Individual category pages showing models within each category
- **Models**: Complete model showcase with detailed specifications
- **Model Detail**: Individual model pages with specs, features, and pricing
- **Professional**: Professional services and commercial solutions
- **Dealers**: Global dealer network with contact information
- **Color & Fabric Selection**: Interactive customization interface
- **Contact**: Contact forms and global office information
- **About Us**: Company history, values, and team information

## Tech Stack

- **React 18** - Frontend framework
- **Vite** - Build tool and development server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **JavaScript** - Programming language

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd tiger-marine-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── components/          # Reusable React components
│   ├── Navbar.jsx      # Navigation with burger menu
│   ├── Footer.jsx      # Site footer
│   ├── HeroSection.jsx # Hero section component
│   └── ModelCard.jsx   # Model card component
├── pages/              # Page components
│   ├── Home.jsx        # Home page
│   ├── Models.jsx      # Models listing page
│   ├── ModelDetail.jsx # Individual model page
│   ├── Professional.jsx # Professional services page
│   ├── Dealers.jsx     # Dealers page
│   ├── ColorFabric.jsx # Color & fabric selection
│   ├── Contact.jsx     # Contact page
│   └── About.jsx       # About us page
├── data/               # Static data
│   └── models.js       # Model and dealer data
├── styles/             # CSS files
│   └── index.css       # Main stylesheet
├── App.jsx             # Main app component
└── main.jsx            # App entry point
```

## Customization

### Colors
The color scheme can be customized in `tailwind.config.js`:
- Navy: `#1e3a8a`
- Gold: `#d4af37`
- Silver: `#c0c0c0`

### Models Data
Model information is stored in `src/data/models.js` and can be easily updated or extended.

### Styling
Custom styles are defined in `src/styles/index.css` using Tailwind's `@layer` directive.

## Future Enhancements

This frontend is ready for backend integration with:
- Node.js backend for email handling
- Admin panel for model management
- Database integration for dynamic content
- User authentication and accounts
- E-commerce functionality

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is proprietary software owned by Tiger Marine.

## Contact

For questions about this project, please contact the development team.
