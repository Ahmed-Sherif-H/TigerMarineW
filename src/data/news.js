/**
 * News Data - Easy to add new news items
 * Just add a new object to the array below!
 */

export const newsItems = [
  {
    id: 1,
    title: "New Flagship Model Launch",
    excerpt: "We're excited to announce the launch of our newest flagship model, featuring cutting-edge technology and luxury amenities.",
    content: "Full article content here...",
    image: "/images/DJI_0154.jpg",
    date: "2024-01-15",
    category: "Announcements",
    featured: true
  },
  {
    id: 2,
    title: "Boat Show Season Begins",
    excerpt: "Join us at major boat shows worldwide to experience our complete collection in person.",
    content: "Full article content here...",
    image: "/images/DJI_0216.jpg",
    date: "2024-01-10",
    category: "Events",
    featured: false
  },
  {
    id: 3,
    title: "Global Dealer Network Expansion",
    excerpt: "Tiger Marine expands its dealer network with new locations in Asia-Pacific region.",
    content: "Full article content here...",
    image: "/images/Max-line.jpg",
    date: "2024-01-05",
    category: "Company News",
    featured: false
  },

];

/**
 * Get featured news items
 */
export const getFeaturedNews = () => {
  return newsItems.filter(item => item.featured);
};

/**
 * Get latest news items (sorted by date, most recent first)
 */
export const getLatestNews = (limit = null) => {
  const sorted = [...newsItems].sort((a, b) => new Date(b.date) - new Date(a.date));
  return limit ? sorted.slice(0, limit) : sorted;
};

/**
 * Get news by category
 */
export const getNewsByCategory = (category) => {
  return newsItems.filter(item => item.category === category);
};

/**
 * Format date for display
 */
export const formatNewsDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

