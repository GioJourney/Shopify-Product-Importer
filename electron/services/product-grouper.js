function getVariantOptions(row) {
  const options = [];
  if (row.option1Name && row.option1Value)
    options.push({ name: row.option1Name, value: row.option1Value });
  if (row.option2Name && row.option2Value)
    options.push({ name: row.option2Name, value: row.option2Value });
  if (row.option3Name && row.option3Value)
    options.push({ name: row.option3Name, value: row.option3Value });
  return options;
}

function groupRowsByProduct(rows) {
  const products = new Map();

  for (const row of rows) {
    if (!products.has(row.handle)) {
      products.set(row.handle, {
        handle: row.handle,
        title: row.title,
        bodyHtml: row.bodyHtml,
        vendor: row.vendor,
        productType: row.productType,
        tags: row.tags,
        status: row.status,
        seoTitle: row.seoTitle,
        seoDescription: row.seoDescription,
        images: new Set(),
        variants: [],
      });
    }

    const product = products.get(row.handle);
    for (const image of row.imageFiles) product.images.add(image);

    product.variants.push({
      rowNumber: row.rowNumber,
      sku: row.sku,
      barcode: row.barcode,
      price: row.price,
      compareAtPrice: row.compareAtPrice,
      inventoryQuantity: row.inventoryQuantity,
      inventoryPolicy: row.inventoryPolicy,
      taxable: row.taxable,
      requiresShipping: row.requiresShipping,
      weight: row.weight,
      weightUnit: row.weightUnit,
      options: getVariantOptions(row),
      variantImage: row.variantImage,
    });
  }

  return Array.from(products.values()).map((product) => ({
    ...product,
    images: Array.from(product.images),
  }));
}

module.exports = { groupRowsByProduct };
