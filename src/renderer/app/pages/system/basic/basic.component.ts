import { Component } from '@angular/core';
import { BaseComponent } from '@renderer/app/base.component';
import { SystemBasicModel } from '@renderer/model/system.model';
import { BasicService } from '@renderer/services/system/basic.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FormatEnum } from '@renderer/enum/format.enum';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-system.basic',
  templateUrl: 'basic.component.html'
})
export class BasicComponent extends BaseComponent {
  model: SystemBasicModel;
  formats: string[] = new Array();
  languages: { key: string, value: string }[] = new Array();

  constructor(private basicService: BasicService,
              private translateService: TranslateService,
              private messageService: NzMessageService) {
    super();
    this.model = this.basicService.get() === null ? new SystemBasicModel() : this.basicService.get();
    Object.keys(FormatEnum).forEach(value => {
      this.formats.push(value);
    });
    this.languages.push({key: this.translateService.instant('language.english'), value: 'en'},
      {key: this.translateService.instant('language.chinese'), value: 'zh'});
  }

  handlerSave() {
    this.basicService.save(this.model);
    this.messageService.success('Save Successful!');
  }
}
