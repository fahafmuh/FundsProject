import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { APIService } from 'src/app/services/api.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  constructor(private router: Router, private apiService: APIService) {}

  ngOnInit(): void {}

  Logout() {
    this.apiService.logout().subscribe((result: any) => {
      sessionStorage.clear();
      this.router.navigate(['login']);
    });
  }

  Reload() {
    location.reload();
  }
}
