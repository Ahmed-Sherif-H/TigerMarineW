/**
 * Customizer Configuration
 * Maps model names to their customizer folder names
 */

const FOLDER_BY_KEY = {
  TL950: 'TopLine950',
  TL850: 'TopLine850',
  TL750: 'TopLine850',
  TL650: 'TopLine650',
  PL620: 'ProLine550',
  PL550: 'ProLine620',
  SL520: 'SportLine520',
  SL480: 'SportLine480',
  OP850: 'Open650',
  OP750: 'Open750',
  OP650: 'Open850',
  ML38: 'TopLine950',
};

const NAME_TO_KEY = {
  TL950: 'TL950',
  'TopLine 950': 'TL950',
  TopLine950: 'TL950',
  TL850: 'TL850',
  'TopLine 850': 'TL850',
  TopLine850: 'TL850',
  TL750: 'TL750',
  'TopLine 750': 'TL750',
  TopLine750: 'TL750',
  TL650: 'TL650',
  'TopLine 650': 'TL650',
  TopLine650: 'TL650',
  PL620: 'PL620',
  'ProLine 620': 'PL620',
  ProLine620: 'PL620',
  PL550: 'PL550',
  'ProLine 550': 'PL550',
  ProLine550: 'PL550',
  SL520: 'SL520',
  'SportLine 520': 'SL520',
  SportLine520: 'SL520',
  SL480: 'SL480',
  'SportLine 480': 'SL480',
  SportLine480: 'SL480',
  OP850: 'OP850',
  'Open 850': 'OP850',
  Open850: 'OP850',
  OP750: 'OP750',
  'Open 750': 'OP750',
  Open750: 'OP750',
  OP650: 'OP650',
  'Open 650': 'OP650',
  Open650: 'OP650',
  ML38: 'ML38',
  'MaxLine 38': 'ML38',
};

export const customizerFolders = {
  TL950: 'TopLine950',
  TL850: 'TopLine850',
  TL750: 'TopLine850',
  TL650: 'TopLine650',
  PL620: 'ProLine550',
  PL550: 'ProLine620',
  SL520: 'SportLine520',
  SL480: 'SportLine480',
  OP850: 'Open650',
  OP750: 'Open750',
  OP650: 'Open850',
  ML38: 'TopLine950',
};

export const customizerParts = [
  { key: 'base', label: 'Base', folder: 'Base', folderVariants: ['Base'] },
  { key: 'deckFloor', label: 'Deck Floor', folder: 'Deck Floor', folderVariants: ['Deck Floor', 'Deck floor'] },
  { key: 'fiberglass', label: 'Fiberglass', folder: 'Fiberglass', folderVariants: ['Fiberglass'] },
  { key: 'sideFender', label: 'Side Fender', folder: 'Side Fender', folderVariants: ['Side Fender', 'Side fender'] },
  { key: 'tube', label: 'Tube', folder: 'Tube', folderVariants: ['Tube'] },
  { key: 'tubeDecoration', label: 'Tube Decoration', folder: 'Tube decoration', folderVariants: ['Tube decoration', 'Tube Decoration'] },
  { key: 'upholestry', label: 'Upholstery', folder: 'Upholestry', folderVariants: ['Upholestry', 'Upholstery'] }
];

export function resolveCustomizerKey(modelName) {
  const raw = String(modelName || '').trim();
  if (!raw) return '';
  if (NAME_TO_KEY[raw]) return NAME_TO_KEY[raw];
  const collapsed = raw.replace(/\s+/g, '').toLowerCase();
  const match = Object.keys(NAME_TO_KEY).find((key) => key.replace(/\s+/g, '').toLowerCase() === collapsed);
  if (match) return NAME_TO_KEY[match];
  return raw;
}

export const getCustomizerFolder = (modelName) => {
  const disabledModels = ['Infinity 280'];
  if (disabledModels.includes(modelName)) return null;

  const key = resolveCustomizerKey(modelName);
  if (disabledModels.includes(key)) return null;

  const folder = FOLDER_BY_KEY[key] || customizerFolders[key];
  if (!folder) return null;
  return `/Customizer-images/${folder}`;
};

export const getBaseImage = (modelName) => {
  const folder = getCustomizerFolder(modelName);
  if (!folder) return null;
  return `${folder}/Base/Boat - Base.webp`;
};

export const getPartImage = (modelName, partKey, colorName) => {
  const folder = getCustomizerFolder(modelName);
  if (!folder) return null;

  const part = customizerParts.find((p) => p.key === partKey);
  if (!part) return null;

  let filename = '';

  if (partKey === 'base') {
    filename = 'Boat - Base.webp';
  } else if (partKey === 'deckFloor') {
    filename = `deck floor - ${colorName}.webp`;
  } else if (partKey === 'fiberglass') {
    filename = `Fiberglass - ${colorName}.webp`;
  } else if (partKey === 'sideFender') {
    filename = `Fender - ${colorName}.webp`;
  } else if (partKey === 'tube') {
    filename = `Tube - ${colorName}.webp`;
  } else if (partKey === 'tubeDecoration') {
    filename = `Tube decoration - ${colorName}.webp`;
  } else if (partKey === 'upholestry') {
    if (colorName === 'Baige') {
      filename = `Upholestry - Baige.webp`;
    } else {
      filename = `Upholestry - ${colorName}.webp`;
    }
  }

  return `${folder}/${part.folder}/${filename}`;
};
