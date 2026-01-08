import { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';
import { allCategories } from '../data/models';
import { getCustomizerFolder, getBaseImage, getPartImage, customizerParts } from '../data/customizerConfig';
import { getAvailableColors } from '../data/customizerColors';
import { getColorHex } from '../data/customizerColorMap';
import { getModelImageFolder, encodeFilename } from '../data/imageHelpers';
import { getModelDisplayName } from '../utils/modelNameUtils';

const ModelCustomizer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Find the model and its category
  const { model, category } = useMemo(() => {
    for (const cat of allCategories) {
      const found = cat.models.find(m => m.id === parseInt(id));
      if (found) return { model: found, category: cat };
    }
    return { model: null, category: null };
  }, [id]);

  // Get full model name (e.g., "TopLine 850" instead of "TL850")
  const fullModelName = useMemo(() => {
    return getModelDisplayName(model, category);
  }, [model, category]);

  // Build dynamic media paths for optional features
  const modelFolder = useMemo(() => {
    if (!model) return '';
    return getModelImageFolder(model.name);
  }, [model]);
  
  const defaultHero = useMemo(() => {
    if (!model) return '';
    return model.heroImage || model.image || '';
  }, [model]);

  const [selectedColors, setSelectedColors] = useState({});
  const [availableColors, setAvailableColors] = useState({});
  const [baseImage, setBaseImage] = useState(null);
  const [partImages, setPartImages] = useState({});
  const [loading, setLoading] = useState(true);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [inquiryData, setInquiryData] = useState({ name: '', email: '', phone: '', message: '' });
  const [isSubmittingInquiry, setIsSubmittingInquiry] = useState(false);
  const [inquiryMessage, setInquiryMessage] = useState({ type: '', text: '' });

  // Initialize customizer
  useEffect(() => {
    if (!model) {
      navigate('/models');
      return;
    }

    const folder = getCustomizerFolder(model.name);
    if (!folder) {
      setLoading(false);
      return;
    }

    // Load base image
    const base = getBaseImage(model.name);
    setBaseImage(base);

    // Load available colors for each part
    const colors = {};
    const initialSelections = {};

    customizerParts.forEach(part => {
      if (part.key === 'base') {
        // Base doesn't have color options
        return;
      }

      // Get available colors for this part type
      const partColors = getAvailableColors(part.key);
      colors[part.key] = partColors;
      
      // Set default selection (first color)
      if (partColors.length > 0) {
        initialSelections[part.key] = partColors[0];
      }
    });

    setAvailableColors(colors);
    setSelectedColors(initialSelections);
    setLoading(false);
  }, [model, navigate]);

  // Update part images when colors change
  useEffect(() => {
    if (!model || !baseImage) return;

    const images = {};
    customizerParts.forEach(part => {
      if (part.key === 'base') return;
      
      const color = selectedColors[part.key];
      if (color) {
        const imagePath = getPartImage(model.name, part.key, color);
        if (imagePath) {
          images[part.key] = imagePath;
        }
      }
    });

    setPartImages(images);
  }, [model, selectedColors, baseImage]);

  const handleColorChange = (partKey, color) => {
    setSelectedColors(prev => ({
      ...prev,
      [partKey]: color
    }));
  };

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    setIsSubmittingInquiry(true);
    setInquiryMessage({ type: '', text: '' });

    try {
      const response = await api.submitCustomizerInquiry({
        name: inquiryData.name,
        email: inquiryData.email,
        phone: inquiryData.phone,
        modelName: fullModelName,
        selectedColors,
        message: inquiryData.message
      });

      if (response.success) {
        setInquiryMessage({ type: 'success', text: 'Inquiry sent successfully! We will contact you soon.' });
        setInquiryData({ name: '', email: '', phone: '', message: '' });
        setTimeout(() => {
          setShowInquiryModal(false);
          setInquiryMessage({ type: '', text: '' });
        }, 2000);
      } else {
        setInquiryMessage({ type: 'error', text: response.error || 'Failed to send inquiry. Please try again.' });
      }
    } catch (error) {
      console.error('Inquiry error:', error);
      const errorMessage = error.message || 'Failed to send inquiry. Please try again.';
      setInquiryMessage({ type: 'error', text: errorMessage });
    } finally {
      setIsSubmittingInquiry(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-smoked-saffron mx-auto mb-4"></div>
          <p className="text-gray-600">Loading customizer...</p>
        </div>
      </div>
    );
  }

  if (!model) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-light text-midnight-slate mb-4">Model Not Found</h1>
          <Link to="/models" className="btn-primary">Back to Models</Link>
        </div>
      </div>
    );
  }

  const customizerFolder = getCustomizerFolder(model.name);
  if (!customizerFolder) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-light text-midnight-slate mb-4">Customizer Not Available</h1>
          <p className="text-gray-600 mb-8">Customizer images are not available for this model.</p>
          <Link to={`/models/${model.id}`} className="btn-primary">Back to Model</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 bg-gradient-to-b from-gray-50 to-white min-h-screen">
      {/* Header */}
      <section className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container-custom py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-light text-midnight-slate mb-2">
                Customize {fullModelName}
              </h1>
              <p className="text-gray-600">Design your perfect boat with our color customizer</p>
            </div>
            <Link
              to={`/models/${model.id}`}
              className="btn-outline px-6 py-2.5"
            >
              ← Back to Model
            </Link>
          </div>
        </div>
      </section>

      <div className="py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Side - Color Selectors */}
          <div className="lg:col-span-1 pl-4 lg:pl-0">
            <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-24 border border-gray-100 ml-0 lg:ml-0" style={{ minHeight: 'calc(100vh - 120px)' }}>
              <h2 className="text-2xl font-light text-midnight-slate mb-6 pb-4 border-b border-gray-200">
                Customize Colors
              </h2>
              
              <div className="space-y-6 h-[calc(100%-100px)] overflow-y-auto pr-2">
                {customizerParts.map((part) => {
                  if (part.key === 'base') return null;
                  
                  const colors = availableColors[part.key] || [];
                  const selectedColor = selectedColors[part.key];

                  return (
                    <div key={part.key} className="border-b border-gray-100 pb-5 last:border-0">
                      <h3 className="text-base font-semibold text-midnight-slate mb-4">
                        {part.label}
                      </h3>
                      
                      <div className="flex flex-wrap gap-3">
                        {colors.map((color) => {
                          const isSelected = selectedColor === color;
                          const colorHex = getColorHex(color);
                          
                          return (
                            <button
                              key={color}
                              onClick={() => handleColorChange(part.key, color)}
                              className={`relative flex flex-col items-center gap-1.5 transition-all ${
                                isSelected
                                  ? 'scale-110'
                                  : 'hover:scale-105'
                              }`}
                            >
                              <div
                                className={`w-10 h-10 rounded-full border-2 transition-all shadow-md ${
                                  isSelected
                                    ? 'border-smoked-saffron ring-2 ring-smoked-saffron ring-offset-1'
                                    : 'border-gray-300 hover:border-smoked-saffron/70'
                                }`}
                                style={{ backgroundColor: colorHex }}
                              >
                                {isSelected && (
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ filter: 'drop-shadow(0 0 2px rgba(0,0,0,0.5))' }}>
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                  </div>
                                )}
                              </div>
                              <span className={`text-[10px] text-center max-w-[55px] leading-tight ${
                                isSelected ? 'font-semibold text-smoked-saffron' : 'text-gray-600'
                              }`}>
                                {color}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Side - Boat Preview */}
          <div className="lg:col-span-2 pr-4 lg:pr-0">
            <div className="bg-white rounded-2xl shadow-xl p-6 flex flex-col border border-gray-100" style={{ minHeight: 'calc(100vh - 120px)' }}>
              <h2 className="text-2xl font-light text-midnight-slate mb-6 text-center pb-4 border-b border-gray-200 flex-shrink-0">
                Your Custom Design
              </h2>
              
              <div className="relative bg-gray-100 rounded-xl overflow-hidden shadow-inner" style={{ height: '550px', flexShrink: 0 }}>
                {/* Background Image */}
                <img
                  src="/Customizer-images/cutomizer-background.webp"
                  alt="Customizer Background"
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ zIndex: 0 }}
                />
                
                {/* Water Reflection Effect */}
                <div 
                  className="absolute bottom-0 left-0 right-0"
                  style={{
                    height: '30%',
                    background: 'linear-gradient(to top, rgba(59, 130, 246, 0.15) 0%, transparent 100%)',
                    zIndex: 1,
                    pointerEvents: 'none'
                  }}
                />
                
                {/* Composite Image - Base + Parts */}
                <div 
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ zIndex: 2 }}
                >
                  <div className="relative w-full h-full flex items-center justify-center">
                    {/* Boat Container with enhanced shadow and effects */}
                    <div 
                      className="relative"
                      style={{
                        filter: 'drop-shadow(0 25px 50px rgba(0, 0, 0, 0.4)) drop-shadow(0 15px 30px rgba(0, 0, 0, 0.3)) drop-shadow(0 5px 15px rgba(0, 0, 0, 0.2))',
                        transform: 'translateY(-8%) perspective(1000px) rotateX(2deg)',
                        width: '80%',
                        height: '80%',
                        transformStyle: 'preserve-3d'
                      }}
                    >
                      {baseImage && (
                        <img
                          src={baseImage}
                          alt="Boat Base"
                          className="absolute inset-0 w-full h-full object-contain"
                          style={{
                            filter: 'brightness(1.08) contrast(1.15) saturate(1.1)',
                            mixBlendMode: 'normal',
                          }}
                        />
                      )}
                      
                      {/* Overlay parts in order */}
                      {customizerParts.map((part) => {
                        if (part.key === 'base') return null;
                        const imagePath = partImages[part.key];
                        if (!imagePath) return null;
                        
                        const handleImageError = (e) => {
                          // Try alternative filename variations
                          const selectedColor = selectedColors[part.key];
                          if (!selectedColor) return;
                          
                          const folder = getCustomizerFolder(model.name);
                          if (!folder) return;
                          
                          // Try alternative variations
                          let altPath = null;
                          if (part.key === 'upholestry') {
                            // Try Beige if Baige fails, or vice versa
                            if (selectedColor === 'Baige') {
                              altPath = `${folder}/Upholestry/Upholestry - Beige.webp`;
                            } else if (selectedColor === 'Beige') {
                              altPath = `${folder}/Upholestry/Upholestry - Baige.webp`;
                            }
                          } else if (part.key === 'fiberglass') {
                            // Try Grey if Gray fails
                            if (selectedColor.includes('Gray')) {
                              altPath = imagePath.replace('Gray', 'Grey');
                            }
                          }
                          
                          if (altPath && e.target.src !== altPath) {
                            e.target.src = altPath;
                          }
                        };
                        
                        return (
                          <img
                            key={part.key}
                            src={imagePath}
                            alt={part.label}
                            className="absolute inset-0 w-full h-full object-contain"
                            style={{ 
                              zIndex: customizerParts.indexOf(part) + 2,
                              filter: 'brightness(1.03) saturate(1.05)',
                              mixBlendMode: 'normal',
                            }}
                            onError={handleImageError}
                          />
                        );
                      })}
                    </div>
                    
                    {/* Subtle Reflection on Water */}
                    <div 
                      className="absolute"
                      style={{
                        bottom: '5%',
                        left: '10%',
                        right: '10%',
                        height: '15%',
                        opacity: 0.2,
                        transform: 'scaleY(-1) translateY(100%)',
                        filter: 'blur(8px)',
                        zIndex: 1,
                        pointerEvents: 'none'
                      }}
                    >
                      {baseImage && (
                        <img
                          src={baseImage}
                          alt="Boat Reflection"
                          className="w-full h-full object-contain opacity-30"
                          style={{
                            filter: 'brightness(0.7) contrast(0.8)',
                          }}
                        />
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Atmospheric Light Effect */}
                <div 
                  className="absolute inset-0"
                  style={{
                    background: 'radial-gradient(ellipse at center top, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
                    zIndex: 3,
                    pointerEvents: 'none'
                  }}
                />
              </div>

              {/* Selected Colors Summary */}
              <div className="mt-6 p-5 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 flex-shrink-0">
                <h3 className="font-semibold text-midnight-slate mb-4 text-base">Your Selections</h3>
                <div className="space-y-3">
                  {Object.entries(selectedColors).map(([partKey, color]) => {
                    const part = customizerParts.find(p => p.key === partKey);
                    if (!part) return null;
                    const colorHex = getColorHex(color);
                    
                    return (
                      <div key={partKey} className="flex items-center justify-between p-2 bg-white rounded-lg border border-gray-100">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-6 h-6 rounded-full border-2 border-gray-200 shadow-sm"
                            style={{ backgroundColor: colorHex }}
                          />
                          <span className="text-sm text-gray-700 font-medium">{part.label}</span>
                        </div>
                        <span className="font-semibold text-midnight-slate text-sm">{color}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

                {/* Action Buttons */}
                <div className="mt-6 flex flex-col sm:flex-row gap-4 flex-shrink-0">
                  <button className="btn-primary flex-1">
                    Save Configuration
                  </button>
                  <button
                    onClick={() => setShowInquiryModal(true)}
                    className="btn-outline flex-1"
                  >
                    Send Inquiry
                  </button>
                  <Link
                    to="/contact"
                    className="btn-outline flex-1 text-center"
                  >
                    Request Quote
                  </Link>
                </div>
            </div>
          </div>
        </div>
      </div>


      {/* Inquiry Modal */}
      {showInquiryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-2xl font-light text-midnight-slate">Send Inquiry</h2>
              <button
                onClick={() => {
                  setShowInquiryModal(false);
                  setInquiryMessage({ type: '', text: '' });
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleInquirySubmit} className="p-6 space-y-4">
              {inquiryMessage.text && (
                <div className={`p-4 rounded-lg ${
                  inquiryMessage.type === 'success' 
                    ? 'bg-green-50 text-green-800 border border-green-200' 
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                  {inquiryMessage.text}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={inquiryData.name}
                  onChange={(e) => setInquiryData({ ...inquiryData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={inquiryData.email}
                  onChange={(e) => setInquiryData({ ...inquiryData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={inquiryData.phone}
                  onChange={(e) => setInquiryData({ ...inquiryData, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Message
                </label>
                <textarea
                  rows={4}
                  value={inquiryData.message}
                  onChange={(e) => setInquiryData({ ...inquiryData, message: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Tell us about your customization preferences..."
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowInquiryModal(false);
                    setInquiryMessage({ type: '', text: '' });
                  }}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingInquiry}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmittingInquiry ? 'Sending...' : 'Send Inquiry'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

    </div>
  );
};

export default ModelCustomizer;

