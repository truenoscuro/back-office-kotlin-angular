import { Route } from '@angular/router';
import { ScreenKey } from './screen-keys.type';
import { TranslationKey } from '../translations/translation-keys.type';

export interface MenuRoute {
  title: TranslationKey;
  icon?: string;
  order: number;
  screenKey?: ScreenKey;
  children?: MenuRoute[];
}

export interface ScreenRoute {
  title: TranslationKey;
  completePath: string[];
  breadcrumbs: Breadcrumb[];
}

export interface Breadcrumb {
  title: TranslationKey;
  key?: ScreenKey;
}
export interface BackOfficeRoute {
  path: string;
  completePath: string[];
  children: BackOfficeRoute[];
  breadcrumbs: Breadcrumb[];
  // Propiedades menus
  isMenu: boolean;
  menuTitle?: TranslationKey;
  menuIcon?: string;
  menuOrder?: number;

  //propeidades screens
  screenKey?: ScreenKey;
  tabBarTitle?: TranslationKey;
  screenTitle?: TranslationKey;
}

export type ComponentLoader = Pick<Route, 'loadComponent' | 'pathMatch' | 'resources' | 'data'>;
