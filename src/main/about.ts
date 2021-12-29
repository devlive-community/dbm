import config from '../../package.json';
import { App } from 'electron';

function createAbout(app: App): void {
  app.setAboutPanelOptions({
    applicationName: config.name,
    applicationVersion: config.version,
    version: config.version,
    copyright: config.author,
    website: config.github,
    iconPath: '../shared/assets/icons/favicon.png',
  });
}

export {
  createAbout
};
