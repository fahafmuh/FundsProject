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
  private fundCreateApi = 'api/fund-create';

  public isCreatedForm: BehaviorSubject<any> = new BehaviorSubject(false);

  constructor(private http: HttpClient) {}

  login(formValues: any): Observable<any> {
    return new Observable((observer) => {
      this.http
        .post(this.serverURL + this.loginApi, {
          username: formValues.username,
          password: formValues.password,
        })
        .subscribe(
          (response: any) => {
            console.log(response);
            observer.next({
              status: 'ok',
              value: response.token,
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

  logout() {
    return new Observable((observer) => {
      this.http.get(this.serverURL + this.logoutApi).subscribe(
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

  onSave(formValues:any): Observable<any>{
    return new Observable((observer) => {
      this.http
        .post(this.serverURL + this.fundCreateApi, {
          formValues: formValues
        })
        .subscribe(
          (response: any) => {
            console.log(response);
            observer.next({
              status: 'ok'
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
