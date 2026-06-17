import { TestBed } from '@angular/core/testing';
import { I18nService } from './i18n.service';
import type { ImportIssue, IssueDescriptor } from '@types';

describe('I18nService', () => {
  let service: I18nService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(I18nService);
  });

  it('defaults to Italian and switches language', () => {
    expect(service.language()).toBe('it');
    expect(service.t('save')).toBe('Salva');

    service.setLanguage('en');
    expect(service.isLanguage('en')).toBe(true);
    expect(service.t('save')).toBe('Save');
  });

  it('persists the selected language', () => {
    service.setLanguage('en');
    TestBed.tick(); // flush the persistence effect (zoneless)
    expect(localStorage.getItem('shopify-product-importer-language')).toBe('en');
  });

  describe('count', () => {
    it('uses the singular key for 1', () => {
      expect(service.count(1, 'productSingular', 'productPlural')).toBe('1 prodotto');
    });

    it('uses the plural key for other values', () => {
      expect(service.count(3, 'productSingular', 'productPlural')).toBe('3 prodotti');
    });
  });

  describe('statusLabel', () => {
    it('maps known statuses case-insensitively', () => {
      expect(service.statusLabel('active')).toBe('Attivo');
      expect(service.statusLabel('DRAFT')).toBe('Bozza');
    });

    it('returns the raw value for unknown statuses', () => {
      expect(service.statusLabel('WEIRD')).toBe('WEIRD');
    });
  });

  describe('issue (code-based)', () => {
    it('translates a plain code', () => {
      const descriptor: IssueDescriptor = {
        code: 'TITLE_REQUIRED',
        message: 'Titolo obbligatorio.',
      };
      expect(service.issue(descriptor)).toBe('Titolo obbligatorio.');

      service.setLanguage('en');
      expect(service.issue(descriptor)).toBe('Title is required.');
    });

    it('interpolates params into the template', () => {
      service.setLanguage('en');
      const descriptor: IssueDescriptor = {
        code: 'SKU_DUPLICATE',
        message: 'SKU duplicato. Già presente alla riga 4.',
        params: { row: 4 },
      };
      expect(service.issue(descriptor)).toBe('Duplicate SKU. Already present on row 4.');
    });

    it('prefixes the row number and field when present', () => {
      const issue: ImportIssue = {
        code: 'IMAGE_NOT_FOUND',
        message: 'Immagine non trovata: a.jpg',
        params: { file: 'a.jpg' },
        rowNumber: 7,
        field: 'image_files',
      };
      expect(service.issue(issue)).toBe('Riga 7 (image_files): Immagine non trovata: a.jpg');
    });

    it('falls back to the message when the code is unknown', () => {
      service.setLanguage('en');
      const descriptor = { code: 'NOT_A_REAL_CODE', message: 'Raw fallback.' };
      expect(service.issue(descriptor)).toBe('Raw fallback.');
    });
  });

  describe('issue (legacy string path)', () => {
    it('passes Italian strings through unchanged', () => {
      expect(service.issue('Titolo obbligatorio.')).toBe('Titolo obbligatorio.');
    });

    it('translates known Italian strings to English', () => {
      service.setLanguage('en');
      expect(service.issue('Titolo obbligatorio.')).toBe('Title is required.');
    });
  });
});
