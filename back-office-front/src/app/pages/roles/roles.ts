import { Component } from '@angular/core';
import { BackOfficePage } from '../../../ui/back-office-page/back-office-page';
import { BackOfficeDrawer } from '../../../ui/back-office-page/back-office-drawer/back-office-drawer';
import { MatButton, MatFabButton, MatIconButton } from '@angular/material/button';
import { AutoFab } from '../../../core/buttons/auto-fab';
import { MatIcon } from '@angular/material/icon';
import { ButtonGroup } from '../../../ui/button-group/button-group';
import { AutoIconFab } from '../../../core/buttons/auto-icon-fab';

@Component({
  imports: [
    BackOfficePage,
    BackOfficeDrawer,
    MatButton,
    AutoFab,
    MatIcon,
    MatFabButton,
    ButtonGroup,
    MatIconButton,
    AutoIconFab,
  ],
  selector: 'app-roles',
  styleUrl: './roles.scss',
  templateUrl: './roles.html',
})
export default class Roles {}
