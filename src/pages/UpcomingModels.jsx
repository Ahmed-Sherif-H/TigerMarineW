import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { getFullModelName } from '../utils/modelNameUtils';
import { useUpcomingModel } from '../context/UpcomingModelContext';

const UpcomingModels = () => {
  const { display, loading, configured } = useUpcomingModel();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const galleryImages = display.galleryImages?.length
    ? display.galleryImages
    : [display.homeImage].filter(Boolean);

  const detailModelId = display.detailModelId || null;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  if (loading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-smoked-saffron mx-auto" />
      </div>
    );
  }

  if (!configured || !display?.name) {
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
      <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={display.heroImage || display.homeImage}
            alt={display.name}
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
              {getFullModelName(display.name)}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl text-gray-100 max-w-3xl mx-auto leading-relaxed font-light"
              style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}
            >
              {display.shortDescription}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {galleryImages.length > 1 && (
        <section className="section-padding bg-gray-50">
          <div className="container-custom max-w-4xl mx-auto">
            <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-[16/10] bg-midnight-slate">
              <img
                src={galleryImages[currentImageIndex]}
                alt={`${display.name} gallery ${currentImageIndex + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 text-midnight-slate hover:bg-white shadow-lg"
                aria-label="Previous image"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 text-midnight-slate hover:bg-white shadow-lg"
                aria-label="Next image"
              >
                ›
              </button>
            </div>
          </div>
        </section>
      )}

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
              {getFullModelName(display.name)}
            </h2>
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed mb-8">
              {display.description}
            </p>
            <Link
              to={detailModelId ? `/models/${detailModelId}` : '/models'}
              className="inline-flex items-center gap-3 bg-smoked-saffron hover:bg-smoked-saffron/90 text-white px-10 py-4 rounded-lg font-medium text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 transform group"
            >
              <span>View {display.name} Details</span>
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
