import { createAction, props } from '@ngrx/store';
import { AuthTokens, User, LoginRequest, RegisterRequest } from '../../core/models';

export const login = createAction('[Auth] Login', props<{ request: LoginRequest }>());
export const loginSuccess = createAction('[Auth] Login Success', props<{ user: User; tokens: AuthTokens }>());
export const loginFailure = createAction('[Auth] Login Failure', props<{ error: string }>());

export const register = createAction('[Auth] Register', props<{ request: RegisterRequest }>());
export const registerSuccess = createAction('[Auth] Register Success', props<{ user: User; tokens: AuthTokens }>());
export const registerFailure = createAction('[Auth] Register Failure', props<{ error: string }>());

export const logout = createAction('[Auth] Logout');
export const refreshToken = createAction('[Auth] Refresh Token');
export const refreshTokenSuccess = createAction('[Auth] Refresh Token Success', props<{ tokens: AuthTokens }>());

export const loadProfile = createAction('[Auth] Load Profile');
export const loadProfileSuccess = createAction('[Auth] Load Profile Success', props<{ user: User }>());
