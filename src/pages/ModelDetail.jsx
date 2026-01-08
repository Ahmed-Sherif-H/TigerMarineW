import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useMemo, useState, useEffect } from 'react';
import { useModels } from '../context/ModelsContext';
import api from '../services/api';
import { getModelImageFolder, encodeFilename } from '../data/imageHelpers';
import { getCustomizerFolder } from '../data/customizerConfig';
import { getModelDisplayName } from '../utils/modelNameUtils';

const ModelDetail = () => {
  const { id } = useParams();
  const { categories } = useModels();
  const [model, setModel] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Find category
  const category = useMemo(() => {
    if (!model) return null;
    return categories.find(c => c.id === model.categoryId);
  }, [model, categories]);

  // Fetch model data
  useEffect(() => {
    const loadModel = async () => {
      try {
        setLoading(true);
        const modelData = await api.getModelById(id);
        console.log('Raw model data from API:', modelData);
        // Transform model data to include proper image paths
        const { transformModel } = await import('../utils/transformModelData');
        const transformed = transformModel(modelData);
        console.log('Transformed model:', transformed);
        console.log('Image paths:', {
          image: transformed?.image,
          heroImage: transformed?.heroImage,
          contentImage: transformed?.contentImage,
          imageFile: transformed?.imageFile,
          heroImageFile: transformed?.heroImageFile,
          interiorMainImage: transformed?.interiorMainImage,
          interiorFiles: transformed?.interiorFiles,
          defaultHero: transformed?.heroImage || transformed?.image
        });
        setModel(transformed);
      } catch (error) {
        console.error('Error loading model:', error);
        // Fallback: try to find in static data
        const { inflatableBoats } = await import('../data/models');
        for (const cat of inflatableBoats) {
          const foundModel = cat.models.find(m => m.id === parseInt(id));
          if (foundModel) {
            setModel(foundModel);
            break;
          }
        }
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      loadModel();
    }
  }, [id]);

  // Build dynamic media paths - ALL HOOKS MUST BE CALLED BEFORE ANY EARLY RETURNS
  const modelFolder = useMemo(() => {
    if (!model || !model.name) return '';
    return getModelImageFolder(model.name);
  }, [model?.name]);

  const defaultHero = useMemo(() => {
    if (!model) return null;
    return model.heroImage || model.image;
  }, [model?.heroImage, model?.image]);
  
  // Videos: support array model.videoFiles or single model.video fallback then default 'video.mp4'
  const videoFiles = useMemo(() => {
    if (!model) return [];
    if (Array.isArray(model.videoFiles) && model.videoFiles.length > 0) {
      return model.videoFiles.map((f) => {
        // Support full paths, URLs, or just filenames
        if (f.startsWith('/') || f.startsWith('http')) return f;
        return modelFolder + encodeFilename(f);
      });
    }
    if (model.video) return [model.video];
    // Try common video filenames as fallback
    return [modelFolder + 'video.mp4'];
  }, [model?.videoFiles, model?.video, modelFolder]);
  
  const [activeVideo, setActiveVideo] = useState(0);

  // Build gallery images from model folder (all images in folder or from galleryFiles)
  const galleryImages = useMemo(() => {
    if (!model) return [];
    if (Array.isArray(model.galleryFiles) && model.galleryFiles.length > 0) {
      return model.galleryFiles.map((file) => modelFolder + encodeFilename(file));
    }
    // Fallback to available images
    const set = new Set([defaultHero, model.image].filter(Boolean));
    return Array.from(set);
  }, [model?.galleryFiles, modelFolder, defaultHero, model?.image]);

  const [currentSlide, setCurrentSlide] = useState(0);
  const goPrev = () => setCurrentSlide((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  const goNext = () => setCurrentSlide((prev) => (prev + 1) % galleryImages.length);

  // Get all optional features (display all, not just first 4)
  const allOptionalFeatures = useMemo(() => {
    if (!model || !model.optionalFeatures || model.optionalFeatures.length === 0) return [];
    return model.optionalFeatures;
  }, [model?.optionalFeatures]);

  // Get left interior image (single image)
  // Note: interiorMainImage is already transformed to full path in transformModelData.js
  const interiorMainImage = useMemo(() => {
    if (!model) {
      console.log('[ModelDetail] No model for interiorMainImage');
      return null;
    }
    // Check for empty string, null, or undefined
    if (!model.interiorMainImage || model.interiorMainImage.trim() === '') {
      console.log('[ModelDetail] No interiorMainImage field in model. Model keys:', Object.keys(model));
      console.log('[ModelDetail] Model interiorMainImage value:', model.interiorMainImage);
      console.log('[ModelDetail] Model raw data:', {
        interiorMainImage: model.interiorMainImage,
        interiorFiles: model.interiorFiles,
        hasInteriorFiles: !!model.interiorFiles?.length
      });
      return null;
    }
    // interiorMainImage is already a full path from transformModelData
    console.log('[ModelDetail] ✅ Interior main image path:', model.interiorMainImage);
    return model.interiorMainImage;
  }, [model?.interiorMainImage]);

  // Get interior carousel images (array for the right side)
  const interiorCarouselImages = useMemo(() => {
    if (!model) return [];
    if (model.interiorFiles && Array.isArray(model.interiorFiles) && model.interiorFiles.length > 0) {
      const interiorFolder = modelFolder + 'Interior/';
      return model.interiorFiles.map(file => interiorFolder + encodeFilename(file));
    }
    return [];
  }, [modelFolder, model?.interiorFiles]);

  const [interiorSlide, setInteriorSlide] = useState(0);
  const [activeNavTab, setActiveNavTab] = useState('overview');
  
  // Scroll spy to highlight active section
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['overview', 'video', 'gallery', 'features', 'optional-features', 'interior', 'specifications'];
      const scrollPosition = window.scrollY + 200; // Offset for sticky nav
      
      for (let i = sections.length - 1; i >= 0; i--) {
        const element = document.getElementById(sections[i]);
        if (element && element.offsetTop <= scrollPosition) {
          setActiveNavTab(sections[i]);
          break;
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 100; // Offset for sticky nav
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };
  
  const goInteriorPrev = () => {
    if (interiorCarouselImages.length <= 0) return;
    const maxIndex = interiorCarouselImages.length - 1;
    setInteriorSlide((prev) => {
      const newIndex = prev - 1;
      return newIndex < 0 ? maxIndex : newIndex;
    });
  };
  const goInteriorNext = () => {
    if (interiorCarouselImages.length <= 0) return;
    const maxIndex = interiorCarouselImages.length - 1;
    setInteriorSlide((prev) => (prev + 1) % (maxIndex + 1));
  };

  // Get full model name (e.g., "TopLine 850" instead of "TL850")
  const fullModelName = useMemo(() => {
    return getModelDisplayName(model, category);
  }, [model, category]);

  // NOW we can do early returns - ALL hooks are called above
  if (loading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-smoked-saffron mx-auto mb-4"></div>
          <p className="text-gray-600">Loading model...</p>
        </div>
      </div>
    );
  }

  if (!model) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-light text-midnight-slate mb-4">Model Not Found</h1>
          <p className="text-gray-600 mb-8">The requested model could not be found.</p>
          <Link to="/categories" className="btn-primary">
            Back to Categories
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20">
      {/* 1) Hero Section - Title and description top-left */}
      <section className="relative h-screen flex items-center justify-start">
        <img
          src={defaultHero}
          alt={model.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-white ml-12 md:ml-24 max-w-2xl"
        >
          <h1 className="text-4xl md:text-5xl font-light mb-4 drop-shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
            {fullModelName}
          </h1>
          {model.shortDescription && (
            <p className="text-lg md:text-xl text-gray-200 leading-relaxed drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] mb-6">
              {model.shortDescription}
            </p>
          )}
          {getCustomizerFolder(model.name) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <Link
                to={`/models/${model.id}/customize`}
                className="inline-flex items-center gap-3 bg-smoked-saffron hover:bg-smoked-saffron/90 text-white px-8 py-4 rounded-lg font-medium text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 transform group"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
                <span>Customize Your Boat</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </motion.div>
          )}
        </motion.div>
      </section>

      {/* Navigation Tabs - Sticky after hero */}
      <nav className="sticky top-20 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="container-custom">
          <div className="flex items-center gap-3 overflow-x-auto py-6" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <style>{`
              .overflow-x-auto::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            <button
              onClick={() => scrollToSection('overview')}
              className={`px-6 py-3 rounded-lg font-semibold text-base whitespace-nowrap transition-all ${
                activeNavTab === 'overview'
                  ? 'bg-smoked-saffron text-white'
                  : 'text-gray-600 hover:text-midnight-slate hover:bg-gray-100'
              }`}
            >
              Overview
            </button>
            {videoFiles.length > 0 && (
              <button
                onClick={() => scrollToSection('video')}
                className={`px-6 py-3 rounded-lg font-semibold text-base whitespace-nowrap transition-all ${
                  activeNavTab === 'video'
                    ? 'bg-smoked-saffron text-white'
                    : 'text-gray-600 hover:text-midnight-slate hover:bg-gray-100'
                }`}
              >
                Video
              </button>
            )}
            {galleryImages.length > 0 && (
              <button
                onClick={() => scrollToSection('gallery')}
                className={`px-6 py-3 rounded-lg font-semibold text-base whitespace-nowrap transition-all ${
                  activeNavTab === 'gallery'
                    ? 'bg-smoked-saffron text-white'
                    : 'text-gray-600 hover:text-midnight-slate hover:bg-gray-100'
                }`}
              >
                Gallery
              </button>
            )}
            {((model.standardFeatures || model.features || []).length > 0) && (
              <button
                onClick={() => scrollToSection('features')}
                className={`px-6 py-3 rounded-lg font-semibold text-base whitespace-nowrap transition-all ${
                  activeNavTab === 'features'
                    ? 'bg-smoked-saffron text-white'
                    : 'text-gray-600 hover:text-midnight-slate hover:bg-gray-100'
                }`}
              >
                Features
              </button>
            )}
            {allOptionalFeatures.length > 0 && (
              <button
                onClick={() => scrollToSection('optional-features')}
                className={`px-6 py-3 rounded-lg font-semibold text-base whitespace-nowrap transition-all ${
                  activeNavTab === 'optional-features'
                    ? 'bg-smoked-saffron text-white'
                    : 'text-gray-600 hover:text-midnight-slate hover:bg-gray-100'
                }`}
              >
                Optional Features
              </button>
            )}
            {(interiorMainImage || interiorCarouselImages.length > 0) && (
              <button
                onClick={() => scrollToSection('interior')}
                className={`px-6 py-3 rounded-lg font-semibold text-base whitespace-nowrap transition-all ${
                  activeNavTab === 'interior'
                    ? 'bg-smoked-saffron text-white'
                    : 'text-gray-600 hover:text-midnight-slate hover:bg-gray-100'
                }`}
              >
                Interior
              </button>
            )}
            {model.specs && Object.keys(model.specs).length > 0 && (
              <button
                onClick={() => scrollToSection('specifications')}
                className={`px-6 py-3 rounded-lg font-semibold text-base whitespace-nowrap transition-all ${
                  activeNavTab === 'specifications'
                    ? 'bg-smoked-saffron text-white'
                    : 'text-gray-600 hover:text-midnight-slate hover:bg-gray-100'
                }`}
              >
                Specifications
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* 2) Model Name and Description - Centered */}
      <section id="overview" className="section-padding bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-light text-midnight-slate mb-6">
              {model.section2Title || fullModelName}
            </h2>
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
              {model.section2Description || model.description || model.shortDescription || ''}
            </p>
          </motion.div>
        </div>
      </section>

      {/* 3) Video Section */}
      <section id="video" className="relative h-[60vh] sm:h-[70vh] md:h-screen">
        {videoFiles.length > 0 && videoFiles[0] ? (
          <>
            <video
              key={activeVideo}
              src={videoFiles[activeVideo]}
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
              onError={(e) => {
                // Hide video if it doesn't exist and show fallback
                e.target.style.display = 'none';
                const fallback = e.target.parentElement?.querySelector('.video-fallback');
                if (fallback) fallback.style.display = 'flex';
              }}
            />
            {/* Fallback message (hidden by default) */}
            <div className="video-fallback absolute inset-0 flex items-center justify-center bg-gray-900" style={{ display: 'none' }}>
              <p className="text-white text-lg">Video unavailable</p>
            </div>
            {/* Video switcher if multiple files exist */}
            {videoFiles.length > 1 && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {videoFiles.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveVideo(idx)}
                    className={`w-3 h-3 rounded-full ${idx === activeVideo ? 'bg-smoked-saffron' : 'bg-white/60'} hover:bg-white transition`}
                    aria-label={`Play video ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
            <p className="text-white text-lg">Video coming soon</p>
          </div>
        )}
      </section>

      {/* 4) Image Right, Text Left - Boat Features */}
      <section className="section-padding bg-gray-100">
        <div className="container-custom">
          <div className="flex gap-8 items-start">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="w-full lg:w-[30%]"
            >
              <h3 className="text-3xl md:text-4xl font-light text-midnight-slate mb-6">
                Exceptional Features
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                Experience the perfect fusion of innovation and luxury. Our commitment to excellence shines through 
                in every detail, from the sleek exterior design to the meticulously crafted interior. Discover 
                why discerning boaters choose Tiger Marine for their most memorable adventures on the water.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative aspect-[16/9] bg-gray-200 rounded-2xl overflow-hidden flex-1"
            >
              <img 
                src={model.contentImage || model.image || defaultHero} 
                alt={model.name} 
                className="w-full h-full object-cover" 
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* 5) Full Width Image Carousel */}
      <section id="gallery" className="relative w-full">
        <div className="relative h-[85vh] w-full overflow-hidden">
          <img
            src={galleryImages[currentSlide]}
            alt={`${model.name} ${currentSlide + 1}`}
            className="w-full h-full object-cover"
          />
          {/* Arrows */}
          {galleryImages.length > 1 && (
            <>
              <button
                onClick={goPrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 text-midnight-slate rounded-full p-3 hover:bg-white transition"
                aria-label="Previous image"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={goNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 text-midnight-slate rounded-full p-3 hover:bg-white transition"
                aria-label="Next image"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
          {/* Previews inside image */}
          {galleryImages.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 bg-black/30 backdrop-blur-sm rounded-xl px-3 py-2">
              <div className="flex gap-2 max-w-[90vw] overflow-x-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {galleryImages.map((src, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`relative w-20 h-14 rounded-md overflow-hidden border ${idx === currentSlide ? 'border-smoked-saffron' : 'border-white/30'} hover:border-smoked-saffron transition-all`}
                  >
                    <img src={src} alt={`${model.name} thumb ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 6) Image Left, Text Right - Boat Features */}
      {/*<section className="section-padding bg-white">
        <div className="container-custom">
          <div className="flex gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative aspect-[16/9] bg-gray-200 rounded-2xl overflow-hidden flex-1"
            >
              <img 
                src={model.contentImage || model.image || defaultHero} 
                alt={model.name} 
                className="w-full h-full object-cover" 
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="w-full lg:w-[30%]"
            >
              <h3 className="text-3xl md:text-4xl font-light text-midnight-slate mb-6">
                Precision Engineering
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                Where cutting-edge technology meets timeless craftsmanship. Each vessel is a masterpiece of 
                engineering excellence, designed to exceed expectations and deliver unparalleled performance. 
                Join the elite community of boaters who demand nothing but the best.
              </p>
            </motion.div>
          </div>
        </div>
      </section>*/}

      {/* 6.5) Standard Features Section */}
      <section id="features" className="section-padding bg-gray-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h3 className="text-2xl md:text-3xl font-light text-midnight-slate mb-3">
              Standard Features
            </h3>
            <p className="text-base text-gray-600 max-w-3xl mx-auto">
              Discover what makes the {fullModelName} exceptional
            </p>
          </motion.div>

          <div className="max-w-6xl mx-auto">
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2">
              {(model.standardFeatures || model.features || []).map((feature, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.03 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-3 text-sm md:text-base text-gray-700"
                >
                  <div className="flex-shrink-0 w-1.5 h-1.5 bg-smoked-saffron rounded-full mt-2"></div>
                  <span>{feature}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 7) Optional Features - Display All Titles */}
      {allOptionalFeatures.length > 0 && (
        <section id="optional-features" className="section-padding bg-white">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-8"
            >
              <h3 className="text-2xl md:text-3xl font-light text-midnight-slate mb-3">
                Optional Features
              </h3>
              <p className="text-base text-gray-600 max-w-3xl mx-auto">
                Enhance your {fullModelName} with these optional upgrades and customizations.
              </p>
            </motion.div>
            
            <div className="max-w-6xl mx-auto">
              <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2">
                {allOptionalFeatures.map((feature, idx) => {
                  const featureName = typeof feature === 'string' ? feature : feature.name;
                  
                  return (
                    <motion.li
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: idx * 0.03 }}
                      viewport={{ once: true }}
                      className="flex items-start gap-3 text-sm md:text-base text-gray-700"
                    >
                      <div className="flex-shrink-0 w-1.5 h-1.5 bg-smoked-saffron rounded-full mt-2"></div>
                      <span>{featureName}</span>
                    </motion.li>
                  );
                })}
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* 8) Interior Section */}
      <section id="interior" className="section-padding bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h3 className="text-3xl md:text-4xl font-light text-midnight-slate mb-4">
              Interior Excellence
            </h3>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Step inside and discover the refined interior of the {fullModelName}, where comfort meets craftsmanship.
            </p>
          </motion.div>
          {/* Two images 30/70 - Small image same height, big one is carousel */}
          {(interiorMainImage || interiorCarouselImages.length > 0) ? (
            <div className="flex gap-4">
              {/* Left image - separate main interior image (always show 30% if carousel exists) */}
              <div className="w-full md:w-[30%] lg:w-[30%]" style={{ height: '600px' }}>
                <div className="h-full bg-gray-200 rounded-2xl overflow-hidden shadow-lg relative">
                  {interiorMainImage ? (
                    <img 
                      src={interiorMainImage} 
                      alt="Interior" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error('[ModelDetail] ❌ Failed to load interiorMainImage:', interiorMainImage);
                        // Hide broken image and show placeholder
                        e.target.style.display = 'none';
                        const parent = e.target.parentElement;
                        if (parent && !parent.querySelector('.broken-image-placeholder')) {
                          const placeholder = document.createElement('div');
                          placeholder.className = 'broken-image-placeholder absolute inset-0 flex flex-col items-center justify-center bg-gray-100 text-gray-400';
                          placeholder.innerHTML = `
                            <svg class="w-16 h-16 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p class="text-sm font-medium">Image not available</p>
                          `;
                          parent.appendChild(placeholder);
                        }
                      }}
                      onLoad={() => {
                        console.log('[ModelDetail] ✅ Successfully loaded interiorMainImage:', interiorMainImage);
                        // Remove placeholder if image loads successfully
                        const parent = e.target.parentElement;
                        const placeholder = parent?.querySelector('.broken-image-placeholder');
                        if (placeholder) {
                          placeholder.remove();
                        }
                      }}
                    />
                  ) : (
                    // Show placeholder if no image URL provided
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 text-gray-400">
                      <svg className="w-16 h-16 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-sm font-medium">No image set</p>
                    </div>
                  )}
                </div>
              </div>
              {/* Right carousel - interior carousel images */}
              <div className="relative w-full lg:w-[70%]" style={{ height: '600px' }}>
                <div className="relative h-full w-full bg-gray-200 rounded-2xl overflow-hidden shadow-lg">
                  {interiorCarouselImages.length > 0 ? (
                    <>
                      <img 
                        src={interiorCarouselImages[interiorSlide] || interiorCarouselImages[0]} 
                        alt={`Interior ${interiorSlide + 1}`} 
                        className="w-full h-full object-cover" 
                      />
                      {/* Carousel controls */}
                      {interiorCarouselImages.length > 1 && (
                        <>
                          <button
                            onClick={goInteriorPrev}
                            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 text-midnight-slate rounded-full p-3 hover:bg-white transition shadow-lg"
                            aria-label="Previous image"
                          >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                          </button>
                          <button
                            onClick={goInteriorNext}
                            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 text-midnight-slate rounded-full p-3 hover:bg-white transition shadow-lg"
                            aria-label="Next image"
                          >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        </>
                      )}
                      {/* Carousel indicators */}
                      {interiorCarouselImages.length > 1 && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2 bg-black/30 backdrop-blur-sm rounded-full px-3 py-2">
                          {interiorCarouselImages.map((_, idx) => (
                            <button
                              key={idx}
                              onClick={() => setInteriorSlide(idx)}
                              className={`w-2.5 h-2.5 rounded-full transition ${
                                interiorSlide === idx ? 'bg-smoked-saffron' : 'bg-white/60'
                              }`}
                              aria-label={`Go to image ${idx + 1}`}
                            />
                          ))}
                        </div>
                      )}
                    </>
                  ) : interiorMainImage ? (
                    <img 
                      src={interiorMainImage} 
                      alt="Interior" 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 text-gray-400">
                      <svg className="w-16 h-16 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-sm font-medium">No carousel images available</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">Interior images coming soon</p>
            </div>
          )}
        </div>
      </section>

      {/* 9) Customization CTA */}
      {getCustomizerFolder(model.name) && (
        <section className="section-padding bg-gradient-to-br from-midnight-slate to-gray-800 text-white">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center max-w-3xl mx-auto"
            >
              <h3 className="text-3xl md:text-4xl font-light mb-4">
                Ready to Customize Your {fullModelName}?
              </h3>
              <p className="text-lg text-gray-300 mb-8">
                Design your perfect boat with our interactive customizer. Choose colors, select optional features, 
                and create a vessel that's uniquely yours.
              </p>
              <Link
                to={`/models/${model.id}/customize`}
                className="inline-flex items-center gap-3 bg-smoked-saffron hover:bg-smoked-saffron/90 text-white px-10 py-4 rounded-lg font-medium text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 transform group"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
                <span>Start Customization</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      {/* 10) Specifications Section */}
      <section id="specifications" className="section-padding bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-light text-midnight-slate mb-6">Specifications</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Core measurements and performance figures for {fullModelName}.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {model.specs && Object.entries(model.specs)
              .filter(([key, value]) => {
                // Filter out empty values, N/A, and whitespace-only values
                if (!value) return false;
                const strValue = String(value).trim();
                return strValue !== '' && strValue !== 'N/A' && strValue !== 'N/A ';
              })
              .map(([key, value], index) => {
                // Format key: "Length" -> "Length", "MaxHP" -> "Max HP", "TubeDiameter" -> "Tube Diameter"
                const formattedKey = key.replace(/([A-Z])/g, ' $1').trim();
                return (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.05 }}
                    viewport={{ once: true }}
                    className="p-6 bg-gray-50 rounded-xl border border-gray-200 hover:shadow-md transition"
                  >
                    <div className="w-8 h-1 bg-smoked-saffron rounded mb-4"></div>
                    <div className="flex flex-col">
                      <span className="text-gray-600 text-sm mb-1 capitalize">{formattedKey}</span>
                      <span className="text-midnight-slate font-semibold text-lg">{value}</span>
                    </div>
                  </motion.div>
                );
              })}
          </div>
        </div>
      </section>

      {/* Navigation */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            {category ? (
              <Link
                to={`/categories/${category.id}`}
                className="btn-outline mb-4 sm:mb-0"
              >
                ← Back to {category.name}
              </Link>
            ) : (
              <Link
                to="/categories"
                className="btn-outline mb-4 sm:mb-0"
              >
                ← Back to Categories
              </Link>
            )}
            <div className="text-center">
              <p className="text-gray-600 mb-2">Ready to customize your {fullModelName}?</p>
              <Link
                to={`/models/${model.id}/customize`}
                className="btn-primary inline-block"
              >
                Start Customization
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ModelDetail;

