import { NgModule } from '@angular/core';
import { HttpService } from '@renderer/services/http.service';
import { BasicService } from '@renderer/services/system/basic.service';
import { SshService } from '@renderer/services/ssh.service';

@NgModule({
  exports: [],
  providers: [
    BasicService,
    HttpService,
    SshService
  ]
})
export class ServiceModule {
}
