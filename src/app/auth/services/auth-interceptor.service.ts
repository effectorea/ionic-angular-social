import { Injectable } from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {from, Observable, switchMap} from "rxjs";
import {Preferences} from "@capacitor/preferences";

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor{

  constructor() { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return from(
      Preferences.get({key: 'token'})
    ).pipe(
      switchMap((data: {value: string}) => {
        const token = data?.value
        if (token) {
          const authReq = req.clone({
            headers: req.headers.set('Authorization', `Bearer ${token}`)
          });
          return next.handle(authReq)
        }
        return next.handle(req)
      })
    )
  }
}
