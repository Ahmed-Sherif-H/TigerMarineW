import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ModelCard from '../components/ModelCard';
import { useModels } from '../context/ModelsContext';
import { useMemo } from 'react';
import { sortModelsByNumberDesc } from '../utils/modelNameUtils';

const CategoryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { categories, loading } = useModels();
  const category = categories.find(c => c.id === parseInt(id));
  
  // Get hero description based on category name
  const getHeroDescription = (categoryName) => {
    if (!categoryName) return '';
    
    const name = categoryName.toLowerCase();
    if (name.includes('maxline')) {
      return 'Designed for luxury cruising with uncompromising comfort and innovation.';
    } else if (name.includes('topline')) {
      return 'The perfect family cruiser, designed for comfort and shared moments.';
    } else if (name.includes('proline')) {
      return 'Performance-driven design for adventure, sport, and versatility.';
    } else if (name.includes('sportline')) {
      return 'Dynamic performance with sporty elegance and agility.';
    } else if (name.includes('open')) {
      return 'Open spaces, effortless movement, and everyday freedom on the water.';
    }
    // Fallback to category description if no match
    return category?.description || '';
  };
  
  // Check if this category is a "Boats" category (should redirect or show different view)
  const isBoatsCategory = useMemo(() => {
    return category?.mainGroup === 'boats';
  }, [category]);
  
  // Redirect boats categories - they should show models directly, not as a category page
  if (category && isBoatsCategory) {
    // If it's a boats category, redirect to home or show models
    // For now, we'll just show a message or redirect
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-light text-midnight-slate mb-4">Boats Collection</h1>
          <p className="text-gray-600 mb-8">This category contains boat models. Please browse from the main menu.</p>
          <Link to="/" className="btn-primary">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-smoked-saffron mx-auto mb-4"></div>
          <p className="text-gray-600">Loading category...</p>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-light text-midnight-slate mb-4">Category Not Found</h1>
          <p className="text-gray-600 mb-8">The requested category could not be found.</p>
          <Link to="/categories" className="btn-primary">
            Back to Categories
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center">
        <div className="absolute inset-0">
          <img
            src={category.heroImage || category.image}
            alt={category.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
        </div>
        
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-6xl md:text-8xl font-light mb-6"
          >
            {category.name}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-2xl text-gray-200 mb-8"
          >
            {getHeroDescription(category.name)}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-6 justify-center"
          >
            <a
              href="#models"
              className="btn-primary text-lg px-10 py-4 hover:scale-105 transform transition-all duration-300"
            >
              View Models
            </a>
            <a
              href="/contact"
              className="btn-outline text-lg px-10 py-4 border-white text-white hover:bg-white hover:text-midnight-slate transform transition-all duration-300"
            >
              Contact Dealer
            </a>
          </motion.div>
        </div>
      </section>

      {/* Category Info */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-light text-midnight-slate mb-8">
                About {category.name}
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                {category.description}
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="text-gray-700">
                    {category.models.length} Model{category.models.length !== 1 ? 's' : ''} Available
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="text-gray-700">Customization Options Available</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="text-gray-700">Global Dealer Network</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-[4/3] bg-gray-200 rounded-2xl overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div 
                className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full opacity-20"
                style={{ backgroundColor: category.color }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Models Section */}
      <section id="models" className="section-padding bg-gray-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-light text-midnight-slate mb-6">
              {category.name} Models
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore the specific models within the {category.name} collection, 
              each designed to deliver exceptional performance and luxury.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortModelsByNumberDesc(category.models).map((model, index) => (
              <ModelCard key={model.id} model={model} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Category Features */}
      {/*<section className="section-padding">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-light text-midnight-slate mb-6">
              Why Choose {category.name}?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover what makes the {category.name} collection the perfect choice 
              for your maritime adventures.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Advanced Engineering",
                description: "Cutting-edge marine technology and engineering excellence",
                icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              },
              {
                title: "Luxury Amenities",
                description: "Premium finishes and amenities for the ultimate comfort",
                icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              },
              {
                title: "Customization",
                description: "Personalize every aspect to match your unique style",
                icon: "M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
                  style={{ backgroundColor: `${category.color}20` }}
                >
                  <svg 
                    className="w-8 h-8" 
                    style={{ color: category.color }}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-midnight-slate mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
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
              Ready to Experience {category.name}?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Contact our specialists to learn more about the {category.name} collection 
              and schedule a viewing at your nearest dealer.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <a
                href="/contact"
                className="btn-secondary text-lg px-8 py-4 hover:scale-105 transform transition-all duration-300"
              >
                Contact Specialist
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

      {/* Navigation */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <Link
              to="/categories"
              className="btn-outline mb-4 sm:mb-0"
            >
              ← Back to Categories
            </Link>
            <div className="text-center">
              <p className="text-gray-600 mb-2">Interested in customizing your {category.name}?</p>
              <a
                href="/color-fabric"
                className="btn-primary"
              >
                Start Customization
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CategoryDetail;

