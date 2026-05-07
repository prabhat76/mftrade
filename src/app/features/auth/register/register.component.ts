import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { register } from '../../../store/auth/auth.actions';
import { selectAuthLoading, selectAuthError } from '../../../store/auth/auth.selectors';

@Component({
  standalone: false,
  selector: 'app-register',
  template: `
    <div class="auth-page">
      <div class="auth-card card">
        <div class="auth-brand">
          <span class="brand-icon">📈</span>
          <h1>Create Account</h1>
          <p>Start your investment journey</p>
        </div>

        <form [formGroup]="form" (ngSubmit)="submit()">
          <div class="form-group">
            <label>Full Name</label>
            <input class="form-control" formControlName="name" placeholder="Prabhat Kumar">
          </div>
          <div class="form-group">
            <label>Email</label>
            <input class="form-control" formControlName="email" type="email" placeholder="you@example.com">
          </div>
          <div class="form-group">
            <label>Mobile</label>
            <input class="form-control" formControlName="mobile" placeholder="9876543210">
          </div>
          <div class="form-group">
            <label>PAN Number</label>
            <input class="form-control" formControlName="panNumber" placeholder="ABCDE1234F" style="text-transform:uppercase">
          </div>
          <div class="form-group">
            <label>Password</label>
            <input class="form-control" formControlName="password" type="password" placeholder="Min 8 characters">
          </div>

          <div class="form-error mt-8" *ngIf="error$ | async as err">{{ err }}</div>

          <button class="btn btn-primary btn-block btn-lg mt-16" type="submit"
                  [disabled]="form.invalid || (loading$ | async)">
            {{ (loading$ | async) ? 'Creating account...' : 'Create Account' }}
          </button>
        </form>

        <p class="auth-footer">Already have an account? <a routerLink="/auth/login">Sign In</a></p>
      </div>
    </div>
  `,
  styles: [`
    .auth-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #e8f0fe 0%, #f8f9fa 100%); padding: 16px; }
    .auth-card { width: 100%; max-width: 440px; }
    .auth-brand { text-align: center; margin-bottom: 24px; }
    .auth-brand .brand-icon { font-size: 2rem; }
    .auth-brand h1 { font-size: 1.5rem; font-weight: 700; color: var(--primary); margin: 6px 0 4px; }
    .auth-brand p { color: var(--text-secondary); font-size: .875rem; }
    .auth-footer { text-align: center; margin-top: 16px; font-size: .875rem; color: var(--text-secondary); }
  `]
})
export class RegisterComponent {
  form: FormGroup;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;

  constructor(private fb: FormBuilder, private store: Store) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      panNumber: ['', [Validators.required, Validators.pattern(/^[A-Z]{5}[0-9]{4}[A-Z]$/)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
    this.loading$ = this.store.select(selectAuthLoading);
    this.error$ = this.store.select(selectAuthError);
  }

  submit() {
    if (this.form.valid) this.store.dispatch(register({ request: this.form.value }));
  }
}
