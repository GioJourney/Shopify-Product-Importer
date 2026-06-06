# Colonne supportate

| Colonna | Obbligatoria | Descrizione |
|---|---:|---|
| handle | Sì | Slug prodotto Shopify. Se mancante può essere generato dal titolo. |
| title | Sì | Nome prodotto. |
| body_html | No | Descrizione HTML. |
| vendor | No | Brand/fornitore. |
| product_type | No | Tipo prodotto. |
| tags | No | Tag separati da virgola. |
| status | No | DRAFT, ACTIVE, ARCHIVED. Consigliato DRAFT. |
| sku | Sì | SKU variante, deve essere univoco. |
| barcode | No | Barcode/EAN. |
| price | Sì | Prezzo. Accetta 24.90 o 24,90. |
| compare_at_price | No | Prezzo barrato. |
| inventory_quantity | No | Quantità iniziale. |
| inventory_policy | No | DENY o CONTINUE. |
| requires_shipping | No | TRUE/FALSE. |
| taxable | No | TRUE/FALSE. |
| weight | No | Peso. |
| weight_unit | No | GRAMS, KILOGRAMS, OUNCES, POUNDS. |
| option1_name | No | Nome opzione, es. Taglia. |
| option1_value | No | Valore opzione, es. M. |
| option2_name | No | Nome seconda opzione. |
| option2_value | No | Valore seconda opzione. |
| option3_name | No | Nome terza opzione. |
| option3_value | No | Valore terza opzione. |
| image_files | No | Immagini separate da virgola presenti nella cartella immagini. |
| variant_image | No | Immagine specifica variante. |
| seo_title | No | Titolo SEO. |
| seo_description | No | Descrizione SEO. |
| import_action | No | CREATE, UPDATE, SKIP, DELETE. In questa base è implementato CREATE. |
