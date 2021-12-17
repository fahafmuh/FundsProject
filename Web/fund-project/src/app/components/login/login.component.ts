import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, MatSnackBar } from '@angular/material/snack-bar';
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
  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  mappingBoolean = true;
  constructor(
    private formBuilder: FormBuilder,
    private apiService: APIService,
    private _snackBar: MatSnackBar,
    private spinner: NgxSpinnerService,
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  Login() {
    if (this.loginForm.valid) {
      this.spinner.show('loginLoading');
      this.apiService.login(this.loginForm.value).subscribe(
        (result: any) => {
          if(result.status == "ok"){
            sessionStorage.setItem('token', result.value);
            this.setRoleAndRedirect();
          }else{
            this._snackBar.open('Error in log in, Try again!', '', {
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,
              duration:4000
            });
          }
          this.spinner.hide('loginLoading');
        },
        (err) => {
          this.spinner.hide('loginLoading');
          this._snackBar.open('Error in log in, Try again!', '', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
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
      this.loginForm.value.username == 'funds-supervisor' &&
      this.loginForm.value.password == 'Hello123!'
    ) {
      sessionStorage.setItem('role', 'supervisor');
      sessionStorage.setItem('username', 'fundssupervisor');
      sessionStorage.setItem('password', 'fundssupervisor');
      this.router.navigate(['dashboard/fund-approval']);
    } else if (
      this.loginForm.value.username == 'funds-manager' &&
      this.loginForm.value.password == 'Hello123!'
    ) {
      sessionStorage.setItem('role', 'manager');
      sessionStorage.setItem('username', 'fundsmanager');
      sessionStorage.setItem('password', 'fundsmanager');
      this.router.navigate(['dashboard/fund-approval']);
    } else {
      return;
    }
  }

  Register() {
    this.router.navigate(['register']);
  }

  ngOnInit(): void {}
}
