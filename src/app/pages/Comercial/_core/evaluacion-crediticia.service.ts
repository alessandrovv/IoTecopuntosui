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
export class EvaluacionCrediticiaService {
  
  constructor(
    private httpClient: HttpClient,
    private headerBasicAuthorization: HeaderBasicAuthorizationService,
  ) {
  }

	GetEvaluacionesCrediticias(Empresa, Inicio, Fin, Estado, Asesor) {
    return this.httpClient.get(`${environment.api.SalesApi.url}/EvaluacionCrediticia/SL_GetEvaluacionesCrediticias?prmintEmpresa=${Empresa}&prmdatFechaInicio=${Inicio}&prmdatFechaFin=${Fin}&prmstrEstado=${Estado}&Asesor=${Asesor}`,{
        headers: this.headerBasicAuthorization.get(ApiEnum.SalesApi)
    }).pipe( map( data => data ));
  }


	GetEstadoEvaluacionCrediticia() {
    return this.httpClient.get(`${environment.api.SalesApi.url}/EvaluacionCrediticia/SL_GetEstadoEvaluacionCrediticia`,{
        headers: this.headerBasicAuthorization.get(ApiEnum.SalesApi)
    }).pipe( map( data => data ));
  }

  GetAsesoresByEmpresa(Empresa) {
    return this.httpClient.get(`${environment.api.SalesApi.url}/EvaluacionCrediticia/SL_GetAsesoresByEmpresa?prmintEmpresa=${Empresa}`,{
        headers: this.headerBasicAuthorization.get(ApiEnum.SalesApi)
    }).pipe( map( data => data ));
  }

  PostRevisionCrediticia(model) {
    return this.httpClient.post(`${environment.api.SalesApi.url}/EvaluacionCrediticia/SL_PostRevisionCrediticia`, model, {
        headers: this.headerBasicAuthorization.get(ApiEnum.SalesApi)
    }).pipe( map( data => data ));
  }

  // SaveUpdateMetaComercial(data) {
  //   return this.httpClient.post(`${environment.api.SalesApi.url}/MetaComercial/SL_SaveUpdateMetaComercial`, data, {
  //     headers: this.headerBasicAuthorization.get(ApiEnum.SalesApi)
  //   }).pipe( map( data => data ));
  // }
  

}
