import { createFeatureSelector, createSelector } from '@ngrx/store';
import { GoldState } from './gold.reducer';

const selectGoldState = createFeatureSelector<GoldState>('gold');
export const selectGoldPrices = createSelector(selectGoldState, s => s.prices);
export const selectGoldEtfs = createSelector(selectGoldState, s => s.etfs);
export const selectGoldLoading = createSelector(selectGoldState, s => s.loading);
export const selectSelectedGoldSymbol = createSelector(selectGoldState, s => s.selectedSymbol);
export const selectGoldLastUpdated = createSelector(selectGoldState, s => s.lastUpdated);
export const selectSelectedGoldPrice = createSelector(
  selectGoldPrices, selectSelectedGoldSymbol,
  (prices, symbol) => prices.find(p => p.symbol === symbol) ?? null
);
