/**
 * Models Data - MAIN DATA FILE
 * 
 * This is THE file where you add/edit ALL boat data (categories and models)
 * Everything is here - inflatable boats, rigid boats, and all related data
 * 
 * To add a new boat:
 * 1. Find the appropriate category below
 * 2. Add a new model object to the models array
 * 3. Use imageFile and heroImageFile (paths auto-generated)
 * 4. Add specs, standardFeatures, and optionalFeatures
 */

import { getCategoryImage, getCategoryHeroImage, getModelImageFolder, getSideMenuImage } from './imageHelpers';

// ============================================================================
// HELPER FUNCTIONS - Auto-generate image paths
// ============================================================================

// Helper to create a model with auto-generated image paths
const createModel = (modelName, modelConfig) => {
  // Extract image files (helper properties, not part of final object)
  const { 
    imageFile,              // Main thumbnail image (for model cards)
    heroImageFile,          // Hero image (for model detail page hero section)
    contentImageFile,       // Content image (for images next to text)
    galleryFiles,           // Array of gallery image filenames
    videoFiles,             // Array of video filenames
    fabricLeftImageFile,    // Left image in High Quality Fabrics section
    fabricRightImageFile,   // Right image in High Quality Fabrics section (carousel)
    ...restConfig 
  } = modelConfig;
  
  // Build image paths properly
  const imageFolder = getModelImageFolder(modelName);
  // Encode filename if it contains spaces or special characters
  const encodeFilename = (filename) => {
    if (!filename) return '';
    if (/[\s()&]/.test(filename)) {
      return encodeURIComponent(filename);
    }
    return filename;
  };
  
  // Build all image paths
  const imagePath = imageFile ? imageFolder + encodeFilename(imageFile) : '';
  const heroImagePath = heroImageFile 
    ? imageFolder + encodeFilename(heroImageFile) 
    : (imageFile ? imageFolder + encodeFilename(imageFile) : '');
  const contentImagePath = contentImageFile 
    ? imageFolder + encodeFilename(contentImageFile) 
    : (imageFile ? imageFolder + encodeFilename(imageFile) : '');
  
  // Build gallery images array
  const galleryImagePaths = Array.isArray(galleryFiles) && galleryFiles.length > 0
    ? galleryFiles.map(file => imageFolder + encodeFilename(file))
    : [];
  
  // Build video paths
  const videoPaths = Array.isArray(videoFiles) && videoFiles.length > 0
    ? videoFiles.map(file => imageFolder + encodeFilename(file))
    : [];
  
  // Build fabric images
  const fabricLeftImagePath = fabricLeftImageFile
    ? imageFolder + encodeFilename(fabricLeftImageFile)
    : heroImagePath;
  const fabricRightImagePath = fabricRightImageFile
    ? imageFolder + encodeFilename(fabricRightImageFile)
    : contentImagePath;
  
  return {
    name: modelName,
    // Main images
    image: imagePath,                    // Thumbnail for model cards
    heroImage: heroImagePath,             // Hero section image
    contentImage: contentImagePath,       // Image next to text content
    sideMenuImage: getSideMenuImage(modelName), // Side menu preview
    // Gallery images
    galleryFiles: galleryImagePaths.length > 0 ? galleryFiles : undefined, // Keep filenames for reference
    // Video files
    videoFiles: videoPaths.length > 0 ? videoFiles : undefined, // Keep filenames for reference
    // Fabric section images
    fabricLeftImage: fabricLeftImagePath,
    fabricRightImage: fabricRightImagePath,
    // Section 2 text (Model Name & Description section)
    section2Title: restConfig.section2Title,        // Custom title for section 2 (optional)
    section2Description: restConfig.section2Description, // Custom description for section 2 (optional)
    // Support both old 'features' and new 'standardFeatures' for backward compatibility
    standardFeatures: restConfig.standardFeatures || restConfig.features || [],
    // Support both string arrays and object arrays for optionalFeatures
    optionalFeatures: restConfig.optionalFeatures || [],
    // Auto-group optional features by category if they're objects
    optionalFeaturesByCategory: restConfig.optionalFeaturesByCategory || 
      (Array.isArray(restConfig.optionalFeatures) && restConfig.optionalFeatures.length > 0 && 
       typeof restConfig.optionalFeatures[0] === 'object' && restConfig.optionalFeatures[0].category
        ? restConfig.optionalFeatures.reduce((acc, feature) => {
            const category = feature.category || 'General';
            if (!acc[category]) acc[category] = [];
            acc[category].push(feature);
            return acc;
          }, {})
        : {}),
    ...restConfig
  };
};

// Helper to create a category
const createCategory = (categoryConfig) => {
  // Extract image and heroImage if provided, otherwise use defaults
  const { image, heroImage, ...restConfig } = categoryConfig;
  
  // Create models first to potentially use their images
  const models = categoryConfig.models.map(model => 
    typeof model === 'string' 
      ? createModel(model, {}) // Just model name, will use defaults
      : createModel(model.name, model) // Full config
  );
  
  // Image priority:
  // 1. Explicit image in category config (allows override)
  // 2. Image from imageConfig.js (automatic sync - source of truth)
  // 3. Fallback to first model's image (only if not in config)
  const categoryImage = image || getCategoryImage(restConfig.name) || (models.length > 0 && models[0].image ? models[0].image : '/images/Max-line.jpg');
  const categoryHeroImage = heroImage || getCategoryHeroImage(restConfig.name) || (models.length > 0 && models[0].heroImage ? models[0].heroImage : '/images/Max-line2.jpg');
  
  return {
    ...restConfig,
    image: categoryImage,
    heroImage: categoryHeroImage,
    models: models
  };
};

