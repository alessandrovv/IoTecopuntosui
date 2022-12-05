import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
import { HeaderBasicAuthorizationService } from '../../../../Shared/services/header-basic-authorization.service';
import { ApiEnum } from '../../../../Shared/enums/api.enum';

@Injectable({
  providedIn: 'root'
})
export class TarifaService {

  constructor(
    private httpClient: HttpClient,
		private headerBasicAuthorization: HeaderBasicAuthorizationService,
  ) { }

  getTarifas() {
		return this.httpClient.get(`${environment.api.WS_OP.url}/Tarifas/OP_GetListarTarifas`, {
			headers: this.headerBasicAuthorization.get(ApiEnum.WS_OP)
		}).pipe(map(data => data));
	}

  getMonedas() {
		return this.httpClient.get(`${environment.api.WS_OP.url}/Tarifas/vFI_GetMonedas`, {
			headers: this.headerBasicAuthorization.get(ApiEnum.WS_OP)
		}).pipe(map(data => data));
	}

  deleteTarifa(idTarifa: number) {
    return this.httpClient.delete(`${environment.api.WS_OP.url}/Tarifas/OP_DeleteTarifa?idTarifa=${idTarifa}`, {
      headers: this.headerBasicAuthorization.get(ApiEnum.WS_OP)
    }).pipe(map(data => data));
  }

  enableDisableTarifa(data) {
		return this.httpClient.post(`${environment.api.WS_OP.url}/Tarifas/OP_EnableDisableTarifa`, data, {
			headers: this.headerBasicAuthorization.get(ApiEnum.WS_OP)
		}).pipe(map(data => data));
	}

  insertUpdateTarifa(data) {
		return this.httpClient.post(`${environment.api.WS_OP.url}/Tarifas/OP_insertUpdateTarifa`, data, {
			headers: this.headerBasicAuthorization.get(ApiEnum.WS_OP)
		}).pipe(map(data => data));
	}

}
