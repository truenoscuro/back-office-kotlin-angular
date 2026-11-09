import { inject, Service, Signal, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { PermissionKey } from '../security/permission-keys.type';

/**
 * Lugar donde está tot el contexto de la aplicación
 */
@Service()
export class AppContext {
  #router = inject(Router);
  #mode = signal<string>(localStorage.getItem(environment.localStorage.mode) || 'light');

  #email = signal('');
  #role = signal('');
  #permissions = signal<PermissionKey[]>([]);
  #token = signal(localStorage.getItem(environment.localStorage.tokenKey) || '');
  //MENU Aquí


  get email(): Signal<string> {
    return this.#email.asReadonly();
  }

  set email(value: string) {
    console.log('value', value);
    this.#email.set(value);
  }

  get role(): Signal<string> {
    return this.#role.asReadonly();
  }

  set role(value: string) {
    this.#role.set(value);
  }

  get permissions(): Signal<string[]> {
    return this.#permissions.asReadonly();
  }

  set permissions(value: PermissionKey[]) {
    this.#permissions.set([...value]);
  }

  get token(): () => string {
    if (!this.#token()) {
      return () => localStorage.getItem(environment.localStorage.tokenKey) || '';
    }
    return this.#token.asReadonly();
  }

  set token(value: string) {
    localStorage.setItem(environment.localStorage.tokenKey, value);
    this.#token.set(value);
  }

  get mode(): () => string {
    if (!this.#mode()) {
      return () => localStorage.getItem(environment.localStorage.mode) || 'light';
    }
    return this.#mode.asReadonly();
  }

  set mode(value: 'light' | 'dark') {
    localStorage.setItem(environment.localStorage.mode, value);
    this.#mode.set(value);
  }

  clear() {
    this.#email.set('');
    this.#role.set('');
    this.#permissions.set([]);
    this.#token.set('');
    this.#mode.set('');
    localStorage.clear();
    this.#router.navigate(['/']);
  }
}
