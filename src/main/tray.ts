import { app, BrowserWindow, ipcMain, ipcRenderer, Menu, Tray } from "electron";

function handlerTray(tray: Tray, app, win: BrowserWindow) {
  tray.on("click", () => {
    // Trigger the reactivation window
    // app.emit('activate');
    tray.popUpContextMenu(createClickMenu(app, win));
  });
}

function createClickMenu(app, win: BrowserWindow): Menu {

  return Menu.buildFromTemplate([
    {
      label: 'Open',
      click: function () {
        app.emit('activate');
      }
    },
    {
      label: 'Quit',
      click: function () {
        if (process.platform !== 'darwin') {
          app.quit();
        }
      }
    }
  ]);
}

export {
  handlerTray
}
