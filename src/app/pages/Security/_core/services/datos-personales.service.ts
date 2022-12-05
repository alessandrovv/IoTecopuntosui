import { Injectable, OnDestroy, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { exhaustMap, map, catchError } from 'rxjs/operators';
import { ApiEnum } from '../../../../Shared/enums/api.enum';
import { environment } from '../../../../../environments/environment';
import { HeaderBasicAuthorizationService } from '../../../../Shared/services/header-basic-authorization.service';

@Injectable({
  providedIn: 'root'
})
export class DatosPersonalesService {

  constructor(
    private httpClient: HttpClient,
    private headerBasicAuthorization: HeaderBasicAuthorizationService,
  ) {  }

  GetTrabajadorByUsuario() {
    return this.httpClient.get(`${environment.api.WS_IT.url}/DatosPersonales/IT_GetTrabajadorByUsuario`,{
        headers: this.headerBasicAuthorization.get(ApiEnum.WS_IT)
    }).pipe( map( data => data ));
  }
  
  CambiarPassword(data) {
    return this.httpClient.post(`${environment.api.WS_IT.url}/DatosPersonales/IT_CambiarPasswordUsuario`, data,{
        headers: this.headerBasicAuthorization.get(ApiEnum.WS_IT)
    }).pipe( map( data => data ));
  }
}
