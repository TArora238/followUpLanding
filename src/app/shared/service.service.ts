import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, TimeoutError, Subject } from 'rxjs';
import { map, catchError, timeout } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';
import { environment } from '../../environments/environment';

declare var Stripe: any;
@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  loader: any = false;
  env: any = environment;
  settings: any = {};
  private userData = new Subject<any>();
  constructor(public http: HttpClient, private snackBar: MatSnackBar) { }
  guid() {
    const a = new Date();
    const nav = window.navigator;
    const screen = window.screen;
    let guid = nav.mimeTypes.length.toString();
    guid += nav.userAgent.replace(/\D+/g, '');
    guid += nav.plugins.length;
    guid += screen.height || '';
    guid += screen.width || '';
    guid += screen.pixelDepth || '';
    guid += a.getTime();
    return guid;
  }
  deviceId () {
    let device_id = localStorage.getItem('user')
      ? localStorage.getItem('user')
      : this.guid();
    device_id = device_id.slice(0, 7);
    return device_id;
  }
  init() {
    console.log(this.env);
    const params = {
      device_type: this.env.device_type,
      device_token: this.env.device_token,
      app_type: this.env.app_type,
      app_version: this.env.app_version,
      device_id: this.deviceId(),
      environment: this.env.env
    };
    return this.http
      .post<any>(this.env.url + 'get_settings', params)
      .pipe(
        map((data: any) => {
          this.settings = data;
          // console.log(this.data);
          Stripe.setPublishableKey(this.settings.stripe_key);
          return data;
        }),
        catchError((error: any) => {
          return throwError(error);
        })
      );
  }
  api(method: any, url: any, params: any) {
    this.loader = true;
    if (method === 'post') {
      return this.http.post<any>(this.env.url + url, params)
        .pipe(
          timeout(20000),
          map((data: any) => {
            this.loader = false;
            return data;
          }),
          catchError((error: any) => {
            this.loader = false;
            if (error instanceof TimeoutError) {
              this.snackBar.open('Server Timeout, Try after sometime.', '', {
                duration: 2000,
              });
              return throwError({ error: 'Timeout Exception' });
            }
            return throwError(error);
          })
        );
    }
  }
  saveUserData(data: any) {
    this.userData.next(data);
  }
  getUserData() {
    return this.userData.asObservable();
  }
}
