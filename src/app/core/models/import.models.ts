export interface Settings {
  shopDomain: string;
  apiVersion: string;
  clientId: string;
  hasSecret: boolean;
}

export interface SettingsInput {
  shopDomain: string;
  apiVersion: string;
  clientId: string;
  clientSecret: string;
}

export interface PreviewProduct {
  handle: string;
  title: string;
  status: string;
  images: number;
  variants: number;
}

export interface ImportIssue {
  rowNumber?: number;
  field?: string;
  message: string;
}

export interface PreviewResult {
  valid: boolean;
  totalRows: number;
  totalProducts: number;
  totalVariants: number;
  errors: ImportIssue[];
  warnings: ImportIssue[];
  products: PreviewProduct[];
}

export interface ImportedProduct {
  handle: string;
  title: string;
  shopifyProduct: unknown;
}

export interface FailedProduct {
  handle: string;
  title: string;
  error: string;
}

export interface ImportResult {
  ok: boolean;
  dryRun: boolean;
  preview: PreviewResult;
  imported: ImportedProduct[];
  failed: FailedProduct[];
  reportPath: string | null;
}

export interface ConnectionTestResult {
  ok: boolean;
  shopName?: string;
  shopDomain?: string;
  scopes?: string[];
  error?: string;
}

export interface Progress {
  current: number;
  total: number;
  title: string;
}

export interface ImportRequest {
  excelPath: string;
  imageFolder: string;
  dryRun?: boolean;
}

export interface PreviewRequest {
  excelPath: string;
  imageFolder: string;
}
