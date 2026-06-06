import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CardModule } from 'primeng/card';
import { ProgressBarModule } from 'primeng/progressbar';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { MessageModule } from 'primeng/message';
import { ShopifyImporterService } from '../../core/services/shopify-importer.service';
import { ImportStateService } from '../../core/services/import-state.service';
import { I18nService } from '../../core/services/i18n.service';

@Component({
  selector: 'app-import-result',
  imports: [CardModule, ProgressBarModule, TableModule, TagModule, MessageModule],
  templateUrl: './import-result.component.html',
  styleUrl: './import-result.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImportResultComponent {
  private readonly importer = inject(ShopifyImporterService);
  protected readonly i18n = inject(I18nService);
  protected readonly state = inject(ImportStateService);

  readonly result = this.state.lastResult;
  readonly preview = computed(() => this.result()?.preview ?? null);
  readonly rawJson = computed(() => {
    const result = this.result();
    return result ? JSON.stringify(result, null, 2) : '';
  });

  constructor() {
    this.importer
      .progress$()
      .pipe(takeUntilDestroyed())
      .subscribe((progress) => this.state.progress.set(progress));
  }
}
