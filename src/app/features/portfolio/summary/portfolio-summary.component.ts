import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { PortfolioSummary, Holding } from '../../../core/models';
import { selectPortfolioSummary, selectAllHoldings, selectPortfolioLoading } from '../../../store/portfolio/portfolio.selectors';
import { loadPortfolio } from '../../../store/portfolio/portfolio.actions';

@Component({
  standalone: false,
  selector: 'app-portfolio-summary',
  template: `
    <div class="page-container">
      <div class="flex items-center justify-between" style="margin-bottom:20px">
        <h2 style="font-size:1.25rem;font-weight:700">Portfolio</h2>
        <div class="flex gap-8">
          <a routerLink="/portfolio/transactions" class="btn btn-outline btn-sm">Transactions</a>
          <a routerLink="/portfolio/sip" class="btn btn-outline btn-sm">SIPs</a>
        </div>
      </div>

      <app-loader *ngIf="loading$ | async"></app-loader>

      <ng-container *ngIf="summary$ | async as s">
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-label">Invested</div>
            <div class="stat-value">₹{{ s.totalInvested | number:'1.0-0' }}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Current Value</div>
            <div class="stat-value">₹{{ s.currentValue | number:'1.0-0' }}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Total P&L</div>
            <div class="stat-value" [class.positive]="s.totalPnl >= 0" [class.negative]="s.totalPnl < 0">
              ₹{{ s.totalPnl | number:'1.0-0' }}
            </div>
            <div class="stat-change" [class.positive]="s.totalPnlPercent >= 0" [class.negative]="s.totalPnlPercent < 0">
              {{ s.totalPnlPercent | number:'1.2-2' }}%
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Today's Change</div>
            <div class="stat-value" [class.positive]="s.dayChange >= 0" [class.negative]="s.dayChange < 0">
              ₹{{ s.dayChange | number:'1.0-0' }}
            </div>
            <div class="stat-change" [class.positive]="s.dayChangePercent >= 0" [class.negative]="s.dayChangePercent < 0">
              {{ s.dayChangePercent | number:'1.2-2' }}%
            </div>
          </div>
        </div>

        <!-- Allocation -->
        <div class="card mt-16" style="margin-bottom:16px">
          <div class="card-header"><h3>Asset Allocation</h3></div>
          <div class="allocation-bar">
            <div class="alloc-mf" [style.width.%]="(s.mfValue / s.currentValue) * 100" title="Mutual Funds">
              MF {{ (s.mfValue / s.currentValue * 100) | number:'1.0-0' }}%
            </div>
            <div class="alloc-gold" [style.width.%]="(s.goldValue / s.currentValue) * 100" title="Gold">
              Gold {{ (s.goldValue / s.currentValue * 100) | number:'1.0-0' }}%
            </div>
          </div>
          <div class="flex gap-16 mt-8">
            <span class="text-sm"><span class="alloc-dot mf"></span> MF ₹{{ s.mfValue | number:'1.0-0' }}</span>
            <span class="text-sm"><span class="alloc-dot gold"></span> Gold ₹{{ s.goldValue | number:'1.0-0' }}</span>
          </div>
        </div>
      </ng-container>

      <!-- Holdings -->
      <div class="card">
        <div class="card-header"><h3>Holdings</h3></div>
        <div style="overflow-x:auto">
          <table class="data-table">
            <thead>
              <tr>
                <th>Fund / Instrument</th>
                <th class="hide-mobile">Units</th>
                <th class="text-right">Invested</th>
                <th class="text-right">Current</th>
                <th class="text-right">P&L</th>
                <th class="text-right hide-mobile">XIRR</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let h of holdings$ | async">
                <td>
                  <div class="font-bold text-sm">{{ h.schemeName }}</div>
                  <div class="text-xs" style="color:var(--text-muted)">{{ h.folioNumber || h.symbol }}</div>
                </td>
                <td class="hide-mobile text-sm">{{ h.units | number:'1.3-3' }}</td>
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
    </div>
  `,
  styles: [`
    .allocation-bar { display: flex; height: 32px; border-radius: var(--radius); overflow: hidden; background: var(--surface-2); }
    .alloc-mf { background: var(--primary); color: #fff; display: flex; align-items: center; justify-content: center; font-size: .75rem; font-weight: 600; transition: width .5s ease; }
    .alloc-gold { background: var(--secondary); color: #fff; display: flex; align-items: center; justify-content: center; font-size: .75rem; font-weight: 600; transition: width .5s ease; }
    .alloc-dot { display: inline-block; width: 10px; height: 10px; border-radius: 50%; margin-right: 4px; }
    .alloc-dot.mf { background: var(--primary); }
    .alloc-dot.gold { background: var(--secondary); }
  `]
})
export class PortfolioSummaryComponent implements OnInit {
  summary$: Observable<PortfolioSummary | null>;
  holdings$: Observable<Holding[]>;
  loading$: Observable<boolean>;

  constructor(private store: Store) {
    this.summary$ = this.store.select(selectPortfolioSummary);
    this.holdings$ = this.store.select(selectAllHoldings);
    this.loading$ = this.store.select(selectPortfolioLoading);
  }

  ngOnInit() { this.store.dispatch(loadPortfolio()); }
}
