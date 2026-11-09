import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { LoginRequest, LoginResponse } from './login.interfaces';
import { AppContext } from '../../../shared/app-context/app-context';
import { Router } from '@angular/router';
import { tap } from 'rxjs';

@Service()
export class LoginService {
  #httpClient = inject(HttpClient);
  #appContext = inject(AppContext);
  #router = inject(Router);
  login(rq: LoginRequest) {
    return this.#httpClient.post<LoginResponse>('/api/auth/login', rq).pipe(
      tap({
        next: (rs) => {
          this.loadContext(rq.email, rs);
          this.#router.navigate(['/']);
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
