import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { GuestGuard } from './core/guards/guest.guard';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'auth',
    canActivate: [GuestGuard],
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule),
  },
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    loadChildren: () => import('./features/dashboard/dashboard.module').then(m => m.DashboardModule),
  },
  {
    path: 'mutual-funds',
    canActivate: [AuthGuard],
    loadChildren: () => import('./features/mutual-funds/mutual-funds.module').then(m => m.MutualFundsModule),
  },
  {
    path: 'gold',
    canActivate: [AuthGuard],
    loadChildren: () => import('./features/gold/gold.module').then(m => m.GoldModule),
  },
  {
    path: 'portfolio',
    canActivate: [AuthGuard],
    loadChildren: () => import('./features/portfolio/portfolio.module').then(m => m.PortfolioModule),
  },
  {
    path: 'watchlist',
    canActivate: [AuthGuard],
    loadChildren: () => import('./features/watchlist/watchlist.module').then(m => m.WatchlistModule),
  },
  { path: '**', redirectTo: 'dashboard' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
