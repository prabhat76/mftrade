import { createAction, props } from '@ngrx/store';
import { MutualFund, FundDetail, NavData, FilterState } from '../../core/models';

export const loadFunds = createAction('[Funds] Load Funds', props<{ filter?: Partial<FilterState> }>());
export const loadFundsSuccess = createAction('[Funds] Load Funds Success', props<{ funds: MutualFund[]; total: number }>());
export const loadFundsFailure = createAction('[Funds] Load Funds Failure', props<{ error: string }>());

export const loadFundDetail = createAction('[Funds] Load Fund Detail', props<{ schemeCode: number }>());
export const loadFundDetailSuccess = createAction('[Funds] Load Fund Detail Success', props<{ fund: FundDetail }>());
export const loadFundDetailFailure = createAction('[Funds] Load Fund Detail Failure', props<{ error: string }>());

export const loadLatestNav = createAction('[Funds] Load Latest NAV', props<{ schemeCode: number }>());
export const loadLatestNavSuccess = createAction('[Funds] Load Latest NAV Success', props<{ nav: NavData }>());

export const searchFunds = createAction('[Funds] Search', props<{ query: string }>());
export const setFundFilter = createAction('[Funds] Set Filter', props<{ filter: Partial<FilterState> }>());
export const clearFundDetail = createAction('[Funds] Clear Detail');
