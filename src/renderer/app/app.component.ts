import { Component } from '@angular/core';
import { ipcRenderer } from 'electron';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  constructor() {
    ipcRenderer.invoke('PING').then((result) => {
      console.warn('Renderer Receive: ', result);
    });
  }
}
