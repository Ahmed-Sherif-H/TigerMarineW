/**
 * Hide/show catalog models without a backend schema change.
 *
 * Prisma rejects unknown fields (e.g. isHidden). The flag is stored inside
 * the existing `specs` JSON using a reserved key, then stripped from public
 * spec displays.
 */

import { isUpcomingModel } from './upcomingModelData';

export const HIDDEN_SPEC_KEY = '__tmHidden';

function specValueMeansHidden(value) {
  if (value === true || value === 1) return true;
  const normalized = String(value ?? '').trim().toLowerCase();
  return normalized === '1' || normalized === 'true' || normalized === 'yes' || normalized === 'hidden';
}

function specsContainHiddenFlag(specs) {
  if (!specs) return false;
  if (Array.isArray(specs)) {
    return specs.some(
      (row) =>
        row &&
        (row.key === HIDDEN_SPEC_KEY || row.id === HIDDEN_SPEC_KEY) &&
        specValueMeansHidden(row.value)
    );
  }
  if (typeof specs === 'object') {
    return specValueMeansHidden(specs[HIDDEN_SPEC_KEY]);
  }
  return false;
}

/** True when this model should be omitted from the public website. */
export function isHiddenModel(model) {
  if (!model) return false;
  if (model.isHidden === true) return true;
  return specsContainHiddenFlag(model.specs);
}

/** Models visitors should see in menus, listings, and category pages. */
export function isPublicCatalogModel(model) {
  return !!model && !isUpcomingModel(model) && !isHiddenModel(model);
}

export function stripHiddenSpec(specs) {
  if (!specs) return specs;
  if (Array.isArray(specs)) {
    return specs.filter((row) => row?.key !== HIDDEN_SPEC_KEY && row?.id !== HIDDEN_SPEC_KEY);
  }
  if (typeof specs === 'object') {
    const next = { ...specs };
    delete next[HIDDEN_SPEC_KEY];
    return next;
  }
  return specs;
}

export function setHiddenOnSpecs(specs, hidden) {
  if (Array.isArray(specs)) {
    const without = specs.filter((row) => row?.key !== HIDDEN_SPEC_KEY && row?.id !== HIDDEN_SPEC_KEY);
    if (!hidden) return without;
    return [...without, { key: HIDDEN_SPEC_KEY, value: '1' }];
  }

  const next = specs && typeof specs === 'object' ? { ...specs } : {};
  if (hidden) {
    next[HIDDEN_SPEC_KEY] = '1';
  } else {
    delete next[HIDDEN_SPEC_KEY];
  }
  return next;
}

export function setHiddenOnModelData(modelData, hidden) {
  if (!modelData) return modelData;
  return {
    ...modelData,
    specs: setHiddenOnSpecs(modelData.specs, hidden),
  };
}

export function visibleSpecEntries(specs) {
  if (!specs || typeof specs !== 'object' || Array.isArray(specs)) return [];
  return Object.entries(specs).filter(([key]) => key !== HIDDEN_SPEC_KEY);
}
