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
export class equipoComercialService {
  
  constructor(
    private httpClient: HttpClient,
    private headerBasicAuthorization: HeaderBasicAuthorizationService,
  ) {
  }

  // READ
  GetListarAsociadosComercial(Certificado) {
    return this.httpClient.get(`${environment.api.WS_HR.url}/EquipoComercial/HR_GetListarAsociadosComercial?Certificado=${Certificado}`,{
        headers: this.headerBasicAuthorization.get(ApiEnum.WS_HR)
    }).pipe( map( data => data ));
  }

  GetAsesoresComercialesList(Empresa) {
    return this.httpClient.get(`${environment.api.WS_HR.url}/EquipoComercial/HR_GetAsesoresComercialesList?Empresa=${Empresa}`,{
        headers: this.headerBasicAuthorization.get(ApiEnum.WS_HR)
    }).pipe( map( data => data ));
  }
  
  SaveUpdateEquipoComercial(data) {
    return this.httpClient.post(`${environment.api.WS_HR.url}/EquipoComercial/HR_SaveUpdateEquipoComercial`, data, {
        headers: this.headerBasicAuthorization.get(ApiEnum.WS_HR)
    }).pipe( map( data => data ));
  }
  
  GetListarEquiposComerciales(Activo) {
    return this.httpClient.get(`${environment.api.WS_HR.url}/EquipoComercial/HR_GetListarEquiposComerciales?Activo=${Activo}`,{
        headers: this.headerBasicAuthorization.get(ApiEnum.WS_HR)
    }).pipe( map( data => data ));
  }
  
  DeleteDisableEquipo(EquipoComercial, Tipo, Estado) {
    return this.httpClient.post(`${environment.api.WS_HR.url}/EquipoComercial/HR_DeleteDisableEquipo`, { EquipoComercial, Tipo, Estado }, {
        headers: this.headerBasicAuthorization.get(ApiEnum.WS_HR)
    }).pipe( map( data => data ));
  }
  
  GetDataEquipoComercial(EquipoComercial) {
    return this.httpClient.get(`${environment.api.WS_HR.url}/EquipoComercial/HR_GetDataEquipoComercial?EquipoComercial=${EquipoComercial}`,{
        headers: this.headerBasicAuthorization.get(ApiEnum.WS_HR)
    }).pipe( map( data => data ));
  }
  

}
