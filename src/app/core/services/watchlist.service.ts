import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { WatchlistItem } from '../models';
import { MOCK_WATCHLIST } from '../mocks/mock-data';

@Injectable({ providedIn: 'root' })
export class WatchlistService {
  constructor(private http: HttpClient) {}

  getWatchlist(): Observable<WatchlistItem[]> {
    if (environment.useMocks) return of(MOCK_WATCHLIST).pipe(delay(300));
    return this.http.get<WatchlistItem[]>(`${environment.watchlistApi}`);
  }

  addItem(item: Omit<WatchlistItem, 'id' | 'addedAt'>): Observable<WatchlistItem> {
    if (environment.useMocks) {
      return of({ ...item, id: `w_${Date.now()}`, addedAt: new Date().toISOString() }).pipe(delay(300));
    }
    return this.http.post<WatchlistItem>(`${environment.watchlistApi}`, item);
  }

  removeItem(id: string): Observable<void> {
    if (environment.useMocks) return of(undefined).pipe(delay(200));
    return this.http.delete<void>(`${environment.watchlistApi}/${id}`);
  }
}
