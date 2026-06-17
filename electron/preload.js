const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('shopifyImporter', {
  selectExcel: () => ipcRenderer.invoke('dialog:selectExcel'),
  selectFolder: () => ipcRenderer.invoke('dialog:selectFolder'),
  getSettings: () => ipcRenderer.invoke('settings:get'),
  saveSettings: (settings) => ipcRenderer.invoke('settings:save', settings),
  clearSettings: () => ipcRenderer.invoke('settings:clear'),
  testConnection: () => ipcRenderer.invoke('shopify:test'),
  previewImport: (payload) => ipcRenderer.invoke('import:preview', payload),
  runImport: (payload) => ipcRenderer.invoke('import:run', payload),
  onProgress: (callback) => {
    const listener = (_event, progress) => callback(progress);
    ipcRenderer.on('import:progress', listener);
    return () => ipcRenderer.removeListener('import:progress', listener);
  },
  updates: {
    getAppVersion: () => ipcRenderer.invoke('updates:appVersion'),
    check: () => ipcRenderer.invoke('updates:check'),
    download: () => ipcRenderer.invoke('updates:download'),
    install: () => ipcRenderer.invoke('updates:install'),
    onStatus: (callback) => {
      const listener = (_event, status) => callback(status);
      ipcRenderer.on('updates:status', listener);
      return () => ipcRenderer.removeListener('updates:status', listener);
    }
  }
});
