# How to Add Optional Features

## 📍 **Location in `models.js`**

Optional features are added **inside each model object**, right after the `features` array.

## 📝 **Structure**

Here's where to add optional features in each boat model:

```javascript
{
  name: "TL950",
  description: "...",
  shortDescription: "...",
  imageFile: "DJI_0150.jpg",
  heroImageFile: "DJI_0247.jpg",
  specs: {
    length: "9.5 m",
    beam: "3.2 m",
    // ... all specs
  },
  features: [
    "Feature 1",
    "Feature 2",
    // ... standard features
  ],
  // ⬇️ ADD OPTIONAL FEATURES HERE ⬇️
  optionalFeatures: [
    {
      name: "Optional Feature Name",
      description: "Description of the feature",
      category: "Category Name",
      price: "Price or 'Contact for pricing'"
    },
    {
      name: "Another Optional Feature",
      description: "Description",
      category: "Category",
      price: "Price"
    }
    // Add more optional features from your Excel here
  ]
}
```

## 🎯 **Step-by-Step**

### Step 1: Open `models.js`

### Step 2: Find the Model
- Navigate to the category (e.g., TopLine, MaxLine, etc.)
- Find the specific model (e.g., TL950, ML38, etc.)

### Step 3: Locate the `features` Array
- Look for the `features: [...]` array
- This contains the standard features

### Step 4: Add `optionalFeatures` Right After `features`
- Add a comma after the closing `]` of the `features` array
- Add `optionalFeatures: [...]` with your optional features

## 📋 **Example from Excel**

If your Excel has:
- **Column M**: Optional Feature Name
- **Column N**: Optional Feature Description  
- **Column O**: Optional Feature Category
- **Column P**: Optional Feature Price

Convert it to:

```javascript
optionalFeatures: [
  {
    name: "Premium Audio System",        // From Excel Column M
    description: "High-end sound system",  // From Excel Column N
    category: "Entertainment",             // From Excel Column O
    price: "Contact for pricing"           // From Excel Column P
  },
  {
    name: "Navigation Suite",             // From Excel Column M
    description: "Advanced GPS system",    // From Excel Column N
    category: "Navigation",                // From Excel Column O
    price: "$5,000"                       // From Excel Column P
  }
]
```

## 🔍 **Where to Find It in the File**

In `models.js`, look for this pattern:

```javascript
createCategory({
  id: 2,
  name: "TopLine",
  models: [
    {
      name: "TL950",
      // ... other properties
      features: [ ... ],
      // ⬇️ ADD optionalFeatures HERE ⬇️
      optionalFeatures: [ ... ]
    }
  ]
})
```

## ✅ **Quick Checklist**

- [ ] Open `models.js`
- [ ] Find the model you want to edit
- [ ] Locate the `features` array
- [ ] Add `optionalFeatures: [...]` right after `features`
- [ ] Add each optional feature as an object with: `name`, `description`, `category`, `price`
- [ ] Save the file

## 💡 **Tips**

1. **Copy from Excel**: Each row in Excel becomes one object in the `optionalFeatures` array
2. **Group by Category**: Features with the same category will be grouped together on the website
3. **Price Format**: Use "Contact for pricing" or specific prices like "$5,000"
4. **Comma After Last Item**: Don't forget the comma after the last feature in the array (except for the last one)

## 📍 **Visual Example**

```
models.js
├── createCategory({
│   ├── id: 2,
│   ├── name: "TopLine",
│   └── models: [
│       ├── {
│       │   ├── name: "TL950",
│       │   ├── specs: { ... },
│       │   ├── features: [ ... ],        ← Standard features
│       │   └── optionalFeatures: [ ... ] ← ADD HERE!
│       │   }
│       └── { ... }
│   ]
└── })
```

