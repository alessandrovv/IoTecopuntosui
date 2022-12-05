import { Injectable, OnDestroy, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { exhaustMap, map, catchError } from 'rxjs/operators';
import { ApiEnum } from 'src/app/Shared/enums/api.enum';
import { HeaderBasicAuthorizationService } from 'src/app/Shared/services/header-basic-authorization.service';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ProvinciaServiceService {

    constructor(
        private httpClient: HttpClient,
        private headerBasicAuthorization: HeaderBasicAuthorizationService,
    ){}

    GetListarProvincias() {
        return this.httpClient.get(`${environment.api.WS_IT.url}/Ubigeo/SC_GetListarProvincias`,{
                    headers: this.headerBasicAuthorization.get(ApiEnum.WS_IT)
            }).pipe( map( data => data ));
    }

    EnableDisableProvincia(Provincia: number, Estado: any) {
      return this.httpClient.post(`${environment.api.WS_IT.url}/Ubigeo/SC_EnableDisableProvincia`,
        { IdProvincia: Provincia, Activo: Estado },
        { headers: this.headerBasicAuthorization.get(ApiEnum.WS_IT) }
        ).pipe( map( data => data ));
    }

    DeleteProvincia(Provincia:number) {
      return this.httpClient.post(`${environment.api.WS_IT.url}/Ubigeo/SC_DeleteProvincia`,
        {IdProvincia: Provincia},
        { headers: this.headerBasicAuthorization.get(ApiEnum.WS_IT) }
      ).pipe( map( data => data ));
    }

    SaveUpdateProvincia(data: any) {
      return this.httpClient.post(`${environment.api.WS_IT.url}/Ubigeo/SC_SaveUpdateProvincia`,
      data,
      { headers: this.headerBasicAuthorization.get(ApiEnum.WS_IT) }
      ).pipe( map( data => data ));
    }


    


}
