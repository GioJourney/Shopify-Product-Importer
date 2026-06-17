import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { UpdateService } from '@core/services/update.service';
import { I18nService } from '@core/services/i18n.service';
import type { UpdateStatus } from '@types';

@Component({
  selector: 'app-update-button',
  imports: [ButtonModule],
  templateUrl: './update-button.component.html',
  styleUrl: './update-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateButtonComponent {
  private readonly updates = inject(UpdateService);
  private readonly messages = inject(MessageService);
  protected readonly i18n = inject(I18nService);

  protected readonly supported = this.updates.isSupported;
  protected readonly status = signal<UpdateStatus>({ state: 'idle' });

  private userInitiated = false;

  protected readonly busy = computed(() => {
    const state = this.status().state;
    return state === 'checking' || state === 'downloading';
  });

  protected readonly label = computed(() => {
    switch (this.status().state) {
      case 'checking':
        return this.i18n.t('updateChecking');
      case 'available':
        return this.i18n.t('updateDownload');
      case 'downloading':
        return `${this.i18n.t('updateDownloading')} ${this.status().percent ?? 0}%`;
      case 'downloaded':
        return this.i18n.t('updateRestart');
      default:
        return this.i18n.t('updateCheck');
    }
  });

  protected readonly icon = computed(() => {
    switch (this.status().state) {
      case 'checking':
      case 'downloading':
        return 'pi pi-spin pi-spinner';
      case 'available':
        return 'pi pi-download';
      case 'downloaded':
        return 'pi pi-refresh';
      default:
        return 'pi pi-cloud-download';
    }
  });

  constructor() {
    if (!this.supported) {
      return;
    }
    this.updates
      .status$()
      .pipe(takeUntilDestroyed())
      .subscribe((status) => this.onStatus(status));
  }

  async onClick(): Promise<void> {
    const state = this.status().state;
    if (state === 'available') {
      this.status.set(await this.updates.download());
      return;
    }
    if (state === 'downloaded') {
      await this.updates.install();
      return;
    }
    this.userInitiated = true;
    this.status.set(await this.updates.check());
  }

  private onStatus(status: UpdateStatus): void {
    this.status.set(status);
    switch (status.state) {
      case 'available':
        this.messages.add({
          severity: 'info',
          summary: this.i18n.t('updateAvailableSummary'),
          detail: `${this.i18n.t('updateAvailableDetail')} ${status.version ?? ''}`.trim(),
        });
        break;
      case 'not-available':
        if (this.userInitiated) {
          this.messages.add({
            severity: 'success',
            summary: this.i18n.t('updateUpToDateSummary'),
            detail: this.i18n.t('updateUpToDateDetail'),
          });
        }
        this.userInitiated = false;
        break;
      case 'downloaded':
        this.messages.add({
          severity: 'success',
          summary: this.i18n.t('updateDownloadedSummary'),
          detail: this.i18n.t('updateDownloadedDetail'),
        });
        break;
      case 'error':
        if (this.userInitiated) {
          this.messages.add({
            severity: 'error',
            summary: this.i18n.t('updateErrorSummary'),
            detail: status.message ?? '',
          });
        }
        this.userInitiated = false;
        break;
    }
  }
}
