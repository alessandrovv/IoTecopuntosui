import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HeaderBasicAuthorizationService } from 'src/app/Shared/services/header-basic-authorization.service';
import { ApiEnum } from 'src/app/Shared/enums/api.enum';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NeumaticoService {

  constructor(
    private httpClient: HttpClient,
    private headerBasicAuthorization: HeaderBasicAuthorizationService,
  ) { }

  GetMarcasNeumatico() {
    return this.httpClient.get(`${environment.api.WS_OP.url}/Vehiculo/OP_GetMarcasNeumatico`, {
      headers: this.headerBasicAuthorization.get(ApiEnum.WS_OP)
    }).pipe(map(data => data));
  }

  GetTiposNeumatico() {
    return this.httpClient.get(`${environment.api.WS_OP.url}/Vehiculo/OP_GetTiposNeumatico`, {
      headers: this.headerBasicAuthorization.get(ApiEnum.WS_OP)
    }).pipe(map(data => data));
  }


  GetPosicionNeumatico() {
    return this.httpClient.get(`${environment.api.WS_OP.url}/Vehiculo/OP_GetPosicionNeumatico`, {
      headers: this.headerBasicAuthorization.get(ApiEnum.WS_OP)
    }).pipe(map(data => data));
  }

 
  GetListarVehiculoNeumaticos(idVehiculo){
    return this.httpClient.get(`${environment.api.WS_OP.url}/Vehiculo/OP_GetListarVehiculoNeumaticos?prmintIdVehiculo=${idVehiculo}`, {
      headers: this.headerBasicAuthorization.get(ApiEnum.WS_OP)
    }).pipe(map(data => data));
  }
}
