const ERROR_CODES = {
  HANDLE_MISSING: 'HANDLE_MISSING',
  TITLE_REQUIRED: 'TITLE_REQUIRED',
  SKU_REQUIRED: 'SKU_REQUIRED',
  PRICE_INVALID: 'PRICE_INVALID',
  SKU_DUPLICATE: 'SKU_DUPLICATE',
  IMAGE_NOT_FOUND: 'IMAGE_NOT_FOUND',
  NO_IMAGE_FOR_PRODUCT: 'NO_IMAGE_FOR_PRODUCT',
  NO_READABLE_SHEETS: 'NO_READABLE_SHEETS',
  SHOP_DOMAIN_MISSING: 'SHOP_DOMAIN_MISSING',
  CREDENTIALS_MISSING: 'CREDENTIALS_MISSING',
  SHOPIFY_AUTH_FAILED: 'SHOPIFY_AUTH_FAILED',
  IMAGE_UPLOAD_FAILED: 'IMAGE_UPLOAD_FAILED',
};

function issue(code, message, extra = {}) {
  return { code, message, ...extra };
}

function codedError(code, message, params) {
  const error = new Error(message);
  error.code = code;
  if (params) error.params = params;
  return error;
}

function serializeError(error) {
  if (error && typeof error === 'object') {
    return {
      code: error.code ?? null,
      params: error.params ?? null,
      message: error.message ?? String(error),
    };
  }
  return { code: null, params: null, message: String(error) };
}

module.exports = { ERROR_CODES, issue, codedError, serializeError };
