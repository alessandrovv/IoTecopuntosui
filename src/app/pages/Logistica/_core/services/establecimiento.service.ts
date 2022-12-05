import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiEnum } from 'src/app/Shared/enums/api.enum';
import { HeaderBasicAuthorizationService } from 'src/app/Shared/services/header-basic-authorization.service';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class EstablecimientoService {

    constructor(
        private httpClient: HttpClient,
        private headerBasicAuthorization: HeaderBasicAuthorizationService,
    ) { }

    getTiposEstablecimiento() {
        return this.httpClient.get(`${environment.api.WS_LG.url}/Establecimiento/LG_GetTipoEstablecimientos`, {
            headers: this.headerBasicAuthorization.get(ApiEnum.WS_LG)
        }).pipe(map(data => data));
    }

    getEstablecimientos(idTipoEstablecimiento, idPais,
        idDepartamento, idProvincia, idDistrito) {
        return this.httpClient.get(`${environment.api.WS_LG.url}/Establecimiento/LG_GetEstablecimientos?idTipoEstablecimiento=${idTipoEstablecimiento}
        &idPais=${idPais}&idDepartamento=${idDepartamento}
        &idProvincia=${idProvincia}&idDistrito=${idDistrito}
        `, {
            headers: this.headerBasicAuthorization.get(ApiEnum.WS_LG)
        }).pipe(map(data => data));
    }

    SaveUpdateEstablecimiento(data) {
        return this.httpClient.post(`${environment.api.WS_LG.url}/Establecimiento/LG_SaveUpdateEstablecimiento`, data, {
            headers: this.headerBasicAuthorization.get(ApiEnum.WS_LG)
        }).pipe(map(data => data));
    }

    EnableDisableEstablecimiento(idEstablecimiento: number, estado: any) {
        return this.httpClient.post(`${environment.api.WS_LG.url}/Establecimiento/LG_EnableDisableEstablecimiento`,
            { idEstablecimiento: idEstablecimiento, estado: estado },
            { headers: this.headerBasicAuthorization.get(ApiEnum.WS_LG) }
        ).pipe(map(data => data));
    }

    DeleteEstablecimiento(idEstablecimiento: number) {
        return this.httpClient.post(`${environment.api.WS_LG.url}/Establecimiento/LG_DeleteEstablecimiento`,
        { idEstablecimiento: idEstablecimiento}, {
          headers: this.headerBasicAuthorization.get(ApiEnum.WS_LG)
        }).pipe(map(data => data));
      }
}
