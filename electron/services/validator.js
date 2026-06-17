const { REQUIRED_COLUMNS } = require('../shared/columns');
const { ERROR_CODES, issue } = require('../shared/error-codes');
const { validateImages } = require('./image-service');

function validateRequiredFields(rows) {
  const errors = [];

  for (const row of rows) {
    if (!row.handle)
      errors.push(
        issue(ERROR_CODES.HANDLE_MISSING, 'Handle mancante o non generabile.', {
          rowNumber: row.rowNumber,
          field: 'handle',
        }),
      );
    if (!row.title)
      errors.push(
        issue(ERROR_CODES.TITLE_REQUIRED, 'Titolo obbligatorio.', {
          rowNumber: row.rowNumber,
          field: 'title',
        }),
      );
    if (!row.sku)
      errors.push(
        issue(ERROR_CODES.SKU_REQUIRED, 'SKU obbligatorio.', {
          rowNumber: row.rowNumber,
          field: 'sku',
        }),
      );
    if (row.price === null || row.price < 0)
      errors.push(
        issue(ERROR_CODES.PRICE_INVALID, 'Prezzo non valido.', {
          rowNumber: row.rowNumber,
          field: 'price',
        }),
      );
  }

  return errors;
}

function validateDuplicates(rows) {
  const errors = [];
  const skuMap = new Map();

  for (const row of rows) {
    if (!row.sku) continue;
    if (skuMap.has(row.sku)) {
      const originalRow = skuMap.get(row.sku);
      errors.push(
        issue(ERROR_CODES.SKU_DUPLICATE, `SKU duplicato. Già presente alla riga ${originalRow}.`, {
          rowNumber: row.rowNumber,
          field: 'sku',
          params: { row: originalRow },
        }),
      );
    } else {
      skuMap.set(row.sku, row.rowNumber);
    }
  }

  return errors;
}

function validateRows(rows, imageFolder) {
  const errors = [...validateRequiredFields(rows), ...validateDuplicates(rows)];
  const warnings = [];

  if (imageFolder) {
    const imageValidation = validateImages(rows, imageFolder);
    errors.push(...imageValidation.errors);
    warnings.push(...imageValidation.warnings);
  }

  return {
    valid: errors.length === 0,
    requiredColumns: REQUIRED_COLUMNS,
    errors,
    warnings,
  };
}

module.exports = { validateRows };
