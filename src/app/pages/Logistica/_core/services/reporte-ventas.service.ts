import { HeaderBasicAuthorizationService } from './../../../../Shared/services/header-basic-authorization.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiEnum } from 'src/app/Shared/enums/api.enum';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ReporteVentasService {

  constructor(private httpClient: HttpClient,
    private headerBasicAuthorization:HeaderBasicAuthorizationService) { }

    GenerarReporteVentas(data) {
      return this.httpClient.post(`${environment.api.WS_LG.url}/reporteVentas/LG_GenerarReporteVentas`, data, {
          headers: this.headerBasicAuthorization.get(ApiEnum.WS_LG)
      }).pipe( map( data => data ));
    }
}
