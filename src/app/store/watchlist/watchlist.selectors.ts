import { createFeatureSelector, createSelector } from '@ngrx/store';
import { WatchlistState, watchlistAdapter } from './watchlist.reducer';

const selectWatchlistState = createFeatureSelector<WatchlistState>('watchlist');
const { selectAll } = watchlistAdapter.getSelectors();
export const selectWatchlistItems = createSelector(selectWatchlistState, selectAll);
export const selectWatchlistLoading = createSelector(selectWatchlistState, s => s.loading);
