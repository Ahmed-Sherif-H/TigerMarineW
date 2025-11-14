import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const CategoryCard = ({ category, index = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ y: -10, scale: 1.02 }}
      className="group relative overflow-hidden rounded-3xl shadow-2xl"
    >
      <Link to={`/categories/${category.id}`} className="block">
        {/* Background Image */}
        <div className="relative h-96 overflow-hidden">
          <img
            src={category.image}
            alt={category.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          
          {/* Gradient Overlay */}
          <div 
            className="absolute inset-0 opacity-80"
            style={{ 
              background: `linear-gradient(135deg, ${category.color}80, ${category.color}40)` 
            }}
          />
          
          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="text-4xl font-light mb-4 group-hover:text-gold transition-colors duration-300">
                {category.name}
              </h3>
              <p className="text-lg text-gray-200 mb-6 leading-relaxed">
                {category.description}
              </p>
              
              {/* Model Count */}
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gold rounded-full"></div>
                  <span className="text-sm font-medium">
                    {category.models.length} Model{category.models.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
              
              {/* CTA */}
              <div className="flex items-center text-gold font-medium group-hover:text-white transition-colors duration-300">
                <span className="mr-2">Explore Collection</span>
                <svg
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </motion.div>
          </div>
        </div>
      </Link>
      
      {/* Floating Elements */}
      <div className="absolute top-4 right-4 opacity-20">
        <div 
          className="w-16 h-16 rounded-full"
          style={{ backgroundColor: category.color }}
        />
      </div>
    </motion.div>
  );
};

export default CategoryCard;



