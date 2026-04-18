import { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import { allCategories } from '../data/models';
import { getCustomizerFolder, getBaseImage, getPartImage, customizerParts } from '../data/customizerConfig';
import { getAvailableColors } from '../data/customizerColors';
import { getColorHex } from '../data/customizerColorMap';
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
  // Title should match the graphics folder being used, not the model name
  const fullModelName = useMemo(() => {
    if (!finalModel) return '';
    
    // Get the graphics folder being used
    const graphicsFolder = getCustomizerFolder(finalModel.name);
    
    if (graphicsFolder) {
      // Derive title from graphics folder for swapped models
      // PL620 uses ProLine550 graphics → show "ProLine 550"
      if (graphicsFolder.includes('ProLine550')) {
        return 'ProLine 550';
      }
      // PL550 uses ProLine620 graphics → show "ProLine 620"
      if (graphicsFolder.includes('ProLine620')) {
        return 'ProLine 620';
      }
      // For other models, check folder name and derive title
      if (graphicsFolder.includes('TopLine950')) return 'TopLine 950';
      if (graphicsFolder.includes('TopLine850')) return 'TopLine 850';
      if (graphicsFolder.includes('TopLine750')) return 'TopLine 750';
      if (graphicsFolder.includes('TopLine650')) return 'TopLine 650';
      if (graphicsFolder.includes('Open850')) return 'Open 850';
      if (graphicsFolder.includes('Open750')) return 'Open 750';
      if (graphicsFolder.includes('Open650')) return 'Open 650';
      if (graphicsFolder.includes('SportLine520')) return 'SportLine 520';
      if (graphicsFolder.includes('SportLine480')) return 'SportLine 480';
    }
    
    // Fallback to standard display name
    return getModelDisplayName(finalModel, category);
  }, [finalModel, category]);

  const [selectedColors, setSelectedColors] = useState({});
  const [availableColors, setAvailableColors] = useState({});
  const [baseImage, setBaseImage] = useState(null);
  const [partImages, setPartImages] = useState({});
  const [loading, setLoading] = useState(true);
  
  // 3D-ish interaction state
  const previewRef = useRef(null);
  const rafRef = useRef(null);
  const [tilt, setTilt] = useState({ x: -0.15, y: -0.25 }); // initial gentle angle
  const targetTiltRef = useRef({ x: -0.15, y: -0.25 });
  const [poppedPart, setPoppedPart] = useState(null);
  const scrollParallaxRef = useRef(0);

  // 2.5D depth map per layer (higher means closer to viewer)
  // Base ~ 1, parts increase by their index with some custom weight
  const depthWeights = useMemo(() => {
    const weights = { base: 1 };
    customizerParts.forEach((p, idx) => {
      if (p.key !== 'base') {
        // near-to-far order based on array order; tweakable
        weights[p.key] = 2 + idx * 0.45;
      }
    });
    return weights;
  }, []);
  
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

    // Default colors for each part
    const defaultColors = {
      deckFloor: 'Beige',
      sideFender: 'Gray',
      tubeDecoration: 'Black',
      fiberglass: 'White',
      tube: 'White',
      upholestry: 'Beige'
    };

    customizerParts.forEach(part => {
      if (part.key === 'base') {
        return;
      }

      // Get available colors for this part type
      const partColors = getAvailableColors(part.key);
      colors[part.key] = partColors;
      
      // Set default selection - use specified default or fallback to first color
      const defaultColor = defaultColors[part.key];
      if (defaultColor && partColors.includes(defaultColor)) {
        initialSelections[part.key] = defaultColor;
      } else if (partColors.length > 0) {
        // Fallback to first color if default not available
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

  // Scroll parallax effect (2.5D)
  useEffect(() => {
    const onScroll = () => {
      // normalize scroll within a small range
      const y = window.scrollY || 0;
      scrollParallaxRef.current = Math.max(-200, Math.min(200, y));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleColorChange = (partKey, color) => {
    setSelectedColors(prev => ({
      ...prev,
      [partKey]: color
    }));
    // Micro pop effect on changed part
    setPoppedPart(partKey);
    setTimeout(() => setPoppedPart(null), 220);
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
    // Default colors for each part
    const defaultColors = {
      deckFloor: 'Beige',
      sideFender: 'Gray',
      tubeDecoration: 'Black',
      fiberglass: 'White',
      tube: 'White',
      upholestry: 'Beige'
    };

    const initialSelections = {};
    customizerParts.forEach(part => {
      if (part.key === 'base') return;
      const partColors = availableColors[part.key] || [];
      
      // Use specified default or fallback to first color
      const defaultColor = defaultColors[part.key];
      if (defaultColor && partColors.includes(defaultColor)) {
        initialSelections[part.key] = defaultColor;
      } else if (partColors.length > 0) {
        initialSelections[part.key] = partColors[0];
      }
    });
    setSelectedColors(initialSelections);
  };


  if (loading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center bg-[#0f1419]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-smoked-saffron/30 border-t-smoked-saffron mx-auto mb-4" />
          <p className="text-aged-bone/80 text-sm tracking-wide">Loading configurator…</p>
        </div>
      </div>
    );
  }

  if (!finalModel) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center bg-[#0f1419]">
        <div className="text-center px-6">
          <h1 className="text-3xl font-light text-aged-bone mb-4">Model not found</h1>
          <Link to="/models" className="inline-flex text-smoked-saffron text-sm font-medium hover:underline">Back to models</Link>
        </div>
      </div>
    );
  }

  const customizerFolder = getCustomizerFolder(finalModel.name);
  if (!customizerFolder) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center bg-[#0f1419]">
        <div className="text-center px-6">
          <h1 className="text-3xl font-light text-aged-bone mb-4">Customizer not available</h1>
          <p className="text-aged-bone/70 mb-8 max-w-md mx-auto text-sm">Layer assets are not set up for this model yet.</p>
          <Link to={`/models/${finalModel.id}`} className="inline-flex text-smoked-saffron text-sm font-medium hover:underline">Back to model</Link>
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
    <div className="pt-20 min-h-screen bg-[#0f1419] text-aged-bone">
      {/* Top bar */}
      <header className="sticky top-20 z-30 border-b border-white/[0.08] bg-[#0f1419]/90 backdrop-blur-md">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-10 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              to={`/models/${finalModel.id}`}
              className="shrink-0 flex items-center justify-center w-9 h-9 rounded-lg border border-white/10 text-aged-bone/80 hover:text-smoked-saffron hover:border-smoked-saffron/40 transition-colors"
              aria-label="Back to model"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-[0.2em] text-smoked-saffron/90 font-medium">Studio configurator</p>
              <h1 className="text-base sm:text-lg font-light text-aged-bone truncate">{fullModelName}</h1>
            </div>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="shrink-0 text-xs sm:text-sm font-medium text-aged-bone/70 hover:text-smoked-saffron border border-white/10 hover:border-smoked-saffron/35 rounded-lg px-3 py-2 transition-colors"
          >
            Reset build
          </button>
        </div>
      </header>

      <div className="py-6 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(300px,400px)] gap-6 lg:gap-8 xl:gap-10 lg:items-start max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-10">
          {/* Hero: preview + build strip (wide column on desktop, first on mobile) */}
          <main className="flex flex-col gap-0 min-w-0">
            <div className="rounded-2xl overflow-hidden border border-white/[0.07] shadow-2xl shadow-black/40 bg-gradient-to-b from-[#1a222c] to-[#12181f] flex flex-col">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-4 sm:px-5 py-3 border-b border-white/[0.06]">
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-widest text-aged-bone/45">Live composite</p>
                  <p className="text-sm text-aged-bone/90">Move the pointer over the hull for parallax</p>
                </div>
                <span className="shrink-0 self-start sm:self-auto text-[10px] uppercase tracking-wider text-smoked-saffron/80 border border-smoked-saffron/25 rounded-full px-2.5 py-1">
                  2.5D layers
                </span>
              </div>
              <div
                ref={previewRef}
                className="relative overflow-hidden"
                style={{
                  height: 'min(58vh, 720px)',
                  minHeight: '420px',
                  perspective: '1200px',
                  background: 'radial-gradient(ellipse 85% 65% at 50% 55%, #2a3544 0%, #151b24 45%, #0e1218 100%)',
                }}
                onMouseMove={(e) => {
                  const rect = previewRef.current?.getBoundingClientRect();
                  if (!rect) return;
                  const nx = (e.clientX - rect.left) / rect.width;   // 0..1
                  const ny = (e.clientY - rect.top) / rect.height;   // 0..1
                  // Map to small angles
                  const targetY = (nx - 0.5) * 0.5;   // yaw
                  const targetX = -(ny - 0.5) * 0.35; // pitch
                  targetTiltRef.current = { x: targetX, y: targetY };
                  if (!rafRef.current) {
                    const step = () => {
                      rafRef.current = null;
                      setTilt(prev => {
                        const nx = prev.x + (targetTiltRef.current.x - prev.x) * 0.12;
                        const ny = prev.y + (targetTiltRef.current.y - prev.y) * 0.12;
                        return { x: nx, y: ny };
                      });
                    };
                    rafRef.current = requestAnimationFrame(step);
                  }
                }}
                onMouseLeave={() => {
                  targetTiltRef.current = { x: -0.12, y: -0.18 };
                }}
              >
                {/* Background parallax — subtle depth on dark stage */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: `
                      linear-gradient(180deg, rgba(90,110,130,0.12) 0%, rgba(40,50,62,0.06) 42%, rgba(20,26,34,0.2) 58%, rgba(10,14,18,0.35) 100%)
                    `,
                    transform: `translate(${-(tilt.y * 12)}px, ${(tilt.x * 8) + scrollParallaxRef.current * 0.06}px)`,
                    transition: 'transform 80ms linear'
                  }}
                />
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: `
                      radial-gradient(ellipse at 30% 38%, rgba(168, 121, 50, 0.12) 0%, transparent 52%),
                      radial-gradient(ellipse at 72% 62%, rgba(255, 255, 255, 0.04) 0%, transparent 45%),
                      radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.25) 100%)
                    `
                  }}
                />
                
                {/* Floor shadow (moves slightly with tilt) */}
                <div
                  className="absolute left-1/2 -translate-x-1/2"
                  style={{
                    bottom: '28px',
                    width: '75%',
                    height: '18%',
                    background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.08) 45%, rgba(0,0,0,0) 70%)',
                    filter: 'blur(6px)',
                    transform: `translate(${tilt.y * 18}px, ${-tilt.x * 12}px)`,
                    opacity: 0.6
                  }}
                />
                {/* Boat composite */}
                <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: 1 }}>
                  <div
                    className="relative"
                    style={{
                      filter: `
                        drop-shadow(0 22px 42px rgba(0, 0, 0, 0.28)) 
                        drop-shadow(0 12px 22px rgba(0, 0, 0, 0.22))
                      `,
                      transform: `rotateX(${tilt.x * 57.3 + 5}deg) rotateY(${tilt.y * 57.3 - 3}deg) translateY(${scrollParallaxRef.current * -0.04}px)`,
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
                          transform: `translateZ(${(depthWeights.base || 1) * 12}px) translate(${tilt.y * 6}px, ${-tilt.x * 6}px)`,
                          // small depth-of-field cue
                          willChange: 'transform, filter'
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
                            transform: `translateZ(${(depthWeights[part.key] || 2) * 12}px) translate(${tilt.y * (3 + (depthWeights[part.key] || 2))}px, ${-tilt.x * (3 + (depthWeights[part.key] || 2))}px) scale(${poppedPart === part.key ? 1.02 : 1})`,
                            // keep crisp edges; remove depth blur for clarity
                            transition: poppedPart === part.key ? 'transform 220ms ease-out' : 'transform 120ms ease-out',
                            willChange: 'transform'
                          }}
                          onError={handleImageError}
                        />
                      );
                    })}
                    
                    {/* Specular sheen overlay */}
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background: 'radial-gradient(ellipse at 30% 25%, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 18%, rgba(255,255,255,0) 55%)',
                        mixBlendMode: 'screen',
                        transform: `translate(${-(tilt.y * 10)}px, ${(tilt.x * 10)}px)`,
                        willChange: 'transform'
                      }}
                    />
                    
                    {/* AO seam vignette */}
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.04) 35%, rgba(0,0,0,0) 60%)',
                        filter: 'blur(1px)',
                        opacity: 0.35
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Build summary — part of the preview card so the hero reads as one unit */}
              <div className="border-t border-white/[0.08] bg-[#0c1016]/85 px-3 sm:px-4 py-3">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h3 className="text-[9px] uppercase tracking-[0.14em] text-aged-bone/45 font-medium">Current build</h3>
                  <p className="text-[9px] text-aged-bone/35 hidden sm:block">Tap a layer to edit</p>
                </div>
                <div className="flex gap-2 overflow-x-auto pb-0.5 -mx-1 px-1 [scrollbar-width:thin] snap-x snap-mandatory">
                  {Object.entries(selectedColors).map(([partKey, color]) => {
                    const part = customizerParts.find(p => p.key === partKey);
                    if (!part) return null;
                    const colorHex = getColorHex(color);
                    const label = partLabels[partKey] || part.label;
                    return (
                      <button
                        key={partKey}
                        type="button"
                        onClick={() => scrollToSection(partKey)}
                        className="group snap-start shrink-0 flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] hover:border-smoked-saffron/35 hover:bg-white/[0.06] pl-2 pr-2.5 py-2 text-left transition-colors max-w-[200px]"
                      >
                        <span
                          className="w-4 h-4 rounded-full border border-white/20 shrink-0 shadow-inner"
                          style={{ backgroundColor: colorHex }}
                        />
                        <span className="min-w-0">
                          <span className="block text-[9px] text-aged-bone/40 uppercase tracking-wider truncate">{label}</span>
                          <span className="block text-xs font-medium text-aged-bone truncate">{color}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </main>

          {/* Materials rail (second column desktop, below hero on mobile) */}
          <aside className="lg:sticky lg:top-[7.25rem] lg:self-start lg:max-h-[calc(100vh-7.25rem)] w-full min-w-0">
            <div className="rounded-2xl border border-white/[0.08] bg-[#151b24]/95 backdrop-blur-sm shadow-xl shadow-black/30 p-5 sm:p-6 h-full flex flex-col min-h-0">
              <div className="mb-5 pb-4 border-b border-white/[0.08]">
                <h2 className="text-lg font-light text-aged-bone tracking-tight">Materials &amp; finish</h2>
                <p className="text-xs text-aged-bone/50 mt-1">Open a section and tap a swatch to update the composite.</p>
              </div>
              <div className="flex-1 overflow-y-auto pr-1 space-y-2.5 min-h-0 [scrollbar-width:thin]">
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
                      className={`rounded-xl overflow-hidden border transition-colors ${
                        isOpen
                          ? 'border-smoked-saffron/35 bg-white/[0.04]'
                          : 'border-white/[0.06] bg-white/[0.02] hover:border-white/10'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => toggleSection(part.key)}
                        className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-white/[0.03] transition-colors"
                      >
                        <span className="text-sm font-medium text-aged-bone/95">{label}</span>
                        <svg
                          className={`w-4 h-4 text-aged-bone/40 shrink-0 transition-transform duration-200 ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2, ease: 'easeOut' }}
                            className="overflow-hidden"
                          >
                            <div className="px-4 pb-4 pt-0 border-t border-white/[0.05]">
                              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 pt-3">
                                {colors.map((color) => {
                                  const isSelected = selectedColor === color;
                                  const colorHex = getColorHex(color);
                                  return (
                                    <button
                                      key={color}
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleColorChange(part.key, color);
                                      }}
                                      className="flex flex-col items-center gap-1.5 group"
                                    >
                                      <div
                                        className={`w-11 h-11 rounded-full border-2 transition-all duration-200 ease-out shadow-lg relative ring-offset-2 ring-offset-[#151b24] ${
                                          isSelected
                                            ? 'border-smoked-saffron ring-2 ring-smoked-saffron scale-110'
                                            : 'border-white/20 group-hover:border-smoked-saffron/50 group-hover:scale-105'
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
                                              className="w-5 h-5 text-white"
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
                                        className={`text-[10px] text-center leading-tight transition-colors duration-200 ${
                                          isSelected
                                            ? 'font-semibold text-smoked-saffron'
                                            : 'text-aged-bone/55 group-hover:text-aged-bone'
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
        </div>
      </div>

    </div>
  );
};

export default ModelCustomizer;
