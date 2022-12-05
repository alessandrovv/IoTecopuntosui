import { FormGroup } from '@angular/forms';
import { Injectable, OnDestroy, Inject, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { exhaustMap, map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ApiEnum } from 'src/app/Shared/enums/api.enum';
import { HeaderBasicAuthorizationService } from 'src/app/Shared/services/header-basic-authorization.service';
import { environment } from 'src/environments/environment';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TipoVehiculoService {


  constructor(
    private httpClient: HttpClient,
    private headerBasicAuthorization: HeaderBasicAuthorizationService,
  ) { }

  GetTipoVehiculo(Activo) {
    return this.httpClient.get(`${environment.api.WS_OP.url}/TipoVehiculo/OP_GetTipoVehiculo?prmintActivo=${Activo}`,{
                headers: this.headerBasicAuthorization.get(ApiEnum.WS_OP)
        }).pipe( map( data => data ));
  }
  GetTipoDato() {
    return this.httpClient.get(`${environment.api.WS_OP.url}/TipoVehiculo/OP_GetTipoDato`,{
                headers: this.headerBasicAuthorization.get(ApiEnum.WS_OP)
        }).pipe( map( data => data ));
  }
  EnableDisableTipoVehiculo(tipoVehiculo: number, Estado: any) {
    return this.httpClient.post(`${environment.api.WS_OP.url}/TipoVehiculo/OP_EnableDisableTipoVehiculo`,
      { idTipoVehiculo: tipoVehiculo, Activo: Estado },
      { headers: this.headerBasicAuthorization.get(ApiEnum.WS_OP) }
      ).pipe( map( data => data ));

  }
  GetCaracteristicaVehiculo() {
    return this.httpClient.get(`${environment.api.WS_OP.url}/TipoVehiculo/OP_GetCaracteristicasVehiculo`,{
                headers: this.headerBasicAuthorization.get(ApiEnum.WS_OP)
        }).pipe( map( data => data ));
  }
  SaveUpdateTipoVehiculo(data){
    return this.httpClient.post(`${environment.api.WS_OP.url}/TipoVehiculo/OP_SaveUpdateTipoVehiculo`, data, {
      headers: this.headerBasicAuthorization.get(ApiEnum.WS_OP)
  }).pipe( map( data => data ));
  }
  GetTipoVehiculoDetalleById(idTipoVehiculo){
    return this.httpClient.get(`${environment.api.WS_OP.url}/TipoVehiculo/OP_GetTipoVehiculoDetalleById?IdTipoVehiculo=${idTipoVehiculo}`,{
      headers: this.headerBasicAuthorization.get(ApiEnum.WS_OP)
    }).pipe( map( data => data ));
  }
  DeleteTipoVehiculo(id:number) {
    return this.httpClient.post(`${environment.api.WS_OP.url}/TipoVehiculo/OP_DeleteTipoVehiculo`,
    {idTipoVehiculo: id},
    { headers: this.headerBasicAuthorization.get(ApiEnum.WS_OP) }
    ).pipe( map( data => data ));
  }

}
