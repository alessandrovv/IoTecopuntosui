import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
import { HeaderBasicAuthorizationService } from '../../../../Shared/services/header-basic-authorization.service';
import { ApiEnum } from '../../../../Shared/enums/api.enum';

@Injectable({
  providedIn: 'root'
})
export class ReporteVencimientoService {

  constructor(
    private httpClient: HttpClient,
		private headerBasicAuthorization: HeaderBasicAuthorizationService,
  ) { }

  getReporteVencimientoVehiculo(idVehiculo: number, idTipoVehiculo: number, idTipoProcedencia: number, idProveedor: number) {
		return this.httpClient.get(`${environment.api.WS_OP.url}/ReporteVencimiento/OP_GetReporteVencimientoVehiculo?idVehiculo=${idVehiculo}&idTipoVehiculo=${idTipoVehiculo}&idTipoProcedencia=${idTipoProcedencia}&idProveedor=${idProveedor}`, {
			headers: this.headerBasicAuthorization.get(ApiEnum.WS_OP)
		}).pipe(map(data => data));
	}

  getComboProcedencia() {
		return this.httpClient.get(`${environment.api.WS_OP.url}/ReporteVencimiento/OP_GetComboProcedencia`, {
			headers: this.headerBasicAuthorization.get(ApiEnum.WS_OP)
		}).pipe(map(data => data));
	}

  getComboPlacas() {
		return this.httpClient.get(`${environment.api.WS_OP.url}/ReporteVencimiento/OP_GetComboPlacas`, {
			headers: this.headerBasicAuthorization.get(ApiEnum.WS_OP)
		}).pipe(map(data => data));
	}

  getProveedorCombo() {
		return this.httpClient.get(`${environment.api.WS_OP.url}/ReporteVencimiento/OP_GetProveedorCombo`, {
			headers: this.headerBasicAuthorization.get(ApiEnum.WS_OP)
		}).pipe(map(data => data));
	}

  getComboTipoVehiculo() {
    return this.httpClient.get(`${environment.api.WS_OP.url}/ReporteVencimiento/OP_GetComboTipoVehiculo`, {
      headers: this.headerBasicAuthorization.get(ApiEnum.WS_OP)
    }).pipe(map(data => data));
  }

  

}
