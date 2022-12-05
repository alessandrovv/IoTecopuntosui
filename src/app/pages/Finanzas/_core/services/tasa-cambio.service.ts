import { Injectable, OnDestroy, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { exhaustMap, map, catchError } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
import { HeaderBasicAuthorizationService } from '../../../../Shared/services/header-basic-authorization.service';
import { ApiEnum } from '../../../../Shared/enums/api.enum';

@Injectable({
    providedIn:'root'
})
export class TasaCambioService{
    constructor(
        private httpClient: HttpClient,
        private headerBasicAuthorization: HeaderBasicAuthorizationService,
    ){}

    GetTasasCambio(){
        return this.httpClient.get(`${environment.api.WS_FI.url}/TasaCambio/FI_GetTasasCambio`,{
            headers: this.headerBasicAuthorization.get(ApiEnum.WS_FI)
        }).pipe( map( data => data ));
    }

    SaveUpdateTasaCambio(data){
        return this.httpClient.post(`${environment.api.WS_FI.url}/TasaCambio/FI_SaveUpdateTasaCambio`, data,{
            headers: this.headerBasicAuthorization.get(ApiEnum.WS_FI)
        }).pipe( map( data => data ));
    }

    DeleteDisableTasaCambio(idTasaCambio:number, tipo:number, estado:any){
        return this.httpClient.post(`${environment.api.WS_FI.url}/TasaCambio/FI_DeleteDisableTasaCambio`,
      { IdTasaCambio: idTasaCambio, Tipo: tipo, Activo:estado },
      { headers: this.headerBasicAuthorization.get(ApiEnum.WS_FI) }
      ).pipe( map( data => data ));
    }
}