import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getModelDisplayName } from '../utils/modelNameUtils';
import { useModels } from '../context/ModelsContext';

const ModelCard = ({ model, index = 0 }) => {
  const { categories } = useModels();
  const category = categories.find(c => c.id === model.categoryId);
  const fullModelName = getModelDisplayName(model, category);
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ y: -10 }}
      className="group"
    >
      <Link to={`/models/${model.id}`} className="block h-full">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 h-full flex flex-col">
          {/* Image Container */}
          <div className="relative overflow-hidden">
            <div className="aspect-[4/3] bg-gray-200">
              <img
                src={model.image}
                alt={model.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
            </div>
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>

          {/* Content */}
          <div className="p-6 flex-1 flex flex-col">
            <h3 className="text-2xl font-semibold text-midnight-slate mb-2 group-hover:text-gold transition-colors duration-300">
              {fullModelName}
            </h3>
            
            <p className="text-gray-600 mb-4 line-clamp-2">
              {model.shortDescription}
            </p>

            {/* Key Specs */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center">
                <div className="text-sm text-gray-500">Length</div>
                <div className="font-semibold text-midnight-slate">{model.specs.length}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-500">Max Speed</div>
                <div className="font-semibold text-midnight-slate">{model.specs.maxSpeed}</div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="text-center mt-auto">
              <span className="inline-flex items-center text-gold font-medium group-hover:text-midnight-slate transition-colors duration-300">
                View Details
                <svg
                  className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"
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
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ModelCard;

