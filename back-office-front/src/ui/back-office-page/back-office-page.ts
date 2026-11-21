import { Component, viewChild } from '@angular/core';
import { HeaderScreen } from '../header-screen/header-screen';
import { DrawerContainer } from '../drawer-container/drawer-container';
import { Drawer } from '../drawer-container/app-drawer/drawer.component';

@Component({
  imports: [HeaderScreen, DrawerContainer, Drawer],
  selector: 'app-back-office-page',
  styleUrl: './back-office-page.scss',
  templateUrl: './back-office-page.html',
})
export class BackOfficePage {
  protected _drawer = viewChild.required(DrawerContainer);

  public toggle() {
    this._drawer().toggle();
  }
}
