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
export class MultitablaService {
  
  constructor(
    private httpClient: HttpClient,
    private headerBasicAuthorization: HeaderBasicAuthorizationService,
  ) {
  }

  GetModalidadContratacion() {
    return this.httpClient.get(`${environment.api.WS_IT.url}/Multitabla/IT_GetModalidadContratacion`,{
        headers: this.headerBasicAuthorization.get(ApiEnum.WS_IT)
    }).pipe( map( data => data ));
  }

  GetPuestoTrabajo(Area) {
    return this.httpClient.get(`${environment.api.WS_IT.url}/Multitabla/IT_GetListarPuestoTrabajo?Area=${Area}`,{
        headers: this.headerBasicAuthorization.get(ApiEnum.WS_IT)
    }).pipe( map( data => data ));
  }

  GetListarSexos() {
    return this.httpClient.get(`${environment.api.WS_IT.url}/Multitabla/IT_GetListarSexos`,{
        headers: this.headerBasicAuthorization.get(ApiEnum.WS_IT)
    }).pipe( map( data => data ));
  }

  GetListarEstadoCivil() {
    return this.httpClient.get(`${environment.api.WS_IT.url}/Multitabla/IT_GetListarEstadoCivil`,{
        headers: this.headerBasicAuthorization.get(ApiEnum.WS_IT)
    }).pipe( map( data => data ));
  }

  GetListarMoneda() {
    return this.httpClient.get(`${environment.api.WS_IT.url}/Multitabla/IT_GetListarMoneda`,{
        headers: this.headerBasicAuthorization.get(ApiEnum.WS_IT)
    }).pipe( map( data => data ));
  }

  GetListarCuentaBancaria() {
    return this.httpClient.get(`${environment.api.WS_IT.url}/Multitabla/IT_GetListarCuentaBancaria`,{
        headers: this.headerBasicAuthorization.get(ApiEnum.WS_IT)
    }).pipe( map( data => data ));
  }

  GetListarPaises() {
    return this.httpClient.get(`${environment.api.WS_IT.url}/Multitabla/IT_GetListarPaises`,{
        headers: this.headerBasicAuthorization.get(ApiEnum.WS_IT)
    }).pipe( map( data => data ));
  }

  GetListarDepartamentos(Pais) {
    return this.httpClient.get(`${environment.api.WS_IT.url}/Multitabla/IT_GetListarDepartamentos?Pais=${Pais}`,{
        headers: this.headerBasicAuthorization.get(ApiEnum.WS_IT)
    }).pipe( map( data => data ));
  }

  GetListarProvincia(Departamento) {
    return this.httpClient.get(`${environment.api.WS_IT.url}/Multitabla/IT_GetListarProvincia?Departamento=${Departamento}`,{
        headers: this.headerBasicAuthorization.get(ApiEnum.WS_IT)
    }).pipe( map( data => data ));
  }

  GetListarDistrito(Provincia) {
    return this.httpClient.get(`${environment.api.WS_IT.url}/Multitabla/IT_GetListarDistrito?Provincia=${Provincia}`,{
        headers: this.headerBasicAuthorization.get(ApiEnum.WS_IT)
    }).pipe( map( data => data ));
  }

  GetListarAreas() {
    return this.httpClient.get(`${environment.api.WS_IT.url}/Multitabla/IT_GetListarAreas`,{
        headers: this.headerBasicAuthorization.get(ApiEnum.WS_IT)
    }).pipe( map( data => data ));
  }

  GetListarPuestoTrabajo() {
    return this.httpClient.get(`${environment.api.WS_IT.url}/Multitabla/IT_GetListarPuestoTrabajo`,{
        headers: this.headerBasicAuthorization.get(ApiEnum.WS_IT)
    }).pipe( map( data => data ));
  }
  
  GetTipoDocumentoIdentidad() {
    return this.httpClient.get(`${environment.api.WS_IT.url}/Multitabla/IT_GetListarTipoDocumentoIdentidad`,{
        headers: this.headerBasicAuthorization.get(ApiEnum.WS_IT)
    }).pipe( map( data => data ));
  }
  
