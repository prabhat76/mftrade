import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { Holding, PortfolioSummary, Transaction, SipOrder } from '../../core/models';
import * as PortfolioActions from './portfolio.actions';

export interface PortfolioState extends EntityState<Holding> {
  summary: PortfolioSummary | null;
  transactions: Transaction[];
  sips: SipOrder[];
  transactionsTotal: number;
  loading: boolean;
  orderLoading: boolean;
  error: string | null;
}

export const holdingsAdapter: EntityAdapter<Holding> = createEntityAdapter<Holding>({
  selectId: h => h.id,
});

const initialState: PortfolioState = holdingsAdapter.getInitialState({
  summary: null, transactions: [], sips: [],
  transactionsTotal: 0, loading: false, orderLoading: false, error: null,
});

export const portfolioReducer = createReducer(
  initialState,
  on(PortfolioActions.loadPortfolio, state => ({ ...state, loading: true })),
  on(PortfolioActions.loadPortfolioSuccess, (state, { holdings, summary }) =>
    holdingsAdapter.setAll(holdings, { ...state, summary, loading: false })
  ),
  on(PortfolioActions.loadPortfolioFailure, (state, { error }) => ({ ...state, loading: false, error })),

  on(PortfolioActions.loadTransactionsSuccess, (state, { transactions, total }) => ({
    ...state, transactions, transactionsTotal: total,
  })),

  on(PortfolioActions.placeOrder, PortfolioActions.createSip, state => ({ ...state, orderLoading: true })),
  on(PortfolioActions.placeOrderSuccess, (state, { transaction }) => ({
    ...state, orderLoading: false, transactions: [transaction, ...state.transactions],
  })),
  on(PortfolioActions.placeOrderFailure, PortfolioActions.createSipFailure, (state, { error }) => ({
    ...state, orderLoading: false, error,
  })),
  on(PortfolioActions.createSipSuccess, (state, { sip }) => ({
    ...state, orderLoading: false, sips: [...state.sips, sip],
  })),
  on(PortfolioActions.cancelSipSuccess, (state, { sipId }) => ({
    ...state, sips: state.sips.filter(s => s.id !== sipId),
  })),
);
