/**
 * Upcoming model content — Home teaser + /models/upcoming
 *
 * Persists on a dedicated Models API record using ONLY fields the backend schema
 * already has (Prisma strips/rejects unknown fields like isUpcoming).
 *
 * Field map:
 *   name                 → fixed "__Upcoming Model Slot__" (identity + hide from catalog)
 *   section2Title        → public display name
 *   section2Description  → JSON meta { homeSectionTitle, detailModelId }
 *   shortDescription     → home/hero teaser
 *   description          → upcoming page body
 *   imageFile            → home card image
 *   heroImageFile        → upcoming page hero
 *   galleryFiles         → upcoming page gallery
 */

export const UPCOMING_MODEL_SLOT_NAME = '__Upcoming Model Slot__';

const META_PREFIX = '__TM_UPCOMING__';

export const DEFAULT_UPCOMING_DISPLAY = {
  homeSectionTitle: 'Our Upcoming Model',
  name: '',
  shortDescription: '',
  description: '',
  homeImage: '',
  heroImage: '',
  galleryImages: [],
  detailModelId: null,
  configured: false,
};

export function emptyUpcomingForm() {
  return {
    modelId: null,
    homeSectionTitle: 'Our Upcoming Model',
    homeImage: '',
    name: '',
    shortDescription: '',
    heroImage: '',
    description: '',
    galleryFiles: [],
    detailModelId: null,
  };
}

function parseMeta(section2Description) {
  const raw = typeof section2Description === 'string' ? section2Description.trim() : '';
  if (!raw) {
    return { homeSectionTitle: DEFAULT_UPCOMING_DISPLAY.homeSectionTitle, detailModelId: null };
  }

  // Preferred: prefixed JSON
  if (raw.startsWith(META_PREFIX)) {
    try {
      const parsed = JSON.parse(raw.slice(META_PREFIX.length));
      return {
        homeSectionTitle: parsed.homeSectionTitle || DEFAULT_UPCOMING_DISPLAY.homeSectionTitle,
        detailModelId: parsed.detailModelId ?? null,
      };
    } catch {
      /* fall through */
    }
  }

  // Plain JSON object
  if (raw.startsWith('{')) {
    try {
      const parsed = JSON.parse(raw);
      return {
        homeSectionTitle: parsed.homeSectionTitle || DEFAULT_UPCOMING_DISPLAY.homeSectionTitle,
        detailModelId: parsed.detailModelId ?? null,
      };
    } catch {
      /* fall through */
    }
  }

  // Legacy: treat whole string as home section title
  return { homeSectionTitle: raw, detailModelId: null };
}

function encodeMeta(homeSectionTitle, detailModelId) {
  return (
    META_PREFIX +
    JSON.stringify({
      homeSectionTitle: homeSectionTitle || DEFAULT_UPCOMING_DISPLAY.homeSectionTitle,
      detailModelId: detailModelId || null,
    })
  );
}

/** True when this record is the dedicated upcoming slot (hidden from catalog). */
export function isUpcomingModel(model) {
  if (!model) return false;
  return String(model.name || '').trim() === UPCOMING_MODEL_SLOT_NAME;
}

/** Find the upcoming slot in a models list. */
export function findUpcomingModel(models) {
  if (!Array.isArray(models)) return null;
  return models.find(isUpcomingModel) || null;
}

export function getUpcomingDisplayName(model) {
  if (!model) return '';
  const fromSection = model.section2Title?.trim();
  if (fromSection) return fromSection;
  return '';
}

/** Map API model → display shape for Home + Upcoming page */
export function modelToUpcomingDisplay(model) {
  if (!model) {
    return { ...DEFAULT_UPCOMING_DISPLAY };
  }

  const meta = parseMeta(model.section2Description);
  const galleryImages =
    Array.isArray(model.galleryImages) && model.galleryImages.length > 0
      ? model.galleryImages
      : Array.isArray(model.galleryFiles) && model.galleryFiles.length > 0
        ? model.galleryFiles
        : [];

  return {
    homeSectionTitle: meta.homeSectionTitle,
    name: getUpcomingDisplayName(model),
    shortDescription: model.shortDescription || '',
    description: model.description || '',
    homeImage: model.image || model.imageFile || '',
    heroImage: model.heroImage || model.heroImageFile || '',
    galleryImages,
    detailModelId: meta.detailModelId,
    configured: true,
  };
}

/** Admin form from a loaded model record */
export function modelToUpcomingForm(model) {
  if (!model) return emptyUpcomingForm();

  const display = modelToUpcomingDisplay(model);
  return {
    modelId: model.id ?? null,
    homeSectionTitle: display.homeSectionTitle,
    homeImage: model.imageFile || model.image || '',
    name: display.name,
    shortDescription: display.shortDescription,
    heroImage: model.heroImageFile || model.heroImage || '',
    description: display.description,
    galleryFiles: Array.isArray(model.galleryFiles) ? [...model.galleryFiles] : [],
    detailModelId: display.detailModelId,
  };
}

/**
 * Build a clean create/update payload with ONLY known model fields.
 * Do not spread the full existing model — unknown keys break Prisma.
 */
export function buildUpcomingSavePayload(form, { existingModel = null, categories = [] } = {}) {
  const displayName = (form.name || '').trim() || 'New Model';
  const boatsCategory = categories.find((c) => c.mainGroup === 'boats');
  const fallbackCategory = categories[0];
  const categoryId =
    existingModel?.categoryId ?? boatsCategory?.id ?? fallbackCategory?.id ?? null;

  const payload = {
    name: UPCOMING_MODEL_SLOT_NAME,
    categoryId,
    section2Title: displayName,
    section2Description: encodeMeta(form.homeSectionTitle, form.detailModelId),
    shortDescription: form.shortDescription || '',
    description: form.description || '',
    imageFile: form.homeImage || '',
    heroImageFile: form.heroImage || '',
    contentImageFile: existingModel?.contentImageFile || '',
    galleryFiles: Array.isArray(form.galleryFiles) ? form.galleryFiles.filter(Boolean) : [],
    interiorFiles: existingModel?.interiorFiles || [],
    interiorMainImage: existingModel?.interiorMainImage || '',
    videoFiles: existingModel?.videoFiles || [],
    standardFeatures: existingModel?.standardFeatures || existingModel?.features || [],
    optionalFeatures: existingModel?.optionalFeatures || [],
    specs: existingModel?.specs || {},
  };

  if (existingModel?.id) {
    payload.id = existingModel.id;
  }

  return payload;
}

/** @deprecated use buildUpcomingSavePayload */
export function upcomingFormToModelPatch(existingModel, form) {
  return buildUpcomingSavePayload(form, { existingModel, categories: [] });
}

/** @deprecated use buildUpcomingSavePayload */
export function upcomingFormToCreatePayload(form, categories = []) {
  return buildUpcomingSavePayload(form, { existingModel: null, categories });
}

export function formatUpcomingSaveError(error) {
  const message = error?.message || String(error);
  if (message.includes('Unique constraint') && message.includes('categoryId')) {
    return (
      'A model with this internal name already exists in that category. ' +
      'Reload the Upcoming tab and click Save again — it should update the existing slot.'
    );
  }
  if (message.includes('Unknown arg') || message.includes('Unknown argument')) {
    return (
      'The server rejected an unknown field. Please refresh and try again with the latest frontend.'
    );
  }
  return message;
}
