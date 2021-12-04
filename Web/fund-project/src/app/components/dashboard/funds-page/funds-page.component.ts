import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { APIService } from 'src/app/services/api.service';

@Component({
  selector: 'app-funds-page',
  templateUrl: './funds-page.component.html',
  styleUrls: ['./funds-page.component.scss'],
})
export class FundsPageComponent implements OnInit {
  isCreated = false;
  constructor(private apiService: APIService,public router:Router) {
  
  }

  ngOnInit(): void {}

  addForm() {
    this.router.navigate(['dashboard/funds/create']);
  }
}
