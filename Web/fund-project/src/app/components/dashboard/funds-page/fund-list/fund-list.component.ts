import { Component, OnInit } from '@angular/core';
import { MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { APIService } from 'src/app/services/api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-fund-list',
  templateUrl: './fund-list.component.html',
  styleUrls: ['./fund-list.component.scss']
})
export class FundListComponent implements OnInit {
  funds:any = [];
  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  constructor(private apiService:APIService, private _snackBar: MatSnackBar, private router:Router) {
    this.apiService.getAllFunds().subscribe((res:any)=>{
      if(res.status == "ok"){
        this.funds = res.funds;
      }else{
        this.funds = [];
      }
    },err=>{
      this.funds = [];
    });
   }

  ngOnInit(): void {
  }

  deleteFund(id:number){
    Swal.fire({
      title: 'Confirmation!',
      text: 'Are you sure want to delete this fund?',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.apiService.deleteFundService(id.toString()).subscribe((res:any)=>{
          if(res.status == "ok"){
            this._snackBar.open('Fund deleted successfully!', '', {
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,
              duration: 4000,
            });
          }
        });
      } else {
        return;
      }
    });
  }

  EditFund(fund:any){
    this.apiService.selectedFund.next(fund);
    this.router.navigate(['dashboard/funds/edit/' + fund.id])
  }

}
