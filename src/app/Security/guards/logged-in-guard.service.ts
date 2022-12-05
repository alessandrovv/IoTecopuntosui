import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../../modules/auth/_services/auth.service';
import { Navigation } from '../../modules/auth/_core/interfaces/navigation';
import { PermissionNavigationService } from '../../Shared/services/permission-navigation.service';

@Injectable({
  providedIn: 'root'
})
export class LoggedInGuardService implements CanActivate {

  constructor(private authService: AuthService,
              private permissionNavigationService: PermissionNavigationService) {
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    console.log('object');
    let stateUrl = state.url.split('?')[0];
    if (!this.authService.isLoggedIn()) {
      this.authService.redirectToLogin();
      return false;
    } else {
        if(this.permissionNavigationService.get() == null) {
          return this.authService.findPermissions()
            .pipe(map((response: any) => {
              console.log(response);
              let navigation: Navigation = response.Data as Navigation;
              this.permissionNavigationService.set(navigation, this.authService.findPermisosRoot());
              let urls = this.permissionNavigationService.getUrls();
              if (urls.indexOf(stateUrl) >= 0) {
                return true;
              } else {
                this.authService.redirectToNotAllowed();
                return false;
              }
          }));
        } else {
          let urls = this.permissionNavigationService.getUrls();
          if (urls.indexOf(stateUrl) >= 0) {
            return true;
          } else {
            this.authService.redirectToNotAllowed();
            return false;
          }
        }
    }
  }

}
