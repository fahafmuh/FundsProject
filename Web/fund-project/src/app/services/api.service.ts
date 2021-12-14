import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root',
})
export class APIService {
  public _config = environment;
  public serverURL = this._config.serverIP;

  private loginApi = 'api/login/';
  private logoutApi = 'api/logout/';
  private fundCreateApi = 'api/create-fund/';
  private DirectorsApi = 'api/Directors/';

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

  getFromLocal(item: any) {
    return sessionStorage.getItem(item);
  }

  setHeaders() {
    let options;
    let user = this.getFromLocal('token');
    if (!!user) {
      let token = user;
      const headers = new HttpHeaders({
        Authorization: 'token ' + token,
      });
      options = {
        headers: headers,
      };
    }
    return options;
  }

  logout(): Observable<any> {
    return new Observable((observer) => {
      this.http
        .get(this.serverURL + this.logoutApi, this.setHeaders())
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

  onSave(formData: any): Observable<any> {
    return new Observable((observer) => {
      this.http
        .post(this.serverURL + this.fundCreateApi, formData, this.setHeaders())
        .subscribe(
          (response: any) => {
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

  getDirectors() {
    return new Observable((observer) => {
      this.http
        .get(this.serverURL + this.DirectorsApi, this.setHeaders())
        .subscribe(
          (res) => {
            let response: any = res;
            observer.next({
              status: 'ok',
              directors: response
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

  addDirector(value: any): Observable<any> {
    return new Observable((observer) => {
      let formData = new FormData();
      formData.append('name', value.name);

      this.http
        .post(this.serverURL + this.DirectorsApi, formData, this.setHeaders())
        .subscribe(
          (response: any) => {
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

  deleteDirector(id: number): Observable<any> {
    return new Observable((observer) => {
      let formData = new FormData();
      formData.append('id', id.toString());
      const options = {
        ...this.setHeaders(),
          formData,
      };
      this.http
        .delete(this.serverURL + this.DirectorsApi,options)
        .subscribe(
          (response: any) => {
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
