import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Transaction } from '../../../core/models';
import { selectTransactions } from '../../../store/portfolio/portfolio.selectors';
import { loadTransactions } from '../../../store/portfolio/portfolio.actions';

@Component({
  standalone: false,
  selector: 'app-transactions',
  template: `
    <div class="page-container">
      <h2 style="font-size:1.25rem;font-weight:700;margin-bottom:20px">Transactions</h2>
      <div class="card">
        <div style="overflow-x:auto">
          <table class="data-table">
            <thead>
              <tr>
                <th>Date</th><th>Type</th><th>Fund / Instrument</th>
                <th class="text-right">Units</th><th class="text-right">Price</th>
                <th class="text-right">Amount</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let t of transactions$ | async">
                <td class="text-xs">{{ t.orderDate | date:'dd MMM yy' }}</td>
                <td><span class="badge" [ngClass]="typeClass(t.type)">{{ t.type }}</span></td>
                <td class="text-sm">{{ t.schemeName }}</td>
                <td class="text-right text-sm">{{ t.units | number:'1.3-3' }}</td>
                <td class="text-right text-sm">₹{{ t.price | number:'1.2-2' }}</td>
                <td class="text-right text-sm font-bold">₹{{ t.amount | number:'1.0-0' }}</td>
                <td><span class="badge" [ngClass]="statusClass(t.status)">{{ t.status }}</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
})
export class TransactionsComponent implements OnInit {
  transactions$: Observable<Transaction[]>;

  constructor(private store: Store) {
    this.transactions$ = this.store.select(selectTransactions);
  }

  ngOnInit() { this.store.dispatch(loadTransactions({})); }

  typeClass(type: string) {
    return { 'badge-success': type === 'BUY' || type === 'SIP', 'badge-danger': type === 'SELL' || type === 'REDEMPTION', 'badge-info': type === 'SWITCH' };
  }

  statusClass(status: string) {
    return { 'badge-success': status === 'COMPLETED', 'badge-warning': status === 'PENDING' || status === 'PROCESSING', 'badge-danger': status === 'FAILED' || status === 'CANCELLED' };
  }
}
