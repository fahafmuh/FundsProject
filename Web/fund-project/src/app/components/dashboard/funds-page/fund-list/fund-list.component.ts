import { Component, OnInit } from '@angular/core';
import { APIService } from 'src/app/services/api.service';

@Component({
  selector: 'app-fund-list',
  templateUrl: './fund-list.component.html',
  styleUrls: ['./fund-list.component.scss']
})
export class FundListComponent implements OnInit {
  funds = [];
  constructor(private apiService:APIService) {
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

}
