import { inject, Service, signal } from '@angular/core';
import { AppContext } from '../app-context/app-context';
import {
  disabled,
  PathKind,
  SchemaPath,
  SchemaPathRules,
  SchemaPathTree,
} from '@angular/forms/signals';
import { PermissionKey } from './permission-keys.type';

@Service()
export class Authority {
  private appContext = inject(AppContext);

  public haveAllPermissions(permissions: PermissionKey[]) {
    for (const permission of permissions) {
      if (!this.appContext.permissions().includes(permission)) {
        return false;
      }
    }
    return true;
  }

  public hasAuthority<TValue, TPathKind extends PathKind = PathKind.Root>(
    path: SchemaPath<TValue, SchemaPathRules.Supported, TPathKind>,
    permissions: PermissionKey[],
  ) {
    disabled(path, { when: (_) => !this.haveAllPermissions(permissions) });
  }

}
