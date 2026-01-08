import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop component
 * Scrolls to top of page when route changes
 * Handles both immediate scroll and delayed scroll for async content
 */
function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // If there's a hash (anchor link), let the browser handle it naturally
    if (hash) {
      // Wait for content to load, then scroll to hash
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          const offset = 100; // Offset for sticky nav
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - offset;
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 100);
      return;
    }

    // No hash - scroll to top immediately
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant' // Use 'instant' for immediate scroll, 'smooth' for animated
    });
    
    // Also ensure scroll position is reset after content loads
    // This handles cases where content loads asynchronously and pushes content down
    const timers = [
      setTimeout(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      }, 100),
      setTimeout(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      }, 300)
    ];

    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [pathname, hash]);

  return null;
}

export default ScrollToTop;

