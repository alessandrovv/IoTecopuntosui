import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HeaderBasicAuthorizationService } from '../../../../Shared/services/header-basic-authorization.service';
import { map } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
import { ApiEnum } from '../../../../Shared/enums/api.enum';
@Injectable({
  providedIn: 'root'
})
export class PlanContratoService {
  
  constructor(
    private httpClient: HttpClient,
    private headerBasicAuthorization: HeaderBasicAuthorizationService,
  ){

  }
  GetPlanContratos(Empresa, Cliente, Estado) {
    return this.httpClient.get(`${environment.api.WS_FI.url}/PlanContrato/FI_GetPlanContratos?Empresa=${Empresa}&Cliente=${Cliente}&Estado=${Estado}`,{
        headers: this.headerBasicAuthorization.get(ApiEnum.WS_FI)
    }).pipe( map( data => data ));
  }

  SaveUpdatePlanContrato(data) {
    return this.httpClient.post(`${environment.api.WS_FI.url}/PlanContrato/FI_SaveUpdatePlanContrato`, data, {
        headers: this.headerBasicAuthorization.get(ApiEnum.WS_FI)
    }).pipe( map( data => data ));
  }
  
  DeletePlanContrato(PlanContrato:number) {
    return this.httpClient.post(`${environment.api.WS_FI.url}/PlanContrato/FI_DeletePlanContrato`, 
    { PlanContrato: PlanContrato},
    { headers: this.headerBasicAuthorization.get(ApiEnum.WS_FI) }).pipe( map( data => data ));
  }

  EnableDisablePlanContrato(PlanContrato: number, Estado: any) {
    return this.httpClient.post(`${environment.api.WS_FI.url}/PlanContrato/FI_EnableDisablePlanContrato`, 
    { PlanContrato: PlanContrato, Activo: Estado },
    { headers: this.headerBasicAuthorization.get(ApiEnum.WS_FI) }).pipe( map( data => data ));
  }
}