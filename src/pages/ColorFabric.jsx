import { useState } from 'react';
import { motion } from 'framer-motion';
import { colorOptions, fabricOptions } from '../data/models';

const ColorFabric = () => {
  const [selectedCategory, setSelectedCategory] = useState('Exterior');
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedFabric, setSelectedFabric] = useState(null);

  const colorCategories = ['Exterior', 'Interior', 'Accent'];
  const fabricCategories = ['Seating', 'Upholstery', 'Decking', 'Hardware', 'Accents'];

  const filteredColors = colorOptions.filter(color => color.category === selectedCategory);
  const filteredFabrics = fabricOptions.filter(fabric => fabric.category === selectedCategory);

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative h-96 flex items-center justify-center bg-gradient-to-r from-navy to-navy-dark">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative z-10 text-center text-white px-4">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-6xl font-light mb-6"
          >
            Color & Fabric Selection
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-200 max-w-3xl mx-auto"
          >
            Personalize your Tiger Marine yacht with our extensive selection of 
            premium colors and fabrics.
          </motion.p>
        </div>
      </section>

      {/* Category Selection */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-light text-midnight-slate mb-6">
              Choose Your Category
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Select a category to explore our premium color and fabric options.
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {colorCategories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-8 py-4 rounded-lg font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-navy text-white shadow-lg'
                    : 'bg-white text-midnight-slate border-2 border-navy hover:bg-navy hover:text-white'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Color Selection */}
      <section className="section-padding">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-light text-midnight-slate mb-6">
              Color Options
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose from our carefully curated palette of premium colors.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6">
            {filteredColors.map((color) => (
              <motion.div
                key={color.id}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className={`cursor-pointer group ${
                  selectedColor?.id === color.id ? 'ring-4 ring-gold' : ''
                }`}
                onClick={() => setSelectedColor(color)}
              >
                <div
                  className="w-full h-24 rounded-lg shadow-lg group-hover:scale-105 transition-transform duration-300"
                  style={{ backgroundColor: color.code }}
                ></div>
                <p className="text-center mt-2 text-sm font-medium text-gray-700">
                  {color.name}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Fabric Selection */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-light text-midnight-slate mb-6">
              Fabric Options
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Select from our premium collection of marine-grade fabrics and materials.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredFabrics.map((fabric) => (
              <motion.div
                key={fabric.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className={`bg-white rounded-2xl shadow-lg p-6 cursor-pointer group hover:shadow-xl transition-all duration-300 ${
                  selectedFabric?.id === fabric.id ? 'ring-4 ring-gold' : ''
                }`}
                onClick={() => setSelectedFabric(fabric)}
              >
                <div className="aspect-video bg-gray-200 rounded-lg mb-4 group-hover:scale-105 transition-transform duration-300">
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-midnight-slate mb-2">{fabric.name}</h3>
                <p className="text-gray-600 text-sm mb-2">{fabric.category}</p>
                <p className="text-gray-500 text-sm">{fabric.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Selection Summary */}
      {(selectedColor || selectedFabric) && (
        <section className="section-padding">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-white rounded-2xl shadow-lg p-8"
            >
              <h2 className="text-3xl font-light text-midnight-slate mb-6 text-center">
                Your Selections
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {selectedColor && (
                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-midnight-slate mb-4">Selected Color</h3>
                    <div className="flex items-center justify-center space-x-4">
                      <div
                        className="w-16 h-16 rounded-lg shadow-lg"
                        style={{ backgroundColor: selectedColor.code }}
                      ></div>
                      <div>
                        <p className="font-medium text-gray-700">{selectedColor.name}</p>
                        <p className="text-sm text-gray-500">{selectedColor.category}</p>
                      </div>
                    </div>
                  </div>
                )}

                {selectedFabric && (
                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-midnight-slate mb-4">Selected Fabric</h3>
                    <div className="flex items-center justify-center space-x-4">
                      <div className="w-16 h-16 bg-gray-300 rounded-lg"></div>
                      <div>
                        <p className="font-medium text-gray-700">{selectedFabric.name}</p>
                        <p className="text-sm text-gray-500">{selectedFabric.category}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="text-center mt-8">
                <button className="btn-primary text-lg px-8 py-4 hover:scale-105 transform transition-all duration-300">
                  Save Selections
                </button>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="section-padding bg-navy text-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-4xl md:text-5xl font-light mb-6">
              Ready to Customize?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Work with our design specialists to create the perfect combination 
              of colors and fabrics for your Tiger Marine yacht.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <a
                href="/contact"
                className="btn-secondary text-lg px-8 py-4 hover:scale-105 transform transition-all duration-300"
              >
                Speak with a Designer
              </a>
              <a
                href="/models"
                className="btn-outline text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-midnight-slate transform transition-all duration-300"
              >
                View Models
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ColorFabric;

