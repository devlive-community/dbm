import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { InputConfiguration } from '@renderer/directives/bootstrap/input/input.configuration';

@Component({
  selector: 'app-directive-bootstrap-input',
  templateUrl: './input.component.html'
})
export class InputComponent implements OnInit {
  @Input()
  config: InputConfiguration;

  @Output()
  messageChange = new EventEmitter<string>();

  @Input()
  get message() {
    return this.inputValue;
  }

  set message(value) {
    this.inputValue = value;
    this.messageChange.emit(this.inputValue);
  }

  inputValue: string;

  ngOnInit(): void {
  }
}
