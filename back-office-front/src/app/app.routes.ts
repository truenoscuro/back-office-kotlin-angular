import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { AppContext } from '../shared/app-context/app-context';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: () => {
      const token = inject(AppContext).token();
      if (token) {
        return '/back-office';
      }

      return '/login';
    },
  },
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login'),
  },
];
