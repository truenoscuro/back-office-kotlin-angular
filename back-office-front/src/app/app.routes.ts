import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { AppContext } from '../core/app-context/app-context';
import Login from './auth/login/login';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: () => {
      const token = inject(AppContext).token();

      if (token) {
        return 'back-office';
      }
      console.info('Redirecting to login');
      return 'login';
    },
  },
  {
    path: 'login',
    component: Login,
  },
];
