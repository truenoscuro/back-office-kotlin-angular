import { Component, inject } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { MatDrawer, MatDrawerContainer, MatDrawerContent } from '@angular/material/sidenav';
import { BackOfficeRouter } from '../../../shared/router/back-office-router';

@Component({
  imports: [MatToolbar, MatIcon, MatIconButton, MatDrawerContainer, MatDrawer, MatDrawerContent],
  selector: 'app-layout',
  styleUrl: './layout.scss',
  templateUrl: './layout.html',
})
export class Layout {
  //Menus!
  menus = inject(BackOfficeRouter).menuRoutes;
}
