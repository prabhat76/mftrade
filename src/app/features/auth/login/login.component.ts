import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { login } from '../../../store/auth/auth.actions';
import { selectAuthLoading, selectAuthError } from '../../../store/auth/auth.selectors';

@Component({
  standalone: false,
  selector: 'app-login',
  template: `
    <div class="auth-page">
      <div class="auth-card card">
        <div class="auth-brand">
          <span class="brand-icon">📈</span>
          <h1>MFTrade</h1>
          <p>Mutual Funds & Gold Investment Platform</p>
        </div>

        <form [formGroup]="form" (ngSubmit)="submit()">
          <div class="form-group">
            <label>Email</label>
            <input class="form-control" formControlName="email" type="email" placeholder="you@example.com"
                   [class.error]="form.get('email')?.invalid && form.get('email')?.touched">
            <span class="form-error" *ngIf="form.get('email')?.invalid && form.get('email')?.touched">Valid email required</span>
          </div>

          <div class="form-group">
            <label>Password</label>
            <input class="form-control" formControlName="password" type="password" placeholder="••••••••"
                   [class.error]="form.get('password')?.invalid && form.get('password')?.touched">
            <span class="form-error" *ngIf="form.get('password')?.invalid && form.get('password')?.touched">Min 6 characters</span>
          </div>

          <div class="form-error mt-8" *ngIf="error$ | async as err">{{ err }}</div>

          <button class="btn btn-primary btn-block btn-lg mt-16" type="submit"
                  [disabled]="form.invalid || (loading$ | async)">
            <app-loader *ngIf="loading$ | async" [overlay]="false"></app-loader>
            {{ (loading$ | async) ? 'Signing in...' : 'Sign In' }}
          </button>
        </form>

        <p class="auth-footer">Don't have an account? <a routerLink="/auth/register">Register</a></p>
      </div>
    </div>
  `,
  styles: [`
    .auth-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #e8f0fe 0%, #f8f9fa 100%); padding: 16px; }
    .auth-card { width: 100%; max-width: 420px; }
    .auth-brand { text-align: center; margin-bottom: 28px; }
    .auth-brand .brand-icon { font-size: 2.5rem; }
    .auth-brand h1 { font-size: 1.75rem; font-weight: 700; color: var(--primary); margin: 8px 0 4px; }
    .auth-brand p { color: var(--text-secondary); font-size: .875rem; }
    .auth-footer { text-align: center; margin-top: 20px; font-size: .875rem; color: var(--text-secondary); }
  `]
})
export class LoginComponent {
  form: FormGroup;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;

  constructor(private fb: FormBuilder, private store: Store) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
    this.loading$ = this.store.select(selectAuthLoading);
    this.error$ = this.store.select(selectAuthError);
  }

  submit() {
    if (this.form.valid) this.store.dispatch(login({ request: this.form.value }));
  }
}
