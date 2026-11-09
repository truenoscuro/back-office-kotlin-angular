import { inject, provideAppInitializer } from '@angular/core';
import { AppContext } from './app-context';
import { HttpClient } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { PermissionKey } from '../security/permission-keys.type';

export function provideAppContext() {
  return [
    provideAppInitializer(() => {
      const appContext = inject(AppContext);
      const token = appContext.token();
      if (!token) {
        return;
      }
      inject(HttpClient)
        .get<{
          token: string;
          role: string;
          email: string;
          permissions: PermissionKey[];
        }>('/api/auth/verify')
        .pipe(
          catchError(() => {
            appContext.clear();
            return throwError(() => new Error('Failed to verify token'));
          }),
        )
        .subscribe(({ token, role, email, permissions }) => {
          appContext.token = token;
          appContext.role = role;
          appContext.email = email;
          appContext.permissions = permissions;
        });
    }),
  ];
}
