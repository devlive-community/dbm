import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RadioComponent } from './radio.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [
    RadioComponent
  ],
  exports: [
    RadioComponent
  ],
  providers: []
})
export class RadioModule {
}
