import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, forkJoin, Observable, of } from 'rxjs';
import { exhaustMap, map, catchError } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
import { HeaderBasicAuthorizationService } from '../../../../Shared/services/header-basic-authorization.service';
import { ApiEnum } from '../../../../Shared/enums/api.enum';
@Injectable({
  providedIn: 'root'
})
export class ClaseMaterialService {

  constructor(
    private httpClient: HttpClient,
		private headerBasicAuthorization: HeaderBasicAuthorizationService,
  ) { }

  getClaseMaterial() {
		return this.httpClient.get(`${environment.api.WS_LG.url}/ClaseMaterial/LG_GetListarClasesMaterial`, {
			headers: this.headerBasicAuthorization.get(ApiEnum.WS_LG)
		}).pipe(map(data => data));
	}

  insertUpdateClaseMaterial(data) {
		return this.httpClient.post(`${environment.api.WS_LG.url}/ClaseMaterial/LG_insertUpdateClaseMaterial`, data, {
			headers: this.headerBasicAuthorization.get(ApiEnum.WS_LG)
		}).pipe(map(data => data));
	}

  enableDisableClaseMaterial(data) {
		return this.httpClient.post(`${environment.api.WS_LG.url}/ClaseMaterial/LG_EnableDisableClaseMaterial`, data, {
			headers: this.headerBasicAuthorization.get(ApiEnum.WS_LG)
		}).pipe(map(data => data));
	}

  deleteClaseMaterial(Material:number) {
	return this.httpClient.delete(`${environment.api.WS_LG.url}/ClaseMaterial/LG_DeleteClaseMaterial?Material=${Material}`, {
			headers: this.headerBasicAuthorization.get(ApiEnum.WS_LG)
		}).pipe(map(data => data));
	}
	GetCaracteristicaClaseMateriales() {
		return this.httpClient.get(`${environment.api.WS_LG.url}/ClaseMaterial/LG_GetCaracteristicasClaseMaterial`,{
					headers: this.headerBasicAuthorization.get(ApiEnum.WS_LG)
			}).pipe( map( data => data ));
	  }
	  GetClaseMaterialDetalleById(idClaseMaterial){
		return this.httpClient.get(`${environment.api.WS_LG.url}/ClaseMaterial/LG_GetClaseMaterialDetalleById?IdClaseMaterial=${idClaseMaterial}`,{
		  headers: this.headerBasicAuthorization.get(ApiEnum.WS_LG)
		}).pipe( map( data => data ));
	  }
	  newSaveUpdateClaseMaterialDetalle(data){
		return this.httpClient.post(`${environment.api.WS_LG.url}/ClaseMaterial/LG_newSaveUpdateClaseMaterial`, data, {
		  headers: this.headerBasicAuthorization.get(ApiEnum.WS_LG)
	  }).pipe( map( data => data ));
	  }
  
}
