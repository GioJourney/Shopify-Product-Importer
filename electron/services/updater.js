const { app } = require('electron');
const { autoUpdater } = require('electron-updater');

autoUpdater.autoDownload = false;
autoUpdater.autoInstallOnAppQuit = true;

function initAutoUpdater(getWindow) {
  const send = (status) => {
    const window = getWindow();
    if (window && !window.isDestroyed()) {
      window.webContents.send('updates:status', status);
    }
  };

  autoUpdater.on('checking-for-update', () => send({ state: 'checking' }));
  autoUpdater.on('update-available', (info) => send({ state: 'available', version: info.version }));
  autoUpdater.on('update-not-available', (info) =>
    send({ state: 'not-available', version: info.version }),
  );
  autoUpdater.on('download-progress', (progress) =>
    send({ state: 'downloading', percent: Math.round(progress.percent) }),
  );
  autoUpdater.on('update-downloaded', (info) =>
    send({ state: 'downloaded', version: info.version }),
  );
  autoUpdater.on('error', (error) =>
    send({ state: 'error', message: error ? error.message || String(error) : 'unknown error' }),
  );
}

function isUpdatable() {
  return app.isPackaged;
}

async function checkForUpdates() {
  if (!isUpdatable()) {
    return { state: 'disabled' };
  }
  await autoUpdater.checkForUpdates();
  return { state: 'checking' };
}

async function downloadUpdate() {
  if (!isUpdatable()) {
    return { state: 'disabled' };
  }
  await autoUpdater.downloadUpdate();
  return { state: 'downloading' };
}

function quitAndInstall() {
  autoUpdater.quitAndInstall();
}

module.exports = { initAutoUpdater, checkForUpdates, downloadUpdate, quitAndInstall, isUpdatable };
