import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { appConfig } from '../app.config';

@Injectable({
  providedIn: 'root'
})
export class HeaderInterceptor implements HttpInterceptor {
  apiLink: string = appConfig.apiUrl;
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req['url'] == this.apiLink + 'api/login') {
      const dupReq = req.clone({ headers: req.headers.set('Content-Type', 'application/json') });
      return next.handle(dupReq);
    } else {
      const cookie = sessionStorage.getItem('x-csrf-token');
      const dupReq2 = req.clone({ headers: req.headers.set('x-csrf-token', cookie) });
      console.log(dupReq2)
      return next.handle(dupReq2);
    }
  }
}
