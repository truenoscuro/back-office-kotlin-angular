import { Component } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-drawer',
  template: '<ng-content/>',
  styles: `
    :host {
      display: block;
    }
  `,
})
export class Drawer {}
