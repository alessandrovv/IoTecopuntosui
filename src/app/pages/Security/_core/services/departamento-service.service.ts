import { Injectable, OnDestroy, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { exhaustMap, map, catchError } from 'rxjs/operators';
import { ApiEnum } from 'src/app/Shared/enums/api.enum';
import { HeaderBasicAuthorizationService } from 'src/app/Shared/services/header-basic-authorization.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DepartamentoServiceService {

  constructor(
    private httpClient: HttpClient,
        private headerBasicAuthorization: HeaderBasicAuthorizationService,
  ) { }


    GetListarDepartamentos(Pais) {
        return this.httpClient.get(`${environment.api.WS_IT.url}/Ubigeo/SC_GetDepartamentos?Pais=${Pais}`,{
            headers: this.headerBasicAuthorization.get(ApiEnum.WS_IT)
        }).pipe( map( data => data ));
    }

    EnableDisableDepartamento(Departamento: number, Estado: any) {
        return this.httpClient.post(`${environment.api.WS_IT.url}/Ubigeo/SC_EnableDisableDepartamento`,
        { IdDepartamento: Departamento, Activo: Estado },
        { headers: this.headerBasicAuthorization.get(ApiEnum.WS_IT) }
        ).pipe( map( data => data ));
    }

    DeleteDepartamento(Departamento:number) {
        return this.httpClient.post(`${environment.api.WS_IT.url}/Ubigeo/SC_DeleteDepartamento`,
        {IdDepartamento: Departamento},
        { headers: this.headerBasicAuthorization.get(ApiEnum.WS_IT) }
        ).pipe( map( data => data ));
    }

    SaveUpdateDepartamento(data: any) {
        return this.httpClient.post(`${environment.api.WS_IT.url}/Ubigeo/SC_SaveUpdateDepartamento`,
        data,
        { headers: this.headerBasicAuthorization.get(ApiEnum.WS_IT) }
        ).pipe( map( data => data ));
    }



}
