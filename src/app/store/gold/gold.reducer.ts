import { createReducer, on } from '@ngrx/store';
import { GoldPrice, GoldEtf } from '../../core/models';
import * as GoldActions from './gold.actions';

export interface GoldState {
  prices: GoldPrice[];
  etfs: GoldEtf[];
  selectedSymbol: string | null;
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;
  polling: boolean;
}

const initialState: GoldState = {
  prices: [], etfs: [], selectedSymbol: null,
  loading: false, error: null, lastUpdated: null, polling: false,
};

export const goldReducer = createReducer(
  initialState,
  on(GoldActions.loadGoldPrices, GoldActions.loadGoldEtfs, state => ({ ...state, loading: true })),
  on(GoldActions.loadGoldPricesSuccess, (state, { prices }) => ({
    ...state, prices, loading: false, lastUpdated: new Date().toISOString(),
  })),
  on(GoldActions.loadGoldEtfsSuccess, (state, { etfs }) => ({ ...state, etfs, loading: false })),
  on(GoldActions.loadGoldPricesFailure, GoldActions.loadGoldEtfsFailure, (state, { error }) => ({
    ...state, loading: false, error,
  })),
  on(GoldActions.selectGoldInstrument, (state, { symbol }) => ({ ...state, selectedSymbol: symbol })),
  on(GoldActions.startGoldPricePoll, state => ({ ...state, polling: true })),
  on(GoldActions.stopGoldPricePoll, state => ({ ...state, polling: false })),
);
