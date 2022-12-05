import { Injectable, OnDestroy, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, } from 'rxjs/operators';
import { ApiEnum } from 'src/app/Shared/enums/api.enum';
import { HeaderBasicAuthorizationService } from 'src/app/Shared/services/header-basic-authorization.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MetaComercialService {
  
  constructor(
    private httpClient: HttpClient,
    private headerBasicAuthorization: HeaderBasicAuthorizationService,
  ) {
  }

	GetMetasComerciales(Empresa,Anio,Mes) {
    return this.httpClient.get(`${environment.api.SalesApi.url}/MetaComercial/SL_GetMetasComerciales?Empresa=${Empresa}&Anio=${Anio}&Mes=${Mes}`,{
        headers: this.headerBasicAuthorization.get(ApiEnum.SalesApi)
    }).pipe( map( data => data ));
  }
  GetListarAnios() {
    return this.httpClient.get(`${environment.api.SalesApi.url}/MetaComercial/SL_GetListarAnio`,{
        headers: this.headerBasicAuthorization.get(ApiEnum.SalesApi)
    }).pipe( map( data => data ));
  }
  GetListarMeses() {
    return this.httpClient.get(`${environment.api.SalesApi.url}/MetaComercial/SL_GetListarMes`,{
        headers: this.headerBasicAuthorization.get(ApiEnum.SalesApi)
    }).pipe( map( data => data ));
  }
  GetDatosMetaComercial(MetaComercial) {
    return this.httpClient.get(`${environment.api.SalesApi.url}/MetaComercial/SL_GetDatosMetaComercial?MetaComercial=${MetaComercial}`,{
        headers: this.headerBasicAuthorization.get(ApiEnum.SalesApi)
    }).pipe( map( data => data ));
  }
  SaveUpdateMetaComercial(data) {
    return this.httpClient.post(`${environment.api.SalesApi.url}/MetaComercial/SL_SaveUpdateMetaComercial`, data, {
      headers: this.headerBasicAuthorization.get(ApiEnum.SalesApi)
    }).pipe( map( data => data ));
  }
  DeleteMetaComercial(MetaComercial) {
    return this.httpClient.post(`${environment.api.SalesApi.url}/MetaComercial/SL_DeleteMetaComercial`, 
    {MetaComercial: MetaComercial},{
        headers: this.headerBasicAuthorization.get(ApiEnum.SalesApi)
    }).pipe( map( data => data ));
  }
  
}
