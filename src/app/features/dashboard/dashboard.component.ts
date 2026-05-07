import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PortfolioSummary, Holding, NseIndex } from '../../core/models';
import { selectPortfolioSummary, selectAllHoldings } from '../../store/portfolio/portfolio.selectors';
import { selectGoldPrices } from '../../store/gold/gold.selectors';
import { loadPortfolio } from '../../store/portfolio/portfolio.actions';
import { loadGoldPrices, loadGoldEtfs, startGoldPricePoll, stopGoldPricePoll } from '../../store/gold/gold.actions';
import { loadFunds } from '../../store/funds/funds.actions';
import { GoldService } from '../../core/services/gold.service';
import { setMarketStatus } from '../../store/ui/ui.actions';

@Component({
  standalone: false,
  selector: 'app-dashboard',
  template: `
    <div class="page-container">
      <div class="flex items-center justify-between mt-8" style="margin-bottom:20px">
        <h2 style="font-size:1.25rem;font-weight:700">Dashboard</h2>
        <span class="text-sm" style="color:var(--text-secondary)">{{ today }}</span>
      </div>

      <!-- Portfolio Summary -->
      <ng-container *ngIf="summary$ | async as s">
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-label">Total Invested</div>
            <div class="stat-value">₹{{ s.totalInvested | number:'1.0-0' }}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Current Value</div>
            <div class="stat-value">₹{{ s.currentValue | number:'1.0-0' }}</div>
            <div class="stat-change" [class.positive]="s.dayChange >= 0" [class.negative]="s.dayChange < 0">
              {{ s.dayChange >= 0 ? '▲' : '▼' }} ₹{{ s.dayChange | number:'1.0-0' }} ({{ s.dayChangePercent | number:'1.2-2' }}%) today
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Total P&L</div>
            <div class="stat-value" [class.positive]="s.totalPnl >= 0" [class.negative]="s.totalPnl < 0">
              ₹{{ s.totalPnl | number:'1.0-0' }}
            </div>
            <div class="stat-change" [class.positive]="s.totalPnlPercent >= 0" [class.negative]="s.totalPnlPercent < 0">
              {{ s.totalPnlPercent | number:'1.2-2' }}% overall
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-label">MF / Gold Split</div>
            <div class="stat-value" style="font-size:1rem">
              ₹{{ s.mfValue | number:'1.0-0' }} / ₹{{ s.goldValue | number:'1.0-0' }}
            </div>
            <div class="stat-change">{{ s.sipCount }} active SIPs · {{ s.holdingsCount }} holdings</div>
          </div>
        </div>
      </ng-container>

      <!-- Holdings Table -->
      <div class="card mt-16">
        <div class="card-header">
          <h3>Holdings</h3>
          <a routerLink="/portfolio" class="btn btn-outline btn-sm">View All</a>
        </div>
        <div style="overflow-x:auto">
          <table class="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th class="hide-mobile">Type</th>
                <th class="text-right">Invested</th>
                <th class="text-right">Current</th>
                <th class="text-right">P&L</th>
                <th class="text-right hide-mobile">XIRR</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let h of holdings$ | async">
                <td>
                  <div class="font-bold text-sm truncate" style="max-width:200px">{{ h.schemeName }}</div>
                  <div class="text-xs" style="color:var(--text-muted)">{{ h.units | number:'1.3-3' }} units</div>
                </td>
                <td class="hide-mobile"><span class="badge badge-info">{{ h.type | titlecase }}</span></td>
                <td class="text-right text-sm">₹{{ h.investedAmount | number:'1.0-0' }}</td>
                <td class="text-right text-sm font-bold">₹{{ h.currentValue | number:'1.0-0' }}</td>
                <td class="text-right text-sm" [class.positive]="h.pnl >= 0" [class.negative]="h.pnl < 0">
                  ₹{{ h.pnl | number:'1.0-0' }}<br>
                  <span class="text-xs">{{ h.pnlPercent | number:'1.2-2' }}%</span>
                </td>
                <td class="text-right text-sm hide-mobile" [class.positive]="(h.xirr ?? 0) >= 0">
                  {{ h.xirr ? (h.xirr | number:'1.1-1') + '%' : '—' }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Gold Prices -->
      <div class="card mt-16">
        <div class="card-header">
          <h3>Gold Prices (MCX)</h3>
          <a routerLink="/gold" class="btn btn-outline btn-sm">Trade Gold</a>
        </div>
        <div class="stats-grid" style="margin-bottom:0">
          <div *ngFor="let g of goldPrices$ | async" class="stat-card" style="cursor:pointer" routerLink="/gold">
            <div class="stat-label">{{ g.symbol }} <span class="text-xs" style="color:var(--text-muted)">{{ g.expiry }}</span></div>
            <div class="stat-value">₹{{ g.ltp | number:'1.0-0' }}</div>
            <div class="stat-change" [class.positive]="g.change >= 0" [class.negative]="g.change < 0">
              {{ g.change >= 0 ? '▲' : '▼' }} {{ g.changePercent | number:'1.2-2' }}%
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="card mt-16">
        <div class="card-header"><h3>Quick Actions</h3></div>
        <div class="flex gap-8" style="flex-wrap:wrap">
          <a routerLink="/mutual-funds" class="btn btn-primary">Invest in MF</a>
          <a routerLink="/gold" class="btn btn-outline">Buy Gold</a>
          <a routerLink="/portfolio/sip" class="btn btn-outline">Manage SIPs</a>
          <a routerLink="/portfolio/transactions" class="btn btn-outline">Transactions</a>
        </div>
      </div>
    </div>
  `,
})
export class DashboardComponent implements OnInit, OnDestroy {
  summary$: Observable<PortfolioSummary | null>;
  holdings$: Observable<Holding[]>;
  goldPrices$: Observable<any[]>;
  today = new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  private destroy$ = new Subject<void>();

  constructor(private store: Store, private goldService: GoldService) {
    this.summary$ = this.store.select(selectPortfolioSummary);
    this.holdings$ = this.store.select(selectAllHoldings);
    this.goldPrices$ = this.store.select(selectGoldPrices);
  }

  ngOnInit() {
    this.store.dispatch(loadPortfolio());
    this.store.dispatch(loadGoldPrices());
    this.store.dispatch(loadGoldEtfs());
    this.store.dispatch(startGoldPricePoll());
    this.goldService.getMarketStatus().pipe(takeUntil(this.destroy$)).subscribe(status => {
      this.store.dispatch(setMarketStatus({ isOpen: status.marketStatus === 'Open' }));
    });
  }

  ngOnDestroy() {
    this.store.dispatch(stopGoldPricePoll());
    this.destroy$.next(); this.destroy$.complete();
  }
}
