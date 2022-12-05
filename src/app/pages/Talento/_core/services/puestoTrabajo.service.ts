import { Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
import { HeaderBasicAuthorizationService } from '../../../../Shared/services/header-basic-authorization.service';
import { ApiEnum } from '../../../../Shared/enums/api.enum';

@Injectable({
  providedIn: 'root'
})
export class puestoTrabajoService {
  
  constructor(
    private httpClient: HttpClient,
    private headerBasicAuthorization: HeaderBasicAuthorizationService,
  ) {
  }

  /* COMBO SELECT */
  GetPuestoTrabajoByUsuario(Empresa, Area) {
    return this.httpClient.get(`${environment.api.WS_HR.url}/PuestoTrabajo/HR_GetPuestoTrabajoByUsuario?Empresa=${Empresa}&Area=${Area}`,{
        headers: this.headerBasicAuthorization.get(ApiEnum.WS_HR)
    }).pipe( map( data => data ));
  }
  /*FIN COMBO SELECT */
  
  GetPuestosDeTrabajo(Empresa, Area, Estado) {
    return this.httpClient.get(`${environment.api.WS_HR.url}/PuestoTrabajo/HR_GetPuestosTrabajo?Empresa=${Empresa}&Area=${Area}&Estado=${Estado}`,{
        headers: this.headerBasicAuthorization.get(ApiEnum.WS_HR)
    }).pipe( map( data => data ));
  }
  GetListarAreasByEmpresa(Empresa) {
    return this.httpClient.get(`${environment.api.WS_HR.url}/PuestoTrabajo/HR_GetListarAreasByEmpresa?Empresa=${Empresa}`,{
        headers: this.headerBasicAuthorization.get(ApiEnum.WS_HR)
    }).pipe( map( data => data ));
  }

  SaveUpdatePuestoTrabajo(data) {
    return this.httpClient.post(`${environment.api.WS_HR.url}/PuestoTrabajo/HR_SaveUpdatePuestoTrabajo`, data, {
        headers: this.headerBasicAuthorization.get(ApiEnum.WS_HR)
    }).pipe( map( data => data ));
  }
  
  DeletePuestoTrabajo(PuestoTrabajo) {
    return this.httpClient.post(`${environment.api.WS_HR.url}/PuestoTrabajo/HR_DeletePuestoTrabajo`, 
    {PuestoTrabajo: PuestoTrabajo},{
        headers: this.headerBasicAuthorization.get(ApiEnum.WS_HR)
    }).pipe( map( data => data ));
  }

  EnableDisablePuestoTrabajo(PuestoTrabajo: number, Estado: any) {
    return this.httpClient.post(`${environment.api.WS_HR.url}/PuestoTrabajo/HR_EnableDisablePuestoTrabajo`, 
    { PuestoTrabajo: PuestoTrabajo, Activo: Estado },
    { headers: this.headerBasicAuthorization.get(ApiEnum.WS_HR) }).pipe( map( data => data ));
  }
}
