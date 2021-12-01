import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RadioConfiguration } from '@renderer/directives/bootstrap/radio/radio.configuration';

@Component({
  selector: 'app-directive-bootstrap-radio',
  templateUrl: './radio.component.html'
})
export class RadioComponent implements OnInit {
  @Input()
  config: RadioConfiguration;
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
