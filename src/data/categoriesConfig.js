/**
 * Categories Configuration - Backward Compatibility File
 * 
 * This file now just re-exports from models.js
 * 
 * ALL boat data is in: src/data/models.js
 * Edit boats there, not here!
 */

// Re-export everything from models.js for backward compatibility
export {
  allCategories,
  inflatableBoats,
  boatsCategories,
  boatCategories,
  allBoats
} from './models';

// For backward compatibility - export as categoriesConfig
import { allCategories } from './models';
export const categoriesConfig = allCategories;