// ============================================================================
// ALL BOAT CATEGORIES - Add/Edit boats here!
// ============================================================================

// All boat categories (inflatable and rigid)
export const allCategories = [
  // INFLATABLE BOATS
  createCategory({
    id: 1,
    name: "MaxLine",
    description: "Our signature series, crafted to embody the highest standards of luxury, performance, and refinement.",
    shortDescription: "Ultimate luxury and performance",
    color: "#1e3a8a",
    // Image automatically synced from imageConfig.js
    models: [
      {
        name: "ML38",
        description: "The ultimate expression of luxury and power in inflatable boating.",
        shortDescription: "Flagship inflatable with uncompromising luxury.",
        // ===== ALL IMAGES - Just specify filenames, paths auto-generated! =====
        imageFile: "IMG_3213.jpg",                    // Thumbnail for model cards
        heroImageFile: "IMG_3213.jpg",                // Hero section image
        contentImageFile: "IMG_3213.jpg",             // Image next to text (optional, falls back to imageFile)
        galleryFiles: ["IMG_3213.jpg"],               // Gallery carousel images (optional)
        videoFiles: ["video.mp4"],                    // Video files (optional)
        fabricLeftImageFile: "IMG_3213.jpg",          // Fabric section left image (optional)
        fabricRightImageFile: "IMG_3213.jpg",         // Fabric section right image (optional)
        // ===== SECTION 2 TEXT - Customize the centered title and description =====
        // section2Title: "MaxLine 38",              // Custom title (optional, auto-generated if not provided)
        section2Description: "The flagship of Tiger Marine — a true statement of luxury and performance. The ML38 combines spacious deck design, premium materials, and twin-engine power to deliver an unmatched cruising experience.",
        specs: {
          Length: "11.65 m" ,
          Beam : "3.70 m" ,
          TubeDiameter: "65 cm" ,
          TubeChambers: "8" ,
          NumberOfPersons: "20" ,
          NumberOfBedrooms: "16" ,
          SleepingCapacity: "2" ,
          MaxHP: "2X400 HP" ,
          RecommendedPower: "2X350 HP" ,
          MinPower: "2X300 HP" ,
          ShaftLength: "XL" ,
          FreshwaterTank: "130 Liter" ,
          FuelTank: "450 Liter"   ,
          BlackWaterTank: "2X330 Liter" ,
          DesignCategory: "C" ,
 
        },
        features: [
          "Premium inflatable construction",
          "Advanced hull design",
          "Luxury amenities",
          "Navigation electronics",
          "Safety equipment",
          "Storage compartments",
          "External and internal LED lighting",
          "1670 Dtex heavy hypalon tube",
          "Aft storage hatch with manual actuators",
          "Cabin portlight windows",
          "Manual aft table",
          "Toilet + 48 Liter Black water system",
          "White hull and deck",
          "Stern and bow cleats",
          "Main battery switch",
          "Complete cushions with bow and aft sundeck",
          "Stainless steel bow handrail",
          "12V Electrical System",
          "Navigation lights",
          "Pilot and Co-pilot molded seats",
          "Sliding cabin access door",
          "Wetbar / Driver seat / cabinet with sink",
          "Bilge pumps",
          "Swimming platforms", 
          "Gray water pump",
          "Swimming platform shower",
          "Telescopic ladder",    
          "2X330 Liters fuel tanks with select switch",
          "130 Liter water tank",
          "Cabin interior",
          "Wardrobe and cabinet",
          "Porthole - Manhole skylight",


        ],
        optionalFeatures: [ 
          "Air conditioning",
          "Bow thruster",
          "Windlass with anchor and chain",
          "Underwater lights",
          "Battery charger",
          "Hot water system",
          "Shore power with 220V system",
          "Fiberglass T-top with lights",
          "Fiberglass Rollbar + Sunshade Awnings",
          "Electric stove",
          "Electric grill",
          "Foam teak floors",
          "Flexi-teak floor", 
          "Real teak floor",
          "Diesel Generator 3.5 KW",
          "Electric Table Kit",
          "Music system with 4 speakers",
          "T-top extension",
          "Hull and Deck Gelcoat Coloring",
          "Tube carbon texture",
          "65 Liter electric fridge",
          "36 Liter - in cabin drawer fridge",
          "Silvertex cushions",
          "Ice-maker",
          "Microwave - in cabin",
          "Trim tabs",
          
        ],
      }
    ]
  }),
  
  createCategory({
    id: 2,
    name: "TopLine",
    description: "Premium inflatable boats combining exceptional comfort with advanced technology",
    shortDescription: "Premium comfort and technology",
    color: "#3b82f6",
    // Image automatically synced from imageConfig.js
    models: [
      {
        name: "TL950",
        description: "The ultimate expression of luxury and power in inflatable boating.",
        shortDescription: "Premium inflatable designed for the discerning mariner.",
        imageFile: "DJI_0150.jpg",
        heroImageFile: "DJI_0247.jpg",
        section2Description: "Designed for those who demand both comfort and capability. The TL950 offers exceptional offshore performance, generous seating, and refined detailing for family or sport adventures alike.",
        specs: {
      
          Length: "9.60 m" ,
          Beam : "3.20 m" ,
          TubeDiameter: "63 cm" ,
          TubeChambers: "6" ,
          NumberOfPersons: "20" ,
          NumberOfBedrooms: "N/A" ,
          SleepingCapacity: "N/A" ,
          MaxHP: "2X250 HP" ,
          RecommendedPower: "2X250 HP" ,
          MinPower: "2X200 HP" ,
          ShaftLength: "XL" ,
          FreshwaterTank: "60 Liter" ,
          FuelTank: "450 Liter"   ,
          BlackWaterTank: "45 Liter" ,
          DesignCategory: "C" ,


        },
        features: [
          "Hypalon tubes.",
          "Large center console with front door for optional toilet installation equipped with glass sink, tab and storage compartment.",
          "Large AFt seat with U shape seats , can accommodate ski equipment and fishing rods",
          "Fiberglass / Aluminum rollbar",
          "AFt table / Sundeck",
          "Large swimming platforms with ladders compartments and handrails ready for two ladders",
          "Hard fiberglass bow with electric anchor compartment.",
          "Sporty Driver seat with standup / seat system",
          "Kitchen unit with built-in sink with foldable tab and ready for electric fridge and stove.",
          "60 Liter water tank.",
          "Wide side steps .",
          "Heavy duty top quality valves",
          "450 Liter fuel tank",
          "Driver seat blue ambient light",
          "Freshwater shower system with 60 Liter water tank",
          "Stainless steel electric switches with led lights",
          "Automatic electric bilge pump",
          "Marine grade high quality upholstery with cushions",
          "Cup holders",
          "Swimming platforms with ladder compartment and hand rails",
          "Large bow storage compartment with gas spring hatch",
          "Gas spring hatches .",
          

        ],

        optionalFeatures: [
          "Stainless steel bimini top - one forward one backward",
          "Hinged aluminum rollbar",
          "Fiberglass T-top",
          "T-top extension shade",
          "Boat cover",
          "Electric toilet system",
          "Navigation lights",
          "Electric windlass with anchor and ropes",
          "S.S. ladder - up to two ladders",
          "Electric outlet socket",
          "Music system",
          "Foam teak parts",
          "Fishing rod holders",
          "Cup holders with lights",  
          "Battery switch",
          "Ski pole",
          "Texture hypalon tubes",
          "Hydraulic steering system",
          "Waste tank",
          "Fridge",
          "Gas cooker",
          "Electric table / Sundeck",
        ],
        
        // Optional Features - Add here! (Example for TL950)
        // optionalFeatures: [
        //   {
        //     name: "Premium Audio System",
        //     description: "High-end sound system with waterproof speakers",
        //     category: "Entertainment",
        //     price: "Contact for pricing"
        //   },
        //   {
        //     name: "Advanced Navigation Suite",
        //     description: "GPS, chartplotter, radar, and autopilot system",
        //     category: "Navigation",
        //     price: "Contact for pricing"
        //   }
        //   // Add more optional features from your Excel here
        // ]
      },
      {
        name: "TL850",
        description: "Premium inflatable with exceptional design and performance.",
        shortDescription: "Premium design and comfort.",
        imageFile: "TL850.jpg",
        heroImageFile: "850TL - 1.jpg",
        videoFiles: ["TopLine850-Opt.mp4"],
        section2Description: "A perfect balance between sporty handling and practical luxury. The TL850 features a sleek hull design and optimized deck layout, making it ideal for day trips or weekend escapes.",
        specs: {
          Length: " 8.60 m" ,
          Beam : "3.15 m" ,
          TubeDiameter: "65 cm" ,
          TubeChambers: "6" ,
          NumberOfPersons: "18" ,
          NumberOfBedrooms: "N/A" ,
          SleepingCapacity: "N/A" ,
          MaxHP: "1X350 HP" ,
          RecommendedPower: "1X300 HP" ,
          MinPower: "1X250 HP" ,
          ShaftLength: "XXL" ,
          FreshwaterTank: "60 Liter" ,
          FuelTank: "450 Liter"   ,
          BlackWaterTank: "45 Liter" ,
          DesignCategory: "C" ,
        
        },
        features: [
          "Hypalon tubes",
          "Large console with front door for optional toilet ( toilet is not included )",
          "Large rear seat with U shape seats",
          "Aft seat back with three different position",
          "Fiberglass / Aluminum rollbar",
          "AFt table / sundeck",
          "Standup driving seat equipped with kitchen station including sink and ready for electric fridge and stove",
          "60 liter water tank with shower and pump",
          "Hard fiberglass bow step with built-in windlass compartment (windlass is not included)",
          "Ambient blue lights in driver seat",
          "280 Liter fuel tank",
          "Full size bow sundeck with cushions",
          "Automatic electric bilge pump",
          "Deck self-drain system",
          "Cup holders",
          "Front Sundeck extension",
          "Swimming platforms with ladder compartment and hand rails",
          "Large bow storage compartment with hydraulic hatch",
          "Large rear seat with U shape seats",
          "Aft seat back with three different position",
          "Fiberglass / Aluminum rollbar",
          "AFt table / sundeck",
          "Standup driving seat equipped with kitchen station including sink and ready for electric fridge and stove",
          "60 liter water tank with shower and pump",
          "Hard fiberglass bow step with built-in windlass compartment (windlass is not included)",
          "Ambient blue lights in driver seat",
          "280 Liter fuel tank",
          "Full size bow sundeck with cushions",
          "Automatic electric bilge pump",
          "Deck self-drain system",
          "Cup holders",
          "Front Sundeck extension",
          "Swimming platforms with ladder compartment and hand rails",
          "Large bow storage compartment with hydraulic hatch",
          
        ],
        optionalFeatures: [
          "Stainless steel bimini top",
          "Hinged aluminum rollbar",
          "Fiberglass T-top",
          "T-top extension shade",
          "Boat cover",
          "Electric toilet system",
          "Navigation lights",
          "Electric windlass with anchor and ropes",
          "S.S. ladder", 
          "Electric outlet socket",
          "Music system",
          "Foam teak parts",
          "Fishing rod holders",
          "Cup holders with lights",
          "Battery switch",
          "Ski pole",
          "Texture hypalon tubes",
          "Hydraulic steering system",  
          "Waste tank",
          "Fridge",
          "Gas cooker",
          
        ]
      },
      {
        name: "TL750",
        description: "Exceptional comfort and performance in a compact package.",
        shortDescription: "Comfort and performance combined.",
        imageFile: "DJI_0007.jpg",
        heroImageFile: "DJI_0521.jpg",
        videoFiles: ["TopLine750.mp4"],
        section2Description: "Compact yet powerful, the TL750 offers exceptional versatility. Its advanced hull shape ensures smooth rides, while its layout provides comfort for both leisure and water sports.",
        specs: {
          Length: "7.50 m",
          Beam : "2.90 m" ,
          TubeDiameter: "59 cm" ,
          TubeChambers: "6" ,
          NumberOfPersons: "16" ,
          NumberOfBedrooms: "N/A" ,
          SleepingCapacity: "N/A" ,
          MaxHP: "1X250 HP" ,
          RecommendedPower: "1X250 HP" ,
          MinPower: "1X200 HP" ,
          ShaftLength: "XL" ,
          FreshwaterTank: "45 Liter" ,
          FuelTank: "210 Liter"   ,
          BlackWaterTank: "45 Liter" ,
          DesignCategory: "C" ,


        },
        features: [
          "Hypalon tubes",
          "Large console with front door for optional toilet ( toilet is not included )",
          "Large rear seat with U shape seats",
          "Rear seat back with three different position",
          "Fiberglass / Aluminum rollbar",
          "Aft table",
          "AFt sundeck",
          "Standup driving seat equipped with kitchen station including sink and ready for electric fridge",
          "60 liter water tank with shower and pump",
          "Hard fiberglass bow step with built-in windlass compartment (windlass is not included)",
          "Ambient blue lights in driver seat",
          "210 Liter fuel tank",
          "Full size bow sundeck with cushions",
          "Automatic electric bilge pump",
          "Deck self-drain system",
          "Cup holders",
          "Front Sundeck extension",  
          "Swimming platforms with ladder compartment and hand rails",
          "Large bow storage compartment with hydraulic hatch",
          
        ],
        optionalFeatures: [
          "Stainless steel bimini top", 
          "Hinged aluminum rollbar",
          "Fiberglass T-top",
          "T-top extension shade",
          "Boat cover",
          "Electric toilet system",
          "Navigation lights",
          "Electric windlass with anchor and ropes",
          "S.S. ladder",
          "Electric outlet socket",
          "Music system",
          "Foam teak parts",
          "Fishing rod holders",
          "Cup holders with lights",  
          "Battery switch",
          "Ski pole",
          "Texture hypalon tubes",
          "Hydraulic steering system",
          
        ]
      },
      {
        name: "TL650",
        description: "Premium inflatable for discerning owners.",
        shortDescription: "Discerning owner's choice.",
        imageFile: "650TL-2(1).jpg",
        heroImageFile: "DJI_0185.jpg",
        videoFiles: ["25 - 650 Topline- 2021.mov"],
        section2Description: "An agile and stylish RIB built for pure enjoyment on the water. The TL650 combines efficient performance with Tiger Marine's signature craftsmanship and attention to detail.",
        specs: {
            Length: "6.50 m",
            Beam: "2.80 m",
            TubeDiameter: "58 cm" ,
            TubeChambers: "6" ,
            NumberOfPersons: "15" ,
            NumberOfBedrooms: "N/A" ,
            SleepingCapacity: "N/A" ,
            MaxHP: "1X200 HP" ,
            RecommendedPower: "1X150 HP" ,
            MinPower: "1X115 HP" ,
            ShaftLength: "XL" ,
            FreshwaterTank: "45 Liter" ,
            FuelTank: "105 Liter"   ,
            BlackWaterTank: "N/A" ,
            DesignCategory: "C" ,
 
        },
        features: [
          "Hypalon tubes",
          "Center Console with front seat",
          "Built-in full width rear seat",
          "Normal / Standup driving seat with rear seat with new standup mechanism",
          "Fiberglass / Aluminum rollbar",
          "105 Liter Fuel tank",
          "Built-in large fiberglass bow step with roller",
          "Ambient blue led lights in seat and console",  
          "Swimming platforms",
          "Front removable sundeck",
          "Cup holders",
          "Electric bilge pump",
          
        ],
        optionalFeatures: [
          "Fresh water shower system",
          "Stainless steel bimini top",
          "Hinged aluminum rollbar",
          "Boat cover",
          "Removable table",
          "Navigation lights",
          "Aft removable sundeck",
          "S.S Ladder",
          "Electric outlet socket",
          "Music system", 
          "Foam teak parts",
          "Battery switch",
          "Fishing rod holders",
          "Cup holders with lights",
          "Retractable ski pole",
          "Hydraulic steering system",
          
        ]
      }
    ]
  }),
  
  createCategory({
    id: 3,
    name: "ProLine",
    description: "Professional-grade inflatable boats for commercial and charter operations",
    shortDescription: "Professional-grade performance",
    color: "#10b981",
    // Image automatically synced from imageConfig.js
    models: [
      {
        name: "PL620",
        description: "Professional inflatable designed for charter and commercial operations.",
        shortDescription: "Professional charter inflatable.",
        imageFile: "DJI_0339.jpg",
        heroImageFile: "DJI_0510.jpg",
        videoFiles: ["ProLine620.mp4"],
        section2Description: "Built for professionals and enthusiasts who value reliability and strength. The PL620 offers durable construction, excellent stability, and practical design for fishing, diving, or patrol use.",
        specs: {
          Length: "6.25 m",
          Beam: "2.65 m",
          TubeDiameter: "56 cm" ,
          TubeChambers: "6" ,
          NumberOfPersons: "12" ,
          NumberOfBedrooms: "N/A" ,
          SleepingCapacity: "N/A" ,
          MaxHP: "1X150 HP" ,
          RecommendedPower: "1X150 HP" ,
          MinPower: "1X115 HP" ,
          ShaftLength: "XL" ,
          FreshwaterTank: "45 Liter" ,
          FuelTank: "105 Liter"   ,
          BlackWaterTank: "N/A" ,
          DesignCategory: "C" ,
   
         


        },
        features: [
          "Built-in Center Console",
          "Two way double driving seat with back foldable table",
          "Built-in large aft seat with extension",
          "100 Liter below deck fuel tank",
          "Fiberglass bow step with cleat",
          "Sundeck",
          "Swimming platforms",
          "Electric bilge pump with electric panel",
          "Deck self drain system",
          "Ambient blue lights",

        ],
        optionalFeatures: [
          "Fresh water shower system",
          "Stainless steel bimini top",
          "Fiberglass T-top",
          "Boat Cover",
          "Navigation lights",
          "S.S. Ladder",
          "Electric outlet socket",
          "Music system",
          "Foam teak parts",
          "Fishing rod holders",
          "Cup holders",
          "Battery switch",
          "Hydraulic steering system",
        ]
      },
      {
        name: "PL550",
        description: "Professional inflatable for commercial use.",
        shortDescription: "Commercial-grade performance.",
        imageFile: "DJI_0529.jpg",
        heroImageFile: "DJI_0689.jpg",
        videoFiles: ["ProLine520.mp4"],
        section2Description: "Compact and efficient, the PL550 is designed for versatility and endurance. It's a trusted companion for both recreational users and professional operators.",
        specs: {
          Length: "5.65 m",
          Beam: "2.30 m",
          TubeDiameter: "52 cm" ,
          TubeChambers: "5" ,
          NumberOfPersons: "9" ,
          NumberOfBedrooms: "N/A" ,
          SleepingCapacity: "N/A" ,
          MaxHP: "1X115 HP" ,
          RecommendedPower: "1X90 HP" ,
          MinPower: "1X75 HP" ,
          ShaftLength: "XL" ,
          FreshwaterTank: "45 Liter" ,
          FuelTank: "70 Liter"   ,
          BlackWaterTank: "N/A" ,
          DesignCategory: "C" ,


        },
        features: [
          "Built-in Center Console - no steering system",
          "Built-in large rear  seat",
          "Stand up driving seat with back foldable table",
          "75 Liter fuel tank",
          "Fiberglass bow step with roller",
          "Full boat Cushions",
          "Swimming plateforms",
          "Sundeck",
          "Electric bilge pump with electric panel",
          "Deck selfdrain system",

          
        ],
        optionalFeatures: [
          "Fresh water shower system",
          "Stainless steel bimini top",
          "Boat Cover",
          "Bow table",  
          "Navigation lights",
          "Large tube side steps with teak and handles",
          "Telescopic S.S. Ladder",
          "Electric outlet socket",
          "Music system",
          "Foam teak parts",
          "Fishing rod holders",
          "Cup holders",
          "Battery switch",
          "Deck led lights",  
          "Hydraulic steering system",
          
        ]
      }
    ]
  }),
  
  createCategory({
    id: 4,
    name: "SportLine",
    description: "High-performance inflatable boats for the active and adventurous mariner",
    shortDescription: "High-performance adventure",
    color: "#f59e0b",
    // Image automatically synced from imageConfig.js
    models: [
      {
        name: "SL520",
        description: "Perfect blend of sport and comfort for the active boater.",
        shortDescription: "Sport inflatable for the active lifestyle.",
        imageFile: "520SL(1).jpg",
        heroImageFile: "DJI_0170.JPG",
        videoFiles: ["SportLine520.mp4"],
        section2Description: "Dynamic, lightweight, and full of energy — the SL520 embodies the spirit of fun on the water. Perfect for sports, family outings, or tender use.",
        specs: {
          Length: "5.25 m",  
          Beam: "2.25 m",
          TubeDiameter: "55 cm" ,
          TubeChambers: "5" ,
          NumberOfPersons: "10" ,
          NumberOfBedrooms: "N/A" ,
          SleepingCapacity: "N/A" ,
          MaxHP: "1X115 HP" ,
          RecommendedPower: "1X90 HP" ,
          MinPower: "1X75 HP" ,
          ShaftLength: "L" ,
          FreshwaterTank: "N/A" ,
          FuelTank: "70 Liter"   ,
          BlackWaterTank: "N/A" ,
          DesignCategory: "C" ,
        
          
        },
        features: [
          "Built-in Side Console",
          "Built-in Double driving seat",
          "Fiberglass bow step with cleat",
          "75 Liter fuel tank",
          "two cleats on the side",
          "Full boat Cushions",
          "Sundeck",
          "3 cup holders",
          "Swimming plateforms",
          "Console built-in ambient blue light",
          "Electric bilge pump with electric panel",
          "Deck selfdrain system",
          
        ],
        optionalFeatures: [
          "Fresh water shower system",
          "Stainless steel bimini top",
          "Boat Cover",
          "Bow table",
          "Navigation lights",
          "S.S. Ladder",
          "Electric outlet socket",
          "Music system",
          "Foam teak parts",   
          "Fishing rod holders",
          "Cup holders",
          "Battery switch", 
          "Deck led lights",
          "Hydraulic steering system",
          
        ]
      },
      {
        name: "SL480",
        description: "Sport performance and comfort in a compact package.",
        shortDescription: "Performance meets comfort.",
        imageFile: "480SL1.jpg",
        heroImageFile: "IMG_9553.jpg",
        videoFiles: ["SportLine480.mp4"],
        section2Description: "A small but capable performer. The SL480 offers easy handling, durability, and the same premium feel as Tiger Marine's larger models — in a compact form.",
        specs: {
          Length: "4.85 m",
          Beam: "2.25 m",
          TubeDiameter: "55 cm" ,
          TubeChambers: "5" ,
          NumberOfPersons: "9" ,
          NumberOfBedrooms: "N/A" ,
          SleepingCapacity: "N/A" ,
          MaxHP: "1X90 HP" ,
          RecommendedPower: "1X75 HP" ,
          MinPower: "1X60 HP" ,
          ShaftLength: "L" ,
          FreshwaterTank: "N/A" ,
          FuelTank: "105 Liter"   ,
          BlackWaterTank: "N/A" ,
          DesignCategory: "C" ,
       
        },
        features: [
          "Built-in Side Console",
          "Built-in Double driving seat",
          "Fiberglass bow step with cleat",
          "75 Liter fuel tank",
          "two cleats on the side",
          "Full boat Cushions",
          "Sundeck",
          "3 cup holders",
          "Swimming plateforms",
          "Console built-in ambient blue light",
          "Electric bilge pump with electric panel",
          "Deck selfdrain system",
        ],
        optionalFeatures: [
          "Steering system - mech. or Hydraulic",
          "Fresh water shower system",
          "Stainless steel bimini top",
          "Boat Cover",
          "Bow table",
          "Navigation lights",
          "S.S. Ladder",
          "Electric outlet socket",
          "Music system",
          "Foam teak parts",
          "Fishing rod holders",
          "Extra cup holders",
          "Battery switch",
          "Hydraulic steering system",
        ]
      }
    ]
  }),
  
  createCategory({
    id: 5,
    name: "Open",
    description: "Open-deck inflatable boats for maximum connection with the sea",
    shortDescription: "Open-deck connection",
    color: "#8b5cf6",
    // Image automatically synced from imageConfig.js
    models: [
      {
        name: "OP850",
        description: "Expansive open deck for ultimate enjoyment.",
        shortDescription: "Ultimate open deck experience.",
        imageFile: "850OP.jpg",
        heroImageFile: "DJI_0140.jpg",
        videoFiles: ["Open850.mp4"],
        section2Description: "Spacious, open, and built for adventure. The OP850 delivers remarkable performance and freedom on the sea with its open-deck concept and powerful engine options.",
        specs: {
          Length: "8.40 m",
          Beam: "3.00 X 2 m",
          TubeDiameter: "59 cm" ,
          TubeChambers: "7" ,
          NumberOfPersons: "20" ,
          NumberOfBedrooms: "N/A" ,
          SleepingCapacity: "N/A" ,
          MaxHP: "1X350 Or 2 X 250 HP" ,
          RecommendedPower: "1X250 Or 2 X 200 HP" ,
          MinPower: "1X250 Or 2 X 150 HP" ,
          ShaftLength: "XXL or XL" ,
          FreshwaterTank: "60 Liter" ,
          FuelTank: "280 Liter"   ,
          BlackWaterTank: "45 liter" ,
          DesignCategory: "C" ,
         
        },
        features: [
          "Large Toilet Console / Toilet is not included",
          "Double standup Driving seat with aft seat",
          "U- shape  rear seat",
          "U- shape front seat",
          "280 Liter fuel tank",
          "Large fiberglass bow step",
          "Tube side steps with teak and handles",
          "Automatic bile pump",
          "electric switch panel",
          "Large swimming platforms",
          
        ],
        optionalFeatures: [
          "Galvanized Aluminum T-top",
          "Eelctric toilet",
          "Fresh water shower system",
          "Stainless steel bimini top",
          "Boat Cover",
          "Navigation lights",
          "S.S. Ladder",  
          "Rear sundeck",
          "Electric outlet socket",
          "Music system",
          "Foam Teak parts",  
          "Fishing rod holders",
          "Cup holders",
          "Battery switch",
          "Deck led lights",
          "Hydrulic steering system",
        ]
      },
      {
        name: "OP750",
        description: "Large open deck design for enhanced enjoyment.",
        shortDescription: "Large open deck design.",
        imageFile: "1.jpg",
        heroImageFile: "DJI_0035.jpg",
        videoFiles: [],
        section2Description: "A versatile mid-size RIB combining comfort, functionality, and sleek design. Ideal for cruising, diving, or family day trips.",
        specs: {
          Length: "7.50 m ",
          Beam: "2.80 m",
          TubeDiameter: "59 cm" ,
          TubeChambers: "6" ,
          NumberOfPersons: "16" ,
          NumberOfBedrooms: "N/A" ,
          SleepingCapacity: "N/A" ,
          MaxHP: "1X250 HP" ,
          RecommendedPower: "1X200 HP" ,
          MinPower: "1X150 HP" ,
          ShaftLength: "XL" ,
          FreshwaterTank: "60 Liter" ,
          FuelTank: "210 Liter"   ,
          BlackWaterTank: "N/A" ,
          DesignCategory: "C" ,
 

        },
        features: [
          "Large center console",
          "Standup driving seat with aft seat",
          "Aft Seat with foldable backrest",
          "210 Liter fuel tank",
          "Tube side steps with handle and cleat",
          "Swimming platforms",
          "Fiberglass bow step",
          "Electric bilge pump with electric panel",
          "Deck self-drain system",
          
        ],
        optionalFeatures: [
          "Fresh water shower system",
          "Stainless steel bimini top",
          "Boat cover",
          "Removable table",
          "Navigation lights",
          "S.S. ladder",
          "Music system",
          "Foam teak parts",
          "Fishing rod holders",
          "Cup holders with lights",
          "Battery switch",
          "Foldable Aluminum rollbar",
          "Aluminum T-top",
          "Removable ski pole",  
          "Electric outlet socket",
          "Removable bow sundeck",
          "Hydrulic steering system",
          
        ]
      },
      {
        name: "OP650",
        description: "Open deck for enhanced enjoyment.",
        shortDescription: "Enhanced open deck experience.",
        imageFile: "_072_Itai_2022.jpg",
        heroImageFile: "DJI_0746.jpg",
        videoFiles: ["Open650.mp4"],
        section2Description: "Compact yet capable, the OP650 provides excellent stability, responsive control, and modern aesthetics — perfect for those seeking accessible adventure.",
        specs: {
          Length: "6.50 m",
          Beam: "2.55 m",
          TubeDiameter: "56 cm" ,
          TubeChambers: "6" ,
          NumberOfPersons: "14" ,
          NumberOfBedrooms: "N/A" ,
          SleepingCapacity: "N/A" ,
          MaxHP: "1X150 HP" ,
          RecommendedPower: "1X140 HP" ,
          MinPower: "1X115 HP" ,
          ShaftLength: "XL" ,
          FreshwaterTank: "45 Liter" ,
          FuelTank: "105 Liter"   ,
          BlackWaterTank: "N/A" ,
          DesignCategory: "C" ,
        

        },
        features: [
          "Medium Center Console",
          "Aft Seat with foldable backrest",
          "Bow step with roller",
          "swimming platforms",
          "Double driving Seat with standup position.",
          "105 Liter fuel tank package",
          "Tube side steps with teak and handles",
          "Bilge pump",
          "Electric switch panel",
        ],
        optionalFeatures: [
          "Aluminum T-top",  
          "Stainless steel bimini top",
          "Boat Cover",
          "Bow or aft table",
          "Navigation lights",
          "S.S. Ladder",
          "Electric outlet socket",
          "Music system",
          "Foam Teak parts",
          "Fishing rod holders",
          "Cup holders",      
          "Battery switch",
          "Hydrulic steering system",
          
        ]
      }
    ]
  }),
  
  // RIGID BOATS
  createCategory({
    id: 6,
    name: "Infinity",
    description: "The Infinity series - premium rigid boats",
    shortDescription: "Infinity collection",
    color: "#ef4444",
    // Image automatically synced from imageConfig.js
    models: [
      {
        name: "Infinity 280",
        description: "Infinity 280 model - premium rigid boat",
        shortDescription: "Infinity 280",
        imageFile: "740PL.jpg",
        heroImageFile: "740-12.jpg",
        specs: {
          length: "8.5 m",
          beam: "2.7 m",
          draft: "0.9 m",
          engine: "Outboard 300HP",
          fuelCapacity: "200L",
          waterCapacity: "50L",
          maxSpeed: "50 knots",
          cruisingSpeed: "35 knots",
          capacity: "8 passengers"
        },
        features: [
          "Rigid hull construction",
          "Premium materials",
          "Advanced navigation",
          "Comfortable seating",
          "Safety equipment",
          "Storage compartments"
        ]
      }
    ]
  })
];

