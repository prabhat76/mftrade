import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Holding } from '../../../core/models';
import { selectAllHoldings, selectPortfolioLoading } from '../../../store/portfolio/portfolio.selectors';
import { loadPortfolio } from '../../../store/portfolio/portfolio.actions';

@Component({
  standalone: false,
  selector: 'app-holdings',
  template: `
    <div class="page-container">
      <h2 style="font-size:1.25rem;font-weight:700;margin-bottom:20px">Holdings</h2>
      <app-loader *ngIf="loading$ | async"></app-loader>
      <div class="card">
        <div style="overflow-x:auto">
          <table class="data-table">
            <thead>
              <tr>
                <th>Name</th><th class="hide-mobile">Type</th>
                <th class="text-right">Units</th><th class="text-right">Avg Price</th>
                <th class="text-right">Invested</th><th class="text-right">Current</th>
                <th class="text-right">P&L</th><th class="text-right hide-mobile">XIRR</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let h of holdings$ | async">
                <td>
                  <div class="font-bold text-sm">{{ h.schemeName }}</div>
                  <div class="text-xs" style="color:var(--text-muted)">{{ h.folioNumber || h.symbol }}</div>
                </td>
                <td class="hide-mobile"><span class="badge badge-info text-xs">{{ h.type }}</span></td>
                <td class="text-right text-sm">{{ h.units | number:'1.3-3' }}</td>
                <td class="text-right text-sm">₹{{ h.avgBuyPrice | number:'1.2-2' }}</td>
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
})
export class HoldingsComponent implements OnInit {
  holdings$: Observable<Holding[]>;
  loading$: Observable<boolean>;

  constructor(private store: Store) {
    this.holdings$ = this.store.select(selectAllHoldings);
    this.loading$ = this.store.select(selectPortfolioLoading);
  }

  ngOnInit() { this.store.dispatch(loadPortfolio()); }
}
