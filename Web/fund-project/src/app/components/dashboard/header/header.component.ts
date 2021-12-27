import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { APIService } from 'src/app/services/api.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  role: any = '';
  constructor(private router: Router, private apiService: APIService) {}

  ngOnInit(): void {
    this.role = sessionStorage.getItem('role');
  }

  Logout() {      
    sessionStorage.clear();
    this.router.navigate(['login']);
    this.apiService.logout().subscribe((result: any) => {
      if(result.status == "ok"){
  
      }
    });
  }

  displayName(name: string) {
    let str = '';
    if (name) {
      let role = name.charAt(0).toUpperCase() + name.slice(1);
      str = 'Fund ' + role;
    }
    return str;
  }

  Reload() {
    location.reload();
  }
}
