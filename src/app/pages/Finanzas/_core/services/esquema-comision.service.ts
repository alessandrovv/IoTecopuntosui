import { Injectable, OnDestroy, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, forkJoin, Observable, of } from 'rxjs';
import { exhaustMap, map, catchError } from 'rxjs/operators';
import { TableService, TableResponseModel, ITableState, BaseModel, PaginatorState, SortState, GroupingState } from '../../../../_metronic/shared/crud-table';
import { baseFilter } from '../../../../_fake/fake-helpers/http-extenstions';
import { environment } from '../../../../../environments/environment';
import { Router } from '@angular/router';
// import { Certificado } from '../models/certificado.model';
import { HeaderBasicAuthorizationService } from '../../../../Shared/services/header-basic-authorization.service';
import { ApiEnum } from '../../../../Shared/enums/api.enum';

@Injectable({
  providedIn: 'root'
})
export class EsquemaComisionService {
  
  constructor(
    private httpClient: HttpClient,
    private headerBasicAuthorization: HeaderBasicAuthorizationService,
  ) {
  }

  // READ

  // HR_GetCertificados

	GetPuestoTrabajo(Area) {
    return this.httpClient.get(`${environment.api.WS_IT.url}/Multitabla/IT_GetListarPuestoTrabajo?Area=${Area}`,{
        headers: this.headerBasicAuthorization.get(ApiEnum.WS_IT)
    }).pipe( map( data => data ));
  }

  GetEsquemasComisionesList(Empresa, Certificado, PuestoTrabajo) {
    return this.httpClient.get(`${environment.api.WS_FI.url}/EsquemaComision/FI_GetEsquemaComisiones?prmintEmpresa=${Empresa}&prmintCertificado=${Certificado}&prmintPuestoTrabajo=${PuestoTrabajo}`,{
        headers: this.headerBasicAuthorization.get(ApiEnum.WS_FI)
    }).pipe( map( data => data ));
  }

	SaveUpdateEsquemaComision(data) {
    return this.httpClient.post(`${environment.api.WS_FI.url}/EsquemaComision/FI_SaveUpdateEsquemaComision`, data,{
        headers: this.headerBasicAuthorization.get(ApiEnum.WS_FI)
    }).pipe( map( data => data ));
  }

	EnableDisableEsquemaComision(data) {
    return this.httpClient.post(`${environment.api.WS_FI.url}/EsquemaComision/FI_EnableDisableEsquemaComision`, data,{
        headers: this.headerBasicAuthorization.get(ApiEnum.WS_FI)
    }).pipe( map( data => data ));
  }

	DeleteEsquemaComision(data) {
    return this.httpClient.post(`${environment.api.WS_FI.url}/EsquemaComision/FI_DeleteEsquemaComision`, data,{
        headers: this.headerBasicAuthorization.get(ApiEnum.WS_FI)
    }).pipe( map( data => data ));
  }

}

