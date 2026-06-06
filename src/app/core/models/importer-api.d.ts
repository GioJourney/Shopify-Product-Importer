import type {
  ConnectionTestResult,
  ImportRequest,
  ImportResult,
  PreviewRequest,
  PreviewResult,
  Progress,
  Settings,
  SettingsInput,
} from './import.models';

export interface ShopifyImporterApi {
  selectExcel(): Promise<string | null>;
  selectFolder(): Promise<string | null>;
  getSettings(): Promise<Settings>;
  saveSettings(settings: SettingsInput): Promise<{ ok: boolean }>;
  testConnection(): Promise<ConnectionTestResult>;
  previewImport(payload: PreviewRequest): Promise<PreviewResult>;
  runImport(payload: ImportRequest): Promise<ImportResult>;
  /** Registers a progress listener; returns an unsubscribe function. */
  onProgress(callback: (progress: Progress) => void): () => void;
}

declare global {
  interface Window {
    shopifyImporter: ShopifyImporterApi;
  }
}

export {};
