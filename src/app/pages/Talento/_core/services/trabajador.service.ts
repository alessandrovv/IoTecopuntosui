import { Injectable, OnDestroy, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, forkJoin, Observable, of } from 'rxjs';
import { exhaustMap, map, catchError } from 'rxjs/operators';
import { TableService, TableResponseModel, ITableState, BaseModel, PaginatorState, SortState, GroupingState } from '../../../../_metronic/shared/crud-table';
import { baseFilter } from '../../../../_fake/fake-helpers/http-extenstions';
import { environment } from '../../../../../environments/environment';
import { Router } from '@angular/router';
import { Certificado } from '../models/certificado.model';
import { HeaderBasicAuthorizationService } from '../../../../Shared/services/header-basic-authorization.service';
import { ApiEnum } from '../../../../Shared/enums/api.enum';

@Injectable({
	providedIn: 'root'
})
export class TrabajadorService {
  
  constructor(
    private httpClient: HttpClient,
    private headerBasicAuthorization: HeaderBasicAuthorizationService,
  ) {
  }

  // READ
  SaveUpdateTrabajadores(data) {
    return this.httpClient.post(`${environment.api.WS_HR.url}/Trabajador/HR_SaveUpdateTrabajadores`, data, {
        headers: this.headerBasicAuthorization.get(ApiEnum.WS_HR)
    }).pipe( map( data => data ));
  }
  SaveUpdateContrato(data) {
    return this.httpClient.post(`${environment.api.WS_HR.url}/Trabajador/HR_SaveUpdateContrato`, data, {
        headers: this.headerBasicAuthorization.get(ApiEnum.WS_HR)
    }).pipe( map( data => data ));
  }
	
	GetTrabajadoresList(empresa, area, puestoTrabajo, estado) {
		return this.httpClient.get(`${environment.api.WS_HR.url}/Trabajador/HR_GetTrabajadoresList?Empresa=${empresa}&Area=${area}&PuestoTrabajo=${puestoTrabajo}&Estado=${estado}`, {
			headers: this.headerBasicAuthorization.get(ApiEnum.WS_HR)
		}).pipe(map(data => data));
	}

	DeleteContrato(Contrato) {
		return this.httpClient.post(`${environment.api.WS_HR.url}/Trabajador/HR_DeleteContrato`, { Contrato }, {
			headers: this.headerBasicAuthorization.get(ApiEnum.WS_HR)
		}).pipe(map(data => data));
	}

	DeleteDisableTrabajador(Trabajador, Tipo, Estado) {
		return this.httpClient.post(`${environment.api.WS_HR.url}/Trabajador/HR_DeleteDisableTrabajador`, { Trabajador, Tipo, Estado }, {
			headers: this.headerBasicAuthorization.get(ApiEnum.WS_HR)
		}).pipe(map(data => data));
	}

	GetDatosTrabajador(Trabajador) {
		return this.httpClient.get(`${environment.api.WS_HR.url}/Trabajador/HR_GetDatosTrabajador?Trabajador=${Trabajador}`, {
			headers: this.headerBasicAuthorization.get(ApiEnum.WS_HR)
		}).pipe(map(data => data));
	}

	GetDatosContrato(Contrato) {
		return this.httpClient.get(`${environment.api.WS_HR.url}/Trabajador/HR_GetDatosContrato?Contrato=${Contrato}`, {
			headers: this.headerBasicAuthorization.get(ApiEnum.WS_HR)
		}).pipe(map(data => data));
	}

	GetZonasTrabajador(Trabajador) {
		return this.httpClient.get(`${environment.api.WS_HR.url}/Trabajador/HR_GetZonasTrabajador?Trabajador=${Trabajador}`, {
			headers: this.headerBasicAuthorization.get(ApiEnum.WS_HR)
		}).pipe(map(data => data));
	}

	GetUnidadesNegocioTrabajador(Trabajador) {
		return this.httpClient.get(`${environment.api.WS_HR.url}/Trabajador/HR_GetUnidadesNegocioTrabajador?Trabajador=${Trabajador}`, {
			headers: this.headerBasicAuthorization.get(ApiEnum.WS_HR)
		}).pipe(map(data => data));
	}

	GetDescargarContrato(data) {
		return this.httpClient.post(`${environment.api.WS_HR.url}/Trabajador/HR_GetDescargarContrato`, data, {
			headers: this.headerBasicAuthorization.get(ApiEnum.WS_HR)
		}).pipe(map(data => data));
	}

	descargarBase64(base64, name) {
		const blob: Blob = this.base64toBlob(base64);
		const url = window.URL.createObjectURL(blob);
		const dlink = document.createElement('a');
		dlink.download = name;
		dlink.href = url;
		dlink.click();
		dlink.remove();
	}

	private blobType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document;charset=UTF-8';
	private base64toBlob(b64Data, sliceSize = 512): Blob {
		const byteCharacters = atob(b64Data);
		const byteArrays = [];
		for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
			const slice = byteCharacters.slice(offset, offset + sliceSize);

			const byteNumbers = new Array(slice.length);
			for (let i = 0; i < slice.length; i++) {
				byteNumbers[i] = slice.charCodeAt(i);
			}

			const byteArray = new Uint8Array(byteNumbers);
			byteArrays.push(byteArray);
		}

		const blob = new Blob(byteArrays, { type: this.blobType });
		return blob;
	}



	public ObtenerBase64String(files: Array<any>, nombreArchivo: string): Observable<any> {
		const formData = new FormData();

		for (let i = 0; i < files.length; i++) {
			formData.append(`file[${i}]`, files[i]);
			formData.append("nombreArchivo", nombreArchivo);
		}

		const url = `${environment.api.WS_HR.url}/Trabajador/FI_ObtenerBase64String`;

		// return this.httpClient.post<any>(url, formData, {headers: this.headerBasicAuthorization.get(ApiEnum.WS_HR)});

		// return this.httpClient.post<any>(url, formData).subscribe(
		//   (res) => console.log(res),
		//   (err) => console.log(err)
		// );

		return this.httpClient.post(`${environment.api.WS_HR.url}/Trabajador/FI_ObtenerBase64String`, formData, { headers: this.headerBasicAuthorization.get(ApiEnum.WS_HR) });

		//  return this.httpClient.post(url, formData, {
		//     headers: this.headerBasicAuthorization.get(ApiEnum.WS_HR)
		//   }).pipe( map( data => data ));
		// return this.httpClient.post<any>(url, formData, {
		//   headers: this.headerBasicAuthorization.get(ApiEnum.WS_HR)
		// });
		// return this.httpClient.post(url, formData, {
		//   headers: this.headerBasicAuthorization.get(ApiEnum.WS_HR)
		// }).pipe( map( data => data ));
		// return this.httpClient.post<any>(url, formData, {headers: this.headerBasicAuthorization.get(ApiEnum.WS_HR)});
	}

}
