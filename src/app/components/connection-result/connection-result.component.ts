import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { TagModule } from 'primeng/tag';
import { MessageModule } from 'primeng/message';
import type { ConnectionTestResult } from '@types';
import { I18nService } from '@core/services/i18n.service';

@Component({
  selector: 'app-connection-result',
  imports: [TagModule, MessageModule],
  templateUrl: './connection-result.component.html',
  styleUrl: './connection-result.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConnectionResultComponent {
  protected readonly i18n = inject(I18nService);

  readonly result = input.required<ConnectionTestResult>();
  readonly missingScopes = input.required<readonly string[]>();
  readonly requiredScopes = input.required<readonly string[]>();
  readonly showAdvanced = input(false);
}
