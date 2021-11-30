import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NoPageComponent } from '../no-page/no-page.component';
import { ApprovalComponent } from './approval/approval.component';
import { DashboardComponent } from './dashboard.component';
import { FundsPageComponent } from './funds-page/funds-page.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,

    children: [
      { path: 'funds', component: FundsPageComponent },
      { path: 'approval/:role', component: ApprovalComponent },
    ],
  },
  {
    path: 'no-page-found',
    component: NoPageComponent,
  },
  {
    path: '**',
    redirectTo: 'no-page-found',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
