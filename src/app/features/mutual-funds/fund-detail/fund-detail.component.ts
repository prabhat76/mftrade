import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FundDetail } from '../../../core/models';
import { selectSelectedFund, selectFundDetailLoading } from '../../../store/funds/funds.selectors';
import { loadFundDetail, clearFundDetail } from '../../../store/funds/funds.actions';
import { placeOrder, createSip } from '../../../store/portfolio/portfolio.actions';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  standalone: false,
  selector: 'app-fund-detail',
  template: `
    <div class="page-container">
      <a routerLink="/mutual-funds" class="btn btn-outline btn-sm" style="margin-bottom:16px">← Back</a>

      <app-loader *ngIf="loading$ | async" message="Loading fund details..."></app-loader>

      <ng-container *ngIf="fund$ | async as fund">
        <!-- Header -->
        <div class="card" style="margin-bottom:16px">
          <div class="flex items-center justify-between" style="flex-wrap:wrap;gap:12px">
            <div>
              <h2 style="font-size:1.1rem;font-weight:700;margin-bottom:4px">{{ fund.schemeName }}</h2>
              <div class="flex gap-8" style="flex-wrap:wrap">
                <span class="badge badge-info">{{ fund.schemeCategory }}</span>
                <span class="badge" [ngClass]="riskClass(fund.riskRating)">{{ fund.riskRating }}</span>
              </div>
            </div>
            <div class="text-right">
              <div style="font-size:1.75rem;font-weight:700">₹{{ fund.currentNav | number:'1.4-4' }}</div>
              <div [class.positive]="fund.navChange >= 0" [class.negative]="fund.navChange < 0">
                {{ fund.navChange >= 0 ? '▲' : '▼' }} ₹{{ fund.navChange | number:'1.4-4' }} ({{ fund.navChangePercent | number:'1.2-2' }}%)
              </div>
            </div>
          </div>
        </div>

        <!-- Stats -->
        <div class="stats-grid" style="margin-bottom:16px">
          <div class="stat-card">
            <div class="stat-label">AUM</div>
            <div class="stat-value" style="font-size:1.1rem">₹{{ fund.aum | number:'1.0-0' }} Cr</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Expense Ratio</div>
            <div class="stat-value" style="font-size:1.1rem">{{ fund.expenseRatio }}%</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Min SIP</div>
            <div class="stat-value" style="font-size:1.1rem">₹{{ fund.minSipAmount }}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Min Lumpsum</div>
            <div class="stat-value" style="font-size:1.1rem">₹{{ fund.minLumpsum }}</div>
          </div>
        </div>

        <!-- Returns -->
        <div class="card" style="margin-bottom:16px">
          <div class="card-header"><h3>Returns</h3></div>
          <div style="overflow-x:auto">
            <table class="data-table">
              <thead>
                <tr>
                  <th>1M</th><th>3M</th><th>6M</th><th>1Y</th><th>3Y</th><th>5Y</th><th>Since Inception</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td [class.positive]="fund.returns.oneMonth >= 0" [class.negative]="fund.returns.oneMonth < 0">{{ fund.returns.oneMonth | number:'1.1-1' }}%</td>
                  <td [class.positive]="fund.returns.threeMonth >= 0" [class.negative]="fund.returns.threeMonth < 0">{{ fund.returns.threeMonth | number:'1.1-1' }}%</td>
                  <td [class.positive]="fund.returns.sixMonth >= 0" [class.negative]="fund.returns.sixMonth < 0">{{ fund.returns.sixMonth | number:'1.1-1' }}%</td>
                  <td [class.positive]="fund.returns.oneYear >= 0" [class.negative]="fund.returns.oneYear < 0">{{ fund.returns.oneYear | number:'1.1-1' }}%</td>
                  <td [class.positive]="fund.returns.threeYear >= 0" [class.negative]="fund.returns.threeYear < 0">{{ fund.returns.threeYear | number:'1.1-1' }}%</td>
                  <td [class.positive]="fund.returns.fiveYear >= 0" [class.negative]="fund.returns.fiveYear < 0">{{ fund.returns.fiveYear | number:'1.1-1' }}%</td>
                  <td [class.positive]="fund.returns.sinceInception >= 0" [class.negative]="fund.returns.sinceInception < 0">{{ fund.returns.sinceInception | number:'1.1-1' }}%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Fund Info -->
        <div class="card" style="margin-bottom:16px">
          <div class="card-header"><h3>Fund Details</h3></div>
          <div class="info-grid">
            <div class="info-row"><span>Fund House</span><span>{{ fund.fundHouse }}</span></div>
            <div class="info-row"><span>Fund Manager</span><span>{{ fund.fundManager || '—' }}</span></div>
            <div class="info-row"><span>Benchmark</span><span>{{ fund.benchmark || '—' }}</span></div>
            <div class="info-row"><span>Exit Load</span><span>{{ fund.exitLoad }}</span></div>
            <div class="info-row"><span>ISIN (Growth)</span><span>{{ fund.isinGrowth }}</span></div>
          </div>
        </div>

        <!-- Invest / SIP -->
        <div class="flex gap-16" style="flex-wrap:wrap">
          <div class="card" style="flex:1;min-width:280px">
            <div class="card-header"><h3>Lumpsum Investment</h3></div>
            <form [formGroup]="lumpsumForm" (ngSubmit)="buyLumpsum(fund)">
              <div class="form-group">
                <label>Amount (₹)</label>
                <input class="form-control" formControlName="amount" type="number" [min]="fund.minLumpsum" [placeholder]="'Min ₹' + fund.minLumpsum">
              </div>
              <button class="btn btn-primary btn-block" type="submit" [disabled]="lumpsumForm.invalid">Invest Now</button>
            </form>
          </div>

          <div class="card" style="flex:1;min-width:280px">
            <div class="card-header"><h3>Start SIP</h3></div>
            <form [formGroup]="sipForm" (ngSubmit)="startSip(fund)">
              <div class="form-group">
                <label>Monthly Amount (₹)</label>
                <input class="form-control" formControlName="amount" type="number" [min]="fund.minSipAmount" [placeholder]="'Min ₹' + fund.minSipAmount">
              </div>
              <div class="form-group">
                <label>Start Date</label>
                <input class="form-control" formControlName="startDate" type="date">
              </div>
              <button class="btn btn-primary btn-block" type="submit" [disabled]="sipForm.invalid">Start SIP</button>
            </form>
          </div>
        </div>
      </ng-container>
    </div>
  `,
  styles: [`
    .info-grid { display: flex; flex-direction: column; gap: 0; }
    .info-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid var(--border); font-size: .875rem; }
    .info-row:last-child { border-bottom: none; }
    .info-row span:first-child { color: var(--text-secondary); }
    .info-row span:last-child { font-weight: 500; text-align: right; }
  `]
})
export class FundDetailComponent implements OnInit, OnDestroy {
  fund$: Observable<FundDetail | null>;
  loading$: Observable<boolean>;
  lumpsumForm: FormGroup;
  sipForm: FormGroup;
  private destroy$ = new Subject<void>();

