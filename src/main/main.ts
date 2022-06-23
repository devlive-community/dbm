import { app, BrowserWindow, globalShortcut, ipcMain, nativeImage, Tray } from 'electron';
import * as path from 'path';
import { createAbout } from './about';
import { createMenu } from './menu';
import { handlerUpdater } from './update';
import { handlerTray } from "./tray";

let win: BrowserWindow = null;
const isDevelopment = process.env.NODE_ENV === 'development';

let tray: Tray = null;
const image = nativeImage.createFromPath(
  path.join(__dirname, '../shared/assets/icons/favicon.png')
);

function createWindow(): BrowserWindow {
  if (win !== null) {
    win = null;
  }
  win = new BrowserWindow({
    center: true,
    width: 800,
    height: 550,
    webPreferences: {
      nodeIntegration: true,
      allowRunningInsecureContent: isDevelopment,
      contextIsolation: false,
      // enableRemoteModule: false,
      // Fix Access-Control-Allow-Origin
      webSecurity: false
    }
  });
  createMenu(app);
  createAbout(app);
  // Maximize window
  win.maximize();
  const winURL = isDevelopment
    ? 'http://localhost:4200'
    : `file://${path.join(__dirname, '/../renderer/index.html')}`;
  if (isDevelopment) {
    win.webContents.openDevTools();
  }
  win.loadURL(winURL).then(() => {
  });
  win.on('closed', (event) => {
    win = null;
    event.preventDefault();
  });
  if (isDevelopment) {
    app.dock.setIcon(path.join(__dirname, '../shared/assets/icons/favicon.png'));
  }
  handlerUpdater(win);
  if (tray === null) {
    tray = new Tray(image.resize({width: 16, height: 16}));
    handlerTray(tray, app, win);
  }
  return win;
}

try {
  app.on('ready', () => {
    if (win == null) {
      createWindow();
    }
    // Turn on debug mode
    globalShortcut.register('CommandOrControl+Shift+L', () => {
      win.webContents.openDevTools();
    });
  });
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
    handlerUpdater(win);
  });
  // handle the ping from renderer
  ipcMain.handle('PING', () => 'PONG');
} catch (e) {
  console.warn('Err: ', e);
  process.exit(0);
}

export { createWindow };
