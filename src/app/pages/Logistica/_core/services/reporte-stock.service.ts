import { HeaderBasicAuthorizationService } from './../../../../Shared/services/header-basic-authorization.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiEnum } from 'src/app/Shared/enums/api.enum';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ReporteStockService {

  constructor(private httpClient: HttpClient,
    private headerBasicAuthorization:HeaderBasicAuthorizationService) { }

    GetEstablecimientos() {
      return this.httpClient.get(`${environment.api.WS_LG.url}/reporteStock/LG_GetEstablecimiento`, {
        headers: this.headerBasicAuthorization.get(ApiEnum.WS_LG)
      }).pipe(map(data => data));
    }
    GenerarReporteStock(data) {
      return this.httpClient.post(`${environment.api.WS_LG.url}/reporteStock/LG_GenerarReporteStock`, data, {
          headers: this.headerBasicAuthorization.get(ApiEnum.WS_LG)
      }).pipe( map( data => data ));
    }
}
