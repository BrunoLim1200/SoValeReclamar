import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthStore } from '../../../core/auth/auth.store';
import { FieldError } from '../../../shared/ui/field-error/field-error';

@Component({
  selector: 'app-forgot-password',
  imports: [ReactiveFormsModule, RouterLink, FieldError],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.scss',
})
export class ForgotPassword {
  private readonly store = inject(AuthStore);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  protected readonly loading = this.store.loading;
  protected readonly error = this.store.error;
  protected readonly step = signal<'request' | 'reset'>('request');

  protected readonly requestForm = this.fb.nonNullable.group({
    username: ['', Validators.required],
  });

  protected readonly resetForm = this.fb.nonNullable.group({
    code: ['', Validators.required],
    newPassword: ['', [Validators.required, Validators.minLength(8)]],
  });

  constructor() {
    this.store.resetFeedback();
  }

  protected async requestCode(): Promise<void> {
    if (this.requestForm.invalid) {
      this.requestForm.markAllAsTouched();
      return;
    }
    const { username } = this.requestForm.getRawValue();
    const ok = await this.store.requestPasswordReset(username);
    if (ok) {
      this.step.set('reset');
    }
  }

  protected async reset(): Promise<void> {
    if (this.resetForm.invalid) {
      this.resetForm.markAllAsTouched();
      return;
    }
    const { username } = this.requestForm.getRawValue();
    const { code, newPassword } = this.resetForm.getRawValue();
    const ok = await this.store.confirmPasswordReset(username, code, newPassword);
    if (ok) {
      this.router.navigate(['/auth/login'], { queryParams: { notice: 'reset' } });
    }
  }
}
