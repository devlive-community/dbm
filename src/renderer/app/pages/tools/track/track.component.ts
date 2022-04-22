import { Component } from '@angular/core';
import { BaseComponent } from '@renderer/app/base.component';
import { DatasourceService } from '@renderer/services/management/datasource.service';
import { DatasourceModel } from '@renderer/model/datasource.model';
import { TrackService } from '@renderer/services/tools/track.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { TrackEnum } from '@renderer/enum/track.enum';
import { ColorEnum } from '@renderer/enum/color.enum';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-tools-track',
  templateUrl: 'track.component.html'
})
export class TrackComponent extends BaseComponent {
  datasource: string;
  dataSources: DatasourceModel[];
  tracks: any[];
  trackId: string = null;
  trackInfo: any[];
  queryDDL: string;

  constructor(private datasourceService: DatasourceService,
              private trackService: TrackService,
              private messageService: NzMessageService,
              private modal: NzModalService) {
    super();
    this.datasourceService.getAll().then(response => {
      this.dataSources = response;
    });
  }

  handlerSearch(value: string) {
    this.loading.button = true;
    this.trackService.getTrackTop(this.datasource).then(response => {
      if (response.status) {
        this.tracks = response?.data?.columns;
      } else {
        this.messageService.error(response.message);
      }
      this.loading.button = false;
    });
  }

  handlerGetTrackInfo() {
    this.loading.button = true;
    this.trackService.getTrackInfo(this.datasource, this.trackId).then(response => {
      if (response.status) {
        this.trackInfo = response?.data?.columns;
      } else {
        this.messageService.error(response.message);
      }
      this.loading.button = false;
    });
  }

  handlerGetColor(value: TrackEnum) {
    let color;
    switch (value) {
      case TrackEnum.QueryStart:
        color = ColorEnum.gray;
        break;
      case TrackEnum.QueryFinish:
        color = ColorEnum.green;
        break;
      case TrackEnum.ExceptionBeforeStart:
        color = ColorEnum.red;
        break;
    }
    return color;
  }

  handlerGetKeys(track: any) {
    return Object.keys(track).filter(value => value !== 'query')
    .filter(value => value !== 'exception')
    .filter(value => value !== 'stack');
  }

  handlerShowMessage(item: any, key: string) {
    this.modal.error({
      nzTitle: key,
      nzContent: item[key],
      nzOkText: 'OK'
    });
  }

  handlerShowDDL(item: any, close: boolean) {
    if (close) {
      this.disabled.button = false;
      this.queryDDL = item.query;
    } else {
      this.disabled.button = true;
    }
  }
}
