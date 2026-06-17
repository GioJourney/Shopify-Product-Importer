import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { I18nService } from '@core/services/i18n.service';

@Component({
  selector: 'app-language-switcher',
  templateUrl: './language-switcher.component.html',
  styleUrl: './language-switcher.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'group',
    '[attr.aria-label]': "i18n.t('languageLabel')",
  },
})
export class LanguageSwitcherComponent {
  protected readonly i18n = inject(I18nService);
}
