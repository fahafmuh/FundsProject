import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-bootstrap-spinner';
import { APIService } from 'src/app/services/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  userRole = 'fund-admin';
  mappingBoolean = true;
  constructor(
    private formBuilder: FormBuilder,
    private apiService: APIService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  Login() {
    console.log(this.loginForm.value);
    if (this.loginForm.valid) {
      this.spinner.show('loginLoading');
      this.apiService.login(this.loginForm.value).subscribe(
        (result: any) => {
          console.log(result);
          if(result.status == "ok"){
            sessionStorage.setItem('token', result.value);
            this.setRoleAndRedirect();
          }
          this.spinner.hide('loginLoading');
        },
        (err) => {
          this.spinner.hide('loginLoading');
          return;
        }
      );
    }
  }

  setRoleAndRedirect() {
    if (
      this.loginForm.value.username == 'fundsadmin' &&
      this.loginForm.value.password == 'fundsadmin'
    ) {
      sessionStorage.setItem('role', 'admin');
      sessionStorage.setItem('username', 'fundsadmin');
      sessionStorage.setItem('password', 'fundsadmin');
      this.router.navigate(['dashboard/funds']);
    } else if (
      this.loginForm.value.username == 'fundssupervisor' &&
      this.loginForm.value.password == 'fundssupervisor'
    ) {
      sessionStorage.setItem('role', 'supervisor');
      sessionStorage.setItem('username', 'fundssupervisor');
      sessionStorage.setItem('password', 'fundssupervisor');
      this.router.navigate(['dashboard/approval/' + 'supervisor']);
    } else if (
      this.loginForm.value.username == 'fundsmanager' &&
      this.loginForm.value.password == 'fundsmanager'
    ) {
      sessionStorage.setItem('role', 'manager');
      sessionStorage.setItem('username', 'fundsmanager');
      sessionStorage.setItem('password', 'fundsmanager');
      this.router.navigate(['dashboard/approval/' + 'manager']);
    } else {
      return;
    }
  }

  Register() {
    this.router.navigate(['register']);
  }

  ngOnInit(): void {}
}
