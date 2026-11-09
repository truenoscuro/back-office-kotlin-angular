import { Route, Router } from '@angular/router';
import { BackOfficeRoute, ComponentLoader } from './router.interfaces';
import { Observable } from 'rxjs';
import {
  EnvironmentProviders,
  inject,
  makeEnvironmentProviders,
  provideAppInitializer,
} from '@angular/core';
import { BackOfficeRouter } from './back-office-router';
import { ScreenKey } from './screen-keys.type';
import { AppContext } from '../app-context/app-context';

export type RouterBackendLoaderFactory = () => Observable<BackOfficeRoute[]>;

export function provideBackOfficeRouter(config: {
  route: Route;
  screenKeyMap: Record<ScreenKey, ComponentLoader>;
  loader: () => RouterBackendLoaderFactory;
}): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: BackOfficeRouter,
      useFactory: () => {
        const router = inject(Router);
        const appContext = inject(AppContext);
        return new BackOfficeRouter(
          config.route,
          config.screenKeyMap,
          config.loader(),
          router,
          appContext,
        );
      },
    },
    provideAppInitializer(() => {
      inject(BackOfficeRouter);
    }),
  ]);
}
