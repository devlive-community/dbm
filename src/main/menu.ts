import { App, Menu } from 'electron';

const platform = process.platform;

function createMenu(app: App): void {
  if (platform === 'darwin') {
    createMenuForDarwin(app);
  } else {
    Menu.setApplicationMenu(null);
  }
}

function createMenuForDarwin(app: App) {
  const template = [
    {
      label: 'Application',
      submenu: [
        {
          label: 'About',
          role: 'about'
        },
        {
          label: 'Quit',
          accelerator: 'Command+Q',
          click() {
            app.quit();
          }
        }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        {
          label: 'Copy',
          accelerator: 'CmdOrCtrl+C',
          selector: 'copy:'
        },
        {
          label: 'Cut',
          accelerator: 'CmdOrCtrl+X',
          selector: 'cut:'
        },
        {
          label: 'Paste',
          accelerator: 'CmdOrCtrl+V',
          selector: 'paste:'
        },
        {
          label: 'Select All',
          accelerator: 'CmdOrCtrl+A',
          selector: 'selectAll:'
        }
      ]
    }
  ];
  // @ts-ignore
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

export {
  createMenu
};
