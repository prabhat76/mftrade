import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Holding, PortfolioSummary, Transaction, OrderRequest, SipOrder } from '../models';
import { MOCK_HOLDINGS, MOCK_PORTFOLIO_SUMMARY, MOCK_TRANSACTIONS } from '../mocks/mock-data';

@Injectable({ providedIn: 'root' })
export class PortfolioService {
  constructor(private http: HttpClient) {}

  getPortfolio(): Observable<{ holdings: Holding[]; summary: PortfolioSummary }> {
    if (environment.useMocks) {
      return of({ holdings: MOCK_HOLDINGS, summary: MOCK_PORTFOLIO_SUMMARY }).pipe(delay(500));
    }
    return this.http.get<{ holdings: Holding[]; summary: PortfolioSummary }>(`${environment.portfolioApi}/summary`);
  }

  getTransactions(page = 1): Observable<{ transactions: Transaction[]; total: number }> {
    if (environment.useMocks) {
      return of({ transactions: MOCK_TRANSACTIONS, total: MOCK_TRANSACTIONS.length }).pipe(delay(400));
    }
    return this.http.get<{ transactions: Transaction[]; total: number }>(
      `${environment.portfolioApi}/transactions?page=${page}&pageSize=20`
    );
  }

  placeOrder(order: OrderRequest): Observable<Transaction> {
    if (environment.useMocks) {
      const txn: Transaction = {
        id: `txn_${Date.now()}`, userId: 'usr_001',
        type: order.type, assetType: order.assetType,
        schemeCode: order.schemeCode, symbol: order.symbol,
        schemeName: 'Mock Fund', units: order.units ?? 0,
        price: 100, amount: order.amount ?? 0,
        status: 'PENDING', orderDate: new Date().toISOString(),
      };
      return of(txn).pipe(delay(800));
    }
    return this.http.post<Transaction>(`${environment.orderApi}/place`, order);
  }

  createSip(sip: Partial<SipOrder>): Observable<SipOrder> {
    if (environment.useMocks) {
      return of({ ...sip, id: `sip_${Date.now()}`, status: 'ACTIVE' } as SipOrder).pipe(delay(600));
    }
    return this.http.post<SipOrder>(`${environment.orderApi}/sip`, sip);
  }

  cancelSip(sipId: string): Observable<void> {
    if (environment.useMocks) return of(undefined).pipe(delay(400));
    return this.http.delete<void>(`${environment.orderApi}/sip/${sipId}`);
  }
}
