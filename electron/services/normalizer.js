function toStringValue(value) {
  if (value === undefined || value === null) return '';
  return String(value).trim();
}

function toNumberValue(value) {
  if (value === undefined || value === null || value === '') return null;
  const normalized = String(value).trim().replace(',', '.');
  const number = Number(normalized);
  return Number.isFinite(number) ? number : null;
}

function toBooleanValue(value, defaultValue = false) {
  if (value === undefined || value === null || value === '') return defaultValue;
  const normalized = String(value).trim().toLowerCase();
  return ['true', 'yes', 'y', 'si', 'sì', '1'].includes(normalized);
}

function normalizeHandle(value) {
  return toStringValue(value)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function normalizeTags(value) {
  return toStringValue(value)
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function normalizeStatus(value) {
  const status = toStringValue(value).toUpperCase();
  if (['ACTIVE', 'DRAFT', 'ARCHIVED'].includes(status)) return status;
  return 'DRAFT';
}

function normalizeRow(row, rowNumber) {
  const handle = normalizeHandle(row.handle || row.title);
  return {
    rowNumber,
    handle,
    title: toStringValue(row.title),
    bodyHtml: toStringValue(row.body_html),
    vendor: toStringValue(row.vendor),
    productType: toStringValue(row.product_type),
    tags: normalizeTags(row.tags),
    status: normalizeStatus(row.status),
    sku: toStringValue(row.sku),
    barcode: toStringValue(row.barcode),
    price: toNumberValue(row.price),
    compareAtPrice: toNumberValue(row.compare_at_price),
    inventoryQuantity: toNumberValue(row.inventory_quantity) ?? 0,
    inventoryPolicy: toStringValue(row.inventory_policy).toUpperCase() || 'DENY',
    requiresShipping: toBooleanValue(row.requires_shipping, true),
    taxable: toBooleanValue(row.taxable, true),
    weight: toNumberValue(row.weight),
    weightUnit: toStringValue(row.weight_unit).toUpperCase() || 'KILOGRAMS',
    option1Name: toStringValue(row.option1_name),
    option1Value: toStringValue(row.option1_value),
    option2Name: toStringValue(row.option2_name),
    option2Value: toStringValue(row.option2_value),
    option3Name: toStringValue(row.option3_name),
    option3Value: toStringValue(row.option3_value),
    imageFiles: toStringValue(row.image_files)
      .split(',')
      .map((name) => name.trim())
      .filter(Boolean),
    variantImage: toStringValue(row.variant_image),
    seoTitle: toStringValue(row.seo_title),
    seoDescription: toStringValue(row.seo_description),
    importAction: toStringValue(row.import_action).toUpperCase() || 'CREATE'
  };
}

module.exports = {
  normalizeRow,
  normalizeHandle,
  toStringValue,
  toNumberValue,
  toBooleanValue
};
