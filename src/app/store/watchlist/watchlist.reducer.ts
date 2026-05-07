import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { WatchlistItem } from '../../core/models';
import * as WatchlistActions from './watchlist.actions';

export interface WatchlistState extends EntityState<WatchlistItem> {
  loading: boolean;
  error: string | null;
}

export const watchlistAdapter: EntityAdapter<WatchlistItem> = createEntityAdapter<WatchlistItem>();

const initialState: WatchlistState = watchlistAdapter.getInitialState({ loading: false, error: null });

export const watchlistReducer = createReducer(
  initialState,
  on(WatchlistActions.loadWatchlist, state => ({ ...state, loading: true })),
  on(WatchlistActions.loadWatchlistSuccess, (state, { items }) =>
    watchlistAdapter.setAll(items, { ...state, loading: false })
  ),
  on(WatchlistActions.loadWatchlistFailure, (state, { error }) => ({ ...state, loading: false, error })),
  on(WatchlistActions.addToWatchlistSuccess, (state, { item }) => watchlistAdapter.addOne(item, state)),
  on(WatchlistActions.removeFromWatchlistSuccess, (state, { id }) => watchlistAdapter.removeOne(id, state)),
);
