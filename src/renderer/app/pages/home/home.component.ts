import { Component, OnInit } from '@angular/core';
import { PackageUtils } from '@renderer/utils/package.utils';

@Component({
  selector: 'app-home',
  templateUrl: 'home.component.html'
})
export class HomeComponent implements OnInit {
  version: string = PackageUtils.get('version');

  ngOnInit() {
  }
}
