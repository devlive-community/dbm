import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';

let win: BrowserWindow = null;

const isDevelopment = process.env.NODE_ENV === 'development';

function createWindow(): BrowserWindow {
  win = new BrowserWindow({
    center: true,
    width: 800,
    height: 550,
    webPreferences: {
      nodeIntegration: true,
      allowRunningInsecureContent: isDevelopment,
      contextIsolation: false,
      enableRemoteModule: false
    },
  });

  const winURL = isDevelopment
    ? 'http://localhost:4200'
    : `file://${path.join(__dirname, '/../renderer/index.html')}`;

  if (isDevelopment) {
    win.webContents.openDevTools();
  }

  win.loadURL(winURL).then(() => {
  });

  win.on('closed', () => {
    win = null;
  });

  return win;
}

try {
  app.on('ready', () => setTimeout(createWindow, 400));

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    if (win === null) {
      createWindow();
    }
  });

  // handle the ping from renderer
  ipcMain.handle('PING', () => 'PONG');

} catch (e) {
  console.warn('Err: ', e);
  process.exit(0);
}
