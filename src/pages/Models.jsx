import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { inflatableBoats } from '../data/models';

const Models = () => {
  return (
    <div className="pt-20">
      {/* Enhanced Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        {/* Background Image with First Category */}
        <div className="absolute inset-0">
          {inflatableBoats[0] && (
            <img
              src={inflatableBoats[0].image}
              alt={inflatableBoats[0].name}
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/70" />
        </div>
        
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Ccircle cx='30' cy='30' r='1.5'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '60px 60px'
            }}
          />
        </div>
        
        <div className="relative z-10 text-center text-white px-4 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <motion.h1
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-6xl md:text-7xl lg:text-8xl font-light mb-6 tracking-tight"
              style={{ textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}
            >
              Our Models
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl text-gray-100 max-w-3xl mx-auto leading-relaxed font-light"
              style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}
            >
              Discover our complete collection of inflatable boats, each crafted with precision 
              and designed to deliver an unparalleled experience on the water.
            </motion.p>
          </motion.div>
        </div>
        
        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-1 h-3 bg-white/70 rounded-full mt-2"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Enhanced Categories Grid */}
      <section className="section-padding bg-gradient-to-b from-white to-gray-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-light text-midnight-slate mb-6 tracking-tight">
              Complete Collection
            </h2>
            <div className="w-24 h-1 bg-smoked-saffron mx-auto mb-8"></div>
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-light">
              From compact sport boats to flagship luxury vessels, our range offers 
              the perfect inflatable boat for every mariner's needs.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12">
            {inflatableBoats.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.15 }}
                viewport={{ once: true }}
              >
                <Link to={`/categories/${category.id}`} className="block group">
                  <div className="relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-700 overflow-hidden h-full border border-gray-100 flex flex-col">
                    {/* Large Category Image */}
                    <div className="relative h-80 lg:h-96 overflow-hidden">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
                      />
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      
                      {/* Category Name and Badge */}
                      <div className="absolute bottom-0 left-0 right-0 p-8">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-4xl md:text-5xl font-light text-white mb-3 tracking-tight">
                              {category.name}
                            </h3>
                            <p className="text-gray-200 text-lg font-light max-w-md">
                              {category.shortDescription}
                            </p>
                          </div>
                          <div className="flex-shrink-0">
                            <div className="bg-smoked-saffron text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                              {category.models.length} Model{category.models.length !== 1 ? 's' : ''}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Category Info Section */}
                    <div className="p-8 flex-1 flex flex-col">
                      <p className="text-gray-600 mb-6 leading-relaxed text-lg font-light line-clamp-3 flex-1">
                        {category.description}
                      </p>
                      
                      {/* Explore Button */}
                      <div className="flex items-center justify-between pt-6 border-t border-gray-200 mt-auto">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-500">Explore Collection</span>
                        </div>
                        <div className="flex items-center text-smoked-saffron group-hover:text-midnight-slate transition-colors duration-300">
                          <span className="mr-3 font-medium text-lg">View Models</span>
                          <svg 
                            className="w-6 h-6 transform group-hover:translate-x-2 transition-transform duration-300" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Customization CTA */}
      <section className="section-padding bg-gradient-to-br from-midnight-slate via-midnight-slate to-gray-800 text-white relative overflow-hidden">
        {/* Decorative Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M50 50c0-27.614-22.386-50-50-50v50h50z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '100px 100px'
            }}
          />
        </div>
        
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h2 className="text-5xl md:text-6xl font-light mb-8 tracking-tight">
                Customize Your Dream
              </h2>
              <div className="w-32 h-1 bg-smoked-saffron mx-auto mb-10"></div>
              <p className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed font-light">
                Every Tiger Marine boat can be customized to your exact specifications. 
                From interior finishes to exterior colors, create a vessel that's uniquely yours.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Link
                  to="/color-fabric"
                  className="group relative px-10 py-5 bg-smoked-saffron text-white rounded-lg font-medium text-lg hover:bg-opacity-90 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 transform inline-flex items-center"
                >
                  <span>Color & Fabric Selection</span>
                  <svg className="ml-3 w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
                <Link
                  to="/contact"
                  className="group px-10 py-5 border-2 border-white/30 text-white rounded-lg font-medium text-lg hover:bg-white/10 hover:border-white transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 transform inline-flex items-center"
                >
                  <span>Speak with a Specialist</span>
                  <svg className="ml-3 w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Models;

