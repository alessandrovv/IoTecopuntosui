//import { AuthService } from './../services/auth.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, Route } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable()
export class RoleGuard implements CanActivate {


  constructor(//private _authService: AuthService, 
    private _router: Router) {
  }
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    try {
      var base_url =  '';
      if (next.data.base_url!=null && next.data.base_url!=undefined){
        base_url =  next.data.base_url;
      }
      var ruta_gazzo = JSON.parse(String( next.toString().replace('Route','').replace(')',' }').replace('(','{ ').replace('url:','"url": ').replace('path:','"path": ').replace("'",'"').replace("'",'"').replace("'",'"').replace("'",'"')  ));
      var accesos = JSON.parse(localStorage.getItem('Accesos'));

      var allow = false;
      accesos.forEach(item => {
        item.submenu.forEach(sub =>{
          //console.log(sub.page);
          if(sub.page.includes(base_url+ruta_gazzo.path)  || ('/'+base_url+ruta_gazzo.path).includes(sub.page)  ){
            allow=true;
          }
        });
      });

      if (allow){
        return true;
      }else{
        this._router.navigate(['/404']);
        return false;
      }

    } catch (error) {
      console.log(error);
      this._router.navigate(['/404']);
      return false;
    }
  }

}
