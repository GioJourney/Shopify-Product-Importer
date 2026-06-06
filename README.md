# Shopify Product Importer

Shopify Product Importer is a desktop app for importing Shopify products from an Excel, LibreOffice, or CSV file. It can also upload product images from a local folder.

The app is built with Electron, Angular, PrimeNG, and Node.js. It is meant for store owners or operators who want a simple way to prepare products in a spreadsheet, preview the data, and then send it to Shopify.

## What The App Does

- Imports products from `.xlsx`, `.xls`, `.ods`, or `.csv` files.
- Lets you choose a local image folder.
- Connects to Shopify using your app Client ID and Client secret.
- Saves Shopify settings locally on your computer.
- Checks required product fields before importing.
- Finds duplicate SKUs.
- Checks for missing images.
- Supports image matching from the `image_files` column.
- Can automatically match images by SKU when `image_files` is empty.
- Shows a preview before importing.
- Supports a test run without saving products in Shopify.
- Imports products through the Shopify GraphQL Admin API.
- Uploads local images to Shopify.
- Saves a JSON report after each run.
- Supports Italian and English in the app interface.

## Who This Is For

Use this app if you manage product data in spreadsheets and want to upload it to Shopify without manually creating each product.

This tool is useful when:

- You receive product lists from suppliers.
- You prepare products in Excel or LibreOffice.
- You keep product images in folders on your computer.
- You want to check the data before sending it to Shopify.
- You want to test an import before creating products.

## Requirements

Before using the app, you need:

- A Shopify store.
- A Shopify app created in the Shopify Dev Dashboard.
- The app installed on your store.
- The Shopify app Client ID.
- The Shopify app Client secret.
- An Excel, LibreOffice, or CSV file with your products.
- Optional: a folder containing product images.

Your Shopify app must have these Admin API scopes:

```txt
write_products
read_products
write_inventory
read_inventory
write_files
```

If the app says some permissions are missing, add the scopes in Shopify, reinstall the app on your store, and test the connection again.

## Shopify Authentication

The importer uses Shopify client credentials authentication.

You do not paste a permanent `shpat_` access token into the app. Instead, the app uses your Client ID and Client secret to request an access token from Shopify when needed.

In the app you will enter:

- Store address, for example `your-store.myshopify.com`
- Client ID
- Client secret
- Shopify API version, usually left as the default

The Client secret is saved locally. When possible, Electron stores it using the operating system encryption support.

## Preparing The Spreadsheet

A starter template is included here:

```txt
docs/shopify-products-template.xlsx
```

The required columns are:

| Column | Required | Notes |
|---|---:|---|
| `handle` | Yes | Product handle. If missing, the app tries to generate it from the title. |
| `title` | Yes | Product title. |
| `sku` | Yes | Variant SKU. Each SKU must be unique. |
| `price` | Yes | Product or variant price. Both `24.90` and `24,90` are accepted. |

Common optional columns:

| Column | What It Does |
|---|---|
| `body_html` | Product description as HTML. |
| `vendor` | Product vendor or brand. |
| `product_type` | Shopify product type. |
| `tags` | Tags separated by commas. |
| `status` | `DRAFT`, `ACTIVE`, or `ARCHIVED`. Use `DRAFT` for safer testing. |
| `compare_at_price` | Compare-at price. |
| `inventory_quantity` | Starting inventory quantity. |
| `inventory_policy` | `DENY` or `CONTINUE`. |
| `requires_shipping` | `TRUE` or `FALSE`. |
| `taxable` | `TRUE` or `FALSE`. |
| `weight` | Product weight. |
| `weight_unit` | `GRAMS`, `KILOGRAMS`, `OUNCES`, or `POUNDS`. |
| `option1_name` | First option name, for example `Size`. |
| `option1_value` | First option value, for example `M`. |
| `option2_name` | Second option name. |
| `option2_value` | Second option value. |
| `option3_name` | Third option name. |
| `option3_value` | Third option value. |
| `image_files` | Image file names separated by commas. |
| `variant_image` | Image for a specific variant. |
| `seo_title` | SEO title. |
| `seo_description` | SEO description. |

More details are available in:

```txt
docs/SHOPIFY_COLUMNS.md
```

## Preparing Images

You can use a local folder for images.

Supported image formats:

