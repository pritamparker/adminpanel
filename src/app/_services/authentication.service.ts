import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { appConfig } from '../app.config';
import { NgxNotificationService } from 'ngx-notification';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  apiLink: String = appConfig.apiUrl;
  user: any;
  constructor(private __http: HttpClient, private __router: Router, private __ngxNotificationService: NgxNotificationService) { }

  login(EmailID: String, Password: String) {
    const body = { email: EmailID, password: Password };
    const data = JSON.stringify(body);
    return this.__http.post(this.apiLink + 'api/login', data, { observe: 'response' as 'response' }).subscribe(
      (res: HttpResponse<any>) => {
        console.log(res);
        sessionStorage.clear();
        const cookie = res.headers.get('x-csrf-token');
        sessionStorage.setItem('x-csrf-token', cookie);
        sessionStorage.setItem('jwt', JSON.stringify(cookie));
        localStorage.setItem('currentUser', JSON.stringify(res.body['data']));
        this.__ngxNotificationService.sendMessage('Login Successfull', 'success', 'top-right');
        this.__router.navigate(['dashboard']);
      },
      (error: any) => {
        console.log(error);
        if (error.status == 0) {
          this.__ngxNotificationService.sendMessage('Internet is slow / down', 'danger', 'top-right');
        } else {
          this.__ngxNotificationService.sendMessage(error.error.reason, 'danger', 'top-right');
        }
      }
    )
  }
  logout() {
    this.user = JSON.parse(localStorage.getItem('currentUser'));
    const body = {
      "email": this.user.email,
      "role_type": this.user.role_type
    };
    const data = JSON.stringify(body);
    return this.__http.post(this.apiLink + 'api/logout', data).subscribe(
      (res: HttpResponse<any>) => {
        console.log(res);
        sessionStorage.removeItem('x-csrf-token');
        sessionStorage.removeItem('jwt');
        localStorage.removeItem('currentUser');
        this.__ngxNotificationService.sendMessage('Logout Successfull', 'success', 'top-right');
        this.__router.navigateByUrl('/login')
      },
      (error: any) => {
        console.log(error);
        if (error.status == 0) {
          this.__ngxNotificationService.sendMessage('Internet is slow / down', 'danger', 'top-right');
        } else {
          this.__ngxNotificationService.sendMessage(error.error.reason, 'danger', 'top-right');
        }
      }
    )
  }
}


