import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { AuthStore } from '../../../core/auth/auth.store';
import { FieldError } from '../../../shared/ui/field-error/field-error';

/** Success banners for users arriving from another auth flow (see `?notice=`). */
const NOTICES: Record<string, string> = {
  confirmed: 'Conta confirmada! Faça login para continuar.',
  reset: 'Senha alterada! Entre com a nova senha.',
};

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, FieldError],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private readonly store = inject(AuthStore);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);

  protected readonly loading = this.store.loading;
  protected readonly error = this.store.error;
  protected readonly notice: string | null;

  protected readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  constructor() {
    this.store.resetFeedback();
    const key = this.route.snapshot.queryParamMap.get('notice');
    this.notice = key ? (NOTICES[key] ?? null) : null;
  }

  protected async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { email, password } = this.form.getRawValue();
    const ok = await this.store.login(email, password);
    if (ok) {
      const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') ?? '/';
      this.router.navigateByUrl(returnUrl);
    }
  }
}
