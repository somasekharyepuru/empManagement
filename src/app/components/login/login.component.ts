import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm = new FormGroup({
    empId: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });
  constructor(
    private authService: AuthService,
    private router: Router
    ) {}

  ngOnInit(): void {}

  submit() {
    if (this.loginForm.invalid) {
      return;
    }
    this.authService.login(this.loginForm.value).subscribe((data) => {
      if (data) {
        this.router.navigateByUrl('/');
      } else {
        this.loginForm.reset();
        alert('invalid credentials')
      }
    }, err => {
      alert('invalid credentials')
    });
  }
}
