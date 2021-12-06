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
  private fundCreateApi = 'api/createFund';
  private getDirectorsApi = 'api/getDirectors';
  private addDirectorApi = 'api/addDirector';
  private deleteDirectorApi = 'api/deleteDirector';

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
        headers: headers
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

  onSave(formValues: any): Observable<any> {
    return new Observable((observer) => {
      this.http
        .post(this.serverURL + this.fundCreateApi, {
          formValues: formValues,
        })
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
        .get(this.serverURL + this.getDirectorsApi, this.setHeaders())
        .subscribe(
          (res) => {
            let response: any = res;
            console.log(response);
            observer.next({
              status: 'ok',
              directors:
                response.directors && response.directors.length
                  ? response.directors
                  : [],
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
      this.http
        .post(this.serverURL + this.addDirectorApi, {
          director: value,
        })
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

  deleteDirector(value: string): Observable<any>{
    return new Observable((observer) => {
      this.http
        .post(this.serverURL + this.deleteDirectorApi, {
          director: value,
        })
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
