import { computed, effect, Injectable, signal } from '@angular/core';

export type LanguageCode = 'it' | 'en';

type ImportIssue = {
  rowNumber?: number;
  field?: string;
  message?: string;
};

const STORAGE_KEY = 'shopify-product-importer-language';

const TRANSLATIONS = {
  it: {
    appSubtitle: 'Importa prodotti da Excel/LibreOffice e immagini locali.',
    languageLabel: 'Lingua',
    stepConfigTitle: '1. Collega il tuo negozio Shopify',
    stepConfigIntro:
      'Inserisci i dati della tua app Shopify una sola volta. Restano salvati per le importazioni future.',
    shopDomainLabel: 'Indirizzo del negozio',
    shopDomainHintPrefix: "Lo trovi nell'indirizzo del tuo pannello Shopify, finisce con",
    clientIdLabel: "Chiave dell'app (Client ID)",
    clientIdPlaceholder: 'Incolla qui la chiave',
    clientIdHintPrefix: 'La copi dalla tua app nel Dev Dashboard di Shopify, sezione',
    clientSecretLabel: "Codice segreto dell'app (Client secret)",
    secretSavedHint: 'Codice già salvato. Lascia vuoto per non cambiarlo.',
    secretMissingHint: 'Codice non ancora salvato. Lo copi accanto alla chiave, nel Dev Dashboard.',
    advancedDetails: 'Dettagli avanzati',
    apiVersionLabel: 'Versione API Shopify',
    apiVersionHint:
      'Cambiala solo se sai cosa stai facendo. In caso di dubbi lascia il valore predefinito.',
    save: 'Salva',
    verifyConnection: 'Verifica connessione',
    connectedTo: 'Connesso a',
    missingScopesNote:
      "Mancano alcuni permessi sulla tua app. Aggiungili nelle impostazioni dell'app su Shopify e reinstallala, altrimenti l'importazione potrebbe non funzionare.",
    allScopesNote: "Tutti i permessi necessari sono attivi. Puoi procedere con l'importazione.",
    missingScopes: 'Permessi mancanti:',
    scopesStatus: 'Stato di tutti i permessi:',
    connectionFallbackError: 'Connessione non riuscita. Controlla i dati inseriti.',
    configSavedSummary: 'Configurazione salvata',
    configSavedDetail: 'Le impostazioni Shopify sono state aggiornate.',
    errorSummary: 'Errore',
    saveFailed: 'Salvataggio non riuscito.',
    connectionSuccessSummary: 'Connessione riuscita',
    shopDetailPrefix: 'Negozio:',
    connectionFailedSummary: 'Connessione fallita',
    checkCredentials: 'Verifica le credenziali.',
    stepFilesTitle: '2. Scegli i file da importare',
    stepFilesIntro: 'Seleziona il foglio Excel con i prodotti e, se vuoi, la cartella con le immagini.',
    chooseExcel: 'Scegli Excel',
    noFileSelected: 'Nessun file selezionato',
    excelHint: "Il file Excel (o LibreOffice) con l'elenco dei prodotti da caricare. Obbligatorio.",
    chooseImages: 'Scegli immagini',
    noFolderSelected: 'Nessuna cartella selezionata',
    imagesHint: 'La cartella con le foto dei prodotti sul tuo computer. Facoltativa.',
    previewAction: 'Anteprima',
    dryRunAction: 'Prova senza salvare',
    importAction: 'Importa su Shopify',
    dryRunDoneSummary: 'Prova completata',
    importDoneSummary: 'Importazione completata',
    noErrors: 'nessun errore',
    notImported: 'non importati',
    incompleteSelectionSummary: 'Selezione incompleta',
    selectExcelFirst: 'Seleziona prima il file Excel.',
    operationFailed: 'Operazione non riuscita.',
    resultTitle: 'Risultato',
    allGood: 'Tutto a posto',
    needsFixing: 'Da correggere',
    productSingular: 'prodotto',
    productPlural: 'prodotti',
    variantSingular: 'variante',
    variantPlural: 'varianti',
    rowSingular: 'riga nel file',
    rowPlural: 'righe nel file',
    reportSavedIn: 'Report salvato in:',
    errorsBeforeImport: 'Problemi da correggere prima di importare',
    warningsBeforeImport: 'Avvisi (puoi importare lo stesso, ma controlla)',
    handleColumn: 'Identificativo',
    titleColumn: 'Titolo',
    statusColumn: 'Stato',
    imagesColumn: 'Immagini',
    variantsColumn: 'Varianti',
    failedProducts: 'Prodotti non importati',
    reasonColumn: 'Motivo',
    technicalDetails: "Dettagli tecnici (utili per l'assistenza)",
    emptyResult: 'Qui vedrai il risultato dopo aver usato "Anteprima" o "Importa su Shopify".',
    rowPrefix: 'Riga',
    activeStatus: 'Attivo',
    draftStatus: 'Bozza',
    archivedStatus: 'Archiviato',
  },
  en: {
    appSubtitle: 'Import products from Excel/LibreOffice files and local images.',
    languageLabel: 'Language',
    stepConfigTitle: '1. Connect your Shopify store',
    stepConfigIntro:
      'Enter your Shopify app details once. They stay saved for future imports.',
    shopDomainLabel: 'Store address',
    shopDomainHintPrefix: 'Find it in your Shopify admin address. It ends with',
    clientIdLabel: 'App key (Client ID)',
    clientIdPlaceholder: 'Paste the key here',
    clientIdHintPrefix: 'Copy it from your app in the Shopify Dev Dashboard, under',
    clientSecretLabel: 'App secret (Client secret)',
    secretSavedHint: 'Secret already saved. Leave empty to keep it unchanged.',
    secretMissingHint: 'Secret not saved yet. Copy it next to the key in the Dev Dashboard.',
    advancedDetails: 'Advanced details',
    apiVersionLabel: 'Shopify API version',
    apiVersionHint: 'Change this only if you know what you are doing. When in doubt, keep the default.',
    save: 'Save',
    verifyConnection: 'Test connection',
    connectedTo: 'Connected to',
    missingScopesNote:
      'Some permissions are missing on your app. Add them in Shopify app settings and reinstall it, otherwise imports may fail.',
    allScopesNote: 'All required permissions are active. You can continue with the import.',
    missingScopes: 'Missing permissions:',
    scopesStatus: 'All permissions status:',
    connectionFallbackError: 'Connection failed. Check the details you entered.',
    configSavedSummary: 'Configuration saved',
    configSavedDetail: 'Shopify settings were updated.',
    errorSummary: 'Error',
    saveFailed: 'Save failed.',
    connectionSuccessSummary: 'Connection successful',
    shopDetailPrefix: 'Store:',
    connectionFailedSummary: 'Connection failed',
    checkCredentials: 'Check your credentials.',
    stepFilesTitle: '2. Choose files to import',
    stepFilesIntro: 'Select the Excel sheet with products and, optionally, the image folder.',
    chooseExcel: 'Choose Excel',
    noFileSelected: 'No file selected',
    excelHint: 'The Excel or LibreOffice file with the product list to upload. Required.',
    chooseImages: 'Choose images',
    noFolderSelected: 'No folder selected',
    imagesHint: 'The folder with product photos on your computer. Optional.',
    previewAction: 'Preview',
    dryRunAction: 'Test without saving',
    importAction: 'Import to Shopify',
    dryRunDoneSummary: 'Test completed',
    importDoneSummary: 'Import completed',
    noErrors: 'no errors',
    notImported: 'not imported',
    incompleteSelectionSummary: 'Incomplete selection',
    selectExcelFirst: 'Select the Excel file first.',
    operationFailed: 'Operation failed.',
    resultTitle: 'Result',
    allGood: 'All good',
    needsFixing: 'Needs fixes',
    productSingular: 'product',
    productPlural: 'products',
    variantSingular: 'variant',
    variantPlural: 'variants',
    rowSingular: 'row in file',
    rowPlural: 'rows in file',
    reportSavedIn: 'Report saved in:',
    errorsBeforeImport: 'Issues to fix before importing',
    warningsBeforeImport: 'Warnings (you can still import, but review them)',
    handleColumn: 'Handle',
    titleColumn: 'Title',
    statusColumn: 'Status',
    imagesColumn: 'Images',
    variantsColumn: 'Variants',
    failedProducts: 'Products not imported',
    reasonColumn: 'Reason',
    technicalDetails: 'Technical details (useful for support)',
    emptyResult: 'Results will appear here after using "Preview" or "Import to Shopify".',
    rowPrefix: 'Row',
    activeStatus: 'Active',
    draftStatus: 'Draft',
    archivedStatus: 'Archived',
  },
} as const;

