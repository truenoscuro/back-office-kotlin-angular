import { Component, signal } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { Menu } from './menu/menu';
import { DrawerContainer } from '../../../ui/drawer-container/drawer-container';
import { Drawer } from '../../../ui/drawer-container/app-drawer/drawer.component';

@Component({
  imports: [MatToolbar, MatIcon, MatIconButton, Menu, DrawerContainer, Drawer],
  selector: 'app-layout',
  styleUrl: './layout.scss',
  templateUrl: './layout.html',
})
export class Layout {
  readonly collapseThreshold = 120;
  isCollapsed = signal(false);

  onChangeCollapsed(drawerWidth: number): void {
    this.isCollapsed.set(drawerWidth <= this.collapseThreshold);
  }
}
