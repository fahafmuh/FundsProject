import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  userRole = 'fund-admin';
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  Login(){
    console.log(this.loginForm.value);
    if(this.loginForm.valid){
      if(this.loginForm.value.username == 'admin' && this.loginForm.value.password == 'admin'){
        sessionStorage.setItem('role','admin');
        this.router.navigate(['dashboard/funds']);
      }else if(this.loginForm.value.username == 'supervisor' && this.loginForm.value.password == 'supervisor'){
        sessionStorage.setItem('role','supervisor');
        this.router.navigate(['dashboard/approval/'+ 'supervisor']);
      }else if(this.loginForm.value.username == 'manager' && this.loginForm.value.password == 'manager'){
        sessionStorage.setItem('role','manager');
        this.router.navigate(['dashboard/approval/'+ 'manager']);
      }else{
        return;
      }
    }
  }

  Register(){
    this.router.navigate(['register'])
  }

  ngOnInit(): void {}
}