type TranslationKey = keyof typeof TRANSLATIONS.it;

@Injectable({ providedIn: 'root' })
export class I18nService {
  readonly languages = [
    { code: 'it', shortLabel: 'IT', label: 'Italiano' },
    { code: 'en', shortLabel: 'EN', label: 'English' },
  ] as const;

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

  issue(issue: unknown): string {
    if (typeof issue === 'string') {
      return this.translateKnownIssue(issue);
    }

    if (!issue || typeof issue !== 'object') {
      return String(issue);
    }

    const candidate = issue as ImportIssue;
    const message = candidate.message ? this.translateKnownIssue(candidate.message) : JSON.stringify(issue);

    if (!candidate.rowNumber) {
      return message;
    }

    const field = candidate.field ? ` (${candidate.field})` : '';
    return `${this.t('rowPrefix')} ${candidate.rowNumber}${field}: ${message}`;
  }

  private getInitialLanguage(): LanguageCode {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'it' || saved === 'en') {
        return saved;
      }
    } catch {
      return 'it';
    }

    return 'it';
  }

  private persistLanguage(language: LanguageCode): void {
    try {
      localStorage.setItem(STORAGE_KEY, language);
    } catch {
      // Ignore storage failures; the switch still works for the current session.
    }
  }

  private updateDocumentLanguage(language: LanguageCode): void {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
    }
  }

  private translateKnownIssue(message: string): string {
    if (this.language() === 'it') {
      return message;
    }

    if (message === 'Handle mancante o non generabile.') {
      return 'Handle missing or could not be generated.';
    }
    if (message === 'Titolo obbligatorio.') {
      return 'Title is required.';
    }
    if (message === 'SKU obbligatorio.') {
      return 'SKU is required.';
    }
    if (message === 'Prezzo non valido.') {
      return 'Price is invalid.';
    }
    if (message === 'Nessuna immagine trovata per il prodotto/variante.') {
      return 'No image found for the product/variant.';
    }
    if (message === 'Il file non contiene fogli leggibili.') {
      return 'The file does not contain readable sheets.';
    }
    if (message === 'Shop domain mancante.') {
      return 'Shop domain is missing.';
    }
    if (message === 'Client ID e Client secret Shopify mancanti.') {
      return 'Shopify Client ID and Client secret are missing.';
    }

    const duplicateSku = message.match(/^SKU duplicato\. Già presente alla riga (\d+)\.$/);
    if (duplicateSku) {
      return `Duplicate SKU. Already present on row ${duplicateSku[1]}.`;
    }

    const missingImage = message.match(/^Immagine non trovata: (.+)$/);
    if (missingImage) {
      return `Image not found: ${missingImage[1]}`;
    }

    const uploadFailed = message.match(/^Upload immagine fallito: (.+)$/);
    if (uploadFailed) {
      return `Image upload failed: ${uploadFailed[1]}`;
    }

    const shopifyAuthFailed = message.match(/^Autenticazione Shopify fallita \(client credentials\): (.+)$/);
    if (shopifyAuthFailed) {
      return `Shopify authentication failed (client credentials): ${shopifyAuthFailed[1]}`;
    }

    return message;
  }
}
