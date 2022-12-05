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
export class DashboardComercialService {

  constructor(
    private httpClient: HttpClient,
    private headerBasicAuthorization: HeaderBasicAuthorizationService,
  ) {
  }

	GetListaAsociados() {
    return this.httpClient.get(`${environment.api.SalesApi.url}/Dashboard/SL_GetListaAsociados`,{
        headers: this.headerBasicAuthorization.get(ApiEnum.SalesApi)
    }).pipe( map( data => data ));
  }

	GetReporteVentasByDepartamento(Tipo, Anio, Mes, Semana, Inicio, Fin) {
    return this.httpClient.get(`${environment.api.SalesApi.url}/Dashboard/SL_GetReporteVentasByDepartamento?prmintPais&prmintTipo=${Tipo}&prmintAnio=${Anio}&prmintMes=${Mes}&prmintSemana=${Semana}&prmdatFechaInicio=${Inicio}&prmdatFechaFin=${Fin}`,{
        headers: this.headerBasicAuthorization.get(ApiEnum.SalesApi)
    }).pipe( map( data => data ));
  }

	GetReporteVentasByEstadoDAS(Pais, Departamento,Tipo, Anio, Mes, Semana, Inicio, Fin) {
    return this.httpClient.get(`${environment.api.SalesApi.url}/Dashboard/SL_GetReporteVentasByEstadoDAS?prmintPais=${Pais}&prmintDepartamento=${Departamento}&prmintTipo=${Tipo}&prmintAnio=${Anio}&prmintMes=${Mes}&prmintSemana=${Semana}&prmdatFechaInicio=${Inicio}&prmdatFechaFin=${Fin}`,{
        headers: this.headerBasicAuthorization.get(ApiEnum.SalesApi)
    }).pipe( map( data => data ));
  }

	GetReporteVentasByEstadoWIN(Pais, Departamento, Tipo, Anio, Mes, Semana, Inicio, Fin) {
    return this.httpClient.get(`${environment.api.SalesApi.url}/Dashboard/SL_GetReporteVentasByEstadoWIN?prmintPais=${Pais}&prmintDepartamento=${Departamento}&prmintTipo=${Tipo}&prmintAnio=${Anio}&prmintMes=${Mes}&prmintSemana=${Semana}&prmdatFechaInicio=${Inicio}&prmdatFechaFin=${Fin}`,{
        headers: this.headerBasicAuthorization.get(ApiEnum.SalesApi)
    }).pipe( map( data => data ));
  }

	GetReporteVentasByAsociado(Pais, Departamento, Tipo, Anio, Mes, Semana, Inicio, Fin) {
    return this.httpClient.get(`${environment.api.SalesApi.url}/Dashboard/SL_GetReporteVentasByAsociado?prmintPais=${Pais}&prmintDepartamento=${Departamento}&prmintTipo=${Tipo}&prmintAnio=${Anio}&prmintMes=${Mes}&prmintSemana=${Semana}&prmdatFechaInicio=${Inicio}&prmdatFechaFin=${Fin}`,{
        headers: this.headerBasicAuthorization.get(ApiEnum.SalesApi)
    }).pipe( map( data => data ));
  }

	GetReporteVentasByEstatusGeneral(Pais, Departamento, Asociado, Tipo, Anio, Mes, Semana, Inicio, Fin) {
    return this.httpClient.get(`${environment.api.SalesApi.url}/Dashboard/SL_GetReporteVentasByEstatusGeneral?prmintPais=${Pais}&prmintDepartamento=${Departamento}&prmintAsociado=${Asociado}&prmintTipo=${Tipo}&prmintAnio=${Anio}&prmintMes=${Mes}&prmintSemana=${Semana}&prmdatFechaInicio=${Inicio}&prmdatFechaFin=${Fin}`,{
        headers: this.headerBasicAuthorization.get(ApiEnum.SalesApi)
    }).pipe( map( data => data ));
  }

	GetReporteObservacionesVentas(Pais, Departamento, Asociado, Tipo, Anio, Mes, Semana, Inicio, Fin) {
    return this.httpClient.get(`${environment.api.SalesApi.url}/Dashboard/SL_GetReporteObservacionesVentas?prmintPais=${Pais}&prmintDepartamento=${Departamento}&prmintAsociado=${Asociado}&prmintTipo=${Tipo}&prmintAnio=${Anio}&prmintMes=${Mes}&prmintSemana=${Semana}&prmdatFechaInicio=${Inicio}&prmdatFechaFin=${Fin}`,{
        headers: this.headerBasicAuthorization.get(ApiEnum.SalesApi)
    }).pipe( map( data => data ));
  }

	ObtenerTipoClave() {
    return this.httpClient.get(`${environment.api.WS_IT.url}/Seguridad/ZITG_ObtenerTipoClave`,{
        headers: this.headerBasicAuthorization.get(ApiEnum.WS_IT)
    }).pipe( map( data => data ));
  }
    
  UpdatePassUsuario(data) {
    return this.httpClient.post(`${environment.api.WS_IT.url}/Seguridad/ZITG_updatePassword`, data, {
        headers: this.headerBasicAuthorization.get(ApiEnum.WS_IT)
    }).pipe( map( data => data ));
  }
  
	VerifyPasswordUsuario(password) {
    return this.httpClient.get(`${environment.api.WS_IT.url}/Seguridad/ZITG_verifyPassword?password=${password}`,{
        headers: this.headerBasicAuthorization.get(ApiEnum.WS_IT)
    }).pipe( map( data => data ));
  }



  

}
