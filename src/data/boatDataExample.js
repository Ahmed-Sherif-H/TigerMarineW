/**
 * Boat Data Example
 * 
 * This file shows how to easily add boat data with standard and optional features.
 * Copy this structure and modify it for your boats.
 * 
 * To add a new boat:
 * 1. Copy the example below
 * 2. Fill in all the information from your Excel
 * 3. Add it to the appropriate category in categoriesConfig.js
 */

import { createBoatModel } from './excelToBoatData';

// Example: How to add a boat with all features
export const exampleBoatModel = {
  name: "TL950",
  description: "The ultimate expression of luxury and power in inflatable boating.",
  shortDescription: "Premium inflatable designed for the discerning mariner.",
  
  // Image files (will be auto-processed by imageHelpers)
  imageFile: "DJI_0150.jpg",
  heroImageFile: "DJI_0247.jpg",
  
  // Specifications from Excel
  specs: {
    length: "9.5 m",
    beam: "3.2 m",
    draft: "0.4 m",
    engine: "Outboard 300HP",
    fuelCapacity: "200L",
    waterCapacity: "50L",
    maxSpeed: "50 knots",
    cruisingSpeed: "35 knots",
    capacity: "12 passengers",
    // Add any additional specs from Excel
    weight: "1500 kg",
    material: "Hypalon",
    hullType: "Rigid Inflatable",
  },
  
  // Standard Features (included with the boat)
  standardFeatures: [
    "Premium inflatable construction",
    "Advanced hull design",
    "Comfortable seating for 12 passengers",
    "Navigation electronics",
    "Safety equipment",
    "Storage compartments",
    "LED lighting",
    "Anchor system",
    "Bilge pump",
    "Fire extinguisher",
    // Add all standard features from Excel
  ],
  
  // Optional Features (available as upgrades)
  optionalFeatures: [
    {
      name: "Premium Audio System",
      description: "High-end sound system with waterproof speakers and subwoofer",
      category: "Entertainment",
      price: "Contact for pricing"
    },
    {
      name: "Advanced Navigation Suite",
      description: "GPS, chartplotter, radar, and autopilot system",
      category: "Navigation",
      price: "Contact for pricing"
    },
    {
      name: "Comfort Pack",
      description: "Upgraded seating, sun-shade systems, and weather protection",
      category: "Comfort",
      price: "Contact for pricing"
    },
    {
      name: "Extended Fuel Tank",
      description: "Additional fuel capacity for longer trips",
      category: "Performance",
      price: "Contact for pricing"
    },
    {
      name: "Tender Launch System",
      description: "Hydraulic system for launching and retrieving tender",
      category: "Convenience",
      price: "Contact for pricing"
    },
    {
      name: "Fishing Package",
      description: "Rod holders, fish finder, and live well",
      category: "Recreation",
      price: "Contact for pricing"
    },
    // Add all optional features from Excel
  ],
  
  // Optional: Group features by category (auto-generated if not provided)
  optionalFeaturesByCategory: {
    "Entertainment": [
      { name: "Premium Audio System", description: "...", price: "..." }
    ],
    "Navigation": [
      { name: "Advanced Navigation Suite", description: "...", price: "..." }
    ],
    "Comfort": [
      { name: "Comfort Pack", description: "...", price: "..." }
    ],
    "Performance": [
      { name: "Extended Fuel Tank", description: "...", price: "..." }
    ],
    "Convenience": [
      { name: "Tender Launch System", description: "...", price: "..." }
    ],
    "Recreation": [
      { name: "Fishing Package", description: "...", price: "..." }
    ]
  }
};

/**
 * Quick Add Method - Using the helper function
 * 
 * This is the easiest way to add a boat:
 */
export const quickAddBoat = createBoatModel({
  name: "TL850",
  description: "Premium inflatable with exceptional design and performance.",
  shortDescription: "Premium design and comfort.",
  imageFile: "TL850.jpg",
  heroImageFile: "850TL - 1.jpg",
  specs: {
    length: "8.5 m",
    beam: "3.0 m",
    draft: "0.35 m",
    engine: "Outboard 250HP",
    fuelCapacity: "180L",
    waterCapacity: "45L",
    maxSpeed: "48 knots",
    cruisingSpeed: "32 knots",
    capacity: "10 passengers"
  },
  standardFeatures: [
    "Premium inflatable construction",
    "Advanced hull design",
    "Comfortable seating",
    "Navigation electronics",
    "Safety equipment",
    "Storage compartments"
  ],
  optionalFeatures: [
    {
      name: "Premium Audio",
      description: "High-end sound system",
      category: "Entertainment",
      price: "Optional"
    },
    {
      name: "Navigation Suite",
      description: "Advanced GPS and chartplotter",
      category: "Navigation",
      price: "Optional"
    }
  ]
});

/**
 * Excel Column Mapping Guide
 * 
 * When exporting from Excel, map your columns like this:
 * 
 * Excel Column A → name
 * Excel Column B → description
 * Excel Column C → shortDescription
 * Excel Column D → length (specs)
 * Excel Column E → beam (specs)
 * Excel Column F → draft (specs)
 * Excel Column G → engine (specs)
 * Excel Column H → fuelCapacity (specs)
 * Excel Column I → waterCapacity (specs)
 * Excel Column J → maxSpeed (specs)
 * Excel Column K → cruisingSpeed (specs)
 * Excel Column L → capacity (specs)
 * Excel Column M → standardFeatures (comma-separated)
 * Excel Column N → optionalFeatureName
 * Excel Column O → optionalFeatureDescription
 * Excel Column P → optionalFeatureCategory
 * Excel Column Q → optionalFeaturePrice
 * 
 * For multiple optional features, use separate rows with the same boat name.
 */

/**
 * Step-by-Step Guide to Add a Boat:
 * 
 * 1. Open categoriesConfig.js
 * 2. Find the category you want to add the boat to (e.g., TopLine)
 * 3. In the models array, add a new object using the structure above
 * 4. Fill in all the data from your Excel
 * 5. Save the file
 * 6. The boat will automatically appear on the website!
 * 
 * Example:
 * 
 * createCategory({
 *   id: 2,
 *   name: "TopLine",
 *   ...
 *   models: [
 *     {
 *       name: "TL950",
 *       description: "...",
 *       specs: { ... },
 *       standardFeatures: [ ... ],
 *       optionalFeatures: [ ... ]
 *     },
 *     // Add your new boat here:
 *     {
 *       name: "TL1050",
 *       description: "New model description",
 *       specs: {
 *         length: "10.5 m",
 *         // ... all specs from Excel
 *       },
 *       standardFeatures: [
 *         "Feature 1",
 *         "Feature 2",
 *         // ... all standard features from Excel
 *       ],
 *       optionalFeatures: [
 *         {
 *           name: "Optional Feature 1",
 *           description: "Description",
 *           category: "Category",
 *           price: "Price"
 *         },
 *         // ... all optional features from Excel
 *       ]
 *     }
 *   ]
 * })
 */

