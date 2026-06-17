import type { LanguageCode } from './language';

/**
 * Stable backend error codes → localized templates. Keep the keys in sync with
 * `electron/shared/error-codes.js`. `{placeholders}` are filled from issue params.
 *
 * This map is the single source of truth for issue text: it powers both the
 * code-based translation path and the legacy message-matching fallback (used
 * when an error crosses the IPC boundary and loses its `code`).
 */
export const ERROR_MESSAGES: Record<LanguageCode, Record<string, string>> = {
  it: {
    HANDLE_MISSING: 'Handle mancante o non generabile.',
    TITLE_REQUIRED: 'Titolo obbligatorio.',
    SKU_REQUIRED: 'SKU obbligatorio.',
    PRICE_INVALID: 'Prezzo non valido.',
    SKU_DUPLICATE: 'SKU duplicato. Già presente alla riga {row}.',
    IMAGE_NOT_FOUND: 'Immagine non trovata: {file}',
    NO_IMAGE_FOR_PRODUCT: 'Nessuna immagine trovata per il prodotto/variante.',
    NO_READABLE_SHEETS: 'Il file non contiene fogli leggibili.',
    SHOP_DOMAIN_MISSING: 'Shop domain mancante.',
    CREDENTIALS_MISSING: 'Client ID e Client secret Shopify mancanti.',
    SHOPIFY_AUTH_FAILED: 'Autenticazione Shopify fallita (client credentials): {detail}',
    IMAGE_UPLOAD_FAILED: 'Upload immagine fallito: {file}',
  },
  en: {
    HANDLE_MISSING: 'Handle missing or could not be generated.',
    TITLE_REQUIRED: 'Title is required.',
    SKU_REQUIRED: 'SKU is required.',
    PRICE_INVALID: 'Price is invalid.',
    SKU_DUPLICATE: 'Duplicate SKU. Already present on row {row}.',
    IMAGE_NOT_FOUND: 'Image not found: {file}',
    NO_IMAGE_FOR_PRODUCT: 'No image found for the product/variant.',
    NO_READABLE_SHEETS: 'The file does not contain readable sheets.',
    SHOP_DOMAIN_MISSING: 'Shop domain is missing.',
    CREDENTIALS_MISSING: 'Shopify Client ID and Client secret are missing.',
    SHOPIFY_AUTH_FAILED: 'Shopify authentication failed (client credentials): {detail}',
    IMAGE_UPLOAD_FAILED: 'Image upload failed: {file}',
  },
};
