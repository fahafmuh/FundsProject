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
  yes=true;
  constructor(
    private formBuilder: FormBuilder,
    private apiService: APIService,
    private spinner:NgxSpinnerService,
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
      this.apiService.login(this.loginForm.value).subscribe((result: any) => {
        console.log(result);
        sessionStorage.setItem('token',result.token);
        this.spinner.hide('loginLoading');
        this.setRoleAndRedirect();
      });
    
    }
  }

  setRoleAndRedirect(){
  if(this.loginForm.value.username == 'fundsadmin' && this.loginForm.value.password == 'fundsadmin'){
        sessionStorage.setItem('role','admin');
        this.router.navigate(['dashboard/funds']);
      }else if(this.loginForm.value.username == 'fundssupervisor' && this.loginForm.value.password == 'fundssupervisor'){
        sessionStorage.setItem('role','supervisor');
        this.router.navigate(['dashboard/approval/'+ 'supervisor']);
      }else if(this.loginForm.value.username == 'fundsmanager' && this.loginForm.value.password == 'fundsmanager'){
        sessionStorage.setItem('role','manager');
        this.router.navigate(['dashboard/approval/'+ 'manager']);
      }else{
        return;
      }
  }

  Register() {
    this.router.navigate(['register']);
  }

  ngOnInit(): void {}
}
