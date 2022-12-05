import { HeaderBasicAuthorizationService } from './../../../../Shared/services/header-basic-authorization.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiEnum } from 'src/app/Shared/enums/api.enum';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ReporteComprasService {

  constructor( private httpClient: HttpClient,
    private headerBasicAuthorization:HeaderBasicAuthorizationService) { }

    GetPaises(Activo) {
      return this.httpClient.get(`${environment.api.WS_LG.url}/reporteCompras/SC_GetPaises?prmintActivo=${Activo}`, {
        headers: this.headerBasicAuthorization.get(ApiEnum.WS_LG)
      }).pipe(map(data => data));
    }
     GetDepartamentos(idPais){
      return this.httpClient.get(`${environment.api.WS_LG.url}/reporteCompras/SC_GetDepartamentos?prmintIdPais=${idPais}`, {
        headers: this.headerBasicAuthorization.get(ApiEnum.WS_LG)
      }).pipe(map(data => data));
    }
    GetCategoriaProveedores(Activo){
      return this.httpClient.get(`${environment.api.WS_LG.url}/reporteCompras/SC_GetCategoriaProveedor?prmintActivo=${Activo}`, {
        headers: this.headerBasicAuthorization.get(ApiEnum.WS_LG)
      }).pipe(map(data => data));
    }
    GenerarReporteCompra(data) {
      return this.httpClient.post(`${environment.api.WS_LG.url}/reporteCompras/LG_GenerarReporteCompra`, data, {
          headers: this.headerBasicAuthorization.get(ApiEnum.WS_LG)
      }).pipe( map( data => data ));
    }
}
