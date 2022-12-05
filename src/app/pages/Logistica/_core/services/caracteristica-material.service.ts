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
export class CaracteristicaMaterialService {

  constructor(
    private httpClient: HttpClient,
		private headerBasicAuthorization: HeaderBasicAuthorizationService,
  ) { }

  getCaracteristicaMaterial() {
		return this.httpClient.get(`${environment.api.WS_LG.url}/CaracteristicasMaterial/LG_GetCaracteristicasMaterial`, {
			headers: this.headerBasicAuthorization.get(ApiEnum.WS_LG)
		}).pipe(map(data => data));
	}

  insertUpdateCaracteristicaMaterial(data) {
		return this.httpClient.post(`${environment.api.WS_LG.url}/CaracteristicasMaterial/LG_insertUpdateCaracteristicasMaterial`, data, {
			headers: this.headerBasicAuthorization.get(ApiEnum.WS_LG)
		}).pipe(map(data => data));
	}

  enableDisableCaracteristicaMaterial(data) {
		return this.httpClient.post(`${environment.api.WS_LG.url}/CaracteristicasMaterial/spLG_EnableDisableCarateristicaMaterial`, data, {
			headers: this.headerBasicAuthorization.get(ApiEnum.WS_LG)
		}).pipe(map(data => data));
	}

  deleteCaracteristicaeMaterial(idCaracteristicaMaterial:number) {
	return this.httpClient.delete(`${environment.api.WS_LG.url}/CaracteristicasMaterial/LG_DeleteCaracteristicaMaterial?idCaracteristicaMaterial=${idCaracteristicaMaterial}`, {
			headers: this.headerBasicAuthorization.get(ApiEnum.WS_LG)
		}).pipe(map(data => data));
	}

  //------------------------------------------------------------------------------------------------------------------------------------------------------------

  getCaracteristicaMaterialValor(idCaracteristicaMaterial: number) {
		return this.httpClient.get(`${environment.api.WS_LG.url}/CaracteristicasMaterial/LG_GetCaracteristicasMaterialValorByCaracteristica?idCaracteristicasMaterial=${idCaracteristicaMaterial}`, {
			headers: this.headerBasicAuthorization.get(ApiEnum.WS_LG)
		}).pipe(map(data => data));
	}


  enableDisableCaracteristicaMaterialValor(data) {
		return this.httpClient.post(`${environment.api.WS_LG.url}/CaracteristicasMaterial/LG_EnableDisableCarateristicaMaterialValor`, data, {
			headers: this.headerBasicAuthorization.get(ApiEnum.WS_LG)
		}).pipe(map(data => data));
	}

  deleteCaracteristicaMaterialValor(idCaracteristicaMaterialValor:number) {
	return this.httpClient.delete(`${environment.api.WS_LG.url}/CaracteristicasMaterial/LG_DeleteCaracteristicaValorMaterial?idCaracteristicaMaterialValor=${idCaracteristicaMaterialValor}`, {
			headers: this.headerBasicAuthorization.get(ApiEnum.WS_LG)
		}).pipe(map(data => data));
	}

}
