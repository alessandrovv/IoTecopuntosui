import { Injectable, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject, of, Subscription } from 'rxjs';
import { map, catchError, switchMap, finalize, tap } from 'rxjs/operators';
import { UserModel } from '../_models/user.model';
import { AuthModel } from '../_models/auth.model';
import { AuthHTTPService } from './auth-http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { StorageService } from '../../../Shared/services/storage.service';
import { JwtService } from '../../../Shared/services/jwt.service';
import { StorageKeyEnum } from '../../../Shared/enums/storage-key.enum';
import { HttpClient } from '@angular/common/http';
import { HeaderBasicAuthorizationService } from '../../../Shared/services/header-basic-authorization.service';
import { PermissionNavigationService } from '../../../Shared/services/permission-navigation.service';
import { ApiEnum } from '../../../Shared/enums/api.enum';
import { UsuarioService } from 'src/app/pages/Security/_core/services/usuario.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
  private authLocalStorageToken = `${environment.appVersion}-${environment.USERDATA_KEY}`;

  // public fields
  currentUser$: Observable<UserModel>;
  isLoading$: Observable<boolean>;
  currentUserSubject: BehaviorSubject<UserModel>;
  isLoadingSubject: BehaviorSubject<boolean>;


  get currentUserValue(): UserModel {
    return this.currentUserSubject.value;
  }

  set currentUserValue(user: UserModel) {
    this.currentUserSubject.next(user);
  }

  constructor(
    private authHttpService: AuthHTTPService,
    private router: Router,
    private storageService: StorageService,
    private jwtService: JwtService,
    private httpClient: HttpClient,
    private headerBasicAuthorization: HeaderBasicAuthorizationService,
    private permissionNavigationService: PermissionNavigationService,
		private usuario_s: UsuarioService,

  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.currentUserSubject = new BehaviorSubject<UserModel>(undefined);
    this.currentUser$ = this.currentUserSubject.asObservable();
    this.isLoading$ = this.isLoadingSubject.asObservable();
    const subscr = this.getUserByToken().subscribe();
    this.unsubscribe.push(subscr);
  }

  // public methods
  // login(email: string, password: string): Observable<UserModel> {
  //   this.isLoadingSubject.next(true);
  //   return this.authHttpService.login(email, password).pipe(
  //     map((auth: AuthModel) => {
  //       const result = this.setAuthFromLocalStorage(auth);
  //       return result;
  //     }),
  //     switchMap(() => this.getUserByToken()),
  //     catchError((err) => {
  //       console.error('err', err);
  //       return of(undefined);
  //     }),
  //     finalize(() => this.isLoadingSubject.next(false))
  //   );
  // }


  enviarMensaje(){
    return this.httpClient.get(`${environment.api.WS_IT.url}/Seguridad/EnviarMensaje`, {
      headers:this.headerBasicAuthorization.get(ApiEnum.WS_IT)
    }).pipe(map(data=>data));
  }

  sendTwilioMessage(body:any){
    return this.httpClient.post(`${environment.api.TwilioApi.url}/${environment.api.TwilioApi.basicAuthorization.username}/Messages.json`,body,{
      headers:this.headerBasicAuthorization.get(ApiEnum.TwilioApi)
    }).pipe(map(data=>data));
  }

  verifyCodeByUser(idUsuario, code, opcion){
    return this.httpClient.get(`${environment.api.WS_IT.url}/Seguridad/RegistrarVerificarAccessCode?idUsuario=${idUsuario}&code=${code}&opcion=${opcion}`, {
      headers:this.headerBasicAuthorization.get(ApiEnum.WS_IT)
    }).pipe(
      tap((response:any) => {
        if(response.Success){
          let jwt = this.storageService.get(StorageKeyEnum.JWT_AUTHORIZATION);
          this.jwtService.load(jwt);
        }
      })
    );
  }

  login(usuario: any) {
    this.isLoadingSubject.next(true);
    return this.httpClient.post(`${environment.api.WS_IT.url}/Seguridad/ZITG_Login`, usuario, { 
      headers: this.headerBasicAuthorization.get(ApiEnum.WS_IT) 
    }).pipe(
      tap((response: any) => {            
          if (response.Ok) {
              this.storageService.set(StorageKeyEnum.JWT_AUTHORIZATION, response.JWT);
              if(!response.IpInvalid){
                this.jwtService.load(response.JWT);
              } 
          }
      }),
      catchError((err) => {
        console.error('err', err);
        return of(undefined);
      }),
      finalize(() => this.isLoadingSubject.next(false))
  )
}




  logout() {
		this.usuario_s.RegistrarCerrarSesion().subscribe((data:any)=>{
			if(data[0].respuesta == 1){
				//TODO
				//Llamar al servicio para registrar el cerrar sesion
				this.usuario_s.LimpiarRestricciones().subscribe((data)=>{},(errorServicio)=>{console.error(errorServicio);})
        this.permissionNavigationService.reset();
        this.storageService.remove(StorageKeyEnum.JWT_AUTHORIZATION);
        this.jwtService.clear();
        localStorage.removeItem(this.authLocalStorageToken);
        this.router.navigate(['/auth/login'], {
          queryParams: {},
        });
			}else{
				console.log(data[0]);
				
				alert("error al cerrar sesion")
			}
		}, (errorServicio)=>{
			console.error(errorServicio);
			
		})
  }

  getUserByToken(): Observable<UserModel> {
    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.authToken) {
      return of(undefined);
    }

    this.isLoadingSubject.next(true);
    return this.authHttpService.getUserByToken(auth.authToken).pipe(
      map((user: UserModel) => {
        if (user) {
          this.currentUserSubject = new BehaviorSubject<UserModel>(user);
        } else {
          this.logout();
        }
        return user;
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  // need create new user then login
  registration(user: UserModel): Observable<any> {
    this.isLoadingSubject.next(true);
    return this.authHttpService.createUser(user).pipe(
      map(() => {
        this.isLoadingSubject.next(false);
      }),
      switchMap(() => this.login({Usuario: user.email, Password: user.password})),
      catchError((err) => {
        console.error('err', err);
        return of(undefined);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  forgotPassword(email: string): Observable<boolean> {
    this.isLoadingSubject.next(true);
    return this.authHttpService
      .forgotPassword(email)
      .pipe(finalize(() => this.isLoadingSubject.next(false)));
  }

  // private methods
  private setAuthFromLocalStorage(auth: AuthModel): boolean {
    // store auth authToken/refreshToken/epiresIn in local storage to keep user logged in between page refreshes
    if (auth && auth.authToken) {
      localStorage.setItem(this.authLocalStorageToken, JSON.stringify(auth));
      return true;
    }
    return false;
  }

  private getAuthFromLocalStorage(): AuthModel {
    try {
      const authData = JSON.parse(
        localStorage.getItem(this.authLocalStorageToken)
      );
      return authData;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

  isLoggedIn() {
    let jwt: string = this.storageService.get(StorageKeyEnum.JWT_AUTHORIZATION);
    if (jwt != null) {
        this.jwtService.load(jwt);
        return this.jwtService.isValid();
    } else { 
        return false;
    }
  }

  redirectToLogin() {
      this.router.navigate(['/auth/login']);
  }

  redirectToMain() {
    this.router.navigate(['/']);
  }

  findPermissions() {
    return this.httpClient.get(`${environment.api.WS_IT.url}/Seguridad/GetPermissions`, {        
        headers: this.headerBasicAuthorization.get(ApiEnum.WS_IT)
    });
  }

  redirectToNotAllowed() {
    this.router.navigate(['/error/404']);
  }
  
  findPermisosRoot() {
    return ['/', '/profile', '/change-password'];
  }

  refreshToken() {
    return this.httpClient.get(`${environment.api.WS_IT.url}/Seguridad/refreshToken`, {
        headers: this.headerBasicAuthorization.get(ApiEnum.WS_IT)
    }).pipe(
        tap((response: any) => {
            if (response.Ok) {
                this.storageService.set(StorageKeyEnum.JWT_AUTHORIZATION, response.JWT);
                this.jwtService.load(response.JWT);
            }
        })
    );
}




}
