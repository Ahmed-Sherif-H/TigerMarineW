import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { upcomingModels } from '../data/models';
import { getFullModelName } from '../utils/modelNameUtils';
import { useModels } from '../context/ModelsContext';

const UpcomingModels = () => {
  const model = upcomingModels[0]; // Only Infinity 280
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { models } = useModels();

  // Find the Infinity 280 model ID from the models context
  const infinityModelId = useMemo(() => {
    if (!models || models.length === 0) return null;
    const infinityModel = models.find(m => m.name === 'Infinity 280');
    return infinityModel?.id || null;
  }, [models]);

  // Infinity 280 images carousel (3-4 images)
  const infinityImages = [
    "/images/Infinity 280/Infinity 280-1.jpg",
    "/images/Infinity 280/Infinity 280-2.jpg",
    "/images/Infinity 280/Infinity 280-3.jpg",
    "/images/Infinity 280/Infinity 280-4.jpg"
  ];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % infinityImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + infinityImages.length) % infinityImages.length);
  };

  if (!model) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-light text-midnight-slate mb-4">No Upcoming Models</h1>
          <p className="text-gray-600 mb-8">Check back soon for upcoming models.</p>
          <Link to="/models" className="btn-primary">
            View Current Models
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 bg-white">
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={model.heroImage || model.image}
            alt={model.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/70" />
        </div>
        
        <div className="relative z-10 text-center text-white px-4 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-4"
            >
              <span className="inline-block px-6 py-2 bg-smoked-saffron text-white rounded-full text-sm font-medium tracking-wide uppercase">
                Coming Soon
              </span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-6xl md:text-7xl lg:text-8xl font-light mb-6 tracking-tight"
              style={{ textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}
            >
              {getFullModelName(model.name)}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl text-gray-100 max-w-3xl mx-auto leading-relaxed font-light"
              style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}
            >
              {model.shortDescription || model.description}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Description Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-light text-midnight-slate mb-6">
              {getFullModelName(model.name)}
            </h2>
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed mb-8">
              {model.description}
            </p>
            <Link
              to={infinityModelId ? `/models/${infinityModelId}` : '/models'}
              className="inline-flex items-center gap-3 bg-smoked-saffron hover:bg-smoked-saffron/90 text-white px-10 py-4 rounded-lg font-medium text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 transform group"
            >
              <span>View Infinity 280 Details</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default UpcomingModels;

