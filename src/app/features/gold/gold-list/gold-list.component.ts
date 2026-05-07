import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { GoldPrice, GoldEtf } from '../../../core/models';
import { selectGoldPrices, selectGoldEtfs, selectGoldLoading, selectGoldLastUpdated } from '../../../store/gold/gold.selectors';
import { loadGoldPrices, loadGoldEtfs, startGoldPricePoll, stopGoldPricePoll } from '../../../store/gold/gold.actions';

@Component({
  standalone: false,
  selector: 'app-gold-list',
  template: `
    <div class="page-container">
      <div class="flex items-center justify-between" style="margin-bottom:20px">
        <h2 style="font-size:1.25rem;font-weight:700">Gold</h2>
        <span class="text-xs" style="color:var(--text-muted)" *ngIf="lastUpdated$ | async as t">
          Updated: {{ t | date:'HH:mm:ss' }}
        </span>
      </div>

      <app-loader *ngIf="loading$ | async"></app-loader>

      <!-- MCX Futures -->
      <div class="card" style="margin-bottom:16px">
        <div class="card-header"><h3>MCX Gold Futures</h3></div>
        <div style="overflow-x:auto">
          <table class="data-table">
            <thead>
              <tr>
                <th>Symbol</th><th>LTP (₹)</th><th>Change</th><th>Open</th><th>High</th><th>Low</th><th class="hide-mobile">Volume</th><th class="hide-mobile">Expiry</th><th></th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let g of goldPrices$ | async">
                <td class="font-bold">{{ g.symbol }}</td>
                <td class="font-bold">{{ g.ltp | number:'1.0-0' }}</td>
                <td [class.positive]="g.change >= 0" [class.negative]="g.change < 0">
                  {{ g.change >= 0 ? '+' : '' }}{{ g.change | number:'1.0-0' }} ({{ g.changePercent | number:'1.2-2' }}%)
                </td>
                <td>{{ g.open | number:'1.0-0' }}</td>
                <td class="positive">{{ g.high | number:'1.0-0' }}</td>
                <td class="negative">{{ g.low | number:'1.0-0' }}</td>
                <td class="hide-mobile">{{ g.volume | number:'1.0-0' }}</td>
                <td class="hide-mobile text-xs">{{ g.expiry }}</td>
                <td><a [routerLink]="['/gold/detail', g.symbol]" class="btn btn-outline btn-sm">Trade</a></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Gold ETFs -->
      <div class="card">
        <div class="card-header"><h3>Gold ETFs (NSE)</h3></div>
        <div style="overflow-x:auto">
          <table class="data-table">
            <thead>
              <tr>
                <th>Symbol</th><th>Name</th><th>LTP (₹)</th><th>Change</th><th class="hide-mobile">NAV</th><th class="hide-mobile">AUM (Cr)</th><th class="hide-mobile">Expense</th><th></th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let e of goldEtfs$ | async">
                <td class="font-bold">{{ e.symbol }}</td>
                <td class="text-sm hide-mobile">{{ e.name }}</td>
                <td class="font-bold">{{ e.ltp | number:'1.2-2' }}</td>
                <td [class.positive]="e.change >= 0" [class.negative]="e.change < 0">
                  {{ e.change >= 0 ? '+' : '' }}{{ e.change | number:'1.2-2' }} ({{ e.changePercent | number:'1.2-2' }}%)
                </td>
                <td class="hide-mobile">{{ e.nav | number:'1.2-2' }}</td>
                <td class="hide-mobile">{{ e.aum | number:'1.0-0' }}</td>
                <td class="hide-mobile">{{ e.expenseRatio }}%</td>
                <td><a [routerLink]="['/gold/detail', e.symbol]" class="btn btn-outline btn-sm">Buy</a></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
})
export class GoldListComponent implements OnInit, OnDestroy {
  goldPrices$: Observable<GoldPrice[]>;
  goldEtfs$: Observable<GoldEtf[]>;
  loading$: Observable<boolean>;
  lastUpdated$: Observable<string | null>;

  constructor(private store: Store) {
    this.goldPrices$ = this.store.select(selectGoldPrices);
    this.goldEtfs$ = this.store.select(selectGoldEtfs);
    this.loading$ = this.store.select(selectGoldLoading);
    this.lastUpdated$ = this.store.select(selectGoldLastUpdated);
  }

  ngOnInit() {
    this.store.dispatch(loadGoldPrices());
    this.store.dispatch(loadGoldEtfs());
    this.store.dispatch(startGoldPricePoll());
  }

  ngOnDestroy() { this.store.dispatch(stopGoldPricePoll()); }
}
