import { ApplicationConfig, inject, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withDisabledInitialNavigation } from '@angular/router';
import { routes } from './app.routes';
import { provideTranslation } from '../core/translations/translation.provider';
import {
  HttpBackend,
  HttpClient,
  HttpErrorResponse,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import { provideBackOfficeRouter } from '../core/router/router.provider';
import { screenKeyMap } from './screen-key-map';

import { AppContext } from '../core/app-context/app-context';
import { BackOfficeRoute } from '../core/router/router.interfaces';
import { catchError, throwError } from 'rxjs';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withDisabledInitialNavigation()),
    provideHttpClient(
      withInterceptors([
        (req, next) => {
          const context = inject(AppContext);
          const token = context.token();
          const reqAuth = req.clone({
            headers: req.headers.set('Authorization', `Bearer ${token}`),
          });
          return next(reqAuth);
        },
        (req, next) => {
          const appContext = inject(AppContext);
          return next(req).pipe(
            catchError((error) => {
              if (error instanceof HttpErrorResponse && error.status === 401) {
                appContext.clear();
              }
              return throwError(() => error);
            }),
          );
        },
      ]),
    ),

    //Añadimos las traducciones
    provideTranslation({
      language: 'es',
      loader: () => {
        const httpBackend = inject(HttpBackend);
        const httpClient = new HttpClient(httpBackend);
        return (lang) => httpClient.get<Record<string, string>>(`/api/i18n/${lang}`);
      },
    }),

    //Añade las rutas del back-office
    provideBackOfficeRouter({
      route: {
        path: 'back-office',
        children: [
          {
            path: '',
            loadComponent: () => import('./back-office/back-office'),
          },
        ],
      },
      screenKeyMap: screenKeyMap,
      loader: () => {
        const httpClient = inject(HttpClient);
        return () => httpClient.get<BackOfficeRoute[]>('/api/routes/me');
      },
    }),

    provide
  ],
};
