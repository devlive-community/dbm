import { Component } from '@angular/core';
import { ipcRenderer } from 'electron';
import { BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  constructor(private bsModalService: BsModalService) {
    this.bsModalService.config.ignoreBackdropClick = true;
    ipcRenderer.invoke('PING').then((result) => {
      console.warn('Renderer Receive: ', result);
    });
  }
}
