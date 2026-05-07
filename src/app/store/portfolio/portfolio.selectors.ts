import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PortfolioState, holdingsAdapter } from './portfolio.reducer';

const selectPortfolioState = createFeatureSelector<PortfolioState>('portfolio');
const { selectAll } = holdingsAdapter.getSelectors();

export const selectAllHoldings = createSelector(selectPortfolioState, selectAll);
export const selectPortfolioSummary = createSelector(selectPortfolioState, s => s.summary);
export const selectTransactions = createSelector(selectPortfolioState, s => s.transactions);
export const selectSips = createSelector(selectPortfolioState, s => s.sips);
export const selectPortfolioLoading = createSelector(selectPortfolioState, s => s.loading);
export const selectOrderLoading = createSelector(selectPortfolioState, s => s.orderLoading);
export const selectPortfolioError = createSelector(selectPortfolioState, s => s.error);

export const selectMfHoldings = createSelector(selectAllHoldings, h => h.filter(x => x.type === 'MUTUAL_FUND'));
export const selectGoldHoldings = createSelector(selectAllHoldings, h =>
  h.filter(x => ['GOLD_ETF', 'GOLD_FUTURES', 'DIGITAL_GOLD', 'SGB'].includes(x.type))
);
