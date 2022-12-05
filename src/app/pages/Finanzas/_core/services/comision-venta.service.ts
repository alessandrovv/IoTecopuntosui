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
export class ComisionVentaService {

  constructor(
    private httpClient: HttpClient,
    private headerBasicAuthorization: HeaderBasicAuthorizationService,
  ) {
  }

	GetComisionesVentas(Empresa, Inicio, Fin, Estado) {
    return this.httpClient.get(`${environment.api.WS_FI.url}/ComisionVenta/SL_GetComisionesVentas?prmintEmpresa=${Empresa}&prmdatFechaInicio=${Inicio}&prmdatFechaFin=${Fin}&prmstrEstado=${Estado}`,{
        headers: this.headerBasicAuthorization.get(ApiEnum.WS_FI)
    }).pipe( map( data => data ));
  }
}
