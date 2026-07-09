import { upcomingModels } from '../data/models';

const STATIC = upcomingModels[0] || {};

/** Fixed DB name — avoids unique (categoryId, name) clashes with catalog models like Infinity 280. */
export const UPCOMING_MODEL_SLOT_NAME = '__Upcoming Model Slot__';

export const DEFAULT_UPCOMING_GALLERY = ['/images/DJI_0154.jpg'];

export const DEFAULT_UPCOMING_DISPLAY = {
  homeSectionTitle: 'Our Upcoming Model',
  name: STATIC.name || 'New Model',
  shortDescription: STATIC.shortDescription || STATIC.description || '',
  description: STATIC.description || '',
  homeImage: STATIC.image || STATIC.heroImage || DEFAULT_UPCOMING_GALLERY[0],
  heroImage: STATIC.heroImage || STATIC.image || DEFAULT_UPCOMING_GALLERY[0],
  galleryImages: [...DEFAULT_UPCOMING_GALLERY],
  detailModelId: null,
};

/** Public-facing name shown on Home / Upcoming page. */
export function getUpcomingDisplayName(model) {
  if (!model) return DEFAULT_UPCOMING_DISPLAY.name;
  const custom = model.upcomingDisplayName?.trim();
  if (custom) return custom;
  const raw = model.name?.trim();
  if (raw && raw !== UPCOMING_MODEL_SLOT_NAME) return raw;
  return DEFAULT_UPCOMING_DISPLAY.name;
}

/** True when this model record is the dedicated upcoming slot (hidden from catalog). */
export function isUpcomingModel(model) {
  if (!model) return false;
  if (model.name === UPCOMING_MODEL_SLOT_NAME) return true;
  const flag = model.isUpcoming;
  return flag === true || flag === 'true' || flag === 1 || flag === '1';
}

/** The single model marked as upcoming in the database. */
export function findUpcomingModel(models) {
  if (!Array.isArray(models)) return null;
  return models.find(isUpcomingModel) || null;
}

/** Map API/static model into display shape for Home + Upcoming page */
export function modelToUpcomingDisplay(model) {
  if (!model) {
    return { ...DEFAULT_UPCOMING_DISPLAY };
  }

  const galleryImages =
    Array.isArray(model.galleryImages) && model.galleryImages.length > 0
      ? model.galleryImages
      : Array.isArray(model.galleryFiles) && model.galleryFiles.length > 0
        ? model.galleryFiles
        : DEFAULT_UPCOMING_GALLERY;

  const detailId = model.upcomingDetailModelId ?? model.detailModelId ?? null;

  return {
    homeSectionTitle:
      model.upcomingHomeTitle ||
      model.section2Title ||
      DEFAULT_UPCOMING_DISPLAY.homeSectionTitle,
    name: getUpcomingDisplayName(model),
    shortDescription:
      model.shortDescription ||
      model.description ||
      DEFAULT_UPCOMING_DISPLAY.shortDescription,
    description: model.description || DEFAULT_UPCOMING_DISPLAY.description,
    homeImage: model.image || model.imageFile || DEFAULT_UPCOMING_DISPLAY.homeImage,
    heroImage: model.heroImage || model.heroImageFile || DEFAULT_UPCOMING_DISPLAY.heroImage,
    galleryImages,
    detailModelId: detailId,
  };
}

/** Admin form defaults from a loaded model record */
export function modelToUpcomingForm(model) {
  const display = modelToUpcomingDisplay(model);
  return {
    modelId: model?.id ?? null,
    homeSectionTitle: display.homeSectionTitle,
    homeImage: model?.imageFile || model?.image || '',
    name: display.name,
    shortDescription: display.shortDescription,
    heroImage: model?.heroImageFile || model?.heroImage || '',
    description: display.description,
    galleryFiles: Array.isArray(model?.galleryFiles) ? [...model.galleryFiles] : [],
    detailModelId: display.detailModelId,
  };
}

export function upcomingFormToModelPatch(existingModel, form) {
  const displayName = (form.name || '').trim() || 'New Model';

  return {
    ...existingModel,
    isUpcoming: true,
    name: UPCOMING_MODEL_SLOT_NAME,
    upcomingDisplayName: displayName,
    upcomingHomeTitle: form.homeSectionTitle || '',
    upcomingDetailModelId: form.detailModelId || null,
    shortDescription: form.shortDescription || '',
    description: form.description || '',
    imageFile: form.homeImage || '',
    heroImageFile: form.heroImage || '',
    galleryFiles: form.galleryFiles || [],
    section2Title: displayName,
  };
}

/** Minimal payload when creating a new dedicated upcoming model record. */
export function upcomingFormToCreatePayload(form, categories = []) {
  const boatsCategory = categories.find((c) => c.mainGroup === 'boats');
  const fallbackCategory = categories[0];

  return upcomingFormToModelPatch(
    {
      categoryId: boatsCategory?.id ?? fallbackCategory?.id ?? null,
      specs: {},
      standardFeatures: [],
      optionalFeatures: [],
    },
    form
  );
}

export function formatUpcomingSaveError(error) {
  const message = error?.message || String(error);
  if (message.includes('Unique constraint') && message.includes('categoryId')) {
    return (
      'Could not create the upcoming slot — a conflicting record may already exist. ' +
      'Reload the page and try Save again. The display name you enter can match a catalog model ' +
      '(e.g. Infinity 280); only the internal slot name must be unique.'
    );
  }
  return message;
}
