import { Component, EventEmitter, Input, Output } from "@angular/core";
import { BaseComponent } from "@renderer/app/base.component";
import { DatasourceDeleteModel } from "@renderer/components/datasource/delete/datasource.delete.model";
import { NzMessageService } from "ng-zorro-antd/message";
import { TranslateService } from "@ngx-translate/core";
import { DatasourceService } from "@renderer/services/management/datasource.service";

@Component({
  selector: 'app-component-datasource-delete',
  templateUrl: './datasource.delete.component.html'
})
export class DatasourceDeleteComponent extends BaseComponent {
  @Input()
  applyValue: DatasourceDeleteModel;
  @Output()
  emitter = new EventEmitter<any>();
  inputValue: string;

  constructor(private messageService: NzMessageService,
              private translateService: TranslateService,
              private datasourceService: DatasourceService) {
    super();
  }

  handlerCloseModal() {
    this.applyValue.value = null;
    this.applyValue.deleted = false;
    this.inputValue = null;
    this.emitter.emit(this.applyValue);
  }

  handlerValidate() {
    if (this.inputValue === this.applyValue.value.alias) {
      this.disabled.button = false;
    } else {
      this.disabled.button = true;
    }
  }

  handlerQuicklyEnter() {
    this.inputValue = this.applyValue.value.alias;
    this.handlerValidate();
  }

  handlerDelete() {
    this.loading.button = true;
    this.datasourceService.delete(this.applyValue.value.id).then(() => {
      this.loading.button = false;
      this.messageService.success(this.translateService.instant('common.success'));
      this.applyValue.visible = false;
      this.applyValue.value = null;
      this.applyValue.deleted = true;
      this.inputValue = null;
      this.emitter.emit(this.applyValue);
    }).catch(error => {
      this.loading.button = false;
      this.applyValue.deleted = false;
      this.messageService.error(error);
      this.emitter.emit(this.applyValue);
    });
  }
}
