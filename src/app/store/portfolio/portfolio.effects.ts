import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import * as PortfolioActions from './portfolio.actions';
import { PortfolioService } from '../../core/services/portfolio.service';
import { Store } from '@ngrx/store';
import { showToast } from '../ui/ui.actions';

@Injectable()
export class PortfolioEffects {
  private actions$ = inject(Actions);
  private portfolioService = inject(PortfolioService);
  private store = inject(Store);

  load$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PortfolioActions.loadPortfolio),
      switchMap(() =>
        this.portfolioService.getPortfolio().pipe(
          map(({ holdings, summary }) => PortfolioActions.loadPortfolioSuccess({ holdings, summary })),
          catchError(err => of(PortfolioActions.loadPortfolioFailure({ error: err.message })))
        )
      )
    )
  );

  loadTransactions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PortfolioActions.loadTransactions),
      switchMap(({ page }) =>
        this.portfolioService.getTransactions(page).pipe(
          map(({ transactions, total }) => PortfolioActions.loadTransactionsSuccess({ transactions, total })),
          catchError(err => of(PortfolioActions.loadTransactionsFailure({ error: err.message })))
        )
      )
    )
  );

  placeOrder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PortfolioActions.placeOrder),
      switchMap(({ order }) =>
        this.portfolioService.placeOrder(order).pipe(
          map(transaction => PortfolioActions.placeOrderSuccess({ transaction })),
          catchError(err => of(PortfolioActions.placeOrderFailure({ error: err.message })))
        )
      )
    )
  );

  orderSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PortfolioActions.placeOrderSuccess),
      tap(() => this.store.dispatch(showToast({
        toast: { id: Date.now().toString(), type: 'success', message: 'Order placed successfully!' }
      }))),
      map(() => PortfolioActions.loadPortfolio())
    )
  );

  createSip$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PortfolioActions.createSip),
      switchMap(({ sip }) =>
        this.portfolioService.createSip(sip).pipe(
          map(s => PortfolioActions.createSipSuccess({ sip: s })),
          catchError(err => of(PortfolioActions.createSipFailure({ error: err.message })))
        )
      )
    )
  );
}
