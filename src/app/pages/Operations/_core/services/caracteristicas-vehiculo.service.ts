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
export class CaracteristicasVehiculoService {

  constructor(
    private httpClient: HttpClient,
		private headerBasicAuthorization: HeaderBasicAuthorizationService,
  ) { }

  getCaracteristicaVehiculo() {
		return this.httpClient.get(`${environment.api.WS_OP.url}/CaracteristicasVehiculo/OP_GetCaracteristicasVehiculo`, {
			headers: this.headerBasicAuthorization.get(ApiEnum.WS_OP)
		}).pipe(map(data => data));
	}

  insertUpdateCaracteristicaVehiculo(data) {
		return this.httpClient.post(`${environment.api.WS_OP.url}/CaracteristicasVehiculo/OP_insertUpdateCaracteristicasVehiculo`, data, {
			headers: this.headerBasicAuthorization.get(ApiEnum.WS_OP)
		}).pipe(map(data => data));
	}

  enableDisableCaracteristicaVehiculo(data) {
		return this.httpClient.post(`${environment.api.WS_OP.url}/CaracteristicasVehiculo/OP_EnableDisableCarateristicaVehiculo`, data, {
			headers: this.headerBasicAuthorization.get(ApiEnum.WS_OP)
		}).pipe(map(data => data));
	}

  deleteCaracteristicaeMaterial(idCaracteristica:number) {
	return this.httpClient.delete(`${environment.api.WS_OP.url}/CaracteristicasVehiculo/OP_DeleteCaracteristicaVehiculo?idCaracteristica=${idCaracteristica}`, {
			headers: this.headerBasicAuthorization.get(ApiEnum.WS_OP)
		}).pipe(map(data => data));
	}

  //------------------------------------------------------------------------------------------------------------------------------------------------------------

  getCaracteristicaVehiculoValor(idCaracteristicas: number) {
		return this.httpClient.get(`${environment.api.WS_OP.url}/CaracteristicasVehiculo/OP_GetCaracteristicasVehiculoValorByCaracteristica?idCaracteristicas=${idCaracteristicas}`, {
			headers: this.headerBasicAuthorization.get(ApiEnum.WS_OP)
		}).pipe(map(data => data));
	}


  enableDisableCaracteristicaVehiculoValor(data) {
		return this.httpClient.post(`${environment.api.WS_OP.url}/CaracteristicasVehiculo/OP_EnableDisableCarateristicVehiculoValor`, data, {
			headers: this.headerBasicAuthorization.get(ApiEnum.WS_OP)
		}).pipe(map(data => data));
	}

  deleteCaracteristicaVehiculoValor(idCaracteristicas:number) {
	return this.httpClient.delete(`${environment.api.WS_OP.url}/CaracteristicasVehiculo/OP_DeleteCaracteristicaValorVehiculo?idCaracteristica=${idCaracteristicas}`, {
			headers: this.headerBasicAuthorization.get(ApiEnum.WS_OP)
		}).pipe(map(data => data));
	}

}
