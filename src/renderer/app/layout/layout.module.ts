import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { LayoutRouting } from './layout.routing';
import { LayoutComponent } from './layout.component';
import { HeaderComponent } from './header/header.component';
import { CommonModule } from '@angular/common';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgZorroAntdModule } from '@renderer/app/ng-zorro-antd.module';

const httpLoaderFactory = (http: HttpClient): TranslateHttpLoader =>
  new TranslateHttpLoader(http, './renderer/assets/i18n/', '.json');

@NgModule({
  declarations: [
    LayoutComponent,
    HeaderComponent
  ],
  imports: [
    LayoutRouting,
    FormsModule,
    CommonModule,
    NgZorroAntdModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: []
})
export class LayoutModule {
}
