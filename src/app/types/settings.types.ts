export interface Settings {
  shopDomain: string;
  apiVersion: string;
  clientId: string;
  hasSecret: boolean;
  encryptionAvailable: boolean;
}

export interface SettingsInput {
  shopDomain: string;
  apiVersion: string;
  clientId: string;
  clientSecret: string;
}
