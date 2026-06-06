import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import type {
  ConnectionTestResult,
  ImportRequest,
  ImportResult,
  PreviewRequest,
  PreviewResult,
  Progress,
  Settings,
  SettingsInput,
} from '../models/import.models';

@Injectable({ providedIn: 'root' })
export class ShopifyImporterService {
  private get api() {
    return window.shopifyImporter;
  }

  selectExcel(): Promise<string | null> {
    return this.api.selectExcel();
  }

  selectFolder(): Promise<string | null> {
    return this.api.selectFolder();
  }

  getSettings(): Promise<Settings> {
    return this.api.getSettings();
  }

  saveSettings(settings: SettingsInput): Promise<{ ok: boolean }> {
    return this.api.saveSettings(settings);
  }

  testConnection(): Promise<ConnectionTestResult> {
    return this.api.testConnection();
  }

  previewImport(payload: PreviewRequest): Promise<PreviewResult> {
    return this.api.previewImport(payload);
  }

  runImport(payload: ImportRequest): Promise<ImportResult> {
    return this.api.runImport(payload);
  }

  progress$(): Observable<Progress> {
    return new Observable<Progress>((subscriber) => {
      const unsubscribe = this.api.onProgress((progress) => subscriber.next(progress));
      return () => unsubscribe();
    });
  }
}
