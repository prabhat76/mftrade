import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { MutualFund, FundDetail, FilterState } from '../../core/models';
import * as FundsActions from './funds.actions';

export interface FundsState extends EntityState<MutualFund> {
  selectedFund: FundDetail | null;
  loading: boolean;
  detailLoading: boolean;
  error: string | null;
  total: number;
  filter: Partial<FilterState>;
  searchQuery: string;
}

export const fundsAdapter: EntityAdapter<MutualFund> = createEntityAdapter<MutualFund>({
  selectId: f => f.schemeCode,
});

const initialState: FundsState = fundsAdapter.getInitialState({
  selectedFund: null,
  loading: false,
  detailLoading: false,
  error: null,
  total: 0,
  filter: { page: 1, pageSize: 20 },
  searchQuery: '',
});

export const fundsReducer = createReducer(
  initialState,
  on(FundsActions.loadFunds, state => ({ ...state, loading: true, error: null })),
  on(FundsActions.loadFundsSuccess, (state, { funds, total }) =>
    fundsAdapter.setAll(funds, { ...state, loading: false, total })
  ),
  on(FundsActions.loadFundsFailure, (state, { error }) => ({ ...state, loading: false, error })),

  on(FundsActions.loadFundDetail, state => ({ ...state, detailLoading: true })),
  on(FundsActions.loadFundDetailSuccess, (state, { fund }) => ({ ...state, selectedFund: fund, detailLoading: false })),
  on(FundsActions.loadFundDetailFailure, (state, { error }) => ({ ...state, detailLoading: false, error })),

  on(FundsActions.setFundFilter, (state, { filter }) => ({ ...state, filter: { ...state.filter, ...filter } })),
  on(FundsActions.searchFunds, (state, { query }) => ({ ...state, searchQuery: query })),
  on(FundsActions.clearFundDetail, state => ({ ...state, selectedFund: null })),
);
