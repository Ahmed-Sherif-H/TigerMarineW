import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import HeroSection from '../components/HeroSection';
import { inflatableBoats } from '../data/models';
import { getLatestNews, formatNewsDate } from '../data/news';

const Home = () => {
  // Get all models from all categories and pick 7 random ones
  const allModels = inflatableBoats.flatMap(category => 
    category.models.map(model => ({
      ...model,
      categoryName: category.name,
      categoryId: category.id
    }))
  );
  
  // Get 7 random models (or all if less than 7)
  const getRandomModels = () => {
    const shuffled = [...allModels].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(7, shuffled.length));
  };
  
  const [selectedModels] = useState(() => getRandomModels());
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalSlides = selectedModels.length;
  
  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  };
  
  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };
  
  const currentModel = selectedModels[currentIndex];

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <HeroSection
        title="Experience the Art of Marine Excellence"
        subtitle="Discover our collection of luxury yachts, crafted with precision and designed for the discerning mariner."
        backgroundImage="/images/DJI_0154.jpg"
      />

      {/* 1. Upcoming Model Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-4xl md:text-5xl font-light text-midnight-slate mb-6">
              Upcoming Model
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Discover our latest innovation in marine excellence
            </p>
            <Link
              to="/models/upcoming"
              className="btn-primary text-lg px-10 py-4 hover:scale-105 transform transition-all duration-300"
            >
              Learn More
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 2. Vision Section */}
      <section className="section-padding bg-gray-100">
        <div className="container-custom">
          <div className="flex gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="w-full lg:w-[30%]"
            >
              <h2 className="text-4xl md:text-5xl font-light text-midnight-slate mb-6">
                Our Vision
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                At Tiger Marine, we envision a world where luxury meets adventure on the open seas. 
                Every vessel we create is a testament to our commitment to excellence, innovation, 
                and uncompromising quality.
              </p>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                From the drawing board to the final launch, we ensure that each yacht meets the 
                highest standards of craftsmanship and performance.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative aspect-[16/9] bg-gray-200 rounded-2xl overflow-hidden flex-1"
            >
              <video
                src="/images/AboutUs.mp4"
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. Models Section */}
      <section className="relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12 pt-16 pb-8"
        >
          <h2 className="text-4xl md:text-5xl font-light text-midnight-slate mb-4">
            Inflatable Boats
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover our premium collection of inflatable boats, designed for performance and luxury
          </p>
        </motion.div>

        {/* Full Width Image with Overlay Carousel */}
        <div className="relative w-full">
          <div className="h-screen w-full overflow-hidden">
            <img
              src={currentModel?.heroImage || currentModel?.image || "/images/Max-line.jpg"}
              alt={currentModel?.name || "Inflatable Boat"}
              className="w-full h-full object-cover transition-opacity duration-700"
              key={currentIndex}
            />
          </div>
          
          {/* Model Info Overlay */}
          <div className="absolute top-1/2 left-8 md:left-16 transform -translate-y-1/2 z-20 max-w-md">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-white text-4xl md:text-5xl font-light mb-4 drop-shadow-2xl">
                {currentModel?.name}
              </h3>
              <p className="text-white/90 text-lg mb-6 drop-shadow-lg">
                {currentModel?.shortDescription || currentModel?.description}
              </p>
              <Link
                to={`/models/${currentModel?.id}`}
                className="btn-primary text-base px-8 py-3 bg-white text-midnight-slate border-white hover:bg-gray-100 inline-block"
              >
                View Details
              </Link>
            </motion.div>
          </div>
          
          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-midnight-slate p-3 rounded-full shadow-lg transition-all duration-300 z-20"
            aria-label="Previous slide"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-midnight-slate p-3 rounded-full shadow-lg transition-all duration-300 z-20"
            aria-label="Next slide"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          
          {/* Models Carousel Preview on Bottom */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent p-4">
            <style>{`
              .model-carousel::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            <div className="model-carousel flex justify-center gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {selectedModels.map((model, index) => (
                <button
                  key={model.id}
                  onClick={() => setCurrentIndex(index)}
                  className={`relative h-20 w-32 flex-shrink-0 rounded-lg overflow-hidden group border-2 transition-all duration-300 ${
                    index === currentIndex 
                      ? 'border-white scale-110' 
                      : 'border-white/20 hover:border-white/50'
                  }`}
                >
                  <img
                    src={model.image}
                    alt={model.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className={`absolute inset-0 transition-colors duration-300 ${
                    index === currentIndex ? 'bg-black/20' : 'bg-black/40 group-hover:bg-black/20'
                  }`} />
                  <div className="absolute bottom-0 left-0 right-0 px-2 py-1 bg-gradient-to-t from-black/80 to-transparent">
                    <h4 className="text-white text-[10px] font-semibold text-center drop-shadow-lg truncate">
                      {model.name}
                    </h4>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Dealers Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-light text-midnight-slate mb-6"
            >
              Global Dealers Network
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-xl text-gray-600 mb-8 leading-relaxed"
            >
              With dealers and service centers worldwide, Tiger Marine brings luxury yachting to every 
              corner of the globe. Our dedicated network ensures you receive the highest level of service 
              and support wherever you are.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Link
                to="/dealers"
                className="btn-primary text-lg px-10 py-4 hover:scale-105 transform transition-all duration-300"
              >
                Find a Dealer
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 5. Latest News Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-light text-midnight-slate mb-6">
              Latest News
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Stay updated with our latest announcements, boat shows, and company news
            </p>
          </motion.div>

          {/* News Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {getLatestNews(6).map((news, index) => (
              <motion.div
                key={news.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Link to="/boat-shows" className="block group">
                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 h-full flex flex-col">
                    {/* News Image */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={news.image}
                        alt={news.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-smoked-saffron text-white px-3 py-1 rounded-full text-xs font-medium">
                          {news.category}
                        </span>
                      </div>
                      {news.featured && (
                        <div className="absolute top-4 right-4">
                          <span className="bg-midnight-slate text-white px-3 py-1 rounded-full text-xs font-medium">
                            Featured
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {/* News Content */}
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="text-sm text-gray-500 mb-3">
                        {formatNewsDate(news.date)}
                      </div>
                      <h3 className="text-xl font-semibold text-midnight-slate mb-3 group-hover:text-smoked-saffron transition-colors duration-300 line-clamp-2">
                        {news.title}
                      </h3>
                      <p className="text-gray-600 mb-4 flex-1 line-clamp-3">
                        {news.excerpt}
                      </p>
                      <div className="flex items-center text-smoked-saffron group-hover:text-midnight-slate transition-colors duration-300">
                        <span className="mr-2 font-medium">Read More</span>
                        <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* View All Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Link
              to="/boat-shows"
              className="btn-primary text-lg px-10 py-4 hover:scale-105 transform transition-all duration-300 inline-block"
            >
              View All News
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 6. Video Section */}
      <section className="relative h-screen">
        <div className="absolute inset-0">
          <img
            src="/images/DJI_0216.jpg"
            alt="Experience Our Models"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center text-white"
          >
            <h2 className="text-5xl md:text-6xl font-light mb-6">
              Experience Our Models
            </h2>
            <Link
              to="/models"
              className="btn-primary text-lg px-10 py-4 hover:scale-105 transform transition-all duration-300"
            >
              Visit Models
            </Link>
          </motion.div>
        </div>
      </section>

    </div>
  );
};

export default Home;
