import { inject, Service } from '@angular/core';
import { HttpBackend, HttpClient } from '@angular/common/http';

import { LoginRequest, LoginResponse } from './login.interfaces';
import { AppContext } from '../../../core/app-context/app-context';

import { tap } from 'rxjs';

@Service()
export class LoginService {
  #httpClient = new HttpClient(inject(HttpBackend));
  #appContext = inject(AppContext);
  login(rq: LoginRequest) {
    return this.#httpClient.post<LoginResponse>('/api/auth/login', rq).pipe(
      tap({
        next: (rs) => {
          this.loadContext(rq.email, rs);
        },
      }),
    );
  }

  private loadContext(email: string, rs: LoginResponse) {
    const { token, role, permissions } = rs;
    this.#appContext.email = email;
    this.#appContext.token = token;
    this.#appContext.role = role;
    this.#appContext.permissions = permissions;
  }
}
