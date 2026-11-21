import { Component, inject, input } from '@angular/core';
import { KeyRouter } from '../../../../core/router/key-router';
import { MatTree, MatTreeNode, MatTreeNodeDef, MatTreeNodePadding, MatTreeNodeToggle } from '@angular/material/tree';
import { MenuRoute } from '../../../../core/router/router.interfaces';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { KeyRouterLink } from '../../../../core/router/key-router-link';
import { TranslationPipe } from '../../../../core/translations/translation-pipe';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  imports: [
    MatTree,
    MatTreeNode,
    MatIconButton,
    MatTreeNodeDef,
    MatTreeNodePadding,
    MatTreeNodeToggle,
    MatIcon,
    KeyRouterLink,
    TranslationPipe,
    MatTooltip,
  ],
  selector: 'app-menu',
  styleUrl: './menu.scss',
  templateUrl: './menu.html',
})
export class Menu {
  menuRoutes = inject(KeyRouter).menuRoutes;
  collapsed = input.required<boolean>();

  childrenAccessor = (node: MenuRoute) => node.children ?? [];

  hasChild = (_: number, node: MenuRoute) => !!node.children && node.children.length > 0;

  typeMenu(node: any) {
    return node as MenuRoute;
  }
}
