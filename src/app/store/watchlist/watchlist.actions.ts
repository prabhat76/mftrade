import { createAction, props } from '@ngrx/store';
import { WatchlistItem } from '../../core/models';

export const loadWatchlist = createAction('[Watchlist] Load');
export const loadWatchlistSuccess = createAction('[Watchlist] Load Success', props<{ items: WatchlistItem[] }>());
export const loadWatchlistFailure = createAction('[Watchlist] Load Failure', props<{ error: string }>());
export const addToWatchlist = createAction('[Watchlist] Add', props<{ item: Omit<WatchlistItem, 'id' | 'addedAt'> }>());
export const addToWatchlistSuccess = createAction('[Watchlist] Add Success', props<{ item: WatchlistItem }>());
export const removeFromWatchlist = createAction('[Watchlist] Remove', props<{ id: string }>());
export const removeFromWatchlistSuccess = createAction('[Watchlist] Remove Success', props<{ id: string }>());