```txt
.jpg
.jpeg
.png
.webp
```

Recommended folder structure:

```txt
product-import/
  products.xlsx
  images/
    shirt-black-1.jpg
    shirt-black-2.jpg
    SHIRT-BLACK-M.jpg
```

There are two ways to match images.

First, you can list image names in the `image_files` column:

```txt
shirt-black-1.jpg, shirt-black-2.jpg
```

Second, if `image_files` is empty, the app tries to match images by SKU. For example, if the SKU is `SHIRT-BLACK-M`, an image named `SHIRT-BLACK-M.jpg` can be matched automatically.

## How To Use The App

1. Open the app.
2. Choose your language with the `IT` or `EN` switch in the top right.
3. Enter your Shopify store address, Client ID, and Client secret.
4. Click `Save`.
5. Click `Test connection`.
6. If the connection works, choose your product spreadsheet.
7. Optional: choose the image folder.
8. Click `Preview` to check products, variants, rows, warnings, and errors.
9. Fix any errors in the spreadsheet if needed.
10. Click `Test without saving` if you want to run a safe check.
11. Click `Import to Shopify` when you are ready to create products.

After an import or test run, the app writes a JSON report in a `reports` folder next to your spreadsheet.

## Understanding The Result Screen

The result screen shows:

- Whether the file is valid.
- How many products were found.
- How many variants were found.
- How many rows were read.
- Errors that must be fixed before importing.
- Warnings that should be reviewed.
- Products that failed during import.
- The path to the saved report.
- Technical details that can help with support.

Errors stop the import. Warnings do not always stop the import, but you should review them before continuing.

## Safe Testing Tips

For the first import, use `DRAFT` in the `status` column. This creates products as drafts, so you can review them in Shopify before publishing.

Start with a small spreadsheet first. A file with two or three products is enough to confirm that your Shopify app, columns, images, and permissions are correct.

Use `Preview` before every import. It is the fastest way to catch missing SKUs, missing titles, invalid prices, duplicate SKUs, and missing images.

## Development Setup

Install dependencies:

```bash
npm install
```

Start the app in development mode:

```bash
npm run dev
```

This starts the Angular dev server at:

```txt
http://localhost:4200
```

Electron opens the desktop app and loads that local dev server.

Build the Angular renderer:

```bash
npm run build:renderer
```

The renderer output is written to:

```txt
dist/renderer
```

## Creating Desktop Builds

Build for Windows:

```bash
npm run dist:win
```

Build for Linux:

```bash
npm run dist:linux
```

Build for macOS:

```bash
npm run dist:mac
```

Build output is written to:

```txt
release/
```

## Project Structure

```txt
electron/
  main.js
  preload.js
  services/
  shopify/
  shared/

src/
  app/
    core/
    features/
  index.html
  main.ts
  styles.scss

docs/
  SHOPIFY_COLUMNS.md
  shopify-products-template.xlsx
```

Important folders:

- `electron/` contains the desktop process, file dialogs, local settings, Excel reading, validation, Shopify API calls, and image upload logic.
- `src/app/` contains the Angular interface.
- `docs/` contains the spreadsheet template and column reference.

## Security Notes

The Electron app is configured with:

- `nodeIntegration: false`
- `contextIsolation: true`
- A limited preload API exposed to the renderer
- Local storage for Shopify settings
- Encrypted Client secret storage when Electron `safeStorage` is available

Do not commit real Shopify credentials, report files with private data, or production spreadsheets to GitHub.

## Current Limitations

- Product creation is implemented.
- Full product update, skip, and delete flows are not complete yet.
- Import resume after interruption is not implemented yet.
- Image optimization before upload is not implemented yet.
- Advanced inventory location handling is not implemented yet.

## Troubleshooting

If the connection test fails, check that:

- The store address is correct and ends with `.myshopify.com`.
- The Client ID is correct.
- The Client secret is correct.
- The Shopify app is installed on the store.
- The required Admin API scopes are enabled.
- The app was reinstalled after changing scopes.

If products do not import, check that:

- Required columns are present.
- `title`, `sku`, and `price` are filled.
- SKUs are unique.
- Prices are valid numbers.
- Image names match files in the selected image folder.
- Product status values are `DRAFT`, `ACTIVE`, or `ARCHIVED`.
# Shopify-Product-Importer
