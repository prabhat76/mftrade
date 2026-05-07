import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { SharedModule } from './shared/shared.module';

import { authReducer } from './store/auth/auth.reducer';
import { fundsReducer } from './store/funds/funds.reducer';
import { goldReducer } from './store/gold/gold.reducer';
import { portfolioReducer } from './store/portfolio/portfolio.reducer';
import { watchlistReducer } from './store/watchlist/watchlist.reducer';
import { uiReducer } from './store/ui/ui.reducer';

import { AuthEffects } from './store/auth/auth.effects';
import { FundsEffects } from './store/funds/funds.effects';
import { GoldEffects } from './store/gold/gold.effects';
import { PortfolioEffects } from './store/portfolio/portfolio.effects';
import { WatchlistEffects } from './store/watchlist/watchlist.effects';

import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { ErrorInterceptor } from './core/interceptors/error.interceptor';

import { environment } from '../environments/environment';

@NgModule({
  declarations: [App],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    SharedModule,
    StoreModule.forRoot({
      auth: authReducer,
      funds: fundsReducer,
      gold: goldReducer,
      portfolio: portfolioReducer,
      watchlist: watchlistReducer,
      ui: uiReducer,
    }),
    EffectsModule.forRoot([
      AuthEffects,
      FundsEffects,
      GoldEffects,
      PortfolioEffects,
      WatchlistEffects,
    ]),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production,
      autoPause: true,
    }),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [App],
})
export class AppModule {}
