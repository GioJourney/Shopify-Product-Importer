const path = require('path');
const { app, BrowserWindow, dialog, ipcMain, safeStorage } = require('electron');
const Store = require('electron-store').default ?? require('electron-store');
const { previewImport, runImport } = require('./services/import-runner');
const { ShopifyGraphqlClient } = require('./shopify/graphql-client');
const { serializeError } = require('./shared/error-codes');
const {
  initAutoUpdater,
  checkForUpdates,
  downloadUpdate,
  quitAndInstall,
} = require('./services/updater');

let mainWindow = null;

const store = new Store({
  name: 'shopify-product-importer',
  defaults: {
    shopDomain: '',
    apiVersion: '2026-04',
    clientId: '',
    encryptedClientSecret: '',
  },
});

const ENC_PREFIX = 'enc:';
const PLAIN_PREFIX = 'plain:';

function encryptSecret(secret) {
  if (!secret) return '';
  if (safeStorage.isEncryptionAvailable()) {
    return ENC_PREFIX + safeStorage.encryptString(secret).toString('base64');
  }
  return PLAIN_PREFIX + Buffer.from(secret, 'utf8').toString('base64');
}

function decryptSecret(value) {
  if (!value) return '';

  if (value.startsWith(ENC_PREFIX)) {
    if (!safeStorage.isEncryptionAvailable()) return '';
    const buffer = Buffer.from(value.slice(ENC_PREFIX.length), 'base64');
    try {
      return safeStorage.decryptString(buffer);
    } catch {
      return '';
    }
  }

  if (value.startsWith(PLAIN_PREFIX)) {
    return Buffer.from(value.slice(PLAIN_PREFIX.length), 'base64').toString('utf8');
  }

  const buffer = Buffer.from(value, 'base64');
  if (safeStorage.isEncryptionAvailable()) {
    try {
      return safeStorage.decryptString(buffer);
    } catch {
      return buffer.toString('utf8');
    }
  }
  return buffer.toString('utf8');
}

function createWindow() {
  const window = new BrowserWindow({
    width: 1180,
    height: 820,
    minWidth: 960,
    minHeight: 700,
    show: false,
    icon: path.join(__dirname, 'icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
    },
  });

  const isDev = !app.isPackaged || process.env.ELECTRON_DEV === '1';
  if (isDev) {
    window.loadURL('http://127.0.0.1:4200');
    window.webContents.openDevTools({ mode: 'detach' });
  } else {
    window.loadFile(path.join(__dirname, '../dist/renderer/browser/index.html'));
  }

  window.once('ready-to-show', () => window.show());
  mainWindow = window;
  window.on('closed', () => {
    if (mainWindow === window) mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();
  initAutoUpdater(() => mainWindow);
  checkForUpdates().catch(() => undefined);

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.handle('dialog:selectExcel', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [{ name: 'Excel/LibreOffice', extensions: ['xlsx', 'xls', 'ods', 'csv'] }],
  });
  return result.canceled ? null : result.filePaths[0];
});

ipcMain.handle('dialog:selectFolder', async () => {
  const result = await dialog.showOpenDialog({ properties: ['openDirectory'] });
  return result.canceled ? null : result.filePaths[0];
});

ipcMain.handle('settings:get', () => ({
  shopDomain: store.get('shopDomain'),
  apiVersion: store.get('apiVersion'),
  clientId: store.get('clientId'),
  hasSecret: Boolean(store.get('encryptedClientSecret')),
  encryptionAvailable: safeStorage.isEncryptionAvailable(),
}));

ipcMain.handle('settings:save', (_event, settings) => {
  store.set('shopDomain', settings.shopDomain || '');
  store.set('apiVersion', settings.apiVersion || '2026-04');
  store.set('clientId', settings.clientId || '');
  if (settings.clientSecret) {
    store.set('encryptedClientSecret', encryptSecret(settings.clientSecret));
  }
  return { ok: true };
});

ipcMain.handle('settings:clear', () => {
  store.set('shopDomain', '');
  store.set('apiVersion', '2026-04');
  store.set('clientId', '');
  store.set('encryptedClientSecret', '');
  return { ok: true };
});

ipcMain.handle('shopify:test', async () => {
  try {
    const client = new ShopifyGraphqlClient({
      shopDomain: store.get('shopDomain'),
      clientId: store.get('clientId'),
      clientSecret: decryptSecret(store.get('encryptedClientSecret')),
      apiVersion: store.get('apiVersion'),
    });
    return await client.testConnection();
  } catch (error) {
    return { ok: false, error: serializeError(error) };
  }
});

ipcMain.handle('import:preview', async (_event, payload) => previewImport(payload));

ipcMain.handle('import:run', async (event, payload) => {
  const settings = {
    shopDomain: store.get('shopDomain'),
    clientId: store.get('clientId'),
    clientSecret: decryptSecret(store.get('encryptedClientSecret')),
    apiVersion: store.get('apiVersion'),
  };

  return runImport({ ...payload, settings }, (progress) =>
    event.sender.send('import:progress', progress),
  );
});

ipcMain.handle('updates:appVersion', () => app.getVersion());

ipcMain.handle('updates:check', async () => {
  try {
    return await checkForUpdates();
  } catch (error) {
    return { state: 'error', message: serializeError(error).message };
  }
});

ipcMain.handle('updates:download', async () => {
  try {
    return await downloadUpdate();
  } catch (error) {
    return { state: 'error', message: serializeError(error).message };
  }
});

ipcMain.handle('updates:install', () => {
  quitAndInstall();
});
