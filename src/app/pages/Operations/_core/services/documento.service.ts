import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HeaderBasicAuthorizationService } from 'src/app/Shared/services/header-basic-authorization.service';
import { ApiEnum } from 'src/app/Shared/enums/api.enum';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class DocumentoService {

  constructor(
    private httpClient: HttpClient,
    private headerBasicAuthorization: HeaderBasicAuthorizationService,
  ) { }

  GetTiposDocumentoVehiculo() {
    return this.httpClient.get(`${environment.api.WS_OP.url}/Vehiculo/OP_GetTipoDocumentoVehiculo`, {
      headers: this.headerBasicAuthorization.get(ApiEnum.WS_OP)
    }).pipe(map(data => data));
  }

  GetListarVehiculoDocumentos(idVehiculo){
    return this.httpClient.get(`${environment.api.WS_OP.url}/Vehiculo/OP_GetListarVehiculoDocumentos?prmintIdVehiculo=${idVehiculo}`, {
      headers: this.headerBasicAuthorization.get(ApiEnum.WS_OP)
    }).pipe(map(data => data));
  }
}
