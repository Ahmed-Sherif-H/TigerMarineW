# News System - Dynamic Content Management

## Overview
The news system allows you to easily add, edit, and manage news items that appear on the homepage. All news items are stored in `src/data/news.js`.

## How to Add a New News Item

Simply add a new object to the `newsItems` array in `src/data/news.js`:

```javascript
{
  id: 5,  // Unique ID (increment from the last one)
  title: "Your News Title",
  excerpt: "A short summary that appears on the card (2-3 lines)",
  content: "Full article content here...",  // For future use if creating a detail page
  image: "/images/your-image.jpg",  // Path to image in public/images folder
  date: "2024-01-20",  // Format: YYYY-MM-DD
  category: "Announcements",  // Options: "Announcements", "Events", "Company News", "Sustainability", etc.
  featured: false  // Set to true to show a "Featured" badge
}
```

## Example

```javascript
{
  id: 5,
  title: "Miami Boat Show 2024",
  excerpt: "Join us at the Miami International Boat Show to see our latest models and innovations.",
  content: "Full article content here...",
  image: "/images/miami-boat-show.jpg",
  date: "2024-02-15",
  category: "Events",
  featured: true
}
```

## Features

- **Automatic Sorting**: News items are automatically sorted by date (newest first)
- **Featured Badge**: Set `featured: true` to add a "Featured" badge
- **Category Badges**: Each news item displays its category with a colored badge
- **Image Support**: Each news item can have its own image
- **Responsive Grid**: Displays 3 columns on desktop, 2 on tablet, 1 on mobile
- **Smooth Animations**: Staggered fade-in animations for each card

## Helper Functions

The `news.js` file includes several helper functions:

- `getLatestNews(limit)` - Get the latest news items (optionally limited)
- `getFeaturedNews()` - Get only featured news items
- `getNewsByCategory(category)` - Filter news by category
- `formatNewsDate(dateString)` - Format dates nicely for display

## Image Recommendations

- **Aspect Ratio**: 16:9 or similar landscape orientation works best
- **Size**: Recommended 800x450px or larger
- **Format**: JPG or PNG
- **Location**: Place images in `/public/images/` folder

## Notes

- The homepage displays the 6 most recent news items
- News items are sorted automatically by date (newest first)
- Each card has hover effects and animations
- "Read More" links currently go to the Boat Shows page (can be customized later)



