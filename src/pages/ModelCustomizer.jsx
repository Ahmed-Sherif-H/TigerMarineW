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
  
  // Find the model and its category - try API first, then fallback to static data
  const { model, category } = useMemo(() => {
    // First try to find in static data
    for (const cat of allCategories) {
      const found = cat.models.find(m => m.id === parseInt(id));
      if (found) return { model: found, category: cat };
    }
    return { model: null, category: null };
  }, [id]);
  
  // Also try to load from API if static data doesn't have it
  const [apiModel, setApiModel] = useState(null);
  useEffect(() => {
    if (!model && id) {
      api.getModelById(id).then(modelData => {
        setApiModel(modelData);
      }).catch(() => {
        // API failed, that's okay - we'll use static data
      });
    }
  }, [id, model]);
  
  // Use API model if available, otherwise use static model
  const finalModel = apiModel || model;

  // Get full model name (e.g., "TopLine 850" instead of "TL850")
  // Use finalModel which could be from API or static data
  // IMPORTANT: For models with swapped graphics, determine title from graphics folder, not model name
  const fullModelName = useMemo(() => {
    if (!finalModel) return '';
    
    // Get the graphics folder being used
    const graphicsFolder = getCustomizerFolder(finalModel.name);
    
    // For ProLine models with swapped graphics, determine title from folder
    if (graphicsFolder) {
      // PL620 uses ProLine550 graphics, so if folder contains ProLine550, show "ProLine 620"
      if (graphicsFolder.includes('ProLine550')) {
        return 'ProLine 620';
      }
      // PL550 uses ProLine620 graphics, so if folder contains ProLine620, show "ProLine 550"
      if (graphicsFolder.includes('ProLine620')) {
        return 'ProLine 550';
      }
      // OP850 uses Open650 graphics, so if folder contains Open650, show "Open 850"
      if (graphicsFolder.includes('Open650')) {
        return 'Open 850';
      }
      // OP650 uses Open850 graphics, so if folder contains Open850, show "Open 650"
      if (graphicsFolder.includes('Open850')) {
        return 'Open 650';
      }
    }
    
    // For all other models, use the standard display name function
    return getModelDisplayName(finalModel, category);
  }, [finalModel, category]);

  const [selectedColors, setSelectedColors] = useState({});
  const [availableColors, setAvailableColors] = useState({});
  const [baseImage, setBaseImage] = useState(null);
  const [partImages, setPartImages] = useState({});
  const [loading, setLoading] = useState(true);
  
  // Collapsible sections state - all open by default
  const [openSections, setOpenSections] = useState(new Set());

  // Initialize customizer
  useEffect(() => {
    const currentModel = finalModel;
    if (!currentModel) {
      navigate('/models');
      return;
    }

    const folder = getCustomizerFolder(currentModel.name);
    if (!folder) {
      // Redirect to model detail page if customizer is not available
      navigate(`/models/${currentModel.id}`);
      return;
    }

    // Load base image
    const base = getBaseImage(currentModel.name);
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
  }, [finalModel, navigate]);

  // Update part images when colors change
  useEffect(() => {
    if (!finalModel || !baseImage) return;

    const images = {};
    customizerParts.forEach(part => {
      if (part.key === 'base') return;
      
      const color = selectedColors[part.key];
      if (color) {
        const imagePath = getPartImage(finalModel.name, part.key, color);
        if (imagePath) {
          images[part.key] = imagePath;
        }
      }
    });

    setPartImages(images);
  }, [finalModel, selectedColors, baseImage]);

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

  if (!finalModel) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-4xl font-light text-midnight-slate mb-4">Model Not Found</h1>
          <Link to="/models" className="btn-primary">Back to Models</Link>
        </div>
      </div>
    );
  }

  const customizerFolder = getCustomizerFolder(finalModel.name);
  if (!customizerFolder) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-4xl font-light text-midnight-slate mb-4">Customizer Not Available</h1>
          <p className="text-gray-600 mb-8">Customizer images are not available for this model.</p>
          <Link to={`/models/${finalModel.id}`} className="btn-primary">Back to Model</Link>
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
                        
                        const folder = getCustomizerFolder(finalModel.name);
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

            {/* BOTTOM: Summary Display */}
            <div className="bg-gradient-to-br from-white via-gray-50/30 to-white backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-4">
              {/* Your Selections Header */}
              <div className="mb-3">
                <h3 className="text-sm font-medium text-midnight-slate mb-1">Your selections</h3>
                <div className="w-12 h-0.5 bg-smoked-saffron"></div>
              </div>
              
              {/* Selections Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {Object.entries(selectedColors).map(([partKey, color]) => {
                  const part = customizerParts.find(p => p.key === partKey);
                  if (!part) return null;
                  const colorHex = getColorHex(color);
                  const label = partLabels[partKey] || part.label;
                  
                  return (
                    <div
                      key={partKey}
                      className="group relative p-2 bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200/50 hover:border-smoked-saffron/30 hover:shadow-sm transition-all duration-300"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded-full border border-gray-300 shadow-sm group-hover:shadow transition-shadow flex-shrink-0"
                          style={{ backgroundColor: colorHex }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-[10px] text-gray-500 uppercase tracking-wide">{label}</div>
                          <div className="text-xs font-semibold text-midnight-slate truncate">{color}</div>
                        </div>
                        <button
                          onClick={() => scrollToSection(partKey)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-gray-400 hover:text-smoked-saffron rounded hover:bg-gray-50"
                          aria-label={`Edit ${label}`}
                        >
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </main>
        </div>
      </div>

    </div>
  );
};

export default ModelCustomizer;
