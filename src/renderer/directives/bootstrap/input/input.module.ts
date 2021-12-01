import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { InputComponent } from './input.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [
    InputComponent
  ],
  exports: [
    InputComponent
  ],
  providers: []
})
export class InputModule {
}
