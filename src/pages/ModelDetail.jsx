import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { inflatableBoats } from '../data/models';
import { getModelImageFolder, encodeFilename } from '../data/imageHelpers';

const ModelDetail = () => {
  const { id } = useParams();
  
  // Find the model across all categories
  let model = null;
  let category = null;
  
  for (const cat of inflatableBoats) {
    const foundModel = cat.models.find(m => m.id === parseInt(id));
    if (foundModel) {
      model = foundModel;
      category = cat;
      break;
    }
  }

  if (!model) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-light text-midnight-slate mb-4">Model Not Found</h1>
          <p className="text-gray-600 mb-8">The requested model could not be found.</p>
          <Link to="/models" className="btn-primary">
            Back to Models
          </Link>
        </div>
      </div>
    );
  }

  // Build dynamic media paths
  const modelFolder = useMemo(() => getModelImageFolder(model.name), [model.name]);
  const defaultHero = model.heroImage || model.image;
  
  // Videos: support array model.videoFiles or single model.video fallback then default 'video.mp4'
  const videoFiles = useMemo(() => {
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
  }, [model.videoFiles, model.video, modelFolder]);
  const [activeVideo, setActiveVideo] = useState(0);

  // Build gallery images from model folder (all images in folder or from galleryFiles)
  const galleryImages = useMemo(() => {
    if (Array.isArray(model.galleryFiles) && model.galleryFiles.length > 0) {
      return model.galleryFiles.map((file) => modelFolder + encodeFilename(file));
    }
    // Fallback to available images
    const set = new Set([defaultHero, model.image].filter(Boolean));
    return Array.from(set);
  }, [model.galleryFiles, modelFolder, defaultHero, model.image]);

  const [currentSlide, setCurrentSlide] = useState(0);
  const goPrev = () => setCurrentSlide((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  const goNext = () => setCurrentSlide((prev) => (prev + 1) % galleryImages.length);

  // Get first 3 optional features for "Elevate Your Experience" section
  const optionalFeaturesForElevate = useMemo(() => {
    if (!model.optionalFeatures || model.optionalFeatures.length === 0) return [];
    return model.optionalFeatures.slice(0, 3);
  }, [model.optionalFeatures]);

  // Get full model name (e.g., "TopLine 850" instead of "TL850")
  const fullModelName = useMemo(() => {
    if (category) {
      // Extract number from model name (e.g., "TL850" -> "850")
      const numberMatch = model.name.match(/\d+/);
      const number = numberMatch ? numberMatch[0] : '';
      // Combine category name with number
      return number ? `${category.name} ${number}` : `${category.name} ${model.name}`;
    }
    return model.name;
  }, [model.name, category]);

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
            {model.name}
          </h1>
          {model.shortDescription && (
            <p className="text-lg md:text-xl text-gray-200 leading-relaxed drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
              {model.shortDescription}
            </p>
          )}
        </motion.div>
      </section>

      {/* 2) Model Name and Description - Centered */}
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
              {model.section2Title || fullModelName}
            </h2>
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
              {model.section2Description || model.description || model.shortDescription || ''}
            </p>
          </motion.div>
        </div>
      </section>

      {/* 3) Video Section */}
      <section className="relative h-[60vh] sm:h-[70vh] md:h-screen">
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
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                {model.description || `The ${model.name} combines cutting-edge technology with refined craftsmanship. 
                Every detail has been meticulously designed to deliver an unparalleled boating experience, 
                from its advanced hull design to its premium interior finishes.`}
              </p>
              <div className="max-h-[400px] overflow-y-auto pr-2">
                <ul className="space-y-3 text-gray-700">
                  {(model.standardFeatures || model.features || []).map((f, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="mt-2 w-2 h-2 bg-smoked-saffron rounded-full flex-shrink-0" />
                      <span className="text-base">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
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
      <section className="relative w-full">
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
      <section className="section-padding bg-white">
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
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Built with uncompromising attention to detail, the {model.name} represents the pinnacle of 
                marine engineering. Its advanced construction techniques and premium materials ensure 
                exceptional performance, durability, and comfort in all conditions.
              </p>
              {(model.standardFeatures || model.features || []).length > 5 && (
                <ul className="space-y-3 text-gray-700">
                  {(model.standardFeatures || model.features || []).slice(5).map((f, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="mt-2 w-2 h-2 bg-smoked-saffron rounded-full flex-shrink-0" />
                      <span className="text-base">{f}</span>
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* 7) Elevate Your Experience - 3 Optional Features */}
      {optionalFeaturesForElevate.length > 0 && (
        <section className="section-padding bg-gray-50">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h3 className="text-3xl md:text-4xl font-light text-midnight-slate mb-4">
                Elevate Your Experience
              </h3>
              <p className="text-gray-600 max-w-3xl mx-auto">
                Enhance your {model.name} with these optional upgrades and customizations.
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {optionalFeaturesForElevate.map((feature, idx) => {
                const featureName = typeof feature === 'string' ? feature : feature.name;
                const featureDesc = typeof feature === 'object' && feature.description ? feature.description : 
                  `Enhance your ${model.name} with this premium option.`;
                // Support full paths, URLs, or just filenames for feature images
                const featureImage = typeof feature === 'object' && feature.image ? 
                  (feature.image.startsWith('/') || feature.image.startsWith('http') 
                    ? feature.image 
                    : modelFolder + encodeFilename(feature.image)) : 
                  defaultHero;
                
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-white rounded-2xl shadow-md hover:shadow-lg transition overflow-hidden"
                  >
                    <div className="h-64 overflow-hidden">
                      <img 
                        src={featureImage} 
                        alt={featureName} 
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" 
                      />
                    </div>
                    <div className="p-6">
                      <h4 className="text-xl font-semibold text-midnight-slate mb-3">
                        {featureName}
                      </h4>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {featureDesc}
                      </p>
                      {typeof feature === 'object' && feature.price && (
                        <p className="text-sm text-smoked-saffron font-medium mt-3">
                          {feature.price}
                        </p>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 8) High Marine Quality Fabrics */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-light text-midnight-slate mb-8 text-center"
          >
            High Marine Quality Fabrics
          </motion.h3>
          {/* Two images 30/70 - Small image same height, big one is carousel */}
          <div className="flex gap-4 mb-10">
            <div className="w-[30%] hidden lg:block" style={{ height: '600px' }}>
              <div className="h-full bg-gray-200 rounded-2xl overflow-hidden">
                <img 
                  src={model.fabricLeftImage || defaultHero} 
                  alt="Interior Left" 
                  className="w-full h-full object-cover" 
                />
              </div>
            </div>
            <div className="w-full lg:w-[70%] relative" style={{ height: '600px' }}>
              <div className="relative h-full w-full bg-gray-200 rounded-2xl overflow-hidden">
                <img 
                  src={galleryImages[currentSlide] || model.fabricRightImage || model.contentImage || model.image || defaultHero} 
                  alt="Interior Right" 
                  className="w-full h-full object-cover" 
                />
                {/* Carousel controls for big image */}
                {galleryImages.length > 1 && (
                  <>
                    <button
                      onClick={goPrev}
                      className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 text-midnight-slate rounded-full p-2 hover:bg-white transition"
                      aria-label="Previous image"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={goNext}
                      className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 text-midnight-slate rounded-full p-2 hover:bg-white transition"
                      aria-label="Next image"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
          {/* Fabric choices grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {(model.fabrics || [
              'Sahara Sand','Marble','Florida Blue','Nougat','Cognac Shot','Honey'
            ]).map((name) => (
              <div key={name} className="border border-gray-200 rounded-xl p-4 text-center bg-white">
                <div className="h-16 bg-gray-100 rounded mb-3"></div>
                <div className="text-sm font-medium text-midnight-slate">{name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9) Specifications Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-light text-midnight-slate mb-6">Specifications</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Core measurements and performance figures for {model.name}.</p>
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
            <Link
              to={`/categories/${category.id}`}
              className="btn-outline mb-4 sm:mb-0"
            >
              ← Back to {category.name}
            </Link>
            <div className="text-center">
              <p className="text-gray-600 mb-2">Ready to customize your {model.name}?</p>
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

