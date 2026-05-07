import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AuthService } from '../services/auth.service';
import { logout, refreshTokenSuccess } from '../../store/auth/auth.actions';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private refreshing = false;
  private refreshSubject = new BehaviorSubject<string | null>(null);

  constructor(private store: Store, private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('accessToken');
    const authReq = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

    return next.handle(authReq).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status === 401 && !req.url.includes('/auth/')) {
          return this.handle401(req, next);
        }
        return throwError(() => err);
      })
    );
  }

  private handle401(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) { this.store.dispatch(logout()); return throwError(() => new Error('No refresh token')); }

    if (!this.refreshing) {
      this.refreshing = true;
      this.refreshSubject.next(null);
      return this.authService.refreshToken(refreshToken).pipe(
        switchMap(tokens => {
          this.refreshing = false;
          localStorage.setItem('accessToken', tokens.accessToken);
          this.store.dispatch(refreshTokenSuccess({ tokens }));
          this.refreshSubject.next(tokens.accessToken);
          return next.handle(req.clone({ setHeaders: { Authorization: `Bearer ${tokens.accessToken}` } }));
        }),
        catchError(err => { this.refreshing = false; this.store.dispatch(logout()); return throwError(() => err); })
      );
    }
    return this.refreshSubject.pipe(
      filter(t => t !== null), take(1),
      switchMap(token => next.handle(req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })))
    );
  }
}
