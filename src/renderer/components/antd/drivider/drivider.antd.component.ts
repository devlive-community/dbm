import { Component, Input, OnInit, QueryList, ViewChildren } from '@angular/core';

@Component({
  selector: 'app-component-antd-drivider',
  templateUrl: 'drivider.antd.component.html'
})
export class DrividerAntdComponent implements OnInit {
  @Input()
  title: string;
  @Input()
  description: string;

  ngOnInit(): void {
  }
}
