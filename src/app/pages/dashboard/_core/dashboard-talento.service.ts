import { Injectable, OnDestroy, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ApiEnum } from 'src/app/Shared/enums/api.enum';
import { HeaderBasicAuthorizationService } from 'src/app/Shared/services/header-basic-authorization.service';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class DashboardTalentoService {
  constructor(
    private httpClient: HttpClient,
    private headerBasicAuthorization: HeaderBasicAuthorizationService,
  ) {
  }

	GetReporteRotacion(Empresa) {
    return this.httpClient.get(`${environment.api.WS_HR.url}/Dashboard/HR_GetReporteRotacion?Empresa=${Empresa}`,{
        headers: this.headerBasicAuthorization.get(ApiEnum.WS_HR)
    }).pipe( map( data => data ));
  }

	GetReporteDistribucionArea(Empresa) {
    return this.httpClient.get(`${environment.api.WS_HR.url}/Dashboard/HR_GetReporteDistribucionAreas?Empresa=${Empresa}`,{
        headers: this.headerBasicAuthorization.get(ApiEnum.WS_HR)
    }).pipe( map( data => data ));
  }
}
