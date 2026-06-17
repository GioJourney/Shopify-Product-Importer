import type { ConnectionTestResult } from './connection.types';
import type {
  ImportRequest,
  ImportResult,
  PreviewRequest,
  PreviewResult,
  Progress,
} from './import.types';
import type { Settings, SettingsInput } from './settings.types';
import type { UpdateStatus } from './update.types';

export interface UpdatesApi {
  getAppVersion(): Promise<string>;
  check(): Promise<UpdateStatus>;
  download(): Promise<UpdateStatus>;
  install(): Promise<void>;
  onStatus(callback: (status: UpdateStatus) => void): () => void;
}

export interface ShopifyImporterApi {
  selectExcel(): Promise<string | null>;
  selectFolder(): Promise<string | null>;
  getSettings(): Promise<Settings>;
  saveSettings(settings: SettingsInput): Promise<{ ok: boolean }>;
  clearSettings(): Promise<{ ok: boolean }>;
  testConnection(): Promise<ConnectionTestResult>;
  previewImport(payload: PreviewRequest): Promise<PreviewResult>;
  runImport(payload: ImportRequest): Promise<ImportResult>;
  onProgress(callback: (progress: Progress) => void): () => void;
  updates: UpdatesApi;
}

declare global {
  interface Window {
    shopifyImporter: ShopifyImporterApi;
  }
}
