import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-approval',
  templateUrl: './approval.component.html',
  styleUrls: ['./approval.component.scss']
})
export class ApprovalComponent implements OnInit {
  role = '';
  constructor(private route:ActivatedRoute) {
    this.route.params.subscribe(params => {
      this.role = params.role; 
      console.log(this.role);
      
    });
   }

  ngOnInit(): void {
  }

}
