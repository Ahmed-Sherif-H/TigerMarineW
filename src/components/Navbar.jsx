import { useState, useMemo, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useModels } from '../context/ModelsContext';
import { getModelDisplayName } from '../utils/modelNameUtils';
import { getSideMenuImage } from '../data/imageHelpers';

const Navbar = () => {
  const { categories, models } = useModels();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [hoveredModel, setHoveredModel] = useState(null);
  
  // Clear hover states when menu closes
  useEffect(() => {
    if (!isMenuOpen) {
      setHoveredCategory(null);
      setHoveredModel(null);
    }
  }, [isMenuOpen]);
  
  // Detect if device is mobile (small screen + touch) to prevent hover
  // Tablets can have hover, so we only prevent on small mobile screens
  const isMobileDevice = typeof window !== 'undefined' && 
    window.innerWidth < 640 && 
    ('ontouchstart' in window || navigator.maxTouchPoints > 0);
  
  // Group categories by mainGroup (only for Inflatable Boats)
  const inflatableBoats = useMemo(() => {
    return categories.filter(cat => (cat.mainGroup || 'inflatableBoats') === 'inflatableBoats');
  }, [categories]);
  
  // Get models that belong to "Boats" mainGroup (models whose category has mainGroup = 'boats')
  const boatsModels = useMemo(() => {
    const boatsCategoryIds = categories
      .filter(cat => cat.mainGroup === 'boats')
      .map(cat => cat.id);
    return models.filter(model => boatsCategoryIds.includes(model.categoryId));
  }, [categories, models]);

  const location = useLocation();

  const menuItems = [
    { name: 'Home', path: '/' },
    { name: 'Inflatable Boats', path: '/categories', hasSubmenu: true, submenuType: 'inflatable' },
    { name: 'Boats', path: '/categories', hasSubmenu: true, submenuType: 'boats' },
    { name: 'Upcoming Models', path: '/models/upcoming' },
    { name: 'Boat Shows', path: '/boat-shows' },
    { name: 'Dealers', path: '/dealers' },
    { name: 'Contact Us', path: '/contact' },
    { name: 'About Us', path: '/about' }
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    // Clear hover states when menu closes
    setHoveredCategory(null);
    setHoveredModel(null);
  };

  return (
    <>
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="container-custom" style={{ marginLeft:30}}>
          <div className="flex items-center justify-between h-20 relative">
            {/* Burger Menu Button - Left */}
            <button
              onClick={toggleMenu}
              className="relative w-8 h-8 flex flex-col justify-center items-center space-y-1 group -ml-2"
              aria-label="Toggle menu"
            >
              <motion.span
                className="w-6 h-0.5 bg-midnight-slate transition-all duration-300"
                animate={isMenuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
              />
              <motion.span
                className="w-6 h-0.5 bg-midnight-slate transition-all duration-300"
                animate={isMenuOpen ? { opacity: 0 } : { opacity: 1 }}
              />
              <motion.span
                className="w-6 h-0.5 bg-midnight-slate transition-all duration-300"
                animate={isMenuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
              />
            </button>

            {/* Logo - Positioned to the left
                Edit the left-[XX%] values to adjust position:
                - Mobile: left-[45%] (smaller = more left, larger = more right)
                - Tablet: sm:left-[48%] 
                - Desktop: md:left-[50%]
                You can also use fixed values like left-20, left-32, etc.
            */}
            <Link 
              to="/" 
              className="absolute left-[45%] sm:left-[48%] md:left-[50%] transform -translate-x-1/2 flex items-center justify-center" 
            >
              <img 
                src="/images/LOGO.png" 
                alt="Tiger Marine" 
                className="h-14 sm:h-20 md:h-24 w-auto"
              />
            </Link>

            {/* Right side - empty for now */}
            <div className="w-8"></div>
          </div>
        </div>
      </nav>

      {/* Side Panel Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-black/50"
            onClick={closeMenu}
          >
            <motion.div
              initial={{ x: -400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -400, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="fixed left-0 top-0 h-full w-64 sm:w-72 bg-white shadow-2xl border-r border-gray-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="h-full flex flex-col" style={{ fontFamily: 'Tussilago, sans-serif' }}>
                {/* Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-black">Menu</h2>
                    <button
                      onClick={closeMenu}
                      className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-black hover:bg-gray-100 rounded-full transition-all duration-300"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Navigation Items */}
                <div className="flex-1 p-6 overflow-y-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                  <style>{`
                    .overflow-y-auto::-webkit-scrollbar {
                      display: none;
                    }
                  `}</style>
                  <nav className="space-y-2">
                    {menuItems.map((item, index) => (
                      <motion.div
                        key={item.name}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="relative group"
                      >
                        {item.hasSubmenu ? (
                          <div className="relative">
                            <div className="text-base font-medium text-black mb-3 cursor-pointer flex items-center hover:text-gray-600 transition-colors duration-300 p-2 rounded">
                              <span>{item.name}</span>
                              <svg className="w-4 h-4 ml-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                            
                            {/* Categories Submenu */}
                            <div className="space-y-1 ml-4">
                              {item.submenuType === 'inflatable' && inflatableBoats.map((category) => (
                                <Link
                                  key={category.id}
                                  to={`/categories/${category.id}`}
                                  onClick={closeMenu}
                                >
                                  <motion.div
                                    className="group p-2 rounded hover:bg-gray-50 transition-all duration-300 cursor-pointer"
                                    onMouseEnter={() => {
                                      // Allow hover on desktop and tablet, prevent on mobile
                                      if (!isMobileDevice) {
                                        setHoveredCategory(category);
                                      }
                                    }}
                                    onTouchStart={() => {
                                      // On mobile, clear hover to prevent preview
                                      if (isMobileDevice) {
                                        setHoveredCategory(null);
                                      }
                                    }}
                                    whileHover={!isMobileDevice ? { x: 2 } : {}}
                                  >
                                    <h4 className="text-black font-medium text-sm group-hover:text-gray-600 transition-colors duration-300">
                                      {category.name}
                                    </h4>
                                  </motion.div>
                                </Link>
                              ))}
                              {item.submenuType === 'boats' && boatsModels.map((model) => (
                                <Link
                                  key={model.id}
                                  to={`/models/${model.id}`}
                                  onClick={closeMenu}
                                >
                                  <motion.div
                                    className="group p-2 rounded hover:bg-gray-50 transition-all duration-300 cursor-pointer"
                                    onMouseEnter={() => {
                                      // Allow hover on desktop and tablet, prevent on mobile
                                      if (!isMobileDevice) {
                                        setHoveredModel(model);
                                      }
                                    }}
                                    onTouchStart={() => {
                                      // On mobile, clear hover to prevent preview
                                      if (isMobileDevice) {
                                        setHoveredModel(null);
                                      }
                                    }}
                                    whileHover={!isMobileDevice ? { x: 2 } : {}}
                                  >
                                    <h4 className="text-black font-medium text-sm group-hover:text-gray-600 transition-colors duration-300">
                                      {getModelDisplayName(model)}
                                    </h4>
                                  </motion.div>
                                </Link>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <Link
                            to={item.path}
                            onClick={closeMenu}
                            className={`text-base font-medium transition-all duration-300 block py-2 px-3 rounded hover:bg-gray-50 ${
                              location.pathname === item.path
                                ? 'text-black bg-gray-100'
                                : 'text-black hover:text-gray-600'
                            }`}
                          >
                            {item.name}
                          </Link>
                        )}
                      </motion.div>
                    ))}
                  </nav>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-200">
                  <div className="text-center">
                    <a
                      href="/contact"
                      className="text-sm text-gray-600 hover:text-black transition-colors duration-300"
                    >
                      Contact us
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hover Preview - Next to side menu */}
      <AnimatePresence>
        {hoveredCategory && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed top-20 left-64 sm:left-72 h-[calc(100vh-5rem)] w-64 sm:w-72 bg-white border-l border-gray-200 shadow-2xl hidden sm:block z-50"
            onMouseLeave={() => setHoveredCategory(null)}
          >
            {/* Gray background overlay */}
            <div className="absolute inset-0" style={{ backgroundColor: '#eeeeee' }} />
            
            {/* Content */}
            <div className="relative h-full overflow-y-auto p-6" style={{ fontFamily: 'Tussilago, sans-serif' }}>
              <style>{`
                .overflow-y-auto::-webkit-scrollbar {
                  display: none;
                }
              `}</style>
              
              <div className="space-y-6">
                {/* Models Grid */}
                <div className="space-y-6">
                  {hoveredCategory.models.map((model) => (
                    <Link key={model.id} to={`/models/${model.id}`} onClick={closeMenu}>
                      <div className="group cursor-pointer">
                        <div className="aspect-[16/9] relative rounded-lg overflow-hidden mb-3">
                          <img
                            src={getSideMenuImage(model.name)}
                            alt={model.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              console.log('Image failed to load:', e.target.src);
                              e.target.src = '/images/sideMenu-NoBG.png';
                            }}
                          />
                        </div>
                        <p className="text-base font-medium text-black text-center group-hover:text-gray-600 transition-colors">
                          {getModelDisplayName(model, hoveredCategory)}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
        {hoveredModel && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed top-20 left-64 sm:left-72 h-[calc(100vh-5rem)] w-64 sm:w-72 bg-white border-l border-gray-200 shadow-2xl hidden sm:block z-50"
            onMouseLeave={() => setHoveredModel(null)}
          >
            {/* Gray background overlay */}
            <div className="absolute inset-0" style={{ backgroundColor: '#eeeeee' }} />
            
            {/* Content */}
            <div className="relative h-full overflow-y-auto p-6" style={{ fontFamily: 'Tussilago, sans-serif' }}>
              <style>{`
                .overflow-y-auto::-webkit-scrollbar {
                  display: none;
                }
              `}</style>
              
              <div className="space-y-6">
                {/* Single Model Preview */}
                <Link key={hoveredModel.id} to={`/models/${hoveredModel.id}`} onClick={closeMenu}>
                  <div className="group cursor-pointer">
                    <div className="aspect-[16/9] relative rounded-lg overflow-hidden mb-3">
                      <img
                        src={getSideMenuImage(hoveredModel.name)}
                        alt={hoveredModel.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          console.log('Image failed to load:', e.target.src);
                          e.target.src = '/images/sideMenu-NoBG.png';
                        }}
                      />
                    </div>
                    <p className="text-base font-medium text-black text-center group-hover:text-gray-600 transition-colors">
                      {getModelDisplayName(hoveredModel)}
                    </p>
                  </div>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;