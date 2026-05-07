import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectIsAuthenticated } from './store/auth/auth.selectors';
import { selectSidebarOpen } from './store/ui/ui.selectors';
import { loadProfile } from './store/auth/auth.actions';
import { AuthService } from './core/services/auth.service';
import { environment } from '../environments/environment';

@Component({
  standalone: false,
  selector: 'app-root',
  template: `
    <!-- ENV BADGE: hidden in production -->
    <div class="env-badge env-{{ envName }}" *ngIf="envName !== 'production'">
      {{ envName | uppercase }}
    </div>

    <ng-container *ngIf="isAuthenticated$ | async; else authLayout">
      <app-header></app-header>
      <app-sidebar></app-sidebar>
      <main class="main-content" [class.sidebar-collapsed]="!(sidebarOpen$ | async)">
        <router-outlet></router-outlet>
      </main>
    </ng-container>

    <ng-template #authLayout>
      <router-outlet></router-outlet>
    </ng-template>

    <app-toast></app-toast>
  `,
  styles: [`
    .env-badge {
      position: fixed;
      bottom: 12px;
      left: 12px;
      z-index: 99999;
      padding: 3px 10px;
      border-radius: 4px;
      font-size: .65rem;
      font-weight: 700;
      letter-spacing: 1px;
      pointer-events: none;
      opacity: .85;
    }
    .env-dev   { background: #34a853; color: #fff; }
    .env-sit   { background: #4285f4; color: #fff; }
    .env-stage { background: #f5a623; color: #fff; }
    .env-pat   { background: #9c27b0; color: #fff; }
  `]
})
export class App implements OnInit {
  isAuthenticated$: Observable<boolean>;
  sidebarOpen$: Observable<boolean>;
  envName = environment.name;

  constructor(private store: Store, private authService: AuthService) {
    this.isAuthenticated$ = this.store.select(selectIsAuthenticated);
    this.sidebarOpen$ = this.store.select(selectSidebarOpen);
  }

  ngOnInit() {
    console.info(
      `%c MFTrade [${environment.name.toUpperCase()}] `,
      `background:${{ dev:'#34a853', sit:'#4285f4', stage:'#f5a623', pat:'#9c27b0', production:'#202124' }[environment.name] ?? '#555'}; color:#fff; font-weight:bold; border-radius:3px; padding:2px 6px`,
      '\nAPI:', environment.apiBase,
      '| Mocks:', environment.useMocks
    );
    if (this.authService.isTokenValid()) {
      this.store.dispatch(loadProfile());
    }
  }
}
