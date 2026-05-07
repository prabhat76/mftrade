import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { WatchlistItem } from '../../core/models';
import { selectWatchlistItems, selectWatchlistLoading } from '../../store/watchlist/watchlist.selectors';
import { loadWatchlist, removeFromWatchlist } from '../../store/watchlist/watchlist.actions';

@Component({
  standalone: false,
  selector: 'app-watchlist',
  template: `
    <div class="page-container">
      <h2 style="font-size:1.25rem;font-weight:700;margin-bottom:20px">Watchlist</h2>
      <app-loader *ngIf="loading$ | async"></app-loader>

      <div class="card">
        <div *ngIf="(items$ | async)?.length === 0 && !(loading$ | async)"
             class="text-center" style="padding:48px;color:var(--text-muted)">
          Your watchlist is empty. Browse <a routerLink="/mutual-funds">Mutual Funds</a> or <a routerLink="/gold">Gold</a> to add items.
        </div>

        <div style="overflow-x:auto" *ngIf="(items$ | async)?.length">
          <table class="data-table">
            <thead>
              <tr><th>Name</th><th>Type</th><th class="hide-mobile">Added On</th><th></th></tr>
            </thead>
            <tbody>
              <tr *ngFor="let item of items$ | async">
                <td class="font-bold text-sm">{{ item.name }}</td>
                <td><span class="badge badge-info">{{ item.type }}</span></td>
                <td class="hide-mobile text-xs">{{ item.addedAt | date:'dd MMM yyyy' }}</td>
                <td>
                  <div class="flex gap-8">
                    <a *ngIf="item.type === 'MUTUAL_FUND'" [routerLink]="['/mutual-funds/detail', item.schemeCode]" class="btn btn-outline btn-sm">View</a>
                    <a *ngIf="item.type === 'GOLD'" [routerLink]="['/gold/detail', item.symbol]" class="btn btn-outline btn-sm">View</a>
                    <button class="btn btn-danger btn-sm" (click)="remove(item.id)">Remove</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
})
export class WatchlistComponent implements OnInit {
  items$: Observable<WatchlistItem[]>;
  loading$: Observable<boolean>;

  constructor(private store: Store) {
    this.items$ = this.store.select(selectWatchlistItems);
    this.loading$ = this.store.select(selectWatchlistLoading);
  }

  ngOnInit() { this.store.dispatch(loadWatchlist()); }

  remove(id: string) { this.store.dispatch(removeFromWatchlist({ id })); }
}
