import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Layout } from './layout/layout';

@Component({
  imports: [RouterOutlet, Layout],
  selector: 'app-backend',
  styles: ``,
  template: `
    <app-layout>
      <router-outlet />
    </app-layout>
  `,
})
export default class BackOffice {}
