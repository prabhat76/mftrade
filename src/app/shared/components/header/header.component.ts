import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { User, NseIndex } from '../../../core/models';
import { selectUser } from '../../../store/auth/auth.selectors';
import { selectSidebarOpen, selectMarketOpen } from '../../../store/ui/ui.selectors';
import { toggleSidebar } from '../../../store/ui/ui.actions';
import { logout } from '../../../store/auth/auth.actions';

@Component({
  standalone: false,
  selector: 'app-header',
  template: `
    <header class="app-header">
      <div class="header-left">
        <button class="icon-btn" (click)="toggleSidebar()">
          <span class="material-icons">menu</span>
        </button>
        <a routerLink="/dashboard" class="brand">
          <span class="brand-icon">📈</span>
          <span class="brand-name hide-xs">MFTrade</span>
        </a>
      </div>

      <div class="header-center hide-mobile">
        <div class="market-status" [class.open]="marketOpen$ | async">
          <span class="dot"></span>
          <span>{{ (marketOpen$ | async) ? 'Market Open' : 'Market Closed' }}</span>
        </div>
      </div>

      <div class="header-right">
        <button class="icon-btn" routerLink="/watchlist" title="Watchlist">
          <span class="material-icons">bookmark_border</span>
        </button>
        <div class="user-menu" *ngIf="user$ | async as user">
          <div class="avatar">{{ user.name[0] }}</div>
          <span class="hide-mobile text-sm">{{ user.name }}</span>
          <button class="icon-btn" (click)="logout()" title="Logout">
            <span class="material-icons">logout</span>
          </button>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .app-header {
      position: fixed; top: 0; left: 0; right: 0; z-index: 100;
      height: var(--header-height); background: var(--surface);
      border-bottom: 1px solid var(--border);
      display: flex; align-items: center; justify-content: space-between;
      padding: 0 16px; box-shadow: var(--shadow);
    }
    .header-left, .header-right { display: flex; align-items: center; gap: 8px; }
    .header-center { flex: 1; display: flex; justify-content: center; }
    .brand { display: flex; align-items: center; gap: 8px; font-weight: 700; font-size: 1.1rem; color: var(--primary); }
    .brand-icon { font-size: 1.4rem; }
    .icon-btn { background: none; border: none; cursor: pointer; padding: 8px; border-radius: 50%; display: flex; align-items: center; color: var(--text-secondary); transition: background var(--transition); }
    .icon-btn:hover { background: var(--surface-2); }
    .market-status { display: flex; align-items: center; gap: 6px; font-size: .8rem; color: var(--text-secondary); padding: 4px 12px; border-radius: 12px; background: var(--surface-2); }
    .market-status.open .dot { background: var(--success); }
    .dot { width: 8px; height: 8px; border-radius: 50%; background: var(--danger); }
    .user-menu { display: flex; align-items: center; gap: 8px; }
    .avatar { width: 32px; height: 32px; border-radius: 50%; background: var(--primary); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: .875rem; }
  `]
})
export class HeaderComponent {
  user$: Observable<User | null>;
  marketOpen$: Observable<boolean>;

  constructor(private store: Store) {
    this.user$ = this.store.select(selectUser);
    this.marketOpen$ = this.store.select(selectMarketOpen);
  }

  toggleSidebar() { this.store.dispatch(toggleSidebar()); }
  logout() { this.store.dispatch(logout()); }
}
