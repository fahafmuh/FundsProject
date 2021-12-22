import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
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
  constructor(private apiService:APIService,private _snackBar: MatSnackBar) {
    this.apiService.getFundsByRoles().subscribe((res:any)=>{
      if(res.status == "ok"){
        this.funds = res.fundsByRoles;
        
      }else{
        this.funds = [];
      }
    },err=>{
      this.funds = [];
    });
   }

  ngOnInit(): void {
  }

  FundSelect(fund:any){
    this.selectedFund = fund;
  }

  Cancel(){
    this.selectedFund = undefined;
    this.reason = '';
    this.status = '';
  }

  Reaction(){
    let obj = {
      "fund_id":"1",
      "fund_approval_status":this.status,
      "reason":this.reason
    }
    this.apiService.updateFundStatus(obj).subscribe((result:any)=>{
      if(result.status == "ok"){
        this.selectedFund = undefined;
        this._snackBar.open('Fund created successfully!', '', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
          duration: 4000,
        });
      }else{

      }
    },err=>{

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
