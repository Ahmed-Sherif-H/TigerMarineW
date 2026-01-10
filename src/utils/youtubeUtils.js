/**
 * YouTube URL utilities
 * Detects YouTube URLs and extracts video IDs
 */

/**
 * Extract YouTube video ID from various URL formats
 * @param {string} urlOrId - YouTube URL or video ID
 * @returns {string|null} - Video ID or null if not a YouTube URL
 */
export function extractYouTubeId(urlOrId) {
  if (!urlOrId || typeof urlOrId !== 'string') return null;
  
  const trimmed = urlOrId.trim();
  if (!trimmed) return null;
  
  // If it's already just an ID (no special characters except dashes/underscores)
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }
  
  // YouTube URL patterns
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/.*[?&]v=([a-zA-Z0-9_-]{11})/,
  ];
  
  for (const pattern of patterns) {
    const match = trimmed.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  return null;
}

/**
 * Check if a string is a YouTube URL or ID
 * @param {string} urlOrId - String to check
 * @returns {boolean} - True if it's a YouTube URL/ID
 */
export function isYouTubeUrl(urlOrId) {
  return extractYouTubeId(urlOrId) !== null;
}

/**
 * Get YouTube embed URL from video ID
 * @param {string} videoId - YouTube video ID
 * @returns {string} - YouTube embed URL
 */
export function getYouTubeEmbedUrl(videoId) {
  const id = extractYouTubeId(videoId);
  if (!id) return null;
  return `https://www.youtube.com/embed/${id}`;
}

