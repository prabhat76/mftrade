import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, delay } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { GoldPrice, GoldEtf, MarketStatus, NseIndex } from '../models';
import { MOCK_GOLD_PRICES, MOCK_GOLD_ETFS, MOCK_MARKET_STATUS, MOCK_NSE_INDICES } from '../mocks/mock-data';

// NSE API endpoints (require session cookie — use a backend proxy in non-dev envs)
// GET https://www.nseindia.com/api/marketStatus
// GET https://www.nseindia.com/api/allIndices
// GET https://www.nseindia.com/api/quote-equity?symbol=GOLDBEES
//
// MCX Gold (via backend proxy):
// GET https://priceapi.mcxindia.com/MarketData/GetContractDetails?instrumentType=FUTCOM&symbol=GOLD

@Injectable({ providedIn: 'root' })
export class GoldService {
  constructor(private http: HttpClient) {}

  getGoldPrices(): Observable<GoldPrice[]> {
    if (environment.useMocks) return of(MOCK_GOLD_PRICES).pipe(delay(300));
    // In non-dev: route through your backend proxy to MCX
    return this.http.get<GoldPrice[]>(`${environment.apiBase}/gold/prices`);
  }

  getGoldEtfs(): Observable<GoldEtf[]> {
    if (environment.useMocks) return of(MOCK_GOLD_ETFS).pipe(delay(300));
    return this.http.get<GoldEtf[]>(`${environment.apiBase}/gold/etfs`);
  }

  getMarketStatus(): Observable<MarketStatus> {
    if (environment.useMocks) return of(MOCK_MARKET_STATUS).pipe(delay(200));
    return this.http.get<{ marketState: MarketStatus[] }>(`${environment.nseApiBase}/marketStatus`).pipe(
      map(res => res.marketState[0])
    );
  }

  getNseIndices(): Observable<NseIndex[]> {
    if (environment.useMocks) return of(MOCK_NSE_INDICES).pipe(delay(200));
    return this.http.get<{ data: NseIndex[] }>(`${environment.nseApiBase}/allIndices`).pipe(
      map(res => res.data)
    );
  }
}
