import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useModels } from '../context/ModelsContext';
import { useMemo } from 'react';

const Footer = () => {
  const { categories } = useModels();
  const currentYear = new Date().getFullYear();
  
  // Get inflatable boats categories
  const inflatableBoats = useMemo(() => {
    return categories.filter(cat => (cat.mainGroup || 'inflatableBoats') === 'inflatableBoats');
  }, [categories]);

  const footerLinks = {
    company: [
      { name: 'About Us', path: '/about' },
      { name: 'Professional', path: '/professional' },
      { name: 'Contact', path: '/contact' }
    ],
    models: [
      { name: 'Tiger 28', path: '/models/5' },
      { name: 'Tiger 35', path: '/models/3' },
      { name: 'Tiger 45', path: '/models/1' },
      { name: 'Tiger 60', path: '/models/2' },
      { name: 'Tiger 75', path: '/models/4' }
    ],
    services: [
      { name: 'Dealers', path: '/dealers' },
      { name: 'Color & Fabric Selection', path: '/color-fabric' },
      { name: 'Customization', path: '/categories' }
    ]
  };

  return (
    <footer className="text-white relative" style={{ backgroundColor: '#000033' }}>
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-6">
              <img 
                src="/images/LOGO.png" 
                alt="Tiger Marine" 
                className="h-20 w-auto mr-4 filter brightness-0 invert"
              />
              <h3 className="text-3xl font-bold" style={{ color: '#A87932' }}>Tiger Marine</h3>
            </div>
            <p className="text-gray-300 text-base leading-relaxed mb-6 max-w-md">
              Experience the art of marine excellence with our luxury yacht collection, 
              crafted for the most discerning mariners worldwide. From ultimate luxury 
              to sport performance, discover the perfect vessel for your maritime journey.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:opacity-80 transition-opacity">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" className="text-white hover:opacity-80 transition-opacity">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a href="#" className="text-white hover:opacity-80 transition-opacity">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xl font-semibold mb-6" style={{ color: '#A87932' }}>CATEGORIES</h4>
            <ul className="space-y-3">
              {inflatableBoats.map((category) => (
                <li key={category.id}>
                  <Link
                    to={`/categories/${category.id}`}
                    className="text-gray-300 hover:text-white transition-colors duration-300 text-sm block"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Links */}
          <div>
            <h4 className="text-xl font-semibold mb-6" style={{ color: '#A87932' }}>CONTACT</h4>
            <div className="space-y-4">
              <div>
                <p className="text-gray-300 text-sm">+202 23108045</p>
                <p className="text-gray-300 text-sm">+20100 4004079</p>
                <p className="text-gray-300 text-sm">info@tigermarine.com</p>
              </div>
              <div className="mt-6">
                <p className="text-gray-300 text-sm mb-3">Factory No. 62, 100 Fadan Zone

Badr Industrial City – Cairo – Egypt</p>
              </div>
              <div className="space-y-2">
                <Link to="/dealers" className="block text-gray-300 hover:text-white transition-colors text-sm">
                  Dealers
                </Link>
                <Link to="/boat-shows" className="block text-gray-300 hover:text-white transition-colors text-sm">
                  Boat Shows
                </Link>
                <Link to="/about" className="block text-gray-300 hover:text-white transition-colors text-sm">
                  About Us
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        {/*<div className="border-t border-white/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-2 md:mb-0">
              © {currentYear} Tiger Marine. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link to="/about" className="text-gray-400 hover:text-white transition-colors text-sm">Privacy Policy</Link>
              <Link to="/about" className="text-gray-400 hover:text-white transition-colors text-sm">Terms of Service</Link>
            </div>
          </div>
        </div>*/}
      </div>
    </footer>
  );
};

export default Footer;

