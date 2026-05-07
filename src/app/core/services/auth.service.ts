import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, delay } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { User, AuthTokens, LoginRequest, RegisterRequest } from '../models';
import { MOCK_USER } from '../mocks/mock-data';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient) {}

  login(request: LoginRequest): Observable<{ user: User; tokens: AuthTokens }> {
    if (environment.useMocks) {
      return of({
        user: MOCK_USER,
        tokens: { accessToken: 'mock_access_token', refreshToken: 'mock_refresh_token', expiresIn: 3600 },
      }).pipe(delay(500));
    }
    return this.http.post<{ user: User; tokens: AuthTokens }>(`${environment.authApi}/login`, request);
  }

  register(request: RegisterRequest): Observable<{ user: User; tokens: AuthTokens }> {
    if (environment.useMocks) {
      return of({
        user: { ...MOCK_USER, name: request.name, email: request.email },
        tokens: { accessToken: 'mock_access_token', refreshToken: 'mock_refresh_token', expiresIn: 3600 },
      }).pipe(delay(800));
    }
    return this.http.post<{ user: User; tokens: AuthTokens }>(`${environment.authApi}/register`, request);
  }

  refreshToken(refreshToken: string): Observable<AuthTokens> {
    if (environment.useMocks) {
      return of({ accessToken: 'new_mock_token', refreshToken, expiresIn: 3600 }).pipe(delay(200));
    }
    return this.http.post<AuthTokens>(`${environment.authApi}/refresh`, { refreshToken });
  }

  getProfile(): Observable<User> {
    if (environment.useMocks) return of(MOCK_USER).pipe(delay(200));
    return this.http.get<User>(`${environment.authApi}/profile`);
  }

  isTokenValid(): boolean {
    return !!localStorage.getItem('accessToken');
  }
}
