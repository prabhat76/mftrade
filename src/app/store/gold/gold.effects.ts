import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { interval, of } from 'rxjs';
import { catchError, map, switchMap, takeUntil } from 'rxjs/operators';
import * as GoldActions from './gold.actions';
import { GoldService } from '../../core/services/gold.service';

@Injectable()
export class GoldEffects {
  private actions$ = inject(Actions);
  private goldService = inject(GoldService);

  loadPrices$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GoldActions.loadGoldPrices),
      switchMap(() =>
        this.goldService.getGoldPrices().pipe(
          map(prices => GoldActions.loadGoldPricesSuccess({ prices })),
          catchError(err => of(GoldActions.loadGoldPricesFailure({ error: err.message })))
        )
      )
    )
  );

  loadEtfs$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GoldActions.loadGoldEtfs),
      switchMap(() =>
        this.goldService.getGoldEtfs().pipe(
          map(etfs => GoldActions.loadGoldEtfsSuccess({ etfs })),
          catchError(err => of(GoldActions.loadGoldEtfsFailure({ error: err.message })))
        )
      )
    )
  );

  pollPrices$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GoldActions.startGoldPricePoll),
      switchMap(() =>
        interval(10000).pipe(
          map(() => GoldActions.loadGoldPrices()),
          takeUntil(this.actions$.pipe(ofType(GoldActions.stopGoldPricePoll)))
        )
      )
    )
  );
}
