import { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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

  const [selectedColors, setSelectedColors] = useState({});
  const [availableColors, setAvailableColors] = useState({});
  const [baseImage, setBaseImage] = useState(null);
  const [partImages, setPartImages] = useState({});
  const [loading, setLoading] = useState(true);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [inquiryData, setInquiryData] = useState({ name: '', email: '', phone: '', message: '' });
  const [isSubmittingInquiry, setIsSubmittingInquiry] = useState(false);
  const [inquiryMessage, setInquiryMessage] = useState({ type: '', text: '' });
  
  // Collapsible sections state - all open by default
  const [openSections, setOpenSections] = useState(new Set());

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
    
    // Open all sections by default
    const allPartKeys = customizerParts
      .filter(p => p.key !== 'base')
      .map(p => p.key);
    setOpenSections(new Set(allPartKeys));
    
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

  const toggleSection = (partKey) => {
    setOpenSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(partKey)) {
        newSet.delete(partKey);
      } else {
        newSet.add(partKey);
      }
      return newSet;
    });
  };

  const scrollToSection = (partKey) => {
    const element = document.getElementById(`section-${partKey}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Ensure section is open when scrolling to it
      setOpenSections(prev => new Set([...prev, partKey]));
    }
  };

  const handleReset = () => {
    const initialSelections = {};
    customizerParts.forEach(part => {
      if (part.key === 'base') return;
      const partColors = availableColors[part.key] || [];
      if (partColors.length > 0) {
        initialSelections[part.key] = partColors[0];
      }
    });
    setSelectedColors(initialSelections);
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
      if (import.meta.env.DEV) {
        console.error('Inquiry error:', error);
      }
      const errorMessage = error.message || 'Failed to send inquiry. Please try again.';
      setInquiryMessage({ type: 'error', text: errorMessage });
    } finally {
      setIsSubmittingInquiry(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-smoked-saffron mx-auto mb-4"></div>
          <p className="text-gray-600">Loading customizer...</p>
        </div>
      </div>
    );
  }

  if (!model) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center bg-gray-50">
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
      <div className="pt-20 min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-4xl font-light text-midnight-slate mb-4">Customizer Not Available</h1>
          <p className="text-gray-600 mb-8">Customizer images are not available for this model.</p>
          <Link to={`/models/${model.id}`} className="btn-primary">Back to Model</Link>
        </div>
      </div>
    );
  }

  // Map part keys to display labels (matching user requirements)
  const partLabels = {
    deckFloor: 'Deck Floor',
    fiberglass: 'fiberGlass',
    sideFender: 'side fender',
    tube: 'tube',
    tubeDecoration: 'tube decoration',
    upholestry: 'upholestry'
  };

  return (
    <div className="pt-20 bg-gradient-to-b from-gray-50 to-white min-h-screen">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-sm sticky top-20 z-30">
        <div className="max-w-[1800px] mx-auto px-4 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            {/* Left: Hamburger (for mobile) */}
            <button className="lg:hidden p-2 text-gray-600 hover:text-midnight-slate">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            {/* Right: Reset Link */}
            <div className="flex-1 flex justify-end">
              <button
                onClick={handleReset}
                className="text-sm text-gray-600 hover:text-midnight-slate transition-colors font-medium"
              >
                Reset to default
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - 2 Column Layout */}
      <div className="py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-6 lg:gap-8 max-w-[1800px] mx-auto px-4 lg:px-8">
          
          {/* LEFT COLUMN - Configurator Panel */}
          <aside className="lg:sticky lg:top-32 lg:h-[calc(100vh-140px)]">
            <div className="bg-gradient-to-br from-white via-gray-50/50 to-white backdrop-blur-sm rounded-2xl shadow-xl border-2 border-gray-200/50 p-6 h-full flex flex-col">
              <div className="mb-6 pb-4 border-b-2 border-gray-200">
                <h2 className="text-2xl font-light text-midnight-slate mb-1">
                  Customize your Boat
                </h2>
                <p className="text-xs text-gray-500">Select colors for each component</p>
              </div>
              
              {/* Collapsible Sections */}
              <div className="flex-1 overflow-y-auto pr-2 space-y-3">
                {customizerParts.map((part) => {
                  if (part.key === 'base') return null;
                  
                  const colors = availableColors[part.key] || [];
                  const selectedColor = selectedColors[part.key];
                  const isOpen = openSections.has(part.key);
                  const label = partLabels[part.key] || part.label;

                  return (
                    <div
                      key={part.key}
                      id={`section-${part.key}`}
                      className="border-2 border-gray-200/60 rounded-xl overflow-hidden bg-white/70 backdrop-blur-sm shadow-md hover:shadow-lg transition-shadow"
                    >
                      {/* Section Header - Clickable */}
                      <button
                        onClick={() => toggleSection(part.key)}
                        className="w-full px-5 py-4 flex items-center justify-between bg-gradient-to-r from-gray-50/50 to-white hover:from-gray-100/50 hover:to-gray-50/50 transition-all"
                      >
                        <span className="text-base font-semibold text-midnight-slate">{label}</span>
                        <svg
                          className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {/* Section Content - Collapsible */}
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2, ease: 'easeOut' }}
                            className="overflow-hidden"
                          >
                            <div className="px-5 pb-5 pt-3 bg-white/40">
                              <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                                {colors.map((color) => {
                                  const isSelected = selectedColor === color;
                                  const colorHex = getColorHex(color);
                                  
                                  return (
                                    <button
                                      key={color}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleColorChange(part.key, color);
                                      }}
                                      className="flex flex-col items-center gap-2 group"
                                    >
                                      <div
                                        className={`w-12 h-12 rounded-full border-2 transition-all duration-200 ease-out shadow-lg relative ${
                                          isSelected
                                            ? 'border-smoked-saffron ring-2 ring-smoked-saffron ring-offset-2 scale-110'
                                            : 'border-gray-300 group-hover:border-smoked-saffron/50 group-hover:scale-105'
                                        }`}
                                        style={{ backgroundColor: colorHex }}
                                      >
                                        {isSelected && (
                                          <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="absolute inset-0 flex items-center justify-center"
                                          >
                                            <svg
                                              className="w-6 h-6 text-white"
                                              fill="none"
                                              stroke="currentColor"
                                              viewBox="0 0 24 24"
                                              style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}
                                            >
                                              <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={3}
                                                d="M5 13l4 4L19 7"
                                              />
                                            </svg>
                                          </motion.div>
                                        )}
                                      </div>
                                      <span
                                        className={`text-xs text-center leading-tight transition-colors duration-200 ${
                                          isSelected
                                            ? 'font-semibold text-smoked-saffron'
                                            : 'text-gray-600 group-hover:text-midnight-slate'
                                        }`}
                                      >
                                        {color}
                                      </span>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* RIGHT COLUMN - Preview & Summary */}
          <main className="flex flex-col gap-6">
            
            {/* TOP: Live Preview */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              {/* Preview Container */}
              <div className="relative bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100 overflow-hidden shadow-inner" style={{ height: '480px' }}>
                {/* Enhanced Background Effects */}
                <div 
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: `
                      radial-gradient(ellipse at 30% 40%, rgba(168, 121, 50, 0.08) 0%, transparent 50%),
                      radial-gradient(ellipse at 70% 60%, rgba(0, 0, 0, 0.03) 0%, transparent 50%),
                      radial-gradient(ellipse at center, transparent 0%, transparent 50%, rgba(0,0,0,0.06) 100%)
                    `
                  }}
                />
                
                {/* Title Overlay - Inside Preview */}
                <div className="absolute top-6 left-6 z-20">
                  <h1 className="text-3xl font-light text-gray-700 mb-1 drop-shadow-lg">
                    {fullModelName}
                  </h1>
                  <p className="text-sm text-gray-600 drop-shadow-md">Live Preview</p>
                </div>
                
                {/* Boat Preview */}
                <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: 1 }}>
                  <div
                    className="relative"
                    style={{
                      filter: `
                        drop-shadow(0 20px 40px rgba(0, 0, 0, 0.25)) 
                        drop-shadow(0 10px 20px rgba(0, 0, 0, 0.2))
                      `,
                      transform: 'perspective(1200px) rotateX(5deg) rotateY(-3deg)',
                      width: '85%',
                      height: '85%',
                      transformStyle: 'preserve-3d',
                    }}
                  >
                    {/* Floating Glow Effect */}
                    <div 
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background: 'radial-gradient(ellipse at center, rgba(168, 121, 50, 0.15) 0%, transparent 60%)',
                        filter: 'blur(30px)',
                        zIndex: -1,
                        transform: 'translateY(10%)'
                      }}
                    />
                    {baseImage && (
                      <img
                        src={baseImage}
                        alt="Boat Base"
                        className="absolute inset-0 w-full h-full object-contain"
                        style={{
                          filter: 'brightness(1.08) contrast(1.15) saturate(1.12)',
                          transform: 'translateZ(20px)',
                        }}
                      />
                    )}
                    
                    {/* Overlay parts */}
                    {customizerParts.map((part) => {
                      if (part.key === 'base') return null;
                      const imagePath = partImages[part.key];
                      if (!imagePath) return null;
                      
                      const handleImageError = (e) => {
                        const selectedColor = selectedColors[part.key];
                        if (!selectedColor) return;
                        
                        const folder = getCustomizerFolder(model.name);
                        if (!folder) return;
                        
                        let altPath = null;
                        if (part.key === 'upholestry') {
                          if (selectedColor === 'Baige') {
                            altPath = `${folder}/Upholestry/Upholestry - Beige.webp`;
                          } else if (selectedColor === 'Beige') {
                            altPath = `${folder}/Upholestry/Upholestry - Baige.webp`;
                          }
                        } else if (part.key === 'fiberglass') {
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
                            transform: `translateZ(${customizerParts.indexOf(part) * 5 + 25}px)`,
                          }}
                          onError={handleImageError}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* BOTTOM: Summary & Actions */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-6">
              {/* Your Selections */}
              <h3 className="text-lg font-medium text-midnight-slate mb-4">Your selections</h3>
              <div className="space-y-2 mb-6">
                {Object.entries(selectedColors).map(([partKey, color]) => {
                  const part = customizerParts.find(p => p.key === partKey);
                  if (!part) return null;
                  const colorHex = getColorHex(color);
                  const label = partLabels[partKey] || part.label;
                  
                  return (
                    <button
                      key={partKey}
                      onClick={() => scrollToSection(partKey)}
                      className="w-full flex items-center justify-between p-3 bg-gray-50/50 hover:bg-gray-100/50 rounded-lg border border-gray-200 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-5 h-5 rounded-full border border-gray-300 shadow-sm"
                          style={{ backgroundColor: colorHex }}
                        />
                        <span className="text-sm text-gray-700 font-medium">{label}:</span>
                        <span className="text-sm text-midnight-slate font-semibold">{color}</span>
                      </div>
                      <svg
                        className="w-4 h-4 text-gray-400 group-hover:text-smoked-saffron transition-colors"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                  );
                })}
              </div>

              {/* Call to Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                <button className="flex-1 px-6 py-3 bg-smoked-saffron text-white rounded-xl hover:bg-smoked-saffron/90 font-medium transition-all shadow-md hover:shadow-lg">
                  Request Quote
                </button>
                <button
                  onClick={() => setShowInquiryModal(true)}
                  className="flex-1 px-6 py-3 border-2 border-smoked-saffron text-smoked-saffron rounded-xl hover:bg-smoked-saffron/5 font-medium transition-all"
                >
                  Send Inquiry
                </button>
                <button className="flex-1 px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-xl font-medium transition-all">
                  Save Configuration
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Inquiry Modal */}
      {showInquiryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
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
                  className="flex-1 px-6 py-3 bg-smoked-saffron text-white rounded-lg hover:bg-smoked-saffron/90 disabled:opacity-50 disabled:cursor-not-allowed"
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
