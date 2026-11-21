import { computed, effect, ResourceRef } from '@angular/core';
import { BackOfficeRoute, ComponentLoader, MenuRoute, ScreenRoute } from './router.interfaces';
import { rxResource } from '@angular/core/rxjs-interop';
import { Observable, of, Subject } from 'rxjs';
import { ActivatedRoute, NavigationExtras, Route, Router, Routes } from '@angular/router';
import { ScreenKey } from './screen-keys.type';
import { AppContext } from '../app-context/app-context';

export class KeyRouter {
  readonly #backOfficeData: string = 'backOffice';
  readonly #screenKeyData: string = 'screenKey';
  readonly #screenKeyMap: Record<string, ComponentLoader>;
  readonly #backOfficeRoute: Route;
  readonly #router: Router;

  readonly #backOfficeRoutesRef: ResourceRef<BackOfficeRoute[]>;
  readonly screenPaths = computed(() => {
    if (this.#backOfficeRoutesRef.isLoading()) {
      return {} as Record<ScreenKey, ScreenRoute>;
    }

    const backOfficeRoutes = this.#backOfficeRoutesRef.value();
    const pathScreen: Record<ScreenKey, ScreenRoute> = {} as Record<ScreenKey, ScreenRoute>;
    for (const backOfficeRoute of backOfficeRoutes) {
      const childScreenPaths = this.loadScreenPaths(backOfficeRoute);
      Object.assign(pathScreen, childScreenPaths);
    }
    return pathScreen;
  });
  readonly menuRoutes = computed(() => {
    if (this.#backOfficeRoutesRef.isLoading()) {
      return [];
    }
    const backOfficeRoutes = this.#backOfficeRoutesRef.value();
    const menus: MenuRoute[] = [];
    for (const backOfficeRoute of backOfficeRoutes) {
      const menu = this.loadMenu(backOfficeRoute);
      if (menu) {
        menus.push(menu);
      }
    }
    return menus.sort((a, b) => a.order - b.order);
  });
  readonly #startNavigate = new Subject<void>();
  startNavigate = this.#startNavigate.asObservable();
  #backOfficeRoutesEffect = effect(() => {
    if (this.#backOfficeRoutesRef.isLoading()) {
      return;
    }

    const backOfficeRoute = this.#backOfficeRoutesRef.value();
    if (backOfficeRoute.length === 0) {
      this.#router.initialNavigation();
      return;
    }
    const routes = this.#router.config;
    let backOffice = this.#router.config.find((router) => router.data?.[this.#backOfficeData]);
    if (!backOffice) {
      backOffice = this.#backOfficeRoute;
      backOffice.data = {};
      backOffice.data[this.#backOfficeData] = true;
      routes.push(backOffice);
    }

    if (!backOffice.children || backOffice.children.length === 0) {
      return;
    }
    //Cargamos los hijos
    const children: Routes = [];
    for (const data of backOfficeRoute) {
      const route = this.loadRoutes(data);
      if (route) {
        children.push(route);
      }
    }

    backOffice.children[0].children = undefined;
    backOffice.children[0].loadChildren = () => children;

    //Volvemos a cargar la configuración
    this.#router.resetConfig(routes);
    this.#router.initialNavigation();
    this.#startNavigate.next();
  });

  constructor(
    backOfficeRoute: Route,
    screenKeyMap: Record<ScreenKey, ComponentLoader>,
    loader: () => Observable<BackOfficeRoute[]>,
    router: Router,
    appContext: AppContext,
  ) {
    this.#router = router;
    this.#backOfficeRoute = backOfficeRoute;
    this.#screenKeyMap = screenKeyMap;
    this.#backOfficeRoutesRef = rxResource({
      params: appContext.token,
      stream: ({ params }) => (params ? loader() : of([])),
      defaultValue: [],
    });
  }

  public getPath(key: ScreenKey, params: (number | string)[] = []) {
    const screenPaths = this.screenPaths();
    if (!screenPaths[key]) {
      throw new Error(`Screen path not found for key: ${key}`);
    }
    const path = screenPaths[key].completePath;
    let pathIndex = 0;
    let paramIndex = 0;
    while (pathIndex < path.length && paramIndex < params.length) {
      if (path[pathIndex].startsWith(':')) {
        path[pathIndex] = params[paramIndex].toString();
        paramIndex++;
      }
      pathIndex++;
    }
    return path;
  }

  public navigate(key: ScreenKey, params: (number | string)[] = [], extras?: NavigationExtras) {
    const path = this.getPath(key, params);
    this.#router.navigate(path, extras);
  }

  public getScreenRoute(activatedRoute: ActivatedRoute) {
    const key = activatedRoute.snapshot.data[this.#screenKeyData] as ScreenKey;
    return this.screenPaths()[key];
  }

  private loadRoutes(backOfficeRoute: BackOfficeRoute) {
    const route: Route = {};

    route.path = backOfficeRoute.path;
    route.title = backOfficeRoute.tabBarTitle;
    if (backOfficeRoute.screenKey && this.#screenKeyMap[backOfficeRoute.screenKey]) {
      const componentData = this.#screenKeyMap[backOfficeRoute.screenKey];
      route.loadComponent = componentData.loadComponent;
      route.resources = componentData.resources;
      route.data = componentData.data || {};
      //Añadimos el screenKey
      route.data[this.#screenKeyData] = backOfficeRoute.screenKey;
    }

    const children: Routes = [];
    if (backOfficeRoute.isMenu) {
      for (const child of backOfficeRoute.children) {
        const childRoute = this.loadRoutes(child);
        if (childRoute) {
          children.push(childRoute);
        }
      }
    }

    if (children.length > 0) {
      route.children = undefined;
      route.loadChildren = () => children;
    }

    return route;
  }

  private loadMenu(data: BackOfficeRoute): MenuRoute | undefined {
    if (
      !data.isMenu ||
      !data.menuTitle ||
      data.menuOrder === undefined ||
      data.menuOrder === null
    ) {
      return undefined;
    }

    return {
      title: data.menuTitle,
      icon: data.menuIcon,
      screenKey: data.screenKey,
      order: data.menuOrder,
      children: data.children
        .map((child) => this.loadMenu(child))
        .filter((child) => !!child)
        .sort((a, b) => a.order - b.order),
    };
  }

  private loadScreenPaths(backOfficeRoute: BackOfficeRoute) {
    const pathScreen: Record<ScreenKey, ScreenRoute> = {} as Record<ScreenKey, ScreenRoute>;

    if (backOfficeRoute.screenKey && backOfficeRoute.screenTitle) {
      pathScreen[backOfficeRoute.screenKey] = {
        title: backOfficeRoute.screenTitle,
        completePath: backOfficeRoute.completePath,
        breadcrumbs: backOfficeRoute.breadcrumbs,
      };
      return pathScreen;
    }
    const children = backOfficeRoute.children || [];
    for (const child of children) {
      const childScreenPaths = this.loadScreenPaths(child);
      Object.assign(pathScreen, childScreenPaths);
    }
    return pathScreen;
  }
}
