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
export class ClientesService {
  
  constructor(
    private httpClient: HttpClient,
    private headerBasicAuthorization: HeaderBasicAuthorizationService,
  ) {
  }

	
  GetClientes(Pais,Departamento,Activo) {
    return this.httpClient.get(`${environment.api.SalesApi.url}/Cliente/SL_GetClientes?Pais=${Pais}&Departamento=${Departamento}&Activo=${Activo}`,{
        headers: this.headerBasicAuthorization.get(ApiEnum.SalesApi)
    }).pipe( map( data => data ));
  }

  GetDataCliente(Cliente) {
    return this.httpClient.get(`${environment.api.SalesApi.url}/Cliente/SL_GetDataCliente?Cliente=${Cliente}`,{
        headers: this.headerBasicAuthorization.get(ApiEnum.SalesApi)
    }).pipe( map( data => data ));
  }

  SaveUpdateCliente(data) {
    return this.httpClient.post(`${environment.api.SalesApi.url}/Cliente/SL_SaveUpdateCliente`, data, {
      headers: this.headerBasicAuthorization.get(ApiEnum.SalesApi)
    }).pipe( map( data => data ));
  }

  DeleteCliente(Cliente) {
    return this.httpClient.post(`${environment.api.SalesApi.url}/Cliente/SL_DeleteCliente`, 
    {Cliente: Cliente},{
        headers: this.headerBasicAuthorization.get(ApiEnum.SalesApi)
    }).pipe( map( data => data ));
  }

  EnableDisableCliente(Cliente: number, Estado: any) {
    return this.httpClient.post(`${environment.api.SalesApi.url}/Cliente/SL_EnableDisableCliente`, 
    { Cliente: Cliente, Activo: Estado },
    { headers: this.headerBasicAuthorization.get(ApiEnum.SalesApi) }).pipe( map( data => data ));
  } 

  SaveUpdateSucursal(data) {
    return this.httpClient.post(`${environment.api.SalesApi.url}/Cliente/SL_SaveUpdateSucursal`, data, {
      headers: this.headerBasicAuthorization.get(ApiEnum.SalesApi)
    }).pipe( map( data => data ));
  }
}
