const fs = require('fs');
const path = require('path');

const SUPPORTED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp']);

function listImages(imageFolder) {
  if (!imageFolder || !fs.existsSync(imageFolder)) return [];
  return fs
    .readdirSync(imageFolder)
    .filter((file) => SUPPORTED_EXTENSIONS.has(path.extname(file).toLowerCase()))
    .map((file) => ({ fileName: file, fullPath: path.join(imageFolder, file) }));
}

function resolveImageFile(imageFolder, fileName) {
  if (!fileName || !imageFolder) return null;
  const directPath = path.join(imageFolder, fileName);
  if (fs.existsSync(directPath)) return directPath;

  const images = listImages(imageFolder);
  const match = images.find((image) => image.fileName.toLowerCase() === fileName.toLowerCase());
  return match?.fullPath ?? null;
}

function autoMatchImagesBySku(imageFolder, sku) {
  if (!sku) return [];
  const normalizedSku = sku.toLowerCase();
  return listImages(imageFolder)
    .filter((image) => image.fileName.toLowerCase().startsWith(normalizedSku))
    .map((image) => image.fullPath);
}

function validateImages(rows, imageFolder) {
  const errors = [];
  const warnings = [];

  for (const row of rows) {
    const declaredImages = row.imageFiles.length ? row.imageFiles : [];
    const matchedImages = declaredImages.length
      ? declaredImages.map((file) => resolveImageFile(imageFolder, file)).filter(Boolean)
      : autoMatchImagesBySku(imageFolder, row.sku);

    for (const fileName of declaredImages) {
      if (!resolveImageFile(imageFolder, fileName)) {
        errors.push({ rowNumber: row.rowNumber, field: 'image_files', message: `Immagine non trovata: ${fileName}` });
      }
    }

    if (matchedImages.length === 0) {
      warnings.push({ rowNumber: row.rowNumber, field: 'image_files', message: 'Nessuna immagine trovata per il prodotto/variante.' });
    }
  }

  return { errors, warnings };
}

module.exports = { listImages, resolveImageFile, autoMatchImagesBySku, validateImages };
