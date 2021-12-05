import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/guard/auth-guard';
import { NoPageComponent } from '../no-page/no-page.component';
import { ApprovalComponent } from './approval/approval.component';
import { DashboardComponent } from './dashboard.component';
import { CreateFundComponent } from './funds-page/create-fund/create-fund.component';
import { FundListComponent } from './funds-page/fund-list/fund-list.component';
import { FundsPageComponent } from './funds-page/funds-page.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,

    children: [
      {
        path: 'funds',
        component: FundsPageComponent,
        children: [
          { path: '', redirectTo: 'list' },
          { path: 'list', component: FundListComponent },
          { path: 'create', component: CreateFundComponent },
          { path: 'edit/:id', component: CreateFundComponent },
        ],
      },
      {
        path: 'approval/:role',
        component: ApprovalComponent,
        canActivate: [AuthGuard],
      },
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
