export type LanguageCode = 'it' | 'en';

/** Selectable UI languages, in display order. */
export const LANGUAGES = [
  { code: 'it', shortLabel: 'IT', label: 'Italiano' },
  { code: 'en', shortLabel: 'EN', label: 'English' },
] as const;

/** localStorage key under which the chosen language is persisted. */
export const LANGUAGE_STORAGE_KEY = 'shopify-product-importer-language';

export const DEFAULT_LANGUAGE: LanguageCode = 'it';
