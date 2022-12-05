import { Injectable, OnDestroy, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { exhaustMap, map, catchError } from 'rxjs/operators';
import { ApiEnum } from 'src/app/Shared/enums/api.enum';
import { HeaderBasicAuthorizationService } from 'src/app/Shared/services/header-basic-authorization.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BancoServiceService {

    constructor(
        private httpClient: HttpClient,
        private headerBasicAuthorization: HeaderBasicAuthorizationService,
    ) { }

    GetBancos() {
        return this.httpClient.get(`${environment.api.WS_FI.url}/Banco/FI_GetBancos`,{
            headers: this.headerBasicAuthorization.get(ApiEnum.WS_FI)
        }).pipe( map( data => data ));
    }

    // GetCuentasBancarias(idBanco:number) {
    //     return this.httpClient.get(`${environment.api.WS_FI.url}/Banco/FI_GetCuentasBancarias`,
    //     {idBanco: idBanco},
    //     { headers: this.headerBasicAuthorization.get(ApiEnum.WS_FI) }
    //     ).pipe( map( data => data ));
    // }

    GetCuentasBancarias(idBanco) {
		return this.httpClient.get(`${environment.api.WS_FI.url}/Banco/FI_GetCuentasBancarias?idBanco=${idBanco}`, {
			headers: this.headerBasicAuthorization.get(ApiEnum.WS_FI)
		}).pipe(map(data => data));
	}

    GetTipoCuenta() {
        return this.httpClient.get(`${environment.api.WS_FI.url}/Banco/FI_GetTipoCuenta`,{
            headers: this.headerBasicAuthorization.get(ApiEnum.WS_FI)
        }).pipe( map( data => data ));
    }
    GetMoneda() {
        return this.httpClient.get(`${environment.api.WS_FI.url}/Banco/FI_GetMoneda`,{
            headers: this.headerBasicAuthorization.get(ApiEnum.WS_FI)
        }).pipe( map( data => data ));
    }

    EnableDisableBanco(idBanco: number, Activo: any) {
        return this.httpClient.post(`${environment.api.WS_FI.url}/Banco/FI_EnableDisableBanco`,
        { idBanco: idBanco, activo: Activo },
        { headers: this.headerBasicAuthorization.get(ApiEnum.WS_FI) }
        ).pipe( map( data => data ));
    }

    DeleteBanco(Banco:number) {
        return this.httpClient.post(`${environment.api.WS_FI.url}/Banco/FI_DeleteBanco`,
        {IdBanco: Banco},
        { headers: this.headerBasicAuthorization.get(ApiEnum.WS_FI) }
        ).pipe( map( data => data ));
    }

    DeleteCuentaBancaria(idCuenta:number) {
        return this.httpClient.post(`${environment.api.WS_FI.url}/Banco/FI_DeleteCuenta`,
        {IdCuenta: idCuenta},
        { headers: this.headerBasicAuthorization.get(ApiEnum.WS_FI) }
        ).pipe( map( data => data ));
    }

    insertUpdateBanco(data) {
		return this.httpClient.post(`${environment.api.WS_FI.url}/Banco/FI_InsertUpdateBanco`, data, {
			headers: this.headerBasicAuthorization.get(ApiEnum.WS_FI)
		}).pipe(map(data => data));
	}



}
