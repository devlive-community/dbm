import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CommonModule, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NZ_CONFIG, NzConfig } from 'ng-zorro-antd/core/config';

const ngZorroConfig: NzConfig = {
  card: {
    nzSize: 'small'
  },
  button: {
    nzSize: 'small'
  },
  table: {
    nzSize: 'small'
  },
  modal: {
    nzMaskClosable: false
  }
};

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AppRoutingModule
  ],
  providers: [
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    },
    {provide: NZ_CONFIG, useValue: ngZorroConfig}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
