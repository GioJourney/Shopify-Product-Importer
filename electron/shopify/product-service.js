const path = require('path');
const { ShopifyGraphqlClient } = require('./graphql-client');
const { uploadLocalImage } = require('./media-uploader');
const { resolveImageFile } = require('../services/image-service');

const PRODUCT_SET = `
mutation productSet($input: ProductSetInput!, $synchronous: Boolean!) {
  productSet(input: $input, synchronous: $synchronous) {
    product { id title handle status }
    userErrors { field message }
  }
}`;

function buildProductOptions(product) {
  const optionValues = new Map();

  for (const variant of product.variants) {
    for (const option of variant.options) {
      if (!optionValues.has(option.name)) optionValues.set(option.name, []);
      const values = optionValues.get(option.name);
      if (!values.includes(option.value)) values.push(option.value);
    }
  }

  if (optionValues.size === 0) return undefined;

  let position = 1;
  return Array.from(optionValues.entries()).map(([name, values]) => ({
    name,
    position: position++,
    values: values.map((value) => ({ name: value })),
  }));
}

function toVariantSetInput(variant) {
  const input = {
    price: String(variant.price),
    barcode: variant.barcode || undefined,
    inventoryPolicy: variant.inventoryPolicy || 'DENY',
    taxable: variant.taxable,
    inventoryItem: {
      sku: variant.sku || undefined,
      tracked: true,
      requiresShipping: variant.requiresShipping,
    },
  };

  if (variant.compareAtPrice !== null && variant.compareAtPrice !== undefined) {
    input.compareAtPrice = String(variant.compareAtPrice);
  }

  if (variant.options.length) {
    input.optionValues = variant.options.map((option) => ({
      optionName: option.name,
      name: option.value,
    }));
  }

  return input;
}

async function buildFiles(client, product, imageFolder) {
  const files = [];
  for (const fileName of product.images) {
    const fullPath = resolveImageFile(imageFolder, fileName);
    if (!fullPath) continue;
    const resourceUrl = await uploadLocalImage(client, fullPath);
    files.push({
      originalSource: resourceUrl,
      contentType: 'IMAGE',
      alt: path.parse(fileName).name,
      filename: fileName,
    });
  }
  return files;
}

function toProductSetInput(product, files) {
  const input = {
    handle: product.handle,
    title: product.title,
    descriptionHtml: product.bodyHtml || undefined,
    vendor: product.vendor || undefined,
    productType: product.productType || undefined,
    tags: product.tags || [],
    status: product.status || 'DRAFT',
    seo:
      product.seoTitle || product.seoDescription
        ? { title: product.seoTitle || undefined, description: product.seoDescription || undefined }
        : undefined,
    variants: product.variants.map(toVariantSetInput),
  };

  const productOptions = buildProductOptions(product);
  if (productOptions) input.productOptions = productOptions;
  if (files.length) input.files = files;

  return input;
}

async function createProductWithVariantsAndImages({ settings, product, imageFolder }) {
  const client = new ShopifyGraphqlClient(settings);

  const files = await buildFiles(client, product, imageFolder);
  const input = toProductSetInput(product, files);

  const result = await client.request(PRODUCT_SET, { input, synchronous: true });

  const productSet = result.productSet;
  if (productSet.userErrors?.length) {
    throw new Error(productSet.userErrors.map((error) => error.message).join(', '));
  }

  return productSet.product;
}

module.exports = { createProductWithVariantsAndImages };
