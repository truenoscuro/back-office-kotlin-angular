import { ApplicationConfig, inject, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withDisabledInitialNavigation } from '@angular/router';
import { routes } from './app.routes';
import { provideTranslation } from '../shared/translations/translation.provider';
import { HttpBackend, HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideBackOfficeRouter } from '../shared/router/router.provider';
import { screenKeyMap } from './screen-key-map';

import { AppContext } from '../shared/app-context/app-context';
import { TranslationKey } from '../shared/translations/translation-keys.type';
import { BackOfficeRoute } from '../shared/router/router.interfaces';

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
      ]),
    ),

    //Añadimos las traducciones
    provideTranslation({
      language: 'es',
      loader: () => {
        const httpBackend = inject(HttpBackend);
        const httpClient = new HttpClient(httpBackend);
        return (lang) => httpClient.get<Record<string, string>>(`/api/i8n/translations/${lang}`);
      },
      titleStrategy: (snapshot) => (snapshot.root.title as TranslationKey) || '',
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
  ],
};
