import { computed, effect, Injectable, signal } from '@angular/core';
import type { ImportIssue, IssueDescriptor, IssueParams } from '@types';
import { ERROR_MESSAGES } from '../i18n/error-messages';
import {
  DEFAULT_LANGUAGE,
  LANGUAGE_STORAGE_KEY,
  LANGUAGES,
  type LanguageCode,
} from '../i18n/language';
import { TRANSLATIONS, type TranslationKey } from '../i18n/translations';

export type { LanguageCode } from '../i18n/language';
export type { TranslationKey } from '../i18n/translations';

@Injectable({ providedIn: 'root' })
export class I18nService {
  readonly languages = LANGUAGES;

  readonly language = signal<LanguageCode>(this.getInitialLanguage());
  readonly currentLanguageLabel = computed(
    () => this.languages.find((language) => language.code === this.language())?.label ?? 'Italiano',
  );

  constructor() {
    effect(() => {
      const language = this.language();
      this.persistLanguage(language);
      this.updateDocumentLanguage(language);
    });
  }

  setLanguage(language: LanguageCode): void {
    this.language.set(language);
  }

  isLanguage(language: LanguageCode): boolean {
    return this.language() === language;
  }

  t(key: TranslationKey): string {
    return TRANSLATIONS[this.language()][key];
  }

  count(count: number, singularKey: TranslationKey, pluralKey: TranslationKey): string {
    return `${count} ${this.t(count === 1 ? singularKey : pluralKey)}`;
  }

  runSuccessDetail(importedCount: number): string {
    return `${this.count(importedCount, 'productSingular', 'productPlural')}, ${this.t('noErrors')}.`;
  }

  runWarningDetail(failedCount: number): string {
    return `${this.count(failedCount, 'productSingular', 'productPlural')} ${this.t('notImported')}.`;
  }

  statusLabel(status: string): string {
    const normalized = status.toUpperCase();
    if (normalized === 'ACTIVE') return this.t('activeStatus');
    if (normalized === 'ARCHIVED') return this.t('archivedStatus');
    if (normalized === 'DRAFT') return this.t('draftStatus');
    return status;
  }

  issue(input: unknown): string {
    if (typeof input === 'string') {
      return this.translateLegacyMessage(input);
    }

    if (!input || typeof input !== 'object') {
      return String(input);
    }

    const candidate = input as Partial<ImportIssue>;
    const message = this.describe(candidate);

    if (!candidate.rowNumber) {
      return message;
    }

    const field = candidate.field ? ` (${candidate.field})` : '';
    return `${this.t('rowPrefix')} ${candidate.rowNumber}${field}: ${message}`;
  }

  private describe(candidate: Partial<IssueDescriptor>): string {
    if (candidate.code) {
      const template = ERROR_MESSAGES[this.language()][candidate.code];
      if (template) {
        return this.interpolate(template, candidate.params);
      }
    }
    return candidate.message
      ? this.translateLegacyMessage(candidate.message)
      : JSON.stringify(candidate);
  }

  private interpolate(template: string, params?: IssueParams | null): string {
    if (!params) {
      return template;
    }
    return template.replace(/\{(\w+)\}/g, (match, key) =>
      key in params ? String(params[key]) : match,
    );
  }

  private translateLegacyMessage(message: string): string {
    if (this.isLanguage('it')) {
      return message;
    }

    for (const [code, template] of Object.entries(ERROR_MESSAGES.it)) {
      const params = this.matchTemplate(template, message);
      if (params) {
        return this.interpolate(ERROR_MESSAGES[this.language()][code], params);
      }
    }

    return message;
  }

  private matchTemplate(template: string, message: string): IssueParams | null {
    const keys: string[] = [];
    const pattern = template
      .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      .replace(/\\\{(\w+)\\\}/g, (_match, key: string) => {
        keys.push(key);
        return '(.+?)';
      });

    const match = new RegExp(`^${pattern}$`).exec(message);
    if (!match) {
      return null;
    }

    const params: IssueParams = {};
    keys.forEach((key, index) => (params[key] = match[index + 1]));
    return params;
  }

  private getInitialLanguage(): LanguageCode {
    try {
      const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (saved === 'it' || saved === 'en') {
        return saved;
      }
    } catch {
      return DEFAULT_LANGUAGE;
    }

    return DEFAULT_LANGUAGE;
  }

  private persistLanguage(language: LanguageCode): void {
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    } catch {
      return;
    }
  }

  private updateDocumentLanguage(language: LanguageCode): void {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
    }
  }
}
