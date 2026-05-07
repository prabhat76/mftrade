import { createReducer, on } from '@ngrx/store';
import { User, AuthTokens } from '../../core/models';
import * as AuthActions from './auth.actions';

export interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  tokens: null,
  loading: false,
  error: null,
  isAuthenticated: false,
};

export const authReducer = createReducer(
  initialState,
  on(AuthActions.login, AuthActions.register, state => ({ ...state, loading: true, error: null })),
  on(AuthActions.loginSuccess, AuthActions.registerSuccess, (state, { user, tokens }) => ({
    ...state, user, tokens, loading: false, isAuthenticated: true, error: null,
  })),
  on(AuthActions.loginFailure, AuthActions.registerFailure, (state, { error }) => ({
    ...state, loading: false, error,
  })),
  on(AuthActions.logout, () => initialState),
  on(AuthActions.refreshTokenSuccess, (state, { tokens }) => ({ ...state, tokens })),
  on(AuthActions.loadProfileSuccess, (state, { user }) => ({ ...state, user })),
);
