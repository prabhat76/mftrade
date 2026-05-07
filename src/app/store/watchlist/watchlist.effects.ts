import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import * as WatchlistActions from './watchlist.actions';
import { WatchlistService } from '../../core/services/watchlist.service';

@Injectable()
export class WatchlistEffects {
  private actions$ = inject(Actions);
  private watchlistService = inject(WatchlistService);

  load$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WatchlistActions.loadWatchlist),
      switchMap(() =>
        this.watchlistService.getWatchlist().pipe(
          map(items => WatchlistActions.loadWatchlistSuccess({ items })),
          catchError(err => of(WatchlistActions.loadWatchlistFailure({ error: err.message })))
        )
      )
    )
  );

  add$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WatchlistActions.addToWatchlist),
      switchMap(({ item }) =>
        this.watchlistService.addItem(item).pipe(
          map(i => WatchlistActions.addToWatchlistSuccess({ item: i })),
          catchError(err => of(WatchlistActions.loadWatchlistFailure({ error: err.message })))
        )
      )
    )
  );

  remove$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WatchlistActions.removeFromWatchlist),
      switchMap(({ id }) =>
        this.watchlistService.removeItem(id).pipe(
          map(() => WatchlistActions.removeFromWatchlistSuccess({ id })),
          catchError(err => of(WatchlistActions.loadWatchlistFailure({ error: err.message })))
        )
      )
    )
  );
}
