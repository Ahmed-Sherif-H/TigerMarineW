/**
 * Transform API model data to include proper image paths
 * This ensures compatibility with existing frontend components
 */

import { getModelImagePath, getFullImagePath, encodeFilename } from './imagePathUtils';
import { isYouTubeUrl } from './youtubeUtils';
import { extractFilename, resolveBackendPublicPath, resolveMediaPublicPath } from './backendConfig';
import { isUpcomingModel } from './upcomingModelData';

/**
 * Transform a single model from API format to frontend format
 */
export function transformModel(model) {
  if (!model) return null;

  const modelFolder = getModelImagePath(model.name);
  
  // Helper to get fallback image path when database doesn't have filename
  const getFallbackImage = (modelName) => {
    // Map model names to likely first image filenames based on actual folder structure
    // Note: Actual filenames may have spaces like "850TL - 1.jpg"
    const fallbackMap = {
      'TL850': '850TL - 1.jpg',  // Actual filename has spaces
      'TL750': '750TL - 1.jpg',
      'TL650': '650TL - 1.jpg',
      'TL950': '950TL - 1.jpg',
      'PL620': '620PL - 1.jpg',
      'PL550': '550PL - 1.jpg',
      'SL520': '520SL - 1.jpg',
      'SL480': '480SL - 1.jpg',
      'OP850': '850OP - 1.jpg',
      'OP750': '750OP - 1.jpg',
      'OP650': '650OP - 1.jpg',
      'ML38': 'ML38 - 1.jpg',
    };
    const fallbackFilename = fallbackMap[modelName] || `${modelName} - 1.jpg`;
    const path = getFullImagePath(modelName, fallbackFilename);
    if (import.meta.env.DEV) {
      console.log(`[Transform] Using fallback image for ${modelName}: ${fallbackFilename} → ${path}`);
    }
    return path;
  };
  
  // Transform image files to full paths
  const transformed = {
    ...model,
    // Main images - handle Cloudinary URLs, legacy filenames, and paths
    image: model.imageFile ? (() => {
      const imageFile = model.imageFile;
      // If it's already a Cloudinary URL or full URL, use it directly
      if (imageFile.startsWith('http://') || imageFile.startsWith('https://')) {
        return imageFile;
      }
      if (imageFile.startsWith('/images/') || imageFile.startsWith('/Customizer-images/')) {
        return resolveMediaPublicPath(imageFile);
      }
      // If it's a path like "/images/Open650/image.jpg", extract just "image.jpg"
      let filename = imageFile;
      if (filename.includes('/')) {
        filename = filename.split('/').pop();
      }
      const path = getFullImagePath(model.name, filename);
      // Only log in development
      if (import.meta.env.DEV) {
        console.log(`[Transform] Image: ${model.imageFile} → ${filename} → ${path}`);
      }
      return path;
    })() : getFallbackImage(model.name),
    heroImage: model.heroImageFile ? (() => {
      const heroImageFile = model.heroImageFile;
      // If it's already a Cloudinary URL or full URL, use it directly
      if (heroImageFile.startsWith('http://') || heroImageFile.startsWith('https://')) {
        return heroImageFile;
      }
      if (heroImageFile.startsWith('/images/') || heroImageFile.startsWith('/Customizer-images/')) {
        return resolveMediaPublicPath(heroImageFile);
      }
      let filename = heroImageFile;
      if (filename.includes('/')) {
        filename = filename.split('/').pop();
      }
      const path = getFullImagePath(model.name, filename);
      // Only log in development
      if (import.meta.env.DEV) {
        console.log(`[Transform] HeroImage: ${model.heroImageFile} → ${filename} → ${path}`);
      }
      return path;
    })() : getFallbackImage(model.name),
    contentImage: model.contentImageFile ? (() => {
      const contentImageFile = model.contentImageFile;
      // If it's already a Cloudinary URL or full URL, use it directly
      if (contentImageFile.startsWith('http://') || contentImageFile.startsWith('https://')) {
        return contentImageFile;
      }
      if (contentImageFile.startsWith('/images/') || contentImageFile.startsWith('/Customizer-images/')) {
        return resolveMediaPublicPath(contentImageFile);
      }
      let filename = contentImageFile;
      if (filename.includes('/')) {
        filename = filename.split('/').pop();
      }
      const path = getFullImagePath(model.name, filename);
      // Only log in development
      if (import.meta.env.DEV) {
        console.log(`[Transform] ContentImage: ${model.contentImageFile} → ${filename} → ${path}`);
      }
      return path;
    })() : getFallbackImage(model.name),
    
    // Keep original filenames for admin
    imageFile: model.imageFile || '',
    heroImageFile: model.heroImageFile || '',
    contentImageFile: model.contentImageFile || '',
    // Transform interiorMainImage to full path (in Interior subfolder)
    interiorMainImage: (model.interiorMainImage && model.interiorMainImage.trim() !== '') ? (() => {
      const interiorMainImage = model.interiorMainImage;
      // If it's already a Cloudinary URL or full URL, use it directly
      if (interiorMainImage.startsWith('http://') || interiorMainImage.startsWith('https://')) {
        if (import.meta.env.DEV) {
          console.log(`[Transform] ✅ InteriorMainImage (Cloudinary URL): ${interiorMainImage}`);
        }
        return interiorMainImage;
      }
      if (interiorMainImage.startsWith('/images/') || interiorMainImage.startsWith('/Customizer-images/')) {
        return resolveMediaPublicPath(interiorMainImage);
      }
      let filename = interiorMainImage;
      // Extract filename from path if backend returns full path
      if (filename.includes('/')) {
        filename = filename.split('/').pop();
      }
      // Build path with Interior subfolder
      // Use getModelImagePath to get base path, then add Interior/ and filename
      const modelFolder = getModelImagePath(model.name); // Returns: ${BACKEND_URL}/images/${encodedFolderName}/
      const encodedFilename = encodeFilename(filename);
      const fullPath = modelFolder + 'Interior/' + encodedFilename;
      // Only log in development
      if (import.meta.env.DEV) {
        console.log(`[Transform] ✅ InteriorMainImage: ${model.interiorMainImage} → ${filename} → ${fullPath}`);
      }
      return fullPath;
    })() : (() => {
      // Only log in development
      if (import.meta.env.DEV) {
        console.log(`[Transform] ⚠️ No interiorMainImage for model ${model.name}. Value:`, model.interiorMainImage);
      }
      return null;
    })(),
    
    // Keep Cloudinary / absolute URLs; only reduce legacy relative paths to filenames
    galleryFiles: (model.galleryFiles || []).map(file => {
      if (typeof file === 'string') {
        return extractFilename(file);
      }
      if (file && file.filename) {
        return extractFilename(file.filename);
      }
      return file;
    }),
    galleryImages: (model.galleryFiles || []).length > 0 
      ? (model.galleryFiles || []).map(file => {
          let filename = typeof file === 'string' ? file : (file?.filename || file);
          if (filename == null || filename === '') return null;
          let str = String(filename).trim();
          if (!str) return null;

          if (str.startsWith('//')) {
            return `https:${str}`;
          }
          if (str.includes('cloudinary.com') && !str.startsWith('http')) {
            return `https://${str.replace(/^\/+/, '')}`;
          }
          if (str.startsWith('http://') || str.startsWith('https://')) {
            return str;
          }

          if (str.startsWith('/images/') || str.startsWith('/Customizer-images/')) {
            return resolveMediaPublicPath(str);
          }
          if (str.startsWith('/') && /upload|(^\/files\/)|\/storage\/|\/media\//i.test(str)) {
            return resolveBackendPublicPath(str);
          }

          if (str.includes('/')) {
            str = str.split('/').pop();
          }
          const fullPath = getFullImagePath(model.name, str);
          if (import.meta.env.DEV) {
            console.log(`[Transform] Gallery file: ${str} → ${fullPath}`);
          }
          return fullPath;
        }).filter(Boolean)
      : [getFallbackImage(model.name)], // Use fallback if no gallery files
    
    videoFiles: (model.videoFiles || []).map(file => {
      const videoValue = typeof file === 'string' ? file : (file?.filename || file);
      // If it's a YouTube URL, preserve it as-is
      if (isYouTubeUrl(videoValue)) {
        return videoValue;
      }
      // For local files, extract filename from path if it's a path
      if (typeof file === 'string') {
        if (file.includes('/')) {
          return file.split('/').pop();
        }
        return file;
      }
      if (file && file.filename) {
        const f = file.filename;
        return f.includes('/') ? f.split('/').pop() : f;
      }
      return file;
    }),
    videos: (model.videoFiles || []).map(file => {
      let filename = typeof file === 'string' ? file : (file?.filename || file);
      
      // If it's a YouTube URL, return it as-is (don't convert to file path)
      if (isYouTubeUrl(filename)) {
        return filename;
      }

      const str = filename != null ? String(filename).trim() : '';
      if (str.startsWith('http://') || str.startsWith('https://')) {
        return str;
      }
      if (str.startsWith('/images/') || str.startsWith('/Customizer-images/')) {
        return resolveMediaPublicPath(str);
      }
      
      // For local video files, extract filename from path if it's a path
      if (str && str.includes('/')) {
        filename = str.split('/').pop();
      }
      // Build full path for local videos only
      return getFullImagePath(model.name, filename);
    }),
    
    interiorFiles: (model.interiorFiles || []).map(file => {
      if (typeof file === 'string') {
        // If it's a Cloudinary URL, preserve it
        if (file.startsWith('http://') || file.startsWith('https://')) {
          return file;
        }
        // Extract filename from path if it's a path
        if (file.includes('/')) {
          return file.split('/').pop();
        }
        return file;
      }
      if (file && file.filename) {
        const f = file.filename;
        // If it's a Cloudinary URL, preserve it
        if (f.startsWith('http://') || f.startsWith('https://')) {
          return f;
        }
        return f.includes('/') ? f.split('/').pop() : f;
      }
      return file;
    }),
    interiorImages: (model.interiorFiles || []).map(file => {
      let filename = typeof file === 'string' ? file : (file?.filename || file);
      if (!filename) return null;
      
      // If it's already a Cloudinary URL or full URL, use it directly
      if (filename.startsWith('http://') || filename.startsWith('https://')) {
        if (import.meta.env.DEV) {
          console.log(`[Transform] ✅ InteriorImage (Cloudinary URL): ${filename}`);
        }
        return filename;
      }

      if (filename.startsWith('/images/') || filename.startsWith('/Customizer-images/')) {
        return resolveMediaPublicPath(filename);
      }
      
      // Extract filename from path if it's a path
      if (filename.includes('/')) {
        filename = filename.split('/').pop();
      }
      
      // Build frontend path for interior images
      const basePath = getModelImagePath(model.name);
      const fullPath = `${basePath}Interior/${encodeFilename(filename)}`;
      if (import.meta.env.DEV) {
        console.log(`[Transform] InteriorImage: ${file} → ${filename} → ${fullPath}`);
      }
      return fullPath;
    }).filter(Boolean),
    
    // Transform specs from array to object if needed
    specs: model.specs 
      ? (Array.isArray(model.specs) 
          ? model.specs.reduce((acc, spec) => {
              acc[spec.key] = spec.value;
              return acc;
            }, {})
          : model.specs)
      : {},
    
    // Transform features - handle both array of strings and array of objects
    features: (model.standardFeatures || model.features || []).map(f => 
      typeof f === 'string' ? f : (f?.feature || f)
    ),
    standardFeatures: (model.standardFeatures || model.features || []).map(f => 
      typeof f === 'string' ? f : (f?.feature || f)
    ),
    
    // Optional features - handle both formats
    optionalFeatures: (model.optionalFeatures || []).map(f => {
      if (typeof f === 'string') {
        return { name: f, description: '', category: '', price: '' };
      }
      return {
        name: f.name || '',
        description: f.description || '',
        category: f.category || '',
        price: f.price || ''
      };
    }),
  };

  return transformed;
}

