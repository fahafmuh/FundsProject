import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private _router: Router) {

    }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
        console.log(sessionStorage.getItem('role') && sessionStorage.getItem('token'));
        
        if(sessionStorage.getItem('role') && sessionStorage.getItem('token')){
            return true;
        }
        else{
            this._router.navigate(['login']);
            return false;
        }
        
    }
   
}