const { REQUIRED_COLUMNS } = require('../shared/columns');
const { validateImages } = require('./image-service');

function validateRequiredFields(rows) {
  const errors = [];

  for (const row of rows) {
    if (!row.handle)
      errors.push({
        rowNumber: row.rowNumber,
        field: 'handle',
        message: 'Handle mancante o non generabile.',
      });
    if (!row.title)
      errors.push({ rowNumber: row.rowNumber, field: 'title', message: 'Titolo obbligatorio.' });
    if (!row.sku)
      errors.push({ rowNumber: row.rowNumber, field: 'sku', message: 'SKU obbligatorio.' });
    if (row.price === null || row.price < 0)
      errors.push({ rowNumber: row.rowNumber, field: 'price', message: 'Prezzo non valido.' });
  }

  return errors;
}

function validateDuplicates(rows) {
  const errors = [];
  const skuMap = new Map();

  for (const row of rows) {
    if (!row.sku) continue;
    if (skuMap.has(row.sku)) {
      errors.push({
        rowNumber: row.rowNumber,
        field: 'sku',
        message: `SKU duplicato. Già presente alla riga ${skuMap.get(row.sku)}.`,
      });
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
