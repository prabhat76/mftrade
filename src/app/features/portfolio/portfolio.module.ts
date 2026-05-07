import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { PortfolioSummaryComponent } from './summary/portfolio-summary.component';
import { HoldingsComponent } from './holdings/holdings.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { SipManagerComponent } from './sip-manager/sip-manager.component';

const routes: Routes = [
  { path: '', component: PortfolioSummaryComponent },
  { path: 'holdings', component: HoldingsComponent },
  { path: 'transactions', component: TransactionsComponent },
  { path: 'sip', component: SipManagerComponent },
];

@NgModule({
  declarations: [PortfolioSummaryComponent, HoldingsComponent, TransactionsComponent, SipManagerComponent],
  imports: [SharedModule, RouterModule.forChild(routes)],
})
export class PortfolioModule {}
