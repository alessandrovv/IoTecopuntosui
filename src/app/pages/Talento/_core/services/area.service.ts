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
export class AreaService {
  
  constructor(
    private httpClient: HttpClient,
    private headerBasicAuthorization: HeaderBasicAuthorizationService,
  ) {
  }

  /* COMBO SELECT */
  GetAreaByUsuario(Empresa) {
    return this.httpClient.get(`${environment.api.WS_HR.url}/Area/HR_GetAreaByUsuario?Empresa=${Empresa}`,{
        headers: this.headerBasicAuthorization.get(ApiEnum.WS_HR)
    }).pipe( map( data => data ));
  }
  /*FIN COMBO SELECT */
  
  GetArea(Empresa,Estado) {
    return this.httpClient.get(`${environment.api.WS_HR.url}/Area/HR_GetAreaGeneral?Empresa=${Empresa}&Estado=${Estado}`,{
        headers: this.headerBasicAuthorization.get(ApiEnum.WS_HR)
    }).pipe( map( data => data ));
  }

  GetEmpresa() {
    return this.httpClient.get(`${environment.api.WS_HR.url}/Area/HR_GetEmpresa`,{
        headers: this.headerBasicAuthorization.get(ApiEnum.WS_HR)
    }).pipe( map( data => data ));
  }

 
  SaveUpdateArea(data) {
    return this.httpClient.post(`${environment.api.WS_HR.url}/Area/HR_SaveUpdateArea`, data, {
        headers: this.headerBasicAuthorization.get(ApiEnum.WS_HR)
    }).pipe( map( data => data ));
  }
  
  EnableDisableArea(Area: number, Estado: any) {
    return this.httpClient.post(`${environment.api.WS_HR.url}/Area/FI_EnableDisableArea`,
      { IdArea: Area, Activo: Estado },
      { headers: this.headerBasicAuthorization.get(ApiEnum.WS_HR) }
      ).pipe( map( data => data ));
  }

  DeleteArea(Usuario) {
    console.log(Usuario);
    return this.httpClient.post(`${environment.api.WS_HR.url}/Area/HR_DeleteArea`, {IdArea:Usuario},{
        headers: this.headerBasicAuthorization.get(ApiEnum.WS_HR)
    }).pipe( map( data => data ));
  }
 
}