/**
 * Transform an array of models
 */
export function transformModels(models) {
  return models.map(transformModel);
}

/**
 * Transform category with models
 */
export function transformCategory(category, models) {
  const categoryModels = models
    .filter(m => m.categoryId === category.id && !isUpcomingModel(m))
    .map(transformModel)
    .sort((a, b) => {
      // Sort by number in descending order (950 → 650)
      const numA = (a.name || '').match(/\d+/);
      const numB = (b.name || '').match(/\d+/);
      if (numA && numB) {
        return parseInt(numB[0], 10) - parseInt(numA[0], 10); // Descending
      }
      if (numA) return -1;
      if (numB) return 1;
      return (a.name || '').localeCompare(b.name || '');
    });
  
  const getCategoryImagePath = (filename) => {
    if (!filename) return null;
    
    if (filename.startsWith('http://') || filename.startsWith('https://')) {
      return filename;
    }
    
    if (filename.startsWith('/images/') || filename.startsWith('/Customizer-images/')) {
      return resolveMediaPublicPath(filename);
    }
    
    return resolveMediaPublicPath(
      `/images/categories/${category.name}/${encodeFilename(filename)}`
    );
  };
  
  // Preserve Cloudinary URLs, handle legacy filenames
  const categoryImage = category.image ? (() => {
    let filename = category.image;
    // If it's already a Cloudinary URL or full URL, use it directly
    if (filename.startsWith('http://') || filename.startsWith('https://')) {
      if (import.meta.env.DEV) {
        console.log(`[Transform] ✅ CategoryImage (Cloudinary URL): ${filename}`);
      }
      return filename;
    }

    if (filename.startsWith('/images/') || filename.startsWith('/Customizer-images/')) {
      return resolveMediaPublicPath(filename);
    }
    
    // If it's a Cloudinary URL but missing protocol, add https://
    if (filename.includes('cloudinary.com')) {
      const cloudinaryUrl = filename.startsWith('//') ? `https:${filename}` : `https://${filename}`;
      if (import.meta.env.DEV) {
        console.log(`[Transform] ✅ CategoryImage (Cloudinary URL - fixed): ${cloudinaryUrl}`);
      }
      return cloudinaryUrl;
    }
    
    // Legacy filename - try to build Cloudinary URL first, then fallback to Railway
    // Extract filename if it's a path
    if (filename.includes('/')) {
      filename = filename.split('/').pop();
    }
    
    // Try Cloudinary URL format first (if file was uploaded to Cloudinary)
    // Format: https://res.cloudinary.com/{cloud_name}/image/upload/v{version}/categories/{categoryName}/{filename}
    // But we don't know the version, so we'll try the Railway path as fallback
    // Note: If images are broken, they need to be re-uploaded to get Cloudinary URLs
    
    // Build Railway backend path for legacy support
    const path = getCategoryImagePath(filename);
    if (import.meta.env.DEV) {
      console.log(`[Transform] ⚠️ CategoryImage (legacy filename - needs re-upload): ${category.image} → ${filename} → ${path}`);
      console.log(`[Transform] 💡 Tip: Re-upload this image from the dashboard to get a Cloudinary URL`);
    }
    return path;
  })() : null;
  
  const categoryHeroImage = category.heroImage ? (() => {
    let filename = category.heroImage;
    // If it's already a Cloudinary URL or full URL, use it directly
    if (filename.startsWith('http://') || filename.startsWith('https://')) {
      if (import.meta.env.DEV) {
        console.log(`[Transform] ✅ CategoryHeroImage (Cloudinary URL): ${filename}`);
      }
      return filename;
    }

    if (filename.startsWith('/images/') || filename.startsWith('/Customizer-images/')) {
      return resolveMediaPublicPath(filename);
    }
    
    // If it's a Cloudinary URL but missing protocol, add https://
    if (filename.includes('cloudinary.com')) {
      const cloudinaryUrl = filename.startsWith('//') ? `https:${filename}` : `https://${filename}`;
      if (import.meta.env.DEV) {
        console.log(`[Transform] ✅ CategoryHeroImage (Cloudinary URL - fixed): ${cloudinaryUrl}`);
      }
      return cloudinaryUrl;
    }
    
    // Legacy filename - extract if path
    if (filename.includes('/')) {
      filename = filename.split('/').pop();
    }
    
    // Build Railway backend path for legacy support
    const path = getCategoryImagePath(filename);
    if (import.meta.env.DEV) {
      console.log(`[Transform] ⚠️ CategoryHeroImage (legacy filename - needs re-upload): ${category.heroImage} → ${filename} → ${path}`);
      console.log(`[Transform] 💡 Tip: Re-upload this image from the dashboard to get a Cloudinary URL`);
    }
    return path;
  })() : categoryImage;
  
  return {
    ...category,
    models: categoryModels,
    // Category images - extract filenames from paths if needed
    image: categoryImage,
    heroImage: categoryHeroImage,
  };
}

