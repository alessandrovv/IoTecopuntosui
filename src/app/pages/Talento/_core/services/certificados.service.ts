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
export class CertificadosService {
  
  constructor(
    private httpClient: HttpClient,
    private headerBasicAuthorization: HeaderBasicAuthorizationService,
  ) {
  }

  // READ

  // HR_GetCertificados

  GetCertificadosList(Empresa, Cliente, Estado) {
    return this.httpClient.get(`${environment.api.WS_HR.url}/Certificados/HR_GetCertificados?Empresa=${Empresa}&Cliente=${Cliente}&Estado=${Estado}`,{
        headers: this.headerBasicAuthorization.get(ApiEnum.WS_HR)
    }).pipe( map( data => data ));
  }

  GetEmpresa() {
    return this.httpClient.get(`${environment.api.WS_HR.url}/Certificados/HR_GetEmpresa`,{
        headers: this.headerBasicAuthorization.get(ApiEnum.WS_HR)
    }).pipe( map( data => data ));
  }

  GetClientesExterno() {
    return this.httpClient.get(`${environment.api.WS_HR.url}/Certificados/HR_GetClientesExterno`,{
        headers: this.headerBasicAuthorization.get(ApiEnum.WS_HR)
    }).pipe( map( data => data ));
  }
  GetClientesExternoByUsuario(Empresa) {
    return this.httpClient.get(`${environment.api.WS_HR.url}/Certificados/HR_GetClienteExternoByUsuario?Empresa=${Empresa}`,{
        headers: this.headerBasicAuthorization.get(ApiEnum.WS_HR)
    }).pipe( map( data => data ));
  }

  SaveUpdateCertificados(data) {
    return this.httpClient.post(`${environment.api.WS_HR.url}/Certificados/HR_SaveUpdateCertificados`, data, {
        headers: this.headerBasicAuthorization.get(ApiEnum.WS_HR)
    }).pipe( map( data => data ));
  }
  
  DeleteCertificado(Certificado, Tipo, Estado) {
    return this.httpClient.post(`${environment.api.WS_HR.url}/Certificados/HR_DeleteDisableCertificado`, {Certificado, Tipo, Estado},{
        headers: this.headerBasicAuthorization.get(ApiEnum.WS_HR)
    }).pipe( map( data => data ));
  }

  // find(tableState: ITableState): Observable<TableResponseModel<Certificado>> {
  //   console.log(this.response);
  //   return this.http.get<Certificado[]>(this.API_URL).pipe(
  //     map((response: Certificado[]) => {
  //       const filteredResult = baseFilter(response, tableState);
  //       console.log(filteredResult);
  //       const result: TableResponseModel<Certificado> = {
  //         items: filteredResult.items,
  //         total: filteredResult.total
  //       };
  //       return result;
  //     })
  //   );
  // }


  // search(tableState: ITableState): Observable<TableResponseModel<Certificado>> {
  //   console.log(this.response);
  //   return this.http.post<TableResponseModel<Certificado>>(this.API_URL, tableState).pipe(
  //     catchError(err => {
  //       // this._errorMessage.next(err);
  //       console.error('FIND ITEMS', err);
  //       return of({ items: [], total: 0 });
  //     })
  //   );
  // }


  



  // deleteItems(ids: number[] = []): Observable<any> {
  //   // const tasks$ = [];
  //   // ids.forEach(id => {
  //   //   tasks$.push(this.delete(id));
  //   // });
  //   // return forkJoin(tasks$);
  // }

  // updateStatusForItems(ids: number[], status: number): Observable<any> {
  //   // return this.http.get<Certificado[]>(this.API_URL).pipe(
  //   //   map((customers: Certificado[]) => {
  //   //     return customers.filter(c => ids.indexOf(c.id) > -1).map(c => {
  //   //       c.activo = status;
  //   //       return c;
  //   //     });
  //   //   }),
  //   //   exhaustMap((customers: Certificado[]) => {
  //   //     const tasks$ = [];
  //   //     customers.forEach(customer => {
  //   //       tasks$.push(this.update(customer));
  //   //     });
  //   //     return forkJoin(tasks$);
  //   //   })
  //   // );
  // }

  
}
