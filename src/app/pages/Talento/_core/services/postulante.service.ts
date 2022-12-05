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
export class PostulanteService {

  constructor(
    private httpClient: HttpClient,
    private headerBasicAuthorization: HeaderBasicAuthorizationService,) 
		{ 	
		}
		GetPostulantesList(Empresa=0, Area=0, PuestoTrabajo=0, Estado=-1, Postulante=0) {
			return this.httpClient.get(`${environment.api.WS_HR.url}/Postulantes/HR_GetPostulantes?Empresa=${Empresa}&Area=${Area}&PuestoTrabajo=${PuestoTrabajo}&Estado=${Estado}&Postulante=${Postulante}`,{
					headers: this.headerBasicAuthorization.get(ApiEnum.WS_HR)
			}).pipe( map( data => data ));
		}

		SaveUpdatePostulante(data) {
			return this.httpClient.post(`${environment.api.WS_HR.url}/Postulantes/HR_SaveUpdatePostulante`, data, {
					headers: this.headerBasicAuthorization.get(ApiEnum.WS_HR)
			}).pipe( map( data => data ));
		}
		
		public EnableDisablePostulante(Usuario: number, Estado: any) {
			return this.httpClient.post(`${environment.api.WS_HR.url}/Postulantes/FI_EnableDisablePostulante`,
				{ idPostulante: Usuario, activo: Estado },
				{ headers: this.headerBasicAuthorization.get(ApiEnum.WS_HR) }
				).pipe( map( data => data ));
		}
	
		public DeletePostulante(Usuario: number) {
			console.log(Usuario);
			return this.httpClient.post(`${environment.api.WS_HR.url}/Postulantes/HR_DeletePostulante`,
				{idPostulante: Usuario},
				{ headers: this.headerBasicAuthorization.get(ApiEnum.WS_HR) }
				).pipe( map( data => data ));
		}
}
