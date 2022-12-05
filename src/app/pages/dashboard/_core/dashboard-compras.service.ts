import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiEnum } from 'src/app/Shared/enums/api.enum';
import { HeaderBasicAuthorizationService } from 'src/app/Shared/services/header-basic-authorization.service';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})
export class DashboardComprasService {

	constructor(private httpClient: HttpClient,
		private headerBasicAuthorization: HeaderBasicAuthorizationService,) { }

	GetReporteComprasByFecha(idCategoriaProveedor, idProveedor, Anio) {
		return this.httpClient.get(`${environment.api.WS_LG.url}/DashboardCompras/LG_GetReporteComprasByFecha?prmintIdCategoriaProveedor=${idCategoriaProveedor}&prmintIdProveedor=${idProveedor}&prmintAnio=${Anio}`, {
			headers: this.headerBasicAuthorization.get(ApiEnum.WS_LG)
		}).pipe(map(data => data));
	}

	GetReporteComprasByCategoriaBySubByClase(tipoFecha, tipo, anio, mes, semana, fechaInicio, fechaFin
		, idCategoriaMaterial, idSubcategoriaMaterial, idClaseMaterial) {
		return this.httpClient.get(`${environment.api.WS_LG.url}/DashboardCompras/LG_GetReporteComprasByCategoriaBySubByClase?prmintTipoFecha=${tipoFecha}&prmintTipo=${tipo}&prmintAnio=${anio}
		&prmintMes=${mes}&prmintSemana=${semana}&prmdatFechaInicio=${fechaInicio}
		&prmdatFechaFin=${fechaFin}&prmintIdCategoriaMaterial=${idCategoriaMaterial}&prmintIdSubategoriaMaterial=${idSubcategoriaMaterial}
		&prmintIdClaseMaterial=${idClaseMaterial}`, {
			headers: this.headerBasicAuthorization.get(ApiEnum.WS_LG)
		}).pipe(map(data => data));
	}

	GetReporteComprasByProveedor(tipo, tipoFecha, idCategoriaProveedor, anio, mes, semana, fechaInicio, fechaFin) {
		return this.httpClient.get(`${environment.api.WS_LG.url}/DashboardCompras/LG_GetReporteComprasByProveedor?prmintTipo=${tipo}&prmintTipoFecha=${tipoFecha}&prmintIdCategoriaProveedor=${idCategoriaProveedor}
		&prmintAnio=${anio}&prmintMes=${mes}&prmintSemana=${semana}
		&prmdatFechaInicio=${fechaInicio}&prmdatFechaFin=${fechaFin}`, {
			headers: this.headerBasicAuthorization.get(ApiEnum.WS_LG)
		}).pipe(map(data => data));
	}

}
