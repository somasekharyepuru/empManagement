import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  loginStorage = 'cookie';
  apiUrl = 'http://localhost:3000';

  constructor(
    private cookieService: CookieService,
    private router: Router,
    private http: HttpClient
  ) {}

  login(userInfo: any): Observable<boolean> {
    return new Observable((Observer) => {
      // this.http.post('localhost:/3000', )
      this.http.get(this.apiUrl + `/users/${userInfo.empId}`, {}).subscribe(
      (data: any) => {
          let userFound = false;
          if (data.password === userInfo.password) {
            userFound = true;
          }
          if (userFound) {
            this.cookieService.set('userInfo', JSON.stringify(data))
            Observer.next(true)
          } else {
            Observer.next(false)
          }
        },
        (error) => {
          Observer.error(error);
        }
      );
    });
  }

  isLoggedIn() {
    return !!this.cookieService.get('userInfo') ? true : false;
  }

  getUserDetails(prop?) {
    return JSON.parse(this.cookieService.get('userInfo'));
  }

  logout() {
    if (this.loginStorage === 'cookie') {
      this.cookieService.delete('userInfo');
    }
    this.router.navigateByUrl('/');
  }

  register(userInfo): Observable<any> {
    userInfo.id = userInfo.empName + this.generateString(5);
    return new Observable((observer) => {
      this.http.post(this.apiUrl + '/users', userInfo).subscribe(
        (data) => {
          observer.next(data);
          observer.complete();
        },
        (err) => {
          observer.error(err);
          observer.complete();
        }
      );
    });
  }


  generateString(length) {
    const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '_';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}
}
