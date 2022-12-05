import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HeaderBasicAuthorizationService } from 'src/app/Shared/services/header-basic-authorization.service';
import { ApiEnum } from 'src/app/Shared/enums/api.enum';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class VehiculoService {

  constructor(
    private httpClient: HttpClient,
    private headerBasicAuthorization: HeaderBasicAuthorizationService,
  ) { }

  GetTipoProcedencia() {
    return this.httpClient.get(`${environment.api.WS_OP.url}/Vehiculo/OP_GetTipoProcedencia`, {
      headers: this.headerBasicAuthorization.get(ApiEnum.WS_OP)
    }).pipe(map(data => data));
  }

  GetProveedoresTransporte(idProveedor) {
    return this.httpClient.get(`${environment.api.WS_OP.url}/Vehiculo/OP_GetProveedoresTransporte?prmintIdProveedor=${idProveedor}`, {
      headers: this.headerBasicAuthorization.get(ApiEnum.WS_OP)
    }).pipe(map(data => data));
  }

  GetTipoVehiculo(activo) {
    return this.httpClient.get(`${environment.api.WS_OP.url}/Vehiculo/OP_GetTipoVehiculo?prmintActivo=${activo}`, {
      headers: this.headerBasicAuthorization.get(ApiEnum.WS_OP)
    }).pipe(map(data => data));
  }

  GetCaracteristicasByTipoVehiculo(IdTipoVehiculo) {
    return this.httpClient.get(`${environment.api.WS_OP.url}/Vehiculo/OP_GetCaracteristicasByTipoVehiculo?prmintIdTipoVehiculo=${IdTipoVehiculo}`, {
      headers: this.headerBasicAuthorization.get(ApiEnum.WS_OP)
    }).pipe(map(data => data));
  }

  GetListarVehiculos(idProcedencia, idProveedor, activo) {
    return this.httpClient.get(`${environment.api.WS_OP.url}/Vehiculo/OP_GetListarVehiculos?prmstrIdProcedencia=${idProcedencia}
    &pmrintIdProveedor=${idProveedor}&prmintActivo=${activo}`, {
      headers: this.headerBasicAuthorization.get(ApiEnum.WS_OP)
    }).pipe(map(data => data));
  }

  GetDatosVehiculo(idVehiculo){
    return this.httpClient.get(`${environment.api.WS_OP.url}/Vehiculo/OP_GetDatosVehiculo?prmintIdVehiculo=${idVehiculo}`, {
      headers: this.headerBasicAuthorization.get(ApiEnum.WS_OP)
    }).pipe(map(data => data));
  }

  GetListarVehiculoDocumentos(idVehiculo){
    return this.httpClient.get(`${environment.api.WS_OP.url}/Vehiculo/OP_GetListarVehiculoDocumentos?prmintIdVehiculo=${idVehiculo}`, {
      headers: this.headerBasicAuthorization.get(ApiEnum.WS_OP)
    }).pipe(map(data => data));
  }

  SaveUpdateVehiculo(datos) {
    return this.httpClient.post(`${environment.api.WS_OP.url}/Vehiculo/OP_SaveUpdateVehiculo`, datos, {
      headers: this.headerBasicAuthorization.get(ApiEnum.WS_OP)
    }).pipe(map(data => data));
  }

  DeleteVehiculo(idVehiculo){
    return this.httpClient.post(`${environment.api.WS_OP.url}/Vehiculo/OP_DeleteVehiculo`, 
    { idVehiculo: idVehiculo}, {
      headers: this.headerBasicAuthorization.get(ApiEnum.WS_OP)
    }).pipe(map(data => data));
  }

  EnableDisableVehiculo(idVehiculo, estado){
    return this.httpClient.post(`${environment.api.WS_OP.url}/Vehiculo/OP_EnableDisableVehiculo`, 
    { idVehiculo: idVehiculo, estado: estado}, {
      headers: this.headerBasicAuthorization.get(ApiEnum.WS_OP)
    }).pipe(map(data => data));
  }
  
}
