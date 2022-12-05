import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../modules/auth/_services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class NoLoggedInGuardService implements CanActivate {

  constructor(private authService: AuthService) {
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    
    if (!this.authService.isLoggedIn()) {
        return true;
    }

    this.authService.redirectToMain();
    return false;
  }

}
