import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FundsState, fundsAdapter } from './funds.reducer';

const selectFundsState = createFeatureSelector<FundsState>('funds');
const { selectAll, selectEntities } = fundsAdapter.getSelectors();

export const selectAllFunds = createSelector(selectFundsState, selectAll);
export const selectFundEntities = createSelector(selectFundsState, selectEntities);
export const selectFundsLoading = createSelector(selectFundsState, s => s.loading);
export const selectFundDetailLoading = createSelector(selectFundsState, s => s.detailLoading);
export const selectSelectedFund = createSelector(selectFundsState, s => s.selectedFund);
export const selectFundsTotal = createSelector(selectFundsState, s => s.total);
export const selectFundFilter = createSelector(selectFundsState, s => s.filter);
export const selectFundSearchQuery = createSelector(selectFundsState, s => s.searchQuery);

export const selectFilteredFunds = createSelector(
  selectAllFunds, selectFundSearchQuery, selectFundFilter,
  (funds, query, filter) => {
    let result = funds;
    if (query) result = result.filter(f =>
      f.schemeName.toLowerCase().includes(query.toLowerCase()) ||
      f.fundHouse.toLowerCase().includes(query.toLowerCase())
    );
    if (filter.fundType) result = result.filter(f => f.schemeType.includes(filter.fundType!));
    if (filter.category) result = result.filter(f => f.schemeCategory.includes(filter.category!));
    return result;
  }
);
