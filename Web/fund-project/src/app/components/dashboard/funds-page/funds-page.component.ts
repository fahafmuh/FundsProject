import { Component, OnInit } from '@angular/core';
import { APIService } from 'src/app/services/api.service';

@Component({
  selector: 'app-funds-page',
  templateUrl: './funds-page.component.html',
  styleUrls: ['./funds-page.component.scss'],
})
export class FundsPageComponent implements OnInit {
  isCreated = false;
  constructor(private apiService: APIService) {
    this.apiService.isCreatedForm.subscribe((res) => {
      this.isCreated = res;
    });
  }

  ngOnInit(): void {}

  addForm() {
    this.apiService.isCreatedForm.next(true);
  }
}
