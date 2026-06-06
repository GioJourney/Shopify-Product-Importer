import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ToastModule } from 'primeng/toast';
import { ShopifyConfigComponent } from './features/shopify-config/shopify-config.component';
import { FileImportComponent } from './features/file-import/file-import.component';
import { ImportResultComponent } from './features/import-result/import-result.component';
import { I18nService } from './core/services/i18n.service';

@Component({
  selector: 'app-root',
  imports: [ToastModule, ShopifyConfigComponent, FileImportComponent, ImportResultComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  protected readonly i18n = inject(I18nService);
}
