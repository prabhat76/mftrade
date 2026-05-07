import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, forkJoin } from 'rxjs';
import { map, delay, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { MutualFund, FundDetail, NavData, FilterState } from '../models';
import { MOCK_FUNDS, MOCK_FUND_DETAILS } from '../mocks/mock-data';

// Public AMFI / mfapi.in endpoints (no auth required)
// GET https://api.mfapi.in/mf                    → all schemes
// GET https://api.mfapi.in/mf/{schemeCode}        → NAV history
// GET https://api.mfapi.in/mf/{schemeCode}/latest → latest NAV

@Injectable({ providedIn: 'root' })
export class MutualFundService {
  private readonly mfApi = environment.mfApiBase;

  constructor(private http: HttpClient) {}

  getFunds(filter?: Partial<FilterState>): Observable<{ funds: MutualFund[]; total: number }> {
    if (environment.useMocks) {
      let funds = [...MOCK_FUNDS];
      if (filter?.search) {
        funds = funds.filter(f => f.schemeName.toLowerCase().includes(filter.search!.toLowerCase()));
      }
      return of({ funds, total: funds.length }).pipe(delay(400));
    }
    // mfapi.in returns flat array of { schemeCode, schemeName }
    return this.http.get<Array<{ schemeCode: number; schemeName: string }>>(`${this.mfApi}/mf`).pipe(
      map(raw => {
        const funds: MutualFund[] = raw.map(r => ({
          schemeCode: r.schemeCode,
          schemeName: r.schemeName,
          fundHouse: r.schemeName.split(' ')[0],
          schemeType: '',
          schemeCategory: '',
          schemeNavName: r.schemeName,
          isinGrowth: '',
          isinDivReinvestment: '',
        }));
        return { funds, total: funds.length };
      })
    );
  }

  getFundDetail(schemeCode: number): Observable<FundDetail> {
    if (environment.useMocks) {
      const detail = MOCK_FUND_DETAILS[schemeCode];
      return of(detail).pipe(delay(300));
    }
    // mfapi.in: GET /mf/{schemeCode} returns { meta, data: [{date, nav}] }
    return this.http.get<{ meta: any; data: Array<{ date: string; nav: string }> }>(`${this.mfApi}/mf/${schemeCode}`).pipe(
      map(res => {
        const history = res.data.slice(0, 365).map(d => ({ date: d.date, nav: parseFloat(d.nav) }));
        const currentNav = history[0]?.nav ?? 0;
        const previousNav = history[1]?.nav ?? 0;
        return {
          schemeCode,
          schemeName: res.meta.scheme_name,
          fundHouse: res.meta.fund_house,
          schemeType: res.meta.scheme_type,
          schemeCategory: res.meta.scheme_category,
          schemeNavName: res.meta.scheme_name,
          isinGrowth: res.meta.isin_growth ?? '',
          isinDivReinvestment: res.meta.isin_div_reinvestment ?? '',
          currentNav,
          previousNav,
          navChange: +(currentNav - previousNav).toFixed(4),
          navChangePercent: previousNav ? +((currentNav - previousNav) / previousNav * 100).toFixed(2) : 0,
          aum: 0, expenseRatio: 0, exitLoad: '', minSipAmount: 500, minLumpsum: 5000,
          navHistory: history,
          returns: { oneMonth: 0, threeMonth: 0, sixMonth: 0, oneYear: 0, threeYear: 0, fiveYear: 0, sinceInception: 0 },
          riskRating: 'MODERATE' as const,
          fundManager: '', benchmark: '',
        } as FundDetail;
      })
    );
  }

  getLatestNav(schemeCode: number): Observable<NavData> {
    if (environment.useMocks) {
      const detail = MOCK_FUND_DETAILS[schemeCode];
      return of({ schemeCode, schemeName: detail?.schemeName ?? '', date: new Date().toLocaleDateString('en-IN'), nav: detail?.currentNav ?? 0 }).pipe(delay(200));
    }
    return this.http.get<{ meta: any; data: Array<{ date: string; nav: string }> }>(`${this.mfApi}/mf/${schemeCode}/latest`).pipe(
      map(res => ({
        schemeCode,
        schemeName: res.meta.scheme_name,
        date: res.data[0]?.date ?? '',
        nav: parseFloat(res.data[0]?.nav ?? '0'),
      }))
    );
  }

  searchFunds(query: string): Observable<{ funds: MutualFund[]; total: number }> {
    return this.getFunds({ search: query });
  }
}
