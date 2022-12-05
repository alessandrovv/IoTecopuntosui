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
export class VentasService {
  
  constructor(
    private httpClient: HttpClient,
    private headerBasicAuthorization: HeaderBasicAuthorizationService,
  ) {
  }

	GetEstadoVentaInterna() {
    return this.httpClient.get(`${environment.api.SalesApi.url}/Ventas/SL_GetEstadoVentaInterna`,{
        headers: this.headerBasicAuthorization.get(ApiEnum.SalesApi)
    }).pipe( map( data => data ));
  }
	
	GetSeguimientoVentasList(Empresa, Estado, FechaInicio, FechaFin) {
    return this.httpClient.get(`${environment.api.SalesApi.url}/Ventas/SL_GetSeguimientoVentasList?Empresa=${Empresa}&Estado=${Estado}&FechaInicio=${FechaInicio}&FechaFin=${FechaFin}`,{
        headers: this.headerBasicAuthorization.get(ApiEnum.SalesApi)
    }).pipe( map( data => data ));
  }
  
  	
	GetDatosVenta(Venta) {
    return this.httpClient.get(`${environment.api.SalesApi.url}/Ventas/SL_GetDatosVenta?Venta=${Venta}`,{
        headers: this.headerBasicAuthorization.get(ApiEnum.SalesApi)
    }).pipe( map( data => data ));
  }
  
  	
	GetDatosCombosVenta(Empresa, Cliente) {
    return this.httpClient.get(`${environment.api.SalesApi.url}/Ventas/SL_GetDatosCombosVenta?Empresa=${Empresa}&Cliente=${Cliente}`,{
        headers: this.headerBasicAuthorization.get(ApiEnum.SalesApi)
    }).pipe( map( data => data ));
  }
  	
	GetGestionSeguimientoVenta(Venta) {
    return this.httpClient.get(`${environment.api.SalesApi.url}/Ventas/SL_GetGestionSeguimientoVenta?Venta=${Venta}`,{
        headers: this.headerBasicAuthorization.get(ApiEnum.SalesApi)
    }).pipe( map( data => data ));
  }

  UpdateGestionSeguimientoVenta(data) {
    return this.httpClient.post(`${environment.api.SalesApi.url}/Ventas/SL_UpdateGestionSeguimientoVenta`, data,{
        headers: this.headerBasicAuthorization.get(ApiEnum.SalesApi)
    }).pipe( map( data => data ));
  }

  UpdateSeguimientoVenta(data) {
    return this.httpClient.post(`${environment.api.SalesApi.url}/Ventas/SL_UpdateSeguimientoVenta`, data,{
        headers: this.headerBasicAuthorization.get(ApiEnum.SalesApi)
    }).pipe( map( data => data ));
  }

  UpdateDataSeguimientoVenta(data) {
    return this.httpClient.post(`${environment.api.SalesApi.url}/Ventas/SL_UpdateDataSeguimientoVenta`, data,{
        headers: this.headerBasicAuthorization.get(ApiEnum.SalesApi)
    }).pipe( map( data => data ));
  }

 	
	DeleteSeguimientoVenta(Venta) {
    return this.httpClient.get(`${environment.api.SalesApi.url}/Ventas/SL_DeleteSeguimientoVenta?Venta=${Venta}`,{
        headers: this.headerBasicAuthorization.get(ApiEnum.SalesApi)
    }).pipe( map( data => data ));
  }
  
  CargarVentasCliente(data) {
    return this.httpClient.post(`${environment.api.SalesApi.url}/Ventas/SL_CargarVentasCliente`, {datos: data},{
        headers: this.headerBasicAuthorization.get(ApiEnum.SalesApi)
    }).pipe( map( data => data ));
  }
  
  
	// GetEvaluacionesCrediticias2() {
  //   return this.httpClient.get(`${environment.api.SalesApi.url}/Ventas/SL_GetEvaluacionesCrediticias2`,{
  //       headers: this.headerBasicAuthorization.get(ApiEnum.SalesApi)
  //   }).pipe( map( data => data ));
  // }
}
