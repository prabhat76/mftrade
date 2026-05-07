import { createAction, props } from '@ngrx/store';
import { Holding, PortfolioSummary, Transaction, OrderRequest, SipOrder } from '../../core/models';

export const loadPortfolio = createAction('[Portfolio] Load');
export const loadPortfolioSuccess = createAction('[Portfolio] Load Success',
  props<{ holdings: Holding[]; summary: PortfolioSummary }>());
export const loadPortfolioFailure = createAction('[Portfolio] Load Failure', props<{ error: string }>());

export const loadTransactions = createAction('[Portfolio] Load Transactions', props<{ page?: number }>());
export const loadTransactionsSuccess = createAction('[Portfolio] Load Transactions Success',
  props<{ transactions: Transaction[]; total: number }>());
export const loadTransactionsFailure = createAction('[Portfolio] Load Transactions Failure', props<{ error: string }>());

export const placeOrder = createAction('[Portfolio] Place Order', props<{ order: OrderRequest }>());
export const placeOrderSuccess = createAction('[Portfolio] Place Order Success', props<{ transaction: Transaction }>());
export const placeOrderFailure = createAction('[Portfolio] Place Order Failure', props<{ error: string }>());

export const createSip = createAction('[Portfolio] Create SIP', props<{ sip: Partial<SipOrder> }>());
export const createSipSuccess = createAction('[Portfolio] Create SIP Success', props<{ sip: SipOrder }>());
export const createSipFailure = createAction('[Portfolio] Create SIP Failure', props<{ error: string }>());

export const cancelSip = createAction('[Portfolio] Cancel SIP', props<{ sipId: string }>());
export const cancelSipSuccess = createAction('[Portfolio] Cancel SIP Success', props<{ sipId: string }>());
