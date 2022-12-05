import { Injectable, OnDestroy, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { exhaustMap, map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ApiEnum } from 'src/app/Shared/enums/api.enum';
import { HeaderBasicAuthorizationService } from 'src/app/Shared/services/header-basic-authorization.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RolService {
    constructor(
        private httpClient: HttpClient,
        private headerBasicAuthorization: HeaderBasicAuthorizationService,
      ) {
      }

    GetRoles(Activo) {
        return this.httpClient.get(`${environment.api.WS_IT.url}/Rol/IT_GetRoles?prmintActivo=${Activo}`,{
                    headers: this.headerBasicAuthorization.get(ApiEnum.WS_IT)
            }).pipe( map( data => data ));
    }
    SaveUpdateRol(data) {
      return this.httpClient.post(`${environment.api.WS_IT.url}/Rol/IT_SaveUpdateRol`, data, {
          headers: this.headerBasicAuthorization.get(ApiEnum.WS_IT)
      }).pipe( map( data => data ));
    }

    EnableDisableRol(Rol: number, Estado: any) {
      return this.httpClient.post(`${environment.api.WS_IT.url}/Rol/IT_EnableDisableRol`,
        { IdRol: Rol, Activo: Estado },
        { headers: this.headerBasicAuthorization.get(ApiEnum.WS_IT) }
        ).pipe( map( data => data ));
    }
    
    DeleteRol(Rol:number) {
      return this.httpClient.post(`${environment.api.WS_IT.url}/Rol/IT_DeleteRol`,
      {IdRol: Rol},
      { headers: this.headerBasicAuthorization.get(ApiEnum.WS_IT) }
      ).pipe( map( data => data ));
  }
     
}