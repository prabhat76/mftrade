import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { GoldListComponent } from './gold-list/gold-list.component';
import { GoldDetailComponent } from './gold-detail/gold-detail.component';

const routes: Routes = [
  { path: '', component: GoldListComponent },
  { path: 'detail/:symbol', component: GoldDetailComponent },
];

@NgModule({
  declarations: [GoldListComponent, GoldDetailComponent],
  imports: [SharedModule, RouterModule.forChild(routes)],
})
export class GoldModule {}
