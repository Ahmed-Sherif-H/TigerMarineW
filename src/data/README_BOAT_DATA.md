# Boat Data Management Guide

This guide explains how to easily add boat data from Excel files to the website.

## Quick Start

1. **Open** `src/data/categoriesConfig.js`
2. **Find** the category you want to add a boat to
3. **Copy** the structure from an existing boat
4. **Fill in** your data from Excel
5. **Save** - the boat will appear automatically!

## Data Structure

Each boat needs:

### Required Fields
- `name`: Model name (e.g., "TL950")
- `description`: Full description
- `shortDescription`: Brief tagline
- `specs`: All specifications (see below)
- `standardFeatures`: Array of included features
- `optionalFeatures`: Array of optional upgrades

### Optional Fields
- `imageFile`: Main image filename
- `heroImageFile`: Hero image filename
- `optionalFeaturesByCategory`: Grouped optional features

## Specifications (specs)

From your Excel, map these columns:

```javascript
specs: {
  length: "9.5 m",           // Excel column: Length
  beam: "3.2 m",             // Excel column: Beam
  draft: "0.4 m",            // Excel column: Draft
  engine: "Outboard 300HP",  // Excel column: Engine
  fuelCapacity: "200L",      // Excel column: Fuel Capacity
  waterCapacity: "50L",      // Excel column: Water Capacity
  maxSpeed: "50 knots",      // Excel column: Max Speed
  cruisingSpeed: "35 knots", // Excel column: Cruising Speed
  capacity: "12 passengers", // Excel column: Capacity
  // Add any additional specs from Excel
}
```

## Standard Features

List all features that come **included** with the boat:

```javascript
standardFeatures: [
  "Premium inflatable construction",
  "Advanced hull design",
  "Comfortable seating",
  // ... all standard features from Excel
]
```

## Optional Features

List all **optional upgrades** available for the boat:

```javascript
optionalFeatures: [
  {
    name: "Premium Audio System",
    description: "High-end sound system with waterproof speakers",
    category: "Entertainment",
    price: "Contact for pricing"
  },
  {
    name: "Advanced Navigation Suite",
    description: "GPS, chartplotter, radar, and autopilot",
    category: "Navigation",
    price: "Contact for pricing"
  },
  // ... all optional features from Excel
]
```

## Excel to Code Conversion

### Method 1: Manual Entry (Recommended for small datasets)

1. Open your Excel file
2. For each boat, copy the structure from `boatDataExample.js`
3. Fill in the values from Excel
4. Add to `categoriesConfig.js`

### Method 2: CSV Export (For large datasets)

1. Export Excel to CSV
2. Use the helper functions in `excelToBoatData.js`
3. Convert CSV rows to boat objects
4. Add to `categoriesConfig.js`

## Example: Adding a New Boat

```javascript
// In categoriesConfig.js, inside the models array:

{
  name: "TL1050",  // From Excel: Model Name
  description: "New premium model with enhanced features",  // From Excel: Description
  shortDescription: "Enhanced premium model",  // From Excel: Short Description
  imageFile: "TL1050.jpg",  // From Excel: Image File
  heroImageFile: "TL1050-hero.jpg",  // From Excel: Hero Image
  
  specs: {
    length: "10.5 m",        // From Excel: Length
    beam: "3.5 m",           // From Excel: Beam
    draft: "0.5 m",          // From Excel: Draft
    engine: "Outboard 350HP", // From Excel: Engine
    fuelCapacity: "250L",    // From Excel: Fuel Capacity
    waterCapacity: "60L",    // From Excel: Water Capacity
    maxSpeed: "52 knots",    // From Excel: Max Speed
    cruisingSpeed: "38 knots", // From Excel: Cruising Speed
    capacity: "14 passengers" // From Excel: Capacity
  },
  
  standardFeatures: [
    // Copy from Excel: Standard Features column (comma-separated or list)
    "Premium inflatable construction",
    "Advanced hull design",
    "Comfortable seating",
    "Navigation electronics",
    "Safety equipment"
  ],
  
  optionalFeatures: [
    // Copy from Excel: Optional Features rows
    {
      name: "Premium Audio",  // From Excel: Optional Feature Name
      description: "High-end sound system",  // From Excel: Optional Feature Description
      category: "Entertainment",  // From Excel: Optional Feature Category
      price: "Contact for pricing"  // From Excel: Optional Feature Price
    },
    {
      name: "Navigation Suite",
      description: "Advanced GPS system",
      category: "Navigation",
      price: "Contact for pricing"
    }
    // ... add all optional features from Excel
  ]
}
```

## Tips

1. **Keep it organized**: Group optional features by category
2. **Be consistent**: Use the same format for all boats
3. **Test after adding**: Check the website to ensure everything displays correctly
4. **Use helper functions**: Check `excelToBoatData.js` for conversion utilities

## Need Help?

- See `boatDataExample.js` for complete examples
- See `boatDataTemplate.js` for the data structure template
- See `excelToBoatData.js` for conversion utilities

