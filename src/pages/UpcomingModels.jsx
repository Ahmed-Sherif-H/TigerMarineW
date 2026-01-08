import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { upcomingModels } from '../data/models';
import { getFullModelName } from '../utils/modelNameUtils';

const UpcomingModels = () => {
  const model = upcomingModels[0]; // Only Infinity 280
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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
            <p className="text-base text-gray-500 italic">
              Full specifications and details will be announced soon.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Image Carousel Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-light text-midnight-slate mb-4">
              Preview
            </h2>
            <p className="text-lg text-gray-600">
              Preview images of the {getFullModelName(model.name)}
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Carousel Image */}
              <motion.div
                key={currentImageIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="relative rounded-2xl overflow-hidden shadow-xl"
              >
                <div className="aspect-[16/9] bg-gray-200">
                  <img
                    src={infinityImages[currentImageIndex]}
                    alt={`${model.name} - Image ${currentImageIndex + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              </motion.div>

              {/* Navigation Arrows */}
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-midnight-slate p-3 rounded-full shadow-lg transition-all duration-300 z-10"
                aria-label="Previous image"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-midnight-slate p-3 rounded-full shadow-lg transition-all duration-300 z-10"
                aria-label="Next image"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Dots Indicator */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {infinityImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentImageIndex ? 'bg-white w-8' : 'bg-white/60'
                    }`}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
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
              Stay Updated
            </h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Be the first to know when the {getFullModelName(model.name)} becomes available. 
              Contact us to receive updates and exclusive preview opportunities.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                to="/contact"
                className="btn-primary text-lg px-10 py-4 hover:scale-105 transform transition-all duration-300"
              >
                Contact Us
              </Link>
              <Link
                to="/models"
                className="btn-outline text-lg px-10 py-4 border-midnight-slate text-midnight-slate hover:bg-midnight-slate hover:text-white transform transition-all duration-300"
              >
                View Current Models
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default UpcomingModels;

