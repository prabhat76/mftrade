import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { FundListComponent } from './fund-list/fund-list.component';
import { FundDetailComponent } from './fund-detail/fund-detail.component';
import { SipCalculatorComponent } from './sip-calculator/sip-calculator.component';

const routes: Routes = [
  { path: '', component: FundListComponent },
  { path: 'detail/:schemeCode', component: FundDetailComponent },
  { path: 'sip-calculator', component: SipCalculatorComponent },
];

@NgModule({
  declarations: [FundListComponent, FundDetailComponent, SipCalculatorComponent],
  imports: [SharedModule, RouterModule.forChild(routes)],
})
export class MutualFundsModule {}
