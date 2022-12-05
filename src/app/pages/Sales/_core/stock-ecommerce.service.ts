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
export class StockEcommerceService {

	constructor(
		private httpClient: HttpClient,
		private headerBasicAuthorization: HeaderBasicAuthorizationService,
	) {
	}

	GetComboEstablecimientos() {
		return this.httpClient.get(`${environment.api.SalesApi.url}/StockEcommerce/SL_GetComboEstablecimientos`, {
			headers: this.headerBasicAuthorization.get(ApiEnum.SalesApi)
		}).pipe(map(data => data));
	}

	GetComboMaterialesAplicaVenta() {
		return this.httpClient.get(`${environment.api.SalesApi.url}/StockEcommerce/SL_GetComboMaterialesAplicaVenta`, {
			headers: this.headerBasicAuthorization.get(ApiEnum.SalesApi)
		}).pipe(map(data => data));
	}

	GetListarStockEcommerce(idEstablecimiento) {
		return this.httpClient.get(`${environment.api.SalesApi.url}/StockEcommerce/SL_GetListarStockEcommerce?prmintIdEstablecimiento=${idEstablecimiento}`, {
			headers: this.headerBasicAuthorization.get(ApiEnum.SalesApi)
		}).pipe(map(data => data));
	}

	GetDetalleStockEcommerce(IdStockEcommerce) {
		return this.httpClient.get(`${environment.api.SalesApi.url}/StockEcommerce/SL_GetDetalleStockEcommerce?prmintIdStockEcommerce=
    ${IdStockEcommerce}`, {
			headers: this.headerBasicAuthorization.get(ApiEnum.SalesApi)
		}).pipe(map(data => data));
	}

	SaveUpdateDetalleStockEcommerce(data) {
		return this.httpClient.post(`${environment.api.SalesApi.url}/StockEcommerce/SL_SaveUpdateDetalleStockEcommerce`, data, {
			headers: this.headerBasicAuthorization.get(ApiEnum.SalesApi)
		}).pipe(map(data => data));
	}

	UpdateStockEcommerce(idStockEcommerce) {
		return this.httpClient.post(`${environment.api.SalesApi.url}/StockEcommerce/SL_UpdateStockEcommerce`, {
			idStockEcommerce: idStockEcommerce
		}, {
			headers: this.headerBasicAuthorization.get(ApiEnum.SalesApi)
		}).pipe(map(data => data));
	}

	SaveUpdateNotaAlmacen(data) {
		return this.httpClient.post(`${environment.api.SalesApi.url}/StockEcommerce/SL_SaveUpdateNotaAlmacen`, data, {
			headers: this.headerBasicAuthorization.get(ApiEnum.SalesApi)
		}).pipe(map(data => data));
	}

}
