const path = require('path');
const { app, BrowserWindow, dialog, ipcMain, safeStorage } = require('electron');
const Store = require('electron-store').default ?? require('electron-store');
const { previewImport, runImport } = require('./services/import-runner');
const { ShopifyGraphqlClient } = require('./shopify/graphql-client');

const store = new Store({
  name: 'shopify-product-importer',
  defaults: {
    shopDomain: '',
    apiVersion: '2026-04',
    clientId: '',
    encryptedClientSecret: ''
  }
});

function encryptSecret(secret) {
  if (!secret) return '';
  if (!safeStorage.isEncryptionAvailable()) return Buffer.from(secret, 'utf8').toString('base64');
  return safeStorage.encryptString(secret).toString('base64');
}

function decryptSecret(value) {
  if (!value) return '';
  const buffer = Buffer.from(value, 'base64');
  if (!safeStorage.isEncryptionAvailable()) return buffer.toString('utf8');
  return safeStorage.decryptString(buffer);
}

function createWindow() {
  const window = new BrowserWindow({
    width: 1180,
    height: 820,
    minWidth: 960,
    minHeight: 700,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false
    }
  });

  const isDev = !app.isPackaged || process.env.ELECTRON_DEV === '1';
  if (isDev) {
    window.loadURL('http://127.0.0.1:4200');
    window.webContents.openDevTools({ mode: 'detach' });
  } else {
    window.loadFile(path.join(__dirname, '../dist/renderer/browser/index.html'));
  }

  window.once('ready-to-show', () => window.show());
}

app.whenReady().then(() => {
  createWindow();

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
    filters: [{ name: 'Excel/LibreOffice', extensions: ['xlsx', 'xls', 'ods', 'csv'] }]
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
  hasSecret: Boolean(store.get('encryptedClientSecret'))
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

ipcMain.handle('shopify:test', async () => {
  try {
    const client = new ShopifyGraphqlClient({
      shopDomain: store.get('shopDomain'),
      clientId: store.get('clientId'),
      clientSecret: decryptSecret(store.get('encryptedClientSecret')),
      apiVersion: store.get('apiVersion')
    });
    return await client.testConnection();
  } catch (error) {
    return { ok: false, error: error.message };
  }
});

ipcMain.handle('import:preview', async (_event, payload) => previewImport(payload));

ipcMain.handle('import:run', async (event, payload) => {
  const settings = {
    shopDomain: store.get('shopDomain'),
    clientId: store.get('clientId'),
    clientSecret: decryptSecret(store.get('encryptedClientSecret')),
    apiVersion: store.get('apiVersion')
  };

  return runImport(
    { ...payload, settings },
    (progress) => event.sender.send('import:progress', progress)
  );
});
