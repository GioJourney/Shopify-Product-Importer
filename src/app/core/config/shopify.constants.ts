/** Default Shopify Admin API version used when the user hasn't overridden it. */
export const DEFAULT_API_VERSION = '2026-04';

/** Access scopes the app needs on the connected Shopify store to import products. */
export const REQUIRED_SCOPES = [
  'write_products',
  'read_products',
  'write_inventory',
  'read_inventory',
  'write_files',
] as const;
