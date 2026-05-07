import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { selectGoldPrices, selectGoldEtfs } from '../../../store/gold/gold.selectors';
import { placeOrder } from '../../../store/portfolio/portfolio.actions';
import { selectOrderLoading } from '../../../store/portfolio/portfolio.selectors';

@Component({
  standalone: false,
  selector: 'app-gold-detail',
  template: `
    <div class="page-container">
      <a routerLink="/gold" class="btn btn-outline btn-sm" style="margin-bottom:16px">← Back</a>

      <ng-container *ngIf="instrument$ | async as inst">
        <div class="card" style="margin-bottom:16px">
          <div class="flex items-center justify-between" style="flex-wrap:wrap;gap:12px">
            <div>
              <h2 style="font-size:1.25rem;font-weight:700">{{ inst.symbol }}</h2>
              <p style="color:var(--text-secondary);font-size:.875rem">{{ inst.name || inst.symbol }}</p>
            </div>
            <div class="text-right">
              <div style="font-size:2rem;font-weight:700">₹{{ inst.ltp | number:'1.2-2' }}</div>
              <div [class.positive]="inst.change >= 0" [class.negative]="inst.change < 0">
                {{ inst.change >= 0 ? '▲' : '▼' }} {{ inst.changePercent | number:'1.2-2' }}%
              </div>
            </div>
          </div>

          <div class="stats-grid" style="margin-top:16px;margin-bottom:0">
            <div class="stat-card"><div class="stat-label">Open</div><div class="stat-value" style="font-size:1rem">₹{{ inst.open | number:'1.0-0' }}</div></div>
            <div class="stat-card"><div class="stat-label">High</div><div class="stat-value positive" style="font-size:1rem">₹{{ inst.high | number:'1.0-0' }}</div></div>
            <div class="stat-card"><div class="stat-label">Low</div><div class="stat-value negative" style="font-size:1rem">₹{{ inst.low | number:'1.0-0' }}</div></div>
            <div class="stat-card"><div class="stat-label">Prev Close</div><div class="stat-value" style="font-size:1rem">₹{{ inst.close | number:'1.0-0' }}</div></div>
          </div>
        </div>

        <!-- Buy Form -->
        <div class="card" style="max-width:400px">
          <div class="card-header"><h3>Buy {{ symbol }}</h3></div>
          <form [formGroup]="buyForm" (ngSubmit)="buy(inst)">
            <div class="form-group">
              <label>Quantity (Units)</label>
              <input class="form-control" formControlName="units" type="number" min="1" placeholder="1">
            </div>
            <div class="form-group">
              <label>Estimated Amount</label>
              <div class="form-control" style="background:var(--surface-2);cursor:default">
                ₹{{ (buyForm.value.units || 0) * inst.ltp | number:'1.2-2' }}
              </div>
            </div>
            <button class="btn btn-primary btn-block" type="submit"
                    [disabled]="buyForm.invalid || (orderLoading$ | async)">
              {{ (orderLoading$ | async) ? 'Placing Order...' : 'Place Buy Order' }}
            </button>
          </form>
        </div>
      </ng-container>
    </div>
  `,
})
export class GoldDetailComponent implements OnInit {
  symbol = '';
  instrument$!: Observable<any>;
  orderLoading$: Observable<boolean>;
  buyForm: FormGroup;

  constructor(private route: ActivatedRoute, private store: Store, private fb: FormBuilder) {
    this.orderLoading$ = this.store.select(selectOrderLoading);
    this.buyForm = this.fb.group({ units: [1, [Validators.required, Validators.min(1)]] });
  }

  ngOnInit() {
    this.symbol = this.route.snapshot.paramMap.get('symbol')!;
    this.instrument$ = combineLatest([
      this.store.select(selectGoldPrices),
      this.store.select(selectGoldEtfs),
    ]).pipe(
      map(([prices, etfs]) => {
        const p = prices.find(x => x.symbol === this.symbol);
        const e = etfs.find(x => x.symbol === this.symbol);
        if (p) return { ...p, name: p.symbol };
        if (e) return { symbol: e.symbol, name: e.name, ltp: e.ltp, change: e.change, changePercent: e.changePercent, open: e.nav, high: e.ltp, low: e.nav, close: e.nav };
        return null;
      })
    );
  }

  buy(inst: any) {
    if (this.buyForm.valid) {
      this.store.dispatch(placeOrder({ order: { type: 'BUY', assetType: 'GOLD_ETF', symbol: inst.symbol, units: this.buyForm.value.units } }));
    }
  }
}
