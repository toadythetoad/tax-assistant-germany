import { app, BrowserWindow, ipcMain, dialog, shell } from 'electron';
import path from 'path';
import log from 'electron-log';
import { initDatabase, getDatabase } from './database';

log.initialize();
log.info('Steuer Assistent 2.0 starting...');

let mainWindow: BrowserWindow | null = null;
const isDev = process.env.NODE_ENV !== 'production' && !app.isPackaged;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    show: false,
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  }

  mainWindow.on('closed', () => { mainWindow = null; });
}

app.whenReady().then(async () => {
  await initDatabase();
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.handle('db:getProfile', async () => {
  try {
    const db = getDatabase();
    const result = db.exec('SELECT data FROM profile WHERE id = 1');
    if (result.length > 0 && result[0].values.length > 0) {
      return JSON.parse(result[0].values[0][0] as string);
    }
    return null;
  } catch { return null; }
});

ipcMain.handle('db:saveProfile', async (_, profile: any) => {
  try {
    const db = getDatabase();
    const data = JSON.stringify(profile);
    const now = new Date().toISOString();
    db.run('DELETE FROM profile WHERE id = 1');
    db.run('INSERT INTO profile (id, data, updatedAt) VALUES (1, ?, ?)', [data, now]);
    return { success: true };
  } catch (e) { return { success: false, error: String(e) }; }
});

ipcMain.handle('dialog:selectFolder', async () => {
  const result = await dialog.showOpenDialog(mainWindow!, {
    properties: ['openDirectory', 'createDirectory'],
  });
  return result.filePaths[0] || null;
});

ipcMain.handle('dialog:selectFile', async (_, filters: any) => {
  const result = await dialog.showOpenDialog(mainWindow!, {
    properties: ['openFile', 'multiSelections'],
    filters: filters || [{ name: 'Documents', extensions: ['pdf', 'jpg', 'jpeg', 'png', 'tiff', 'tif'] }],
  });
  return result.filePaths;
});

ipcMain.handle('pdf:openExternal', async (_, filePath: string) => {
  try {
    await shell.openPath(filePath);
    return { success: true };
  } catch (e) { return { success: false, error: String(e) }; }
});

ipcMain.handle('app:getHelpPath', async () => {
  const helpPath = app.isPackaged
    ? path.join(process.resourcesPath, 'help', 'anleitung.pdf')
    : path.join(__dirname, '..', '..', 'public', 'help', 'anleitung.pdf');
  return helpPath;
});

ipcMain.handle('app:getPath', async (_, name: string) => {
  return app.getPath(name as any);
});

ipcMain.handle('ocr:processFile', async (_, filePath: string) => {
  const { processFile } = require('./ocr');
  try {
    return await processFile(filePath);
  } catch (e) {
    return { error: String(e) };
  }
});

ipcMain.handle('ocr:ocrImageBuffer', async (_, base64DataUrl: string) => {
  const { ocrImageBuffer } = require('./ocr');
  try {
    return await ocrImageBuffer(base64DataUrl);
  } catch (e) {
    return { error: String(e) };
  }
});

ipcMain.handle('ocr:paddleFile', async (_, filePath: string) => {
  const { ocrImagePaddle } = require('./ocrPaddle');
  try {
    const result = await ocrImagePaddle(filePath);
    return result;
  } catch (e) {
    return { error: String(e) };
  }
});
