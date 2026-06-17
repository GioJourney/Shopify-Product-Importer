# Shopify Product Importer

A desktop app to import Shopify products from an Excel / LibreOffice / CSV file, with optional image upload from a local folder. Preview your data, run a safe test, then send everything to Shopify. Interface available in **Italian** and **English**.

---

## Using the app

**1. Connect your store**

In the Shopify Dev Dashboard, create an app and copy its **Client ID** and **Client secret**. Your app needs these Admin API scopes:

```
write_products  read_products  write_inventory  read_inventory  write_files
```

Open the importer, enter your store address (`your-store.myshopify.com`), Client ID and Client secret, click **Save**, then **Test connection**. The secret is stored encrypted on your computer and never leaves it. If it reports missing permissions, add the scopes in Shopify, reinstall the app, and test again.

**2. Prepare your spreadsheet**

Four columns are required:

| Column   | Notes                                                    |
| -------- | -------------------------------------------------------- |
| `handle` | Product handle (auto-generated from the title if empty). |
| `title`  | Product title.                                           |
| `sku`    | Variant SKU — must be unique.                            |
| `price`  | `24.90` or `24,90` both work.                            |

Many optional columns are supported (`body_html`, `vendor`, `tags`, `status`, options, images, SEO…). See `docs/SHOPIFY_COLUMNS.md`, or start from `docs/shopify-products-template.xlsx`.

**3. Add images (optional)**

Point the app at a folder of `.jpg` / `.jpeg` / `.png` / `.webp` files. List file names in the `image_files` column, or leave it empty to match images by SKU automatically (e.g. SKU `SHIRT-BLACK-M` → `SHIRT-BLACK-M.jpg`).

**4. Import**

Choose the spreadsheet (and image folder), click **Preview** to check products and catch errors, then **Test without saving** for a dry run, and finally **Import to Shopify**. A JSON report is saved next to your spreadsheet after each run.

> 💡 First time? Set `status` to `DRAFT` and use a file with 2–3 products to confirm everything works before a full import.

---

## For developers

Built with Electron, Angular, and PrimeNG.

```bash
npm install      # install dependencies
npm run dev      # run the app (Angular dev server + Electron)
npm test         # run unit tests
npm run lint     # lint
```

Build desktop installers (output in `release/`):

```bash
npm run dist:win     # Windows
npm run dist:linux   # Linux
npm run dist:mac     # macOS
```

Releases are automated: push a `v*` tag (e.g. `v1.0.0`) and GitHub Actions builds and publishes the Windows and Linux artifacts.

---

## Disclaimer & responsibility

This software writes products and images to your live Shopify store. **You are responsible for the data you import.** Always run **Preview** and a **Test without saving** pass first, and start with `DRAFT` products on a small file.

The app is provided "as is", without warranty of any kind. The authors are not liable for any data loss, incorrect imports, or other damage to your store or business resulting from its use. Keep backups of your product data, and never commit real credentials, reports, or production spreadsheets to source control.

