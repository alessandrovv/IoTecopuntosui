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
import { Metadata } from '../models/metadata.model';

@Injectable({
  providedIn: 'root'
})
export class MetadataService {
  
  constructor(
    private httpClient: HttpClient,
    private headerBasicAuthorization: HeaderBasicAuthorizationService,
  ) {
  }

  // READ
  public listarWS(url: string): Observable<Array<any>> {
		return this.httpClient.get<Array<any>>(`${environment.api.WS_HR.url}${url}`, {
			headers: this.headerBasicAuthorization.get(ApiEnum.WS_HR)
		});
	}

  public getDatosEspecificos(Empresa: number, Modalidad: string, PuestoTrabajo: string): Observable<Array<Metadata>> {
		return this.httpClient.get<any[]>(
			`${environment.api.WS_HR.url}/Trabajador/HR_ListarDatosEspecificos?Empresa=${Empresa}&Modalidad=${Modalidad}&PuestoTrabajo=${PuestoTrabajo}`,
			{ headers: this.headerBasicAuthorization.get(ApiEnum.WS_HR) }
		);
	}

  public etExpedientesDatosPuesto(Empresa: number, Modalidad: string, PuestoTrabajo: string): Observable<Array<Metadata>> {
		return this.httpClient.get<any[]>(
			`${environment.api.WS_HR.url}/Trabajador/HR_ListarDatosEspecificos?Empresa=${Empresa}&Modalidad=${Modalidad}&PuestoTrabajo=${PuestoTrabajo}`,
			{ headers: this.headerBasicAuthorization.get(ApiEnum.WS_HR) }
		);
	}

  getExpedientesDatosPuesto(Empresa: number, Modalidad: string, PuestoTrabajo: string) {
    return this.httpClient.get(`${environment.api.WS_HR.url}/Trabajador/HR_GetExpedientesDatosPuesto?Empresa=${Empresa}&Modalidad=${Modalidad}&PuestoTrabajo=${PuestoTrabajo}`,{
        headers: this.headerBasicAuthorization.get(ApiEnum.WS_HR)
    }).pipe( map( data => data ));
  }


  public getExpedientesContrato(Empresa: number, Modalidad: string, PuestoTrabajo: string): Observable<Array<Metadata>> {
		return this.httpClient.get<any[]>(
			`${environment.api.WS_HR.url}/Trabajador/HR_ListarExpedientesContrato?Empresa=${Empresa}&Modalidad=${Modalidad}&PuestoTrabajo=${PuestoTrabajo}`,
			{ headers: this.headerBasicAuthorization.get(ApiEnum.WS_HR) }
		);
	}

  
  
}
