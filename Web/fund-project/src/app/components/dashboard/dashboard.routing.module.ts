import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/guard/auth-guard';
import { NoPageComponent } from '../no-page/no-page.component';
import { ApprovalComponent } from './approval/approval.component';
import { DashboardComponent } from './dashboard.component';
import { FundsPageComponent } from './funds-page/funds-page.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    component: DashboardComponent,

    children: [
      {
        path: 'funds',
        component: FundsPageComponent,
        canActivate: [AuthGuard],
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
