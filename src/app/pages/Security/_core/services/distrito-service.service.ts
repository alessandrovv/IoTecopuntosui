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
export class DistritoServiceService {

  constructor(
        private httpClient: HttpClient,
        private headerBasicAuthorization: HeaderBasicAuthorizationService,
  ) {}


  // GetPaises() {
  //   return this.httpClient.get(`${environment.api.WS_IT.url}/Ubigeo/SC_GetPaises`,{
  //               headers: this.headerBasicAuthorization.get(ApiEnum.WS_IT)
  //       }).pipe( map( data => data ));
  // }


  // GetDepartamentos() {
  //   return this.httpClient.get(`${environment.api.WS_IT.url}/Ubigeo/SC_GetDepartamentos`,{
  //               headers: this.headerBasicAuthorization.get(ApiEnum.WS_IT)
  //       }).pipe( map( data => data ));
  // }

  // GetProvincia() {
  //   return this.httpClient.get(`${environment.api.WS_IT.url}/Ubigeo/SC_GetProvincia`,{
  //               headers: this.headerBasicAuthorization.get(ApiEnum.WS_IT)
  //       }).pipe( map( data => data ));
  // }

  // GetDistrito() {
  //   return this.httpClient.get(`${environment.api.WS_IT.url}/Ubigeo/SC_GetDistrito`,{
  //               headers: this.headerBasicAuthorization.get(ApiEnum.WS_IT)
  //       }).pipe( map( data => data ));
  // }

  GetListarDistritos() {
    return this.httpClient.get(`${environment.api.WS_IT.url}/Ubigeo/SC_GetListarDistritos`,{
                headers: this.headerBasicAuthorization.get(ApiEnum.WS_IT)
        }).pipe( map( data => data ));
  }
  

  EnableDisableDistrito(data) {
		return this.httpClient.post(`${environment.api.WS_IT.url}/Ubigeo/SC_EnableDisableDistrito`, data, {
			headers: this.headerBasicAuthorization.get(ApiEnum.WS_IT)
		}).pipe(map(data => data));
	}

  deleteDistrito(Distrito:number) {
    return this.httpClient.delete(`${environment.api.WS_IT.url}/Ubigeo/SC_DeleteDistritos?Distrito=${Distrito}`, {
        headers: this.headerBasicAuthorization.get(ApiEnum.WS_IT)
      }).pipe(map(data => data));
    }
  
  GetobtenerDataDepartamentos(idPais){
    return this.httpClient.get(`${environment.api.WS_IT.url}/Ubigeo/SC_obtenerDataDepartamentos?idPais=${idPais}`,{
        headers:this.headerBasicAuthorization.get(ApiEnum.WS_IT)
      }).pipe(map(data=>data));
    }

  GetobtenerDataProvincia(idDepartamento){
    return this.httpClient.get(`${environment.api.WS_IT.url}/Ubigeo/SC_obtenerDataProvincia?idDepartamento=${idDepartamento}`,{
        headers:this.headerBasicAuthorization.get(ApiEnum.WS_IT)
      }).pipe(map(data=>data));
    }

  insertUpdateDistrito(data) {
    return this.httpClient.post(`${environment.api.WS_IT.url}/Ubigeo/SC_InsertUpdateDistrito`, data, {
      headers: this.headerBasicAuthorization.get(ApiEnum.WS_IT)
    }).pipe(map(data => data));
    }
  
  

}
