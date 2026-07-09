import { upcomingModels } from '../data/models';

const STATIC = upcomingModels[0] || {};

export const DEFAULT_UPCOMING_GALLERY = [
  '/images/DJI_0154.jpg',
];

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

/** True when this model record is the dedicated upcoming slot (hidden from catalog). */
export function isUpcomingModel(model) {
  if (!model) return false;
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
    name: model.name || DEFAULT_UPCOMING_DISPLAY.name,
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
  return {
    ...existingModel,
    isUpcoming: true,
    upcomingHomeTitle: form.homeSectionTitle || '',
    upcomingDetailModelId: form.detailModelId || null,
    name: form.name || existingModel?.name || 'New Upcoming Model',
    shortDescription: form.shortDescription || '',
    description: form.description || '',
    imageFile: form.homeImage || '',
    heroImageFile: form.heroImage || '',
    galleryFiles: form.galleryFiles || [],
    section2Title: form.name || existingModel?.section2Title,
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
