import { HeaderBasicAuthorizationService } from './../../../../Shared/services/header-basic-authorization.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiEnum } from 'src/app/Shared/enums/api.enum';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ReporteMovimientosService {

  constructor(private httpClient: HttpClient,
    private headerBasicAuthorization:HeaderBasicAuthorizationService) { }

  GetDatosCombos(){
    return this.httpClient.get(`${environment.api.WS_LG.url}/reporteMovimientos/LG_GetDatosCombosReporteMovimientos`, {
             headers: this.headerBasicAuthorization.get(ApiEnum.WS_LG)
      }).pipe(map(data => data));
  }
  GenerarReporteMovimientos(data) {
    return this.httpClient.post(`${environment.api.WS_LG.url}/reporteMovimientos/LG_GenerarReporteMovimientos`, data, {
        headers: this.headerBasicAuthorization.get(ApiEnum.WS_LG)
    }).pipe( map( data => data ));
  }

}
