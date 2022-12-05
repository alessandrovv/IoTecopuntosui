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
export class RutasService {
  
  constructor(
    private httpClient: HttpClient,
    private headerBasicAuthorization: HeaderBasicAuthorizationService,
  ) {
  }

	
  GetListarMotivoVisitaComercial() {
    return this.httpClient.get(`${environment.api.SalesApi.url}/RutaComercial/SL_GetListarMotivoVisitaComercial`,{
        headers: this.headerBasicAuthorization.get(ApiEnum.SalesApi)
    }).pipe( map( data => data ));
  }
  GetListarSucursalesByCliente(Cliente) {
    return this.httpClient.get(`${environment.api.SalesApi.url}/RutaComercial/SL_GetListarSucursalesByCliente?Cliente=${Cliente}`,{
        headers: this.headerBasicAuthorization.get(ApiEnum.SalesApi)
    }).pipe( map( data => data ));
  }
  GetListarClientes() {
    return this.httpClient.get(`${environment.api.SalesApi.url}/RutaComercial/SL_GetListarClientes`,{
        headers: this.headerBasicAuthorization.get(ApiEnum.SalesApi)
    }).pipe( map( data => data ));
  }


  GetRutasComercial(Desde,Hasta,Trabajador,Activo) {
    return this.httpClient.get(`${environment.api.SalesApi.url}/RutaComercial/SL_GetRutasComercial?Desde=${Desde}&Hasta=${Hasta}&Trabajador=${Trabajador}&Activo=${Activo}`,{
        headers: this.headerBasicAuthorization.get(ApiEnum.SalesApi)
    }).pipe( map( data => data ));
  }

  GetDataRutaComercial(RutaComercial) {
    return this.httpClient.get(`${environment.api.SalesApi.url}/RutaComercial/SL_GetDataRutaComercial?RutaComercial=${RutaComercial}`,{
        headers: this.headerBasicAuthorization.get(ApiEnum.SalesApi)
    }).pipe( map( data => data ));
  }


  SaveUpdateRutaComercial(data) {
    return this.httpClient.post(`${environment.api.SalesApi.url}/RutaComercial/SL_SaveUpdateRutaComercial`, data, {
      headers: this.headerBasicAuthorization.get(ApiEnum.SalesApi)
    }).pipe( map( data => data ));
  }
  
  DeleteRutaComercial(RutaComercial) {
    return this.httpClient.post(`${environment.api.SalesApi.url}/RutaComercial/SL_DeleteRutaComercial`, 
    {RutaComercial: RutaComercial},{
        headers: this.headerBasicAuthorization.get(ApiEnum.SalesApi)
    }).pipe( map( data => data ));
  }

  EnableDisableRutaComercial(RutaComercial: number, Estado: any) {
    return this.httpClient.post(`${environment.api.SalesApi.url}/RutaComercial/SL_EnableDisableRutaComercial`, 
    { RutaComercial: RutaComercial, Activo: Estado },
    { headers: this.headerBasicAuthorization.get(ApiEnum.SalesApi) }).pipe( map( data => data ));
  } 
}
