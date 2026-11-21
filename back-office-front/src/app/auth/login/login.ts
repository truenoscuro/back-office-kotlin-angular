import { Component, DestroyRef, inject, signal } from '@angular/core';
import { MatCard, MatCardActions, MatCardContent, MatCardHeader } from '@angular/material/card';
import { MatError, MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { TranslationPipe } from '../../../core/translations/translation-pipe';
import { MatButton } from '@angular/material/button';
import { email, form, FormField, required } from '@angular/forms/signals';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { finalize } from 'rxjs';
import { TranslationStringPipe } from '../../../core/translations/translation-key-pipe';
import { LoginService } from './login-service';
import { LoginRequest } from './login.interfaces';
import { KeyRouter } from '../../../core/router/key-router';
import { Router } from '@angular/router';

@Component({
  imports: [
    MatCard,
    MatCardHeader,
    MatCardContent,
    MatFormField,
    MatLabel,
    TranslationPipe,
    MatInput,
    MatCardActions,
    MatButton,
    FormField,
    MatError,
    MatProgressSpinner,
    TranslationStringPipe,
  ],
  selector: 'app-login',
  styleUrl: './login.scss',
  templateUrl: './login.html',
})
export default class Login {
  protected isLoading = signal(false);
  protected loginData = signal(<LoginRequest>{
    email: '',
    password: '',
  });
  protected loginForm = form(this.loginData, (path) => {
    required(path.email, { message: 'LOGIN.EMAIL_REQUIRED' });
    required(path.password, { message: 'LOGIN.PASSWORD_REQUIRED' });
    email(path.email, { message: 'LOGIN.EMAIL_INVALID' });
  });
  #backOfficeRouter = inject(KeyRouter);
  #router = inject(Router);
  #loginService = inject(LoginService);

  #subscription = inject(KeyRouter).startNavigate.subscribe(() => this.#router.navigate(['']));

  #destroyRef = inject(DestroyRef).onDestroy(() => this.#subscription.unsubscribe());

  protected login() {
    if (this.loginForm().invalid()) {
      return;
    }

    this.isLoading.set(true);
    this.#loginService
      .login(this.loginData())
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe();
  }
}
