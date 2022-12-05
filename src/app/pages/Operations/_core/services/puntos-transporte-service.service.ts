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
export class PuntosTransporteServiceService {
  constructor(
    private httpClient: HttpClient,
		private headerBasicAuthorization: HeaderBasicAuthorizationService,
  ) { }

  getPaises() {
		return this.httpClient.get(`${environment.api.WS_OP.url}/PuntosTransporte/SC_GetPaises`, {
			headers: this.headerBasicAuthorization.get(ApiEnum.WS_OP)
		}).pipe(map(data => data));
	}

  getUbicaciones(idPais:number) {
    return this.httpClient.get(`${environment.api.WS_OP.url}/PuntosTransporte/SC_GetUbicaciones?idPais=${idPais}`, {
      headers: this.headerBasicAuthorization.get(ApiEnum.WS_OP)
    }).pipe(map(data => data));
  }

  getPuntosTransporte() {
		return this.httpClient.get(`${environment.api.WS_OP.url}/PuntosTransporte/OP_GetPuntosTransporte`, {
			headers: this.headerBasicAuthorization.get(ApiEnum.WS_OP)
		}).pipe(map(data => data));
  }


  deletePuntosTransporte(idPuntoTransporte:number) {
    return this.httpClient.delete(`${environment.api.WS_OP.url}/PuntosTransporte/OP_DeletePuntoTransporte?idPuntoTransporte=${idPuntoTransporte}`, {
      headers: this.headerBasicAuthorization.get(ApiEnum.WS_OP)
    }).pipe(map(data => data));
  }

  enableDisablePuntosTransporte(data) {
		return this.httpClient.post(`${environment.api.WS_OP.url}/PuntosTransporte/OP_EnableDisablePuntosTransporte`, data, {
			headers: this.headerBasicAuthorization.get(ApiEnum.WS_OP)
		}).pipe(map(data => data));
	}

  insertUpdatePuntosTransporte(data) {
		return this.httpClient.post(`${environment.api.WS_OP.url}/PuntosTransporte/OP_InsertUpdatePuntosTransporte`, data, {
			headers: this.headerBasicAuthorization.get(ApiEnum.WS_OP)
		}).pipe(map(data => data));
	}

}