  GetListarBancos() {
    return this.httpClient.get(`${environment.api.WS_IT.url}/Multitabla/IT_GetListarBancos`,{
        headers: this.headerBasicAuthorization.get(ApiEnum.WS_IT)
    }).pipe( map( data => data ));
  }
  
  GetListarMotivosCese() {
    return this.httpClient.get(`${environment.api.WS_IT.url}/Multitabla/IT_GetListarMotivosCese`,{
        headers: this.headerBasicAuthorization.get(ApiEnum.WS_IT)
    }).pipe( map( data => data ));
  }
  
  GetListarFondoPensiones() {
    return this.httpClient.get(`${environment.api.WS_IT.url}/Multitabla/IT_GetListarFondoPensiones`,{
        headers: this.headerBasicAuthorization.get(ApiEnum.WS_IT)
    }).pipe( map( data => data ));
  }
  
  GetListarEstadoExpediente() {
    return this.httpClient.get(`${environment.api.WS_IT.url}/Multitabla/IT_GetListarEstadoExpediente`,{
        headers: this.headerBasicAuthorization.get(ApiEnum.WS_IT)
    }).pipe( map( data => data ));
  }
  
  GetListarEsquemaComision() {
    return this.httpClient.get(`${environment.api.WS_IT.url}/Multitabla/IT_GetListarEsquemaComision`,{
        headers: this.headerBasicAuthorization.get(ApiEnum.WS_IT)
    }).pipe( map( data => data ));
  }

	public GetMultitablas() {
    return this.httpClient.get(`${environment.api.WS_IT.url}/Multitabla/IT_GetMultitablas`,
      { headers: this.headerBasicAuthorization.get(ApiEnum.WS_IT) }
      ).pipe( map( data => data ));
  }
  
  public GetTablaById(Tabla) {
    return this.httpClient.get(`${environment.api.WS_IT.url}/Multitabla/IT_GetTablaById?prmintIdMultitabla=${Tabla}`,
      { headers: this.headerBasicAuthorization.get(ApiEnum.WS_IT) }
      ).pipe( map( data => data ));
  }
  
  public SaveUpdateMultitabla(data: any) {
    return this.httpClient.post(`${environment.api.WS_IT.url}/Multitabla/IT_SaveUpdateMultitabla`,
    data,
    { headers: this.headerBasicAuthorization.get(ApiEnum.WS_IT) }
    ).pipe( map( data => data ));
  }

  public GetEstadoEvaluacionGrabacion() {
    return this.httpClient.get(`${environment.api.WS_IT.url}/Multitabla/IT_GetEstadoEvaluacionGrabacion`,
      { headers: this.headerBasicAuthorization.get(ApiEnum.WS_IT) }
      ).pipe( map( data => data ));
  }

  public GetEstadoEvaluacionDocumentacion() {
    return this.httpClient.get(`${environment.api.WS_IT.url}/Multitabla/IT_GetEstadoEvaluacionDocumentacion`,
      { headers: this.headerBasicAuthorization.get(ApiEnum.WS_IT) }
      ).pipe( map( data => data ));
  }

  public GetEstadoRegistroCRM() {
    return this.httpClient.get(`${environment.api.WS_IT.url}/Multitabla/IT_EstadoRegistroCRM`,
      { headers: this.headerBasicAuthorization.get(ApiEnum.WS_IT) }
      ).pipe( map( data => data ));
  }
  
  public GetEstadoVentaExterno() {
    return this.httpClient.get(`${environment.api.WS_IT.url}/Multitabla/IT_GetEstadoVentaExterno`,
      { headers: this.headerBasicAuthorization.get(ApiEnum.WS_IT) }
      ).pipe( map( data => data ));
  }

  public GetEstadoInstalacion() {
    return this.httpClient.get(`${environment.api.WS_IT.url}/Multitabla/IT_GetEstadoInstalacion`,
      { headers: this.headerBasicAuthorization.get(ApiEnum.WS_IT) }
      ).pipe( map( data => data ));
  }

}
