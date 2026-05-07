import { createAction, props } from '@ngrx/store';
import { GoldPrice, GoldEtf } from '../../core/models';

export const loadGoldPrices = createAction('[Gold] Load Prices');
export const loadGoldPricesSuccess = createAction('[Gold] Load Prices Success', props<{ prices: GoldPrice[] }>());
export const loadGoldPricesFailure = createAction('[Gold] Load Prices Failure', props<{ error: string }>());

export const loadGoldEtfs = createAction('[Gold] Load ETFs');
export const loadGoldEtfsSuccess = createAction('[Gold] Load ETFs Success', props<{ etfs: GoldEtf[] }>());
export const loadGoldEtfsFailure = createAction('[Gold] Load ETFs Failure', props<{ error: string }>());

export const selectGoldInstrument = createAction('[Gold] Select Instrument', props<{ symbol: string }>());
export const startGoldPricePoll = createAction('[Gold] Start Price Poll');
export const stopGoldPricePoll = createAction('[Gold] Stop Price Poll');
