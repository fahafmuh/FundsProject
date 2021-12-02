import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root',
})
export class APIService {
  public _config = environment;
  public serverURL = this._config.serverIP;

  private loginApi = 'api/login/';
  private logoutApi = 'api/logout/';

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Pragma: 'no-cache',
      'Cache-Control': 'no-cache, no-store, max-age=0, must-revalidate',
    })
  };

  constructor(private http: HttpClient) {}

  login(formValues: any): Observable<any> {
    return new Observable((observer) => {
      this.http
        .post(this.serverURL + this.loginApi, {
          username: formValues.username,
          password: formValues.password,
        },this.httpOptions)
        .subscribe(
          (response) => {
            console.log(response);
            observer.next({
              status: 'ok',
            });
            observer.complete();
          },
          (err) => {
            observer.next({ status: 'error' });
            observer.complete();
          }
        );
    });
  }

  logout(){
    return new Observable((observer) => {
        this.http
          .get(this.serverURL + this.logoutApi)
          .subscribe(
            (response) => {
              console.log(response);
              observer.next({
                status: 'ok',
              });
              observer.complete();
            },
            (err) => {
              observer.next({ status: 'error' });
              observer.complete();
            }
          );
      });
  }
}
