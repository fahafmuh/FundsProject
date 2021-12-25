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
  private fundCreateApi = 'api/create-fund/';
  private fundEditApi = 'api/edit-fund/';
  private DirectorsApi = 'api/Directors/';
  private deleteDirectorsApi = 'api/director-delete/';
  private deleteFundApi = 'api/fund-delete/';
  private ApprovalApi = 'api/fund-approval/';
  private getAllFundsApi = 'api/getallfunds/';
  private getFundsByRolesApi = 'api/getfundsbyrole/';

  public selectedFund: BehaviorSubject<any> = new BehaviorSubject(undefined);
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
              value: response,
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

  onEdit(formData:any): Observable<any> {
      return new Observable((observer) => {
        this.http
          .post(this.serverURL + this.fundEditApi, formData, this.setHeaders())
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

  getAllFunds() {
    return new Observable((observer) => {
      this.http
        .get(this.serverURL + this.getAllFundsApi, this.setHeaders())
        .subscribe(
          (res) => {
            let response: any = res;
            console.log(response);
            
            observer.next({
              status: 'ok',
              funds: response.data
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

    getFundsByRoles() {
    return new Observable((observer) => {
      this.http
        .get(this.serverURL + this.getFundsByRolesApi, this.setHeaders())
        .subscribe(
          (res) => {
            let response: any = res;
            console.log(response);
            
            observer.next({
              status: 'ok',
              fundsByRoles: response.data
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
      value.map((res:any)=>{
        formData.append('name', res.name);
      });

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

  updateFundStatus(formValues:any): Observable<any>{
    return new Observable((observer) => {

      this.http
        .post(this.serverURL + this.ApprovalApi, formValues, this.setHeaders())
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

  deleteDirector(id: string): Observable<any> {
    return new Observable((observer) => {
      let formData = new FormData();
      formData.append('id', id);
      this.http
        .post(this.serverURL + this.deleteDirectorsApi,formData,this.setHeaders())
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

  deleteFundService(id: string): Observable<any> {
    return new Observable((observer) => {
      let formData = new FormData();
      formData.append('id', id);
      this.http
        .post(this.serverURL + this.deleteFundApi,formData,this.setHeaders())
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
