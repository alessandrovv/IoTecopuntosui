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
export class ProveedorService {

  constructor(
    private httpClient: HttpClient,
		private headerBasicAuthorization: HeaderBasicAuthorizationService,
  ) { }

  GetProveedores(categoria, Pais, Departamento , Provincia, Distrito ) {
		return this.httpClient.get(`${environment.api.WS_LG.url}/Proveedores/LG_GetProveedores?Categoria=${categoria}&Pais=${Pais}&Departamento=${Departamento}&Provincia=${Provincia}&Distrito=${Distrito}`, {
			headers: this.headerBasicAuthorization.get(ApiEnum.WS_LG)
		}).pipe(map(data => data));
	}

  GetListarCategoriaProveedores(){
    return this.httpClient.get(`${environment.api.WS_LG.url}/Proveedores/LG_GetListarCategoriaProveedor`, {
			headers: this.headerBasicAuthorization.get(ApiEnum.WS_LG)
		}).pipe(map(data => data));
  }

  GetDatosProveedor(Proveedor) {
    return this.httpClient.get(`${environment.api.WS_LG.url}/Proveedores/LG_GetDatosProveedor?Proveedor=${Proveedor}`,{
        headers: this.headerBasicAuthorization.get(ApiEnum.WS_LG)
    }).pipe( map( data => data ));
  }

  GetCodigoSiguienteProveedor(){
    return this.httpClient.get(`${environment.api.WS_LG.url}/Proveedores/LG_GetProveedorCodigoSiguiente`, {
			headers: this.headerBasicAuthorization.get(ApiEnum.WS_LG)
		}).pipe(map(data => data));
  }

  EnableDisableProveedor(Proveedor: number, Estado: any) {
    return this.httpClient.post(`${environment.api.WS_LG.url}/Proveedores/LG_EnableDisableProveedor`, 
    { Proveedor: Proveedor, Activo: Estado },
    { headers: this.headerBasicAuthorization.get(ApiEnum.WS_LG) }).pipe( map( data => data ));
  } 

  DeleteProveedor(Proveedor) {
    return this.httpClient.post(`${environment.api.WS_LG.url}/Proveedores/LG_DeleteProveedor`, 
    {Proveedor: Proveedor},{
        headers: this.headerBasicAuthorization.get(ApiEnum.WS_LG)
    }).pipe( map( data => data ));
  }

  SaveUpdateProveedores(data) {
		return this.httpClient.post(`${environment.api.WS_LG.url}/Proveedores/LG_SaveUpdateProveedor`, data, {
			headers: this.headerBasicAuthorization.get(ApiEnum.WS_LG)
		}).pipe(map(data => data));
	}
}