  constructor(private route: ActivatedRoute, private store: Store, private fb: FormBuilder) {
    this.fund$ = this.store.select(selectSelectedFund);
    this.loading$ = this.store.select(selectFundDetailLoading);
    this.lumpsumForm = this.fb.group({ amount: ['', [Validators.required, Validators.min(500)]] });
    this.sipForm = this.fb.group({
      amount: ['', [Validators.required, Validators.min(500)]],
      startDate: [new Date().toISOString().split('T')[0], Validators.required],
    });
  }

  ngOnInit() {
    const code = +this.route.snapshot.paramMap.get('schemeCode')!;
    this.store.dispatch(loadFundDetail({ schemeCode: code }));
  }

  buyLumpsum(fund: FundDetail) {
    if (this.lumpsumForm.valid) {
      this.store.dispatch(placeOrder({ order: { type: 'BUY', assetType: 'MUTUAL_FUND', schemeCode: fund.schemeCode, amount: this.lumpsumForm.value.amount } }));
    }
  }

  startSip(fund: FundDetail) {
    if (this.sipForm.valid) {
      this.store.dispatch(createSip({ sip: { schemeCode: fund.schemeCode, schemeName: fund.schemeName, amount: this.sipForm.value.amount, frequency: 'MONTHLY', startDate: this.sipForm.value.startDate, userId: '' } }));
    }
  }

  riskClass(risk: string) {
    return { 'badge-success': risk === 'LOW', 'badge-warning': risk === 'MODERATE', 'badge-danger': risk === 'HIGH' || risk === 'VERY_HIGH' };
  }

  ngOnDestroy() { this.store.dispatch(clearFundDetail()); this.destroy$.next(); this.destroy$.complete(); }
}
