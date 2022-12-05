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
export class EmpresaService {

  constructor(
    private httpClient: HttpClient,
    private headerBasicAuthorization: HeaderBasicAuthorizationService,
  ) {
  }

  /* COMBO SELECT */ 
  GetEmpresaByUsuario() {
    return this.httpClient.get(`${environment.api.WS_IT.url}/Empresa/IT_GetEmpresaByUsuario`,{
        headers: this.headerBasicAuthorization.get(ApiEnum.WS_IT)
    }).pipe( map( data => data ));
  }
  /*FIN COMBO SELECT */

  
 
}
