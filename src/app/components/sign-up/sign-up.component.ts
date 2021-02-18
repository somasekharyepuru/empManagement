import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DepartmentValues } from 'src/app/dashboard/department_roles.cnst';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  signUpForm = new FormGroup({
    empName: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    role: new FormControl('-1', Validators.required),
    password: new FormControl('', Validators.required),
  });
  availabledepartments = JSON.parse(JSON.stringify(DepartmentValues));
  getHeaders = Object.keys;
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    try {
      delete this.availabledepartments.admin;
    } catch (e) {

    }
  }

  submit() {
    if (this.signUpForm.invalid) {
      return
    }

    if (this.signUpForm.get('role').value == '-1') {
      alert('Please select role');
    }

    this.authService.register(this.signUpForm.value).subscribe( (data: any) => {
      if (data) {
        this.signUpForm.reset();
        alert('please note down your employee ID:: ' + data.id);
        this.router.navigateByUrl('/');
      } else {
        alert('error occured')
      }

    })
  }

}
