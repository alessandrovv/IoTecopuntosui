import { Injectable, OnDestroy, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { exhaustMap, map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ApiEnum } from 'src/app/Shared/enums/api.enum';
import { HeaderBasicAuthorizationService } from 'src/app/Shared/services/header-basic-authorization.service';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class VisitaComercialService {
  private getListVentasSource = new Subject<any>();
	public getListVentas$ = this.getListVentasSource.asObservable();

	private updateTableVentasSource = new Subject<any>();
	public updateTableVentas$ = this.updateTableVentasSource.asObservable();	
  constructor(
    private httpClient: HttpClient,
    private headerBasicAuthorization: HeaderBasicAuthorizationService,
  ) {
  }

  GetEstadoVisitaComercial() {
    return this.httpClient.get(`${environment.api.SalesApi.url}/SeguimientoVisitaComercial/SL_GetEstadoVisitaComercial`,{
        headers: this.headerBasicAuthorization.get(ApiEnum.SalesApi)
    }).pipe( map( data => data ));
  }
  GetCondicionCliente() {
    return this.httpClient.get(`${environment.api.SalesApi.url}/SeguimientoVisitaComercial/SL_GetCondicionCliente`,{
        headers: this.headerBasicAuthorization.get(ApiEnum.SalesApi)
    }).pipe( map( data => data ));
  }
  GetTransporteVisitaComercial() {
    return this.httpClient.get(`${environment.api.SalesApi.url}/SeguimientoVisitaComercial/SL_GetTransporteVisitaComercial`,{
        headers: this.headerBasicAuthorization.get(ApiEnum.SalesApi)
    }).pipe( map( data => data ));
  }
	GetMotivoVisitaComercial() {
    return this.httpClient.get(`${environment.api.SalesApi.url}/SeguimientoVisitaComercial/SL_GetMotivoVisitaComercial`,{
        headers: this.headerBasicAuthorization.get(ApiEnum.SalesApi)
    }).pipe( map( data => data ));
  }
  GetResultadoVisitaComercial() {
    return this.httpClient.get(`${environment.api.SalesApi.url}/SeguimientoVisitaComercial/SL_GetResultadoVisitaComercial`,{
        headers: this.headerBasicAuthorization.get(ApiEnum.SalesApi)
    }).pipe( map( data => data ));
  }



  GetSeguimientoVisitaComercialList(
    Cliente
    ,Trabajador
    ,EstadoVisita
    ,MotivoVisita
    ,Transporte
    ,CondicionCliente
    ,ResultadoVisita
    ,FechaInicio
    ,FechaFin) {
    return this.httpClient.get(`${environment.api.SalesApi.url}/SeguimientoVisitaComercial/SL_GetSeguimientoVisitaComercialList?Cliente=${Cliente}&Trabajador=${Trabajador}&EstadoVisita=${EstadoVisita}&MotivoVisita=${MotivoVisita}&Transporte=${Transporte}&CondicionCliente=${CondicionCliente}&ResultadoVisita=${ResultadoVisita}&FechaInicio=${FechaInicio}&FechaFin=${FechaFin}`,{
        headers: this.headerBasicAuthorization.get(ApiEnum.SalesApi)
    }).pipe( map( data => data ));
  }  

  GetSeguimientoVisitaComercialReporte(Cliente
    ,Trabajador
    ,EstadoVisita
    ,MotivoVisita
    ,Transporte
    ,CondicionCliente
    ,FechaInicio
    ,ResultadoVisita
    ,FechaFin) {
    return this.httpClient.get(`${environment.api.SalesApi.url}/SeguimientoVisitaComercial/SL_GetSeguimientoVisitaComercialList?Cliente=${Cliente}&Trabajador=${Trabajador}&EstadoVisita=${EstadoVisita}&MotivoVisita=${MotivoVisita}&Transporte=${Transporte}&CondicionCliente=${CondicionCliente}&FechaInicio=${FechaInicio}&FechaFin=${FechaFin}`,{
      headers: this.headerBasicAuthorization.get(ApiEnum.SalesApi)
  }).pipe( map( data => data ));
  }
 

  GetEvidenciaByVisitaComercial(VisitaComercial) {
    return this.httpClient.get(`${environment.api.SalesApi.url}/SeguimientoVisitaComercial/SL_GetEvidenciaByVisitaComercial?VisitaComercial=${VisitaComercial}`,{
        headers: this.headerBasicAuthorization.get(ApiEnum.SalesApi)
    }).pipe( map( data => data ));
  }

  CargarVentasCliente(data) {
    return this.httpClient.post(`${environment.api.SalesApi.url}/SeguimientoVisitaComercial/SL_CargarVentasCliente`, {datos: data},{
        headers: this.headerBasicAuthorization.get(ApiEnum.SalesApi)
    }).pipe( map( data => data ));
  }

  actualizarFiltros(filtros:any){
		console.log('disparandoEvento actualizarFiltros');
		this.getListVentasSource.next(filtros)
	}

  GetEvidenciasComerciales(){
    
  }
}
