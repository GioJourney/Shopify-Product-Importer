const fs = require('fs');
const path = require('path');
const { readExcelFile } = require('./excel-reader');
const { validateRows } = require('./validator');
const { groupRowsByProduct } = require('./product-grouper');
const { createProductWithVariantsAndImages } = require('../shopify/product-service');
const { clearTokenCache } = require('../shopify/graphql-client');
const { serializeError } = require('../shared/error-codes');

function ensureReportsFolder(baseFolder) {
  const reportsFolder = path.join(baseFolder, 'reports');
  if (!fs.existsSync(reportsFolder)) fs.mkdirSync(reportsFolder, { recursive: true });
  return reportsFolder;
}

function writeReport(baseFolder, result) {
  const reportsFolder = ensureReportsFolder(baseFolder);
  const filePath = path.join(
    reportsFolder,
    `import-report-${new Date().toISOString().replace(/[:.]/g, '-')}.json`,
  );
  fs.writeFileSync(filePath, JSON.stringify(result, null, 2), 'utf8');
  return filePath;
}

async function previewImport({ excelPath, imageFolder }) {
  const rows = readExcelFile(excelPath);
  const validation = validateRows(rows, imageFolder);
  const products = groupRowsByProduct(rows);

  return {
    valid: validation.valid,
    totalRows: rows.length,
    totalProducts: products.length,
    totalVariants: rows.length,
    errors: validation.errors,
    warnings: validation.warnings,
    products: products.map((product) => ({
      handle: product.handle,
      title: product.title,
      status: product.status,
      images: product.images.length,
      variants: product.variants.length,
    })),
  };
}

async function runImport(
  { excelPath, imageFolder, settings, dryRun = false },
  onProgress = () => {},
) {
  const preview = await previewImport({ excelPath, imageFolder });
  if (!preview.valid) {
    return { ok: false, dryRun, preview, imported: [], failed: [], reportPath: null };
  }

  const rows = readExcelFile(excelPath);
  const products = groupRowsByProduct(rows);

  if (dryRun) {
    const result = { ok: true, dryRun: true, preview, imported: [], failed: [] };
    result.reportPath = writeReport(path.dirname(excelPath), result);
    return result;
  }

  clearTokenCache();

  const imported = [];
  const failed = [];

  for (let index = 0; index < products.length; index += 1) {
    const product = products[index];
    onProgress({ current: index + 1, total: products.length, title: product.title });

    try {
      const shopifyProduct = await createProductWithVariantsAndImages({
        settings,
        product,
        imageFolder,
      });
      imported.push({ handle: product.handle, title: product.title, shopifyProduct });
    } catch (error) {
      failed.push({ handle: product.handle, title: product.title, error: serializeError(error) });
    }
  }

  const result = { ok: failed.length === 0, dryRun: false, preview, imported, failed };
  result.reportPath = writeReport(path.dirname(excelPath), result);
  return result;
}

module.exports = { previewImport, runImport };
