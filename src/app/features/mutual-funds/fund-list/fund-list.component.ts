import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { MutualFund } from '../../../core/models';
import { selectFilteredFunds, selectFundsLoading } from '../../../store/funds/funds.selectors';
import { loadFunds, searchFunds, setFundFilter } from '../../../store/funds/funds.actions';

@Component({
  standalone: false,
  selector: 'app-fund-list',
  template: `
    <div class="page-container">
      <div class="flex items-center justify-between" style="margin-bottom:20px">
        <h2 style="font-size:1.25rem;font-weight:700">Mutual Funds</h2>
        <a routerLink="/mutual-funds/sip-calculator" class="btn btn-outline btn-sm">SIP Calculator</a>
      </div>

      <!-- Search & Filters -->
      <div class="card" style="margin-bottom:16px">
        <div class="flex gap-8" style="flex-wrap:wrap;align-items:center">
          <input class="form-control" style="max-width:320px" [formControl]="searchCtrl" placeholder="Search funds, AMC...">
          <select class="form-control" style="max-width:180px" (change)="onCategoryChange($event)">
            <option value="">All Categories</option>
            <option value="Large Cap">Large Cap</option>
            <option value="Mid Cap">Mid Cap</option>
            <option value="Small Cap">Small Cap</option>
            <option value="Flexi Cap">Flexi Cap</option>
            <option value="Gold">Gold</option>
            <option value="Debt">Debt</option>
          </select>
          <select class="form-control" style="max-width:160px" (change)="onSortChange($event)">
            <option value="">Sort By</option>
            <option value="nav">NAV</option>
            <option value="name">Name</option>
          </select>
        </div>
      </div>

      <!-- Loading -->
      <app-loader *ngIf="loading$ | async" message="Loading funds..."></app-loader>

      <!-- Fund Cards -->
      <div class="funds-grid" *ngIf="!(loading$ | async)">
        <div *ngFor="let fund of funds$ | async" class="fund-card card" [routerLink]="['/mutual-funds/detail', fund.schemeCode]">
          <div class="fund-header">
            <div class="fund-house-badge">{{ fund.fundHouse.split(' ')[0] }}</div>
            <span class="badge badge-info text-xs">{{ fund.schemeCategory | slice:0:20 }}</span>
          </div>
          <h4 class="fund-name">{{ fund.schemeName }}</h4>
          <div class="fund-footer">
            <span class="text-xs" style="color:var(--text-muted)">{{ fund.schemeCode }}</span>
            <span class="badge badge-neutral text-xs">{{ fund.schemeType | slice:0:15 }}</span>
          </div>
        </div>
      </div>

      <div *ngIf="(funds$ | async)?.length === 0 && !(loading$ | async)" class="text-center" style="padding:48px;color:var(--text-muted)">
        No funds found. Try a different search.
      </div>
    </div>
  `,
  styles: [`
    .funds-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }
    .fund-card { cursor: pointer; transition: box-shadow var(--transition), transform var(--transition); }
    .fund-card:hover { box-shadow: var(--shadow-md); transform: translateY(-2px); }
    .fund-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
    .fund-house-badge { font-size: .7rem; font-weight: 700; color: var(--primary); background: #e8f0fe; padding: 2px 8px; border-radius: 4px; }
    .fund-name { font-size: .875rem; font-weight: 600; line-height: 1.4; margin-bottom: 12px; color: var(--text-primary); }
    .fund-footer { display: flex; align-items: center; justify-content: space-between; }
    @media (max-width: 480px) { .funds-grid { grid-template-columns: 1fr; } }
  `]
})
export class FundListComponent implements OnInit {
  funds$: Observable<MutualFund[]>;
  loading$: Observable<boolean>;
  searchCtrl = new FormControl('');
  private destroy$ = new Subject<void>();

  constructor(private store: Store) {
    this.funds$ = this.store.select(selectFilteredFunds);
    this.loading$ = this.store.select(selectFundsLoading);
  }

  ngOnInit() {
    this.store.dispatch(loadFunds({}));
    this.searchCtrl.valueChanges.pipe(
      debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$)
    ).subscribe(q => this.store.dispatch(searchFunds({ query: q ?? '' })));
  }

  onCategoryChange(e: Event) {
    this.store.dispatch(setFundFilter({ filter: { category: (e.target as HTMLSelectElement).value } }));
  }

  onSortChange(e: Event) {
    this.store.dispatch(setFundFilter({ filter: { sortBy: (e.target as HTMLSelectElement).value } }));
  }

  ngOnDestroy() { this.destroy$.next(); this.destroy$.complete(); }
}
