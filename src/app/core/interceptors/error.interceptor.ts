import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { showToast } from '../../store/ui/ui.actions';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private store: Store) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((err: HttpErrorResponse) => {
        const message = err.error?.message ?? err.message ?? 'An unexpected error occurred';
        if (err.status !== 401) {
          this.store.dispatch(showToast({
            toast: { id: Date.now().toString(), type: 'error', message, duration: 5000 }
          }));
        }
        return throwError(() => err);
      })
    );
  }
}
