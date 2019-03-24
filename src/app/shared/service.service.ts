import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, TimeoutError, Subject } from 'rxjs';
import { map, catchError, timeout } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  env: any = environment;

  constructor(public http: HttpClient, private snackBar: MatSnackBar) { }
  api(method: any, url: any, params: any) {
    if (method === 'post') {
      return this.http.post<any>(this.env.url + url, params)
        .pipe(
          timeout(20000),
          map((data: any) => {
            return data;
          }),
          catchError((error: any) => {
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
}
