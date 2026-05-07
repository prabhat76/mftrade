import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { SipOrder } from '../../../core/models';
import { selectSips } from '../../../store/portfolio/portfolio.selectors';
import { cancelSip } from '../../../store/portfolio/portfolio.actions';

@Component({
  standalone: false,
  selector: 'app-sip-manager',
  template: `
    <div class="page-container">
      <div class="flex items-center justify-between" style="margin-bottom:20px">
        <h2 style="font-size:1.25rem;font-weight:700">SIP Manager</h2>
        <a routerLink="/mutual-funds" class="btn btn-primary btn-sm">+ New SIP</a>
      </div>

      <div class="card">
        <div *ngIf="(sips$ | async)?.length === 0" class="text-center" style="padding:48px;color:var(--text-muted)">
          No active SIPs. <a routerLink="/mutual-funds">Start a SIP</a>
        </div>
        <div style="overflow-x:auto" *ngIf="(sips$ | async)?.length">
          <table class="data-table">
            <thead>
              <tr>
                <th>Fund</th><th>Amount</th><th>Frequency</th>
                <th class="hide-mobile">Next Date</th><th class="hide-mobile">Progress</th>
                <th>Status</th><th></th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let s of sips$ | async">
                <td class="text-sm font-bold">{{ s.schemeName }}</td>
                <td>₹{{ s.amount | number:'1.0-0' }}</td>
                <td class="text-xs">{{ s.frequency }}</td>
                <td class="hide-mobile text-xs">{{ s.nextInstallmentDate | date:'dd MMM yy' }}</td>
                <td class="hide-mobile text-xs">{{ s.completedInstallments }}/{{ s.totalInstallments }}</td>
                <td><span class="badge" [ngClass]="statusClass(s.status)">{{ s.status }}</span></td>
                <td>
                  <button class="btn btn-danger btn-sm" *ngIf="s.status === 'ACTIVE'" (click)="cancel(s.id!)">Cancel</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
})
export class SipManagerComponent implements OnInit {
  sips$: Observable<SipOrder[]>;

  constructor(private store: Store) {
    this.sips$ = this.store.select(selectSips);
  }

  ngOnInit() {}

  cancel(id: string) { this.store.dispatch(cancelSip({ sipId: id })); }

  statusClass(s: string) {
    return {
      'badge-success': s === 'ACTIVE',
      'badge-warning': s === 'PAUSED',
      'badge-danger': s === 'CANCELLED',
      'badge-neutral': s === 'COMPLETED',
    };
  }
}
