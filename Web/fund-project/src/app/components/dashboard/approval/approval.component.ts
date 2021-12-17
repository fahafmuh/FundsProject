import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-approval',
  templateUrl: './approval.component.html',
  styleUrls: ['./approval.component.scss']
})
export class ApprovalComponent implements OnInit {
  role:any = '';
  constructor() {
    this.role = sessionStorage.getItem('role');
   }

  ngOnInit(): void {
  }

}
