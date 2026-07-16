import { Component, input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

/**
 * Shows the first validation message for a reactive-form control, once it has
 * been touched or edited. Reads control state through getters, not signals:
 * reactive-form state isn't signal-based, so change detection re-evaluates
 * these on the DOM/form events that mutate the control (input, blur, submit) —
 * which is exactly when they can change, and enough even in this zoneless app.
 */
@Component({
  selector: 'app-field-error',
  imports: [],
  templateUrl: './field-error.html',
  styleUrl: './field-error.scss',
})
export class FieldError {
  readonly control = input.required<AbstractControl>();

  protected get visible(): boolean {
    const c = this.control();
    return c.invalid && (c.touched || c.dirty);
  }

  protected get message(): string {
    const errors = this.control().errors;
    if (!errors) return '';
    if (errors['required']) return 'Campo obrigatório.';
    if (errors['email']) return 'E-mail inválido.';
    if (errors['minlength']) {
      return `Mínimo de ${errors['minlength'].requiredLength} caracteres.`;
    }
    return 'Valor inválido.';
  }
}
