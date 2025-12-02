import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const HeroSection = ({ 
  title, 
  subtitle, 
  backgroundImage, 
  showButtons = true,
  height = "h-screen",
  overlay = true 
}) => {
  return (
    <section className={`relative ${height} flex items-start justify-start overflow-hidden`}>
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video
          className="w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="/images/video.mp4" type="video/mp4" />
        </video>
        {overlay && (
          <div className="absolute inset-0 bg-gradient-to-r from-black/00 via-black/20 to-black/00" />
        )}
        
        {/* Subtle Pattern Overlay */}
        <div className="absolute inset-0 opacity-0">
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}
          ></div>
        </div>
        
        {/* Elegant Floating Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{ 
              y: [0, -30, 0],
              x: [0, 15, 0],
              rotate: [0, 3, 0]
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 left-1/4 w-40 h-40 bg-gradient-to-br from-gold/20 to-transparent rounded-full blur-2xl"
          />
          <motion.div
            animate={{ 
              y: [0, 25, 0],
              x: [0, -20, 0],
              rotate: [0, -2, 0]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 3 }}
            className="absolute bottom-1/3 right-1/4 w-32 h-32 bg-gradient-to-br from-white/15 to-transparent rounded-full blur-xl"
          />
          <motion.div
            animate={{ 
              y: [0, -20, 0],
              x: [0, 10, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 6 }}
            className="absolute top-1/2 right-1/3 w-20 h-20 bg-gradient-to-br from-silver/25 to-transparent rounded-full blur-lg"
          />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-left text-white h-full flex flex-col justify-center pl-8 pr-8">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="max-w-lg"
        >
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-light mb-6 leading-tight tracking-wide">
            <span className="block text-white drop-shadow-2xl">{title}</span>
          </h1>
        </motion.div>

        {subtitle && (
          <motion.p
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-base md:text-lg text-gray-200 mb-10 max-w-md leading-relaxed font-light drop-shadow-lg"
          >
            {subtitle}
          </motion.p>
        )}

        {showButtons && (
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-6 items-start"
          >
            <Link
              to="/categories"
              className="group relative px-8 py-4 bg-white text-midnight-slate font-semibold text-base rounded-full hover:bg-gray-100 hover:text-midnight-slate transform hover:scale-105 transition-all duration-500 shadow-2xl hover:shadow-white/30 border-2 border-white/20"
            >
              <span className="relative z-10 tracking-wide">Explore Models</span>
              <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </Link>
            <Link
              to="/contact"
              className="group px-8 py-4 border-2 border-white/80 text-white font-semibold text-base rounded-full hover:bg-white hover:text-midnight-slate transform hover:scale-105 transition-all duration-500 backdrop-blur-sm bg-white/5 hover:bg-white/90 tracking-wide"
            >
              Contact Us
            </Link>
          </motion.div>
        )}
      </div>

      {/* Elegant Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ 
            y: [0, -30, 0],
            opacity: [0.3, 0.8, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-3 h-3 bg-gold rounded-full"
        />
        <motion.div
          animate={{ 
            y: [0, 25, 0],
            opacity: [0.2, 0.6, 0.2]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-1/3 right-1/4 w-2 h-2 bg-white rounded-full"
        />
        <motion.div
          animate={{ 
            y: [0, -20, 0],
            opacity: [0.4, 0.7, 0.4]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 4 }}
          className="absolute bottom-1/3 left-1/3 w-2.5 h-2.5 bg-silver rounded-full"
        />
        <motion.div
          animate={{ 
            y: [0, 35, 0],
            x: [0, 10, 0],
            opacity: [0.2, 0.5, 0.2]
          }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-gold rounded-full"
        />
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
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
  );
};

export default HeroSection;
