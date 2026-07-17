import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthStore } from '../../../core/auth/auth.store';
import { FieldError } from '../../../shared/ui/field-error/field-error';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink, FieldError],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  private readonly store = inject(AuthStore);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  protected readonly loading = this.store.loading;
  protected readonly error = this.store.error;
  /** 'form' = sign-up; 'confirm' = email verification code (Cognito always requires it). */
  protected readonly step = signal<'form' | 'confirm'>('form');

  protected readonly form = this.fb.nonNullable.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  protected readonly confirmForm = this.fb.nonNullable.group({
    code: ['', Validators.required],
  });

  constructor() {
    this.store.resetFeedback();
  }

  protected async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { username, email, password } = this.form.getRawValue();
    const ok = await this.store.register(username, email, password);
    if (ok) {
      this.step.set('confirm');
    }
  }

  protected async confirm(): Promise<void> {
    if (this.confirmForm.invalid) {
      this.confirmForm.markAllAsTouched();
      return;
    }
    const { email } = this.form.getRawValue();
    const { code } = this.confirmForm.getRawValue();
    const ok = await this.store.confirmRegistration(email, code);
    if (ok) {
      this.router.navigate(['/auth/login'], { queryParams: { notice: 'confirmed' } });
    }
  }
}
