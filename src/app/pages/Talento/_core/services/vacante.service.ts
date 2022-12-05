import { Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
import { HeaderBasicAuthorizationService } from '../../../../Shared/services/header-basic-authorization.service';
import { ApiEnum } from '../../../../Shared/enums/api.enum';

@Injectable({
  providedIn: 'root'
})
export class VacanteService {
  
  constructor(
    private httpClient: HttpClient,
    private headerBasicAuthorization: HeaderBasicAuthorizationService,
  ) {
  }

  GetVacantes(Empresa, Area, PuestoTrabajo, Estado) {
    return this.httpClient.get(`${environment.api.WS_HR.url}/Vacante/HR_GetVacantes?Empresa=${Empresa}&Area=${Area}&PuestoTrabajo=${PuestoTrabajo}&Estado=${Estado}`,{
        headers: this.headerBasicAuthorization.get(ApiEnum.WS_HR)
    }).pipe( map( data => data ));
  }

  GetDatosVacante(Vacante) {
    return this.httpClient.get(`${environment.api.WS_HR.url}/Vacante/HR_GetDatosVacante?Vacante=${Vacante}`,{
        headers: this.headerBasicAuthorization.get(ApiEnum.WS_HR)
    }).pipe( map( data => data ));
  }

  SaveUpdateVacante(data) {
    return this.httpClient.post(`${environment.api.WS_HR.url}/Vacante/HR_SaveUpdateVacante`, data, {
        headers: this.headerBasicAuthorization.get(ApiEnum.WS_HR)
    }).pipe( map( data => data ));
  }
  DeleteVacante(Vacante) {
    return this.httpClient.post(`${environment.api.WS_HR.url}/Vacante/HR_DeleteVacante`, 
    {Vacante: Vacante},{
        headers: this.headerBasicAuthorization.get(ApiEnum.WS_HR)
    }).pipe( map( data => data ));
  }

  EnableDisableVacante(Vacante: number, Estado: any) {
    return this.httpClient.post(`${environment.api.WS_HR.url}/Vacante/HR_EnableDisableVacante`, 
    { Vacante: Vacante, Activo: Estado },
    { headers: this.headerBasicAuthorization.get(ApiEnum.WS_HR) }).pipe( map( data => data ));
  } 
}