// Generate model IDs automatically based on order
let modelIdCounter = 1;
allCategories.forEach(category => {
  category.models.forEach(model => {
    model.id = modelIdCounter++;
  });
});

// ============================================================================
// EXPORTS - Organized by boat type
// ============================================================================

// Inflatable boats (categories 1-5)
export const inflatableBoats = allCategories.filter(cat => cat.id <= 5);

// Rigid boats (categories 6+)
export const boatsCategories = allCategories.filter(cat => cat.id > 5);

// For backward compatibility
export const boatCategories = inflatableBoats;
export const allBoats = allCategories;

// ============================================================================
// OTHER DATA - Dealers, Colors, Fabrics, Upcoming Models
// ============================================================================

export const upcomingModels = [
  {
    id: 1,
    name: "Infinity 280",
    description: "The Infinity 280 - premium rigid boat combining exceptional performance with refined luxury. Experience the perfect balance of power, comfort, and style.",
    shortDescription: "Premium rigid boat with exceptional performance and luxury",
    image: "/images/Infinity 280/Infinity 280-1.jpg",
    heroImage: "/images/Infinity 280/Infinity 280-1.jpg",
    specs: {
      length: "8.5 m",
      beam: "2.7 m",
      draft: "0.9 m",
      engine: "Outboard 300HP",
      fuelCapacity: "200L",
      waterCapacity: "50L",
      maxSpeed: "50 knots",
      cruisingSpeed: "35 knots",
      capacity: "8 passengers"
    },
    features: [
      "Rigid hull construction",
      "Premium materials",
      "Advanced navigation",
      "Comfortable seating",
      "Safety equipment",
      "Storage compartments"
    ]
  }
];

