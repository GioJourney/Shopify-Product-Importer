const REQUIRED_COLUMNS = ['handle', 'title', 'sku', 'price'];

const OPTIONAL_COLUMNS = [
  'body_html',
  'vendor',
  'product_type',
  'tags',
  'status',
  'barcode',
  'compare_at_price',
  'inventory_quantity',
  'inventory_policy',
  'requires_shipping',
  'taxable',
  'weight',
  'weight_unit',
  'option1_name',
  'option1_value',
  'option2_name',
  'option2_value',
  'option3_name',
  'option3_value',
  'image_files',
  'variant_image',
  'seo_title',
  'seo_description',
  'import_action'
];

module.exports = { REQUIRED_COLUMNS, OPTIONAL_COLUMNS };
