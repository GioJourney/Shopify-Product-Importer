import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { MessageModule } from 'primeng/message';
import { MessageService } from 'primeng/api';
import { ShopifyImporterService } from '../../core/services/shopify-importer.service';
import type { ConnectionTestResult } from '../../core/models/import.models';
import { I18nService } from '../../core/services/i18n.service';

const DEFAULT_API_VERSION = '2026-04';

const REQUIRED_SCOPES = [
  'write_products',
  'read_products',
  'write_inventory',
  'read_inventory',
  'write_files',
];

@Component({
  selector: 'app-shopify-config',
  imports: [
    FormsModule,
    CardModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    TagModule,
    MessageModule,
  ],
  templateUrl: './shopify-config.component.html',
  styleUrl: './shopify-config.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShopifyConfigComponent implements OnInit {
  private readonly importer = inject(ShopifyImporterService);
  private readonly messages = inject(MessageService);
  protected readonly i18n = inject(I18nService);

  readonly requiredScopes = REQUIRED_SCOPES;

  readonly shopDomain = signal('');
  readonly clientId = signal('');
  readonly clientSecret = signal('');
  readonly hasSecret = signal(false);
  readonly saving = signal(false);
  readonly showAdvanced = signal(false);

  readonly testing = signal(false);
  readonly testResult = signal<ConnectionTestResult | null>(null);
  readonly apiVersion = signal(DEFAULT_API_VERSION);

  readonly missingScopes = computed(() => {
    const result = this.testResult();
    if (!result?.ok || !result.scopes) {
      return [] as string[];
    }
    const granted = new Set(result.scopes);
    return REQUIRED_SCOPES.filter((scope) => !granted.has(scope));
  });

  ngOnInit(): void {
    void this.loadSettings();
  }

  private async loadSettings(): Promise<void> {
    const settings = await this.importer.getSettings();
    this.shopDomain.set(settings.shopDomain ?? '');
    this.apiVersion.set(settings.apiVersion || DEFAULT_API_VERSION);
    this.clientId.set(settings.clientId ?? '');
    this.hasSecret.set(settings.hasSecret);
  }

  async save(): Promise<void> {
    this.saving.set(true);
    try {
      await this.importer.saveSettings({
        shopDomain: this.shopDomain().trim(),
        apiVersion: this.apiVersion().trim() || DEFAULT_API_VERSION,
        clientId: this.clientId().trim(),
        clientSecret: this.clientSecret().trim(),
      });
      this.clientSecret.set('');
      await this.loadSettings();
      this.messages.add({
        severity: 'success',
        summary: this.i18n.t('configSavedSummary'),
        detail: this.i18n.t('configSavedDetail'),
      });
    } catch (error) {
      this.messages.add({
        severity: 'error',
        summary: this.i18n.t('errorSummary'),
        detail: error instanceof Error ? this.i18n.issue(error.message) : this.i18n.t('saveFailed'),
      });
    } finally {
      this.saving.set(false);
    }
  }

  async verifyConnection(): Promise<void> {
    this.testing.set(true);
    this.testResult.set(null);
    try {
      const result = await this.importer.testConnection();
      this.testResult.set(result);
      if (result.ok) {
        this.messages.add({
          severity: this.missingScopes().length ? 'warn' : 'success',
          summary: this.i18n.t('connectionSuccessSummary'),
          detail: `${this.i18n.t('shopDetailPrefix')} ${result.shopName}`,
        });
      } else {
        this.messages.add({
          severity: 'error',
          summary: this.i18n.t('connectionFailedSummary'),
          detail: result.error ? this.i18n.issue(result.error) : this.i18n.t('checkCredentials'),
        });
      }
    } catch (error) {
      this.messages.add({
        severity: 'error',
        summary: this.i18n.t('connectionFailedSummary'),
        detail: error instanceof Error ? this.i18n.issue(error.message) : this.i18n.t('checkCredentials'),
      });
    } finally {
      this.testing.set(false);
    }
  }
}
