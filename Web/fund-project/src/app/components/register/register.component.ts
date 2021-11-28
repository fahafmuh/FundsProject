import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  roles = [
    { value: 'fund-admin', viewValue: 'Fund Admin' },
    { value: 'fund-supervisor', viewValue: 'Fund Supervisor' },
    { viewValue: 'Fund Manager', value: 'fund-manager' },
  ];
  constructor(private formBuilder: FormBuilder,private router:Router) {
    this.registerForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      role: ['', Validators.required],
    });
  }

  onCancel(){
    this.registerForm.reset();
    this.router.navigate(['login']);
  }

  submitForm(){
    console.log(this.registerForm.value);
  }

  ngOnInit(): void {}
}
