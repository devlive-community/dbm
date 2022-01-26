import { Injectable } from '@angular/core';
import { ClipboardService } from 'ngx-clipboard';
import { NzMessageService } from 'ng-zorro-antd/message';

@Injectable()
export class ClipboardComService {
  constructor(private clipboardService: ClipboardService,
              private messageService: NzMessageService) {
  }

  copy(text: string) {
    this.clipboardService.copy(text);
    this.messageService.success('Success');
  }
}
