import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { FundListComponent } from './funds-page/fund-list/fund-list.component';
import { FundsPageComponent } from './funds-page/funds-page.component';
import { CreateFundComponent } from './funds-page/create-fund/create-fund.component';
import { DashboardRoutingModule } from './dashboard.routing.module';
import { HeaderComponent } from './header/header.component';
import { ApprovalComponent } from './approval/approval.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthGuard } from 'src/app/guard/auth-guard';
import { MaterialModule } from 'src/app/app.material.module';
import { ConfirmationDialogComponent } from 'src/app/dialogs/confirmation-dialog/confirmation-dialog.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { CreateDirectorsComponent } from './funds-page/create-directors/create-directors.component';
@NgModule({
  declarations: [
    DashboardComponent,
    FundListComponent,
    FundsPageComponent,
    HeaderComponent,
    ApprovalComponent,
    CreateFundComponent,
    CreateDirectorsComponent
  ],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    NgMultiSelectDropDownModule.forRoot(),
    RouterModule,
    NgbModule,
    MaterialModule,
    CommonModule,
    DashboardRoutingModule,
  ],
  entryComponents:[ConfirmationDialogComponent],
  providers: [AuthGuard],
  exports:[MaterialModule],
  bootstrap: [DashboardComponent]
})
export class DashboardModule { }
