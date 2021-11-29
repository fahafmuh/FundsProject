import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-funds-page',
  templateUrl: './funds-page.component.html',
  styleUrls: ['./funds-page.component.scss']
})
export class FundsPageComponent implements OnInit {
  isCreated = false;
  constructor() { }

  ngOnInit(): void {
  }

  addForm(){
    this.isCreated = true;
  }

}
