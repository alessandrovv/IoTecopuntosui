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
export class ProyectosService {

  constructor(
    private httpClient: HttpClient,
    private headerBasicAuthorization: HeaderBasicAuthorizationService,
  ) {
  }

  GetListarProyectos() {
    return this.httpClient.get(`${environment.api.SalesApi.url}/Proyecto/SL_GetListarProyectos`,{
        headers: this.headerBasicAuthorization.get(ApiEnum.SalesApi)
    }).pipe( map( data => data ));
  }

  EnableDisableProyecto(data) {
		return this.httpClient.post(`${environment.api.SalesApi.url}/Proyecto/SL_EnableDisableProyecto`, data, {
			headers: this.headerBasicAuthorization.get(ApiEnum.SalesApi)
		}).pipe(map(data => data));
	}

  deleteProyecto(Proyecto:number) {
    return this.httpClient.delete(`${environment.api.SalesApi.url}/Proyecto/SL_DeleteProyecto?Proyecto=${Proyecto}`, {
        headers: this.headerBasicAuthorization.get(ApiEnum.SalesApi)
      }).pipe(map(data => data));
    }

  GetCliProyecto() {
    return this.httpClient.get(`${environment.api.SalesApi.url}/Proyecto/SL_GetCliProyecto`, {
        headers: this.headerBasicAuthorization.get(ApiEnum.SalesApi)
      }).pipe(map(data => data));
    }

  insertUpdateProyecto(data) {
    return this.httpClient.post(`${environment.api.SalesApi.url}/Proyecto/SL_InsertUpdateProyecto`, data, {
        headers: this.headerBasicAuthorization.get(ApiEnum.SalesApi)
    }).pipe(map(data => data));
    }
}
