import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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
    password: new FormControl('', Validators.required),
  });
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  submit() {
    console.log(this.signUpForm, 'sign up form here')
    if (this.signUpForm.invalid) {
      return
    }

    this.authService.register(this.signUpForm.value).subscribe( (data: any) => {
      if (data) {
        console.log('coming here in the things', data);
        this.signUpForm.reset();
        alert('please note down your employee ID:: ' + data.id);
        this.router.navigateByUrl('/');
      } else {
        alert('error occured')
      }

    })
  }

}
