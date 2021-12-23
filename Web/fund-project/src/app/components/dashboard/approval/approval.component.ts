import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';
import { APIService } from 'src/app/services/api.service';

@Component({
  selector: 'app-approval',
  templateUrl: './approval.component.html',
  styleUrls: ['./approval.component.scss']
})
export class ApprovalComponent implements OnInit,OnDestroy {
  status = '';
  reason = '';
  selectedFund:any = undefined;
  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  funds:any = [];
  id:string = '';
  constructor(private apiService:APIService,private spinner:NgxSpinnerService,private _snackBar: MatSnackBar) {
    this.spinner.show();
    this.apiService.getFundsByRoles().subscribe((res:any)=>{
      if(res.status == "ok"){
        this.funds = res.fundsByRoles;
        this.spinner.hide();

      }else{
        this.funds = [];
        this.spinner.hide();

      }
    },err=>{
      this.funds = [];
      this.spinner.hide();

    });
   }

  ngOnInit(): void {
  }

  FundSelect(fund:any){
    this.id = fund.id;
    this.selectedFund = fund;
  }

  Cancel(){
    this.selectedFund = undefined;
    this.reason = '';
    this.status = '';
    this.id = '';
  }

  Reaction(){
    let obj = {
      "fund_id":"1",
      "fund_approval_status":this.status,
      "reason":this.reason
    }
    this.apiService.updateFundStatus(obj).subscribe((result:any)=>{
      if(result.status == "ok"){
        this.Cancel();
        this._snackBar.open('Fund status sent successfully!', '', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
          duration: 4000,
        });
      }else{
        this._snackBar.open('Error in sending fund status!', '', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
          duration: 4000,
        });
        return;
      }
    },err=>{
      return;
    });
    
  }

  DisableCondition(){
    let bool = false;
    if(this.status == '' && this.reason == '') bool = true;
    else if(this.status == 'Approved' && this.reason == '') bool = false;
    else if(this.status == 'Rejected' && this.reason == '') bool = true;
    else bool=false;
    return bool;
  }

  ngOnDestroy(){
    this.selectedFund = undefined;
  }

}
