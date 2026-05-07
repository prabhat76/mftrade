import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectSidebarOpen } from '../../../store/ui/ui.selectors';

interface NavItem {
  label: string;
  icon: string;
  route: string;
  children?: NavItem[];
}

@Component({
  standalone: false,
  selector: 'app-sidebar',
  template: `
    <nav class="sidebar" [class.collapsed]="!(sidebarOpen$ | async)">
      <ul class="nav-list">
        <li *ngFor="let item of navItems">
          <a [routerLink]="item.route" routerLinkActive="active" class="nav-item">
            <span class="material-icons nav-icon">{{ item.icon }}</span>
            <span class="nav-label">{{ item.label }}</span>
          </a>
        </li>
      </ul>
    </nav>
  `,
  styles: [`
    .sidebar {
      position: fixed; left: 0; top: var(--header-height); bottom: 0;
      width: var(--sidebar-width); background: var(--surface);
      border-right: 1px solid var(--border); overflow-y: auto;
      transition: width var(--transition), transform var(--transition);
      z-index: 90;
    }
    .sidebar.collapsed { width: 64px; }
    .sidebar.collapsed .nav-label { display: none; }
    .nav-list { list-style: none; padding: 8px 0; }
    .nav-item {
      display: flex; align-items: center; gap: 12px;
      padding: 12px 16px; color: var(--text-secondary);
      transition: all var(--transition); border-radius: 0 24px 24px 0; margin-right: 8px;
    }
    .nav-item:hover { background: var(--surface-2); color: var(--primary); }
    .nav-item.active { background: #e8f0fe; color: var(--primary); font-weight: 600; }
    .nav-icon { font-size: 1.25rem; flex-shrink: 0; }
    .nav-label { font-size: .875rem; white-space: nowrap; }

    @media (max-width: 768px) {
      .sidebar { transform: translateX(-100%); }
      .sidebar:not(.collapsed) { transform: translateX(0); box-shadow: var(--shadow-md); }
    }
  `]
})
export class SidebarComponent {
  sidebarOpen$: Observable<boolean>;

  navItems: NavItem[] = [
    { label: 'Dashboard',     icon: 'dashboard',       route: '/dashboard' },
    { label: 'Mutual Funds',  icon: 'trending_up',     route: '/mutual-funds' },
    { label: 'Gold',          icon: 'monetization_on', route: '/gold' },
    { label: 'Portfolio',     icon: 'account_balance_wallet', route: '/portfolio' },
    { label: 'Transactions',  icon: 'receipt_long',    route: '/portfolio/transactions' },
    { label: 'SIP Manager',   icon: 'autorenew',       route: '/portfolio/sip' },
    { label: 'Watchlist',     icon: 'bookmark',        route: '/watchlist' },
  ];

  constructor(private store: Store) {
    this.sidebarOpen$ = this.store.select(selectSidebarOpen);
  }
}
