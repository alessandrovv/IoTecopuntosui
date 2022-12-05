import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
import { HeaderBasicAuthorizationService } from '../../../../Shared/services/header-basic-authorization.service';
import { ApiEnum } from '../../../../Shared/enums/api.enum';

@Injectable({
  providedIn: 'root'
})
export class RutaServiceService {
  constructor(
    private httpClient: HttpClient,
		private headerBasicAuthorization: HeaderBasicAuthorizationService,
  ) { }

  getRutas() {
		return this.httpClient.get(`${environment.api.WS_OP.url}/Rutas/OP_GetListarRutas`, {
			headers: this.headerBasicAuthorization.get(ApiEnum.WS_OP)
		}).pipe(map(data => data));
	}

  deleteRuta(idRuta: number) {
    return this.httpClient.delete(`${environment.api.WS_OP.url}/Rutas/OP_DeleteRuta?idRuta=${idRuta}`, {
      headers: this.headerBasicAuthorization.get(ApiEnum.WS_OP)
    }).pipe(map(data => data));
  }

  enableDisableRuta(data) {
		return this.httpClient.post(`${environment.api.WS_OP.url}/Rutas/OP_EnableDisableRuta`, data, {
			headers: this.headerBasicAuthorization.get(ApiEnum.WS_OP)
		}).pipe(map(data => data));
	}

  insertUpdateRuta(data) {
		return this.httpClient.post(`${environment.api.WS_OP.url}/Rutas/OP_insertUpdateClaseRuta`, data, {
			headers: this.headerBasicAuthorization.get(ApiEnum.WS_OP)
		}).pipe(map(data => data));
	}

}
