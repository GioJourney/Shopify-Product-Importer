import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ToastModule } from 'primeng/toast';
import { ShopifyConfigComponent } from '@components/shopify-config/shopify-config.component';
import { FileImportComponent } from '@components/file-import/file-import.component';
import { ImportResultComponent } from '@components/import-result/import-result.component';
import { LanguageSwitcherComponent } from '@components/language-switcher/language-switcher.component';
import { UpdateButtonComponent } from '@components/update-button/update-button.component';
import { I18nService } from '@core/services/i18n.service';

@Component({
  selector: 'app-root',
  imports: [
    ToastModule,
    ShopifyConfigComponent,
    FileImportComponent,
    ImportResultComponent,
    LanguageSwitcherComponent,
    UpdateButtonComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  protected readonly i18n = inject(I18nService);
}
