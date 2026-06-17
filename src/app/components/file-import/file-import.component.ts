import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { ShopifyImporterService } from '@core/services/shopify-importer.service';
import { ImportStateService } from '@core/services/import-state.service';
import { I18nService } from '@core/services/i18n.service';
import { SectionCardComponent } from '@components/section-card/section-card.component';

@Component({
  selector: 'app-file-import',
  imports: [ButtonModule, SectionCardComponent],
  templateUrl: './file-import.component.html',
  styleUrl: './file-import.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileImportComponent {
  private readonly importer = inject(ShopifyImporterService);
  private readonly messages = inject(MessageService);
  protected readonly i18n = inject(I18nService);
  protected readonly state = inject(ImportStateService);

  readonly busy = signal<'preview' | 'dryRun' | 'import' | null>(null);

  async selectExcel(): Promise<void> {
    const filePath = await this.importer.selectExcel();
    if (filePath) {
      this.state.excelPath.set(filePath);
    }
  }

  async selectFolder(): Promise<void> {
    const folderPath = await this.importer.selectFolder();
    if (folderPath) {
      this.state.imageFolder.set(folderPath);
    }
  }

  async preview(): Promise<void> {
    if (!this.guard()) {
      return;
    }
    this.busy.set('preview');
    try {
      const result = await this.importer.previewImport({
        excelPath: this.state.excelPath()!,
        imageFolder: this.state.imageFolder() ?? '',
      });
      this.state.lastResult.set({
        ok: result.valid,
        dryRun: true,
        preview: result,
        imported: [],
        failed: [],
        reportPath: null,
      });
    } catch (error) {
      this.fail(error);
    } finally {
      this.busy.set(null);
    }
  }

  async run(dryRun: boolean): Promise<void> {
    if (!this.guard()) {
      return;
    }
    this.busy.set(dryRun ? 'dryRun' : 'import');
    this.state.progress.set(null);
    this.state.running.set(!dryRun);
    try {
      const result = await this.importer.runImport({
        excelPath: this.state.excelPath()!,
        imageFolder: this.state.imageFolder() ?? '',
        dryRun,
      });
      this.state.lastResult.set(result);
      this.messages.add({
        severity: result.ok ? 'success' : 'warn',
        summary: this.i18n.t(dryRun ? 'dryRunDoneSummary' : 'importDoneSummary'),
        detail: result.ok
          ? this.i18n.runSuccessDetail(result.imported.length)
          : this.i18n.runWarningDetail(result.failed.length),
      });
    } catch (error) {
      this.fail(error);
    } finally {
      this.busy.set(null);
      this.state.running.set(false);
    }
  }

  private guard(): boolean {
    if (this.state.canRun()) {
      return true;
    }
    this.messages.add({
      severity: 'warn',
      summary: this.i18n.t('incompleteSelectionSummary'),
      detail: this.i18n.t('selectExcelFirst'),
    });
    return false;
  }

  private fail(error: unknown): void {
    this.messages.add({
      severity: 'error',
      summary: this.i18n.t('errorSummary'),
      detail: error instanceof Error ? this.i18n.issue(error.message) : this.i18n.t('operationFailed'),
    });
  }
}
