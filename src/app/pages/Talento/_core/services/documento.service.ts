import { Injectable, OnDestroy, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, forkJoin, Observable, of } from 'rxjs';
import { exhaustMap, map, catchError } from 'rxjs/operators';
import { TableService, TableResponseModel, ITableState, BaseModel, PaginatorState, SortState, GroupingState } from '../../../../_metronic/shared/crud-table';
import { baseFilter } from '../../../../_fake/fake-helpers/http-extenstions';
import { environment } from '../../../../../environments/environment';
import { Router } from '@angular/router';
import { Certificado } from '../models/certificado.model';
import { HeaderBasicAuthorizationService } from '../../../../Shared/services/header-basic-authorization.service';
import { ApiEnum } from '../../../../Shared/enums/api.enum';

@Injectable({
  providedIn: 'root'
})
export class DocumentoService {
  
  constructor(
    private httpClient: HttpClient,
    private headerBasicAuthorization: HeaderBasicAuthorizationService,
  ) {
  }

  // READ
  GetConfiguracionDocumentoList(Empresa, Modalidad, PuestoTrabajo) {
    return this.httpClient.get(`${environment.api.WS_HR.url}/ConfiguracionDocumento/HR_GetConfiguracionDocumento?Empresa=${Empresa}&Modalidad=${Modalidad}&PuestoTrabajo=${PuestoTrabajo}`,{
        headers: this.headerBasicAuthorization.get(ApiEnum.WS_HR)
    }).pipe( map( data => data ));
  }
  
  GetDatosContratosDocumentoList() {
    return this.httpClient.get(`${environment.api.WS_HR.url}/ConfiguracionDocumento/HR_GetDatosContratosDocumento`,{
        headers: this.headerBasicAuthorization.get(ApiEnum.WS_HR)
    }).pipe( map( data => data ));
  }

  GetTipoDatoslList() {
    return this.httpClient.get(`${environment.api.WS_HR.url}/ConfiguracionDocumento/HR_GetTipoDatos`,{
        headers: this.headerBasicAuthorization.get(ApiEnum.WS_HR)
    }).pipe( map( data => data ));
  }

  GetDocumentoExpediente() {
    return this.httpClient.get(`${environment.api.WS_HR.url}/ConfiguracionDocumento/HR_GetDocumentoExpediente`,{
        headers: this.headerBasicAuthorization.get(ApiEnum.WS_HR)
    }).pipe( map( data => data ));
  }
  
  SaveUpdateConfiguracionDocumento(data) {
    return this.httpClient.post(`${environment.api.WS_HR.url}/ConfiguracionDocumento/HR_SaveUpdateConfiguracionDocumento`, data, {
        headers: this.headerBasicAuthorization.get(ApiEnum.WS_HR)
    }).pipe( map( data => data ));
  }
  
  DeleteDisableConfDocumento(Documento, Tipo, Estado) {
    return this.httpClient.post(`${environment.api.WS_HR.url}/ConfiguracionDocumento/HR_DeleteDisableConfDocumento`, {Documento, Tipo, Estado},{
        headers: this.headerBasicAuthorization.get(ApiEnum.WS_HR)
    }).pipe( map( data => data ));
  }
  
  GetDatosConfiguracionDocumento(Documento) {
    return this.httpClient.get(`${environment.api.WS_HR.url}/ConfiguracionDocumento/HR_GetDatosConfiguracionDocumento?Documento=${Documento}`,{
        headers: this.headerBasicAuthorization.get(ApiEnum.WS_HR)
    }).pipe( map( data => data ));
  }
  

}
