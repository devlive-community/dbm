import {NgModule} from '@angular/core';
import {HttpService} from '@renderer/services/http.service';
import {BasicService} from '@renderer/services/system/basic.service';
import {SshService} from '@renderer/services/ssh.service';
import {PrestoService} from "@renderer/services/presto.service";
import {FactoryService} from "@renderer/services/factory.service";

@NgModule({
  exports: [],
  providers: [
    BasicService,
    HttpService,
    SshService,
    PrestoService,
    FactoryService
  ]
})
export class ServiceModule {
}
