import { NgModule } from '@angular/core';
import { HttpService } from '@renderer/services/http.service';
import { BasicService } from '@renderer/services/system/basic.service';

@NgModule({
  exports: [],
  providers: [
    BasicService,
    HttpService
  ]
})
export class ServiceModule {
}
