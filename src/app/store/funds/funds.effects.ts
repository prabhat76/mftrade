import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, debounceTime } from 'rxjs/operators';
import * as FundsActions from './funds.actions';
import { MutualFundService } from '../../core/services/mutual-fund.service';

@Injectable()
export class FundsEffects {
  private actions$ = inject(Actions);
  private mfService = inject(MutualFundService);

  loadFunds$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FundsActions.loadFunds),
      switchMap(({ filter }) =>
        this.mfService.getFunds(filter).pipe(
          map(({ funds, total }) => FundsActions.loadFundsSuccess({ funds, total })),
          catchError(err => of(FundsActions.loadFundsFailure({ error: err.message })))
        )
      )
    )
  );

  loadFundDetail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FundsActions.loadFundDetail),
      switchMap(({ schemeCode }) =>
        this.mfService.getFundDetail(schemeCode).pipe(
          map(fund => FundsActions.loadFundDetailSuccess({ fund })),
          catchError(err => of(FundsActions.loadFundDetailFailure({ error: err.message })))
        )
      )
    )
  );

  searchFunds$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FundsActions.searchFunds),
      debounceTime(300),
      switchMap(({ query }) =>
        this.mfService.searchFunds(query).pipe(
          map(({ funds, total }) => FundsActions.loadFundsSuccess({ funds, total })),
          catchError(err => of(FundsActions.loadFundsFailure({ error: err.message })))
        )
      )
    )
  );
}
