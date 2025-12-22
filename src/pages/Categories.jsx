import { motion } from 'framer-motion';
import CategoryCard from '../components/CategoryCard';
import { useModels } from '../context/ModelsContext';

const Categories = () => {
  const { categories, loading } = useModels();

  if (loading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-smoked-saffron mx-auto mb-4"></div>
          <p className="text-gray-600">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative h-96 flex items-center justify-center bg-gradient-to-r from-midnight-slate to-gray-600">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative z-10 text-center text-white px-4">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-6xl font-light mb-6"
          >
            Our Collections
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-200 max-w-3xl mx-auto"
          >
            Explore our five distinct inflatable boat categories, each designed for different 
            lifestyles and maritime adventures.
          </motion.p>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="section-padding bg-gradient-to-br from-gray-50 to-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-light text-midnight-slate mb-6">
              Choose Your Category
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Each category represents a different approach to inflatable boating, 
              from ultimate performance to open-deck freedom.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {categories.length === 0 ? (
              <div className="col-span-full text-center py-12 text-gray-500">
                No categories found
              </div>
            ) : (
              categories.map((category, index) => (
                <CategoryCard key={category.id} category={category} index={index} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Category Comparison */}
      <section className="section-padding">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-light text-midnight-slate mb-6">
              Category Comparison
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Understanding the differences between our categories to help you 
              choose the perfect inflatable boat for your needs.
            </p>
          </motion.div>

          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-2xl shadow-lg overflow-hidden">
              <thead className="bg-midnight-slate text-white">
                <tr>
                  <th className="px-6 py-4 text-left">Category</th>
                  <th className="px-6 py-4 text-left">Best For</th>
                  <th className="px-6 py-4 text-left">Size Range</th>
                  <th className="px-6 py-4 text-left">Key Features</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category, index) => (
                  <motion.tr
                    key={category.id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                        <span className="font-semibold text-midnight-slate">{category.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {category.shortDescription}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {category.name === 'MaxLine' ? '11.5m' :
                       category.name === 'TopLine' ? '6.5-9.5m' :
                       category.name === 'ProLine' ? '5.5-6.2m' :
                       category.name === 'SportLine' ? '4.8-5.2m' :
                       '6.5-8.5m'}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {category.name === 'MaxLine' ? 'Ultimate luxury, flagship design' :
                       category.name === 'TopLine' ? 'Premium comfort, advanced tech' :
                       category.name === 'ProLine' ? 'Professional grade, charter ready' :
                       category.name === 'SportLine' ? 'High performance, sport design' :
                       'Open deck, maximum connection'}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-midnight-slate text-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-4xl md:text-5xl font-light mb-6">
              Ready to Explore?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Dive deeper into any category to discover the specific models 
              and features that match your vision of inflatable boating.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <a
                href="/contact"
                className="btn-secondary text-lg px-8 py-4 hover:scale-105 transform transition-all duration-300"
              >
                Speak with a Specialist
              </a>
              <a
                href="/dealers"
                className="btn-outline text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-midnight-slate transform transition-all duration-300"
              >
                Find a Dealer
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Categories;

