import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create-fund',
  templateUrl: './create-fund.component.html',
  styleUrls: ['./create-fund.component.scss'],
})
export class CreateFundComponent implements OnInit {
  constructor() {}
  active = 1;
  ngOnInit(): void {}

  Submit() {}
  Cancel() {
    
  }
}