export const dealers = [
  {
    id: 1,
    country: "Croatia",
    company: "Donar Boats",
    address: "Riva 1, 52100 Pula, Croatia",
    telephone: "+385 98 802 328",
    fax: "+385 52 350 822",
    email: "donarboats@gmail.com",
    website: "http://www.donarboats.hr/hr"
  },
  {
    id: 3,
    country: "France",
    company: "Boats Distribution",
    address: "27 Route du Cap, 83230 Bormes-les-Mimosas, France",
    telephone: null,
    fax: null,
    email: null,
    website: "http://www.boats-diffusion.com"
  },
  {
    id: 4,
    country: "Serbia",
    company: "Donar Boats",
    address: "Runjačica 16, Premantura, 52100 Pula, Croatia",
    telephone: "+385 98 802 328",
    fax: "+385 52 350 822",
    email: "donarboats@gmail.com",
    website: "http://www.donarboats.hr/index.php/en/"
  },
  {
    id: 5,
    country: "Germany",
    company: "Tiger Marine Center",
    address: "Delftweg 129, 3043 NH Rotterdam, Netherlands (Serving Germany)",
    telephone: null,
    fax: null,
    email: null,
    website: "http://www.tigermarinecenter.nl"
  },
  {
    id: 7,
    country: "Spain",
    company: "Kings Boats RIBS S.L",
    address: "Barcelona, Spain",
    telephone: "+34 653 683 678 / +34 620 899 997",
    fax: null,
    email: "comercial@kingsboatsribs.com",
    website: "https://kingsboatsribs.com/"
  },
  {
    id: 8,
    country: "Greece",
    company: "Biskinis Bros S.A.",
    address: "Oinoi 320 09, Greece",
    telephone: null,
    fax: null,
    email: null,
    website: "https://protagonyachts.com/company/"
  },
  {
    id: 9,
    country: "Kuwait",
    company: "Alghanim Marine Co.",
    address: "P.O. Box 30, Souk AlDakhili 15251, Kuwait",
    telephone: "+965 2 4729377",
    fax: "+965 2 4729344 Ext:117",
    email: "info@alghanimmarine.com",
    website: null
  },
  {
    id: 10,
    country: "Egypt",
    company: "Coastal Marine",
    address: "MB16-01-2 Abu Tig Marina, Ext 75522, El Gouna, Egypt",
    telephone: "+20 122 211 2844",
    fax: null,
    email: "info@coastalmarineegypt.com",
    website: "https://www.coastalmarineegypt.com/"
  },
  {
    id: 11,
    country: "Egypt",
    company: "Tiger Marine Factory",
    address: "100 Fadan Industrial Zone, Badr City, Cairo, Egypt",
    telephone: "+202 23108045 / +202 23108046",
    fax: "+202 23108047",
    email: "info@tigermarine.com",
    website: null
  },
  {
    id: 13,
    country: "Cyprus",
    company: "MD Pro Line Boat Sales",
    address: "Ayias Kyriakis, Geri, Cyprus",
    telephone: null,
    fax: null,
    email: null,
    website: "https://www.facebook.com/tigermarinecy/"
  },
  {
    id: 14,
    country: "Sweden",
    company: "Olympic Boats Sweden AB",
    address: "Smedbergsvägen 27, 455 35 Munkedal, Sweden",
    telephone: null,
    fax: null,
    email: null,
    website: "http://www.tiger-marine.se"
  },
  {
    id: 15,
    country: "Netherlands",
    company: "Tiger Marine CENTER",
    address: "Delftweg 129, 3043 NH Rotterdam, Netherlands",
    telephone: null,
    fax: null,
    email: null,
    website: "http://www.tigermarinecenter.nl"
  },
  {
    id: 20,
    country: "Belgium",
    company: "ARDEMA BV",
    address: "Vlambloemweg 3, 8620 Nieuwpoort, Belgium",
    telephone: "+32 471 18 19 98",
    fax: null,
    email: "info@tiger-marine-boats.be",
    website: null
  },
  {
    id: 19,
    country: "Canada",
    company: "Tobermory Marine Ltd",
    address: "7032 Hwy 6, Tobermory, ON N0H 2R0, Canada",
    telephone: null,
    fax: null,
    email: null,
    website: "http://www.tobermorymarine.com"
  }
];

