import { ComponentLoader } from '../core/router/router.interfaces';
import { ScreenKey } from '../core/router/screen-keys.type';

export const screenKeyMap: Record<ScreenKey, ComponentLoader> = {
  dashboard: {
    loadComponent: () => import('./pages/dashboard/dashboard'),
  },
  roles: {
    loadComponent: () => import('./pages/roles/roles'),
  },
  routes: {
    loadComponent: () => import('./pages/routes/routes'),
  },
  users: {
    loadComponent: () => import('./pages/users/users'),
  },
  anonymous: {
    loadComponent: () => import('./pages/anonymous/anonymous'),
  },
};