export const colorOptions = [
  { id: 1, name: "Navy Blue", code: "#1e3a8a", category: "Exterior" },
  { id: 2, name: "Pearl White", code: "#f8fafc", category: "Exterior" },
  { id: 3, name: "Charcoal Gray", code: "#374151", category: "Exterior" },
  { id: 4, name: "Royal Gold", code: "#d4af37", category: "Accent" },
  { id: 5, name: "Silver Metallic", code: "#c0c0c0", category: "Accent" },
  { id: 6, name: "Cream", code: "#f5f5dc", category: "Interior" },
  { id: 7, name: "Espresso", code: "#3c2415", category: "Interior" },
  { id: 8, name: "Ocean Blue", code: "#0ea5e9", category: "Interior" }
];

export const fabricOptions = [
  { id: 1, name: "Premium Leather", category: "Seating", description: "Italian leather with weather-resistant treatment" },
  { id: 2, name: "Marine Vinyl", category: "Seating", description: "Durable vinyl designed for marine environments" },
  { id: 3, name: "Sunbrella Fabric", category: "Upholstery", description: "UV-resistant outdoor fabric" },
  { id: 4, name: "Teak Decking", category: "Decking", description: "Premium teak with natural oil finish" },
  { id: 5, name: "Carbon Fiber", category: "Accents", description: "Lightweight carbon fiber trim" },
  { id: 6, name: "Stainless Steel", category: "Hardware", description: "Marine-grade stainless steel fixtures" }
];

