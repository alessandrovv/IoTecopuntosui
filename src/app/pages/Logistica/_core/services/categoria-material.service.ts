import { CategoriaMaterial } from './models/CategoriaMaterial.interface';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, forkJoin, Observable, of } from 'rxjs';
import { exhaustMap, map, catchError } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
import { HeaderBasicAuthorizationService } from '../../../../Shared/services/header-basic-authorization.service';
import { ApiEnum } from '../../../../Shared/enums/api.enum';

@Injectable({
  providedIn: 'root'
})
export class CategoriaMaterialService {

  constructor(
    private httpClient: HttpClient,
		private headerBasicAuthorization: HeaderBasicAuthorizationService,
  ) { }

  GetCategoriaMaterial(Activo) {
		return this.httpClient.get(`${environment.api.WS_LG.url}/CategoriaMaterial/LG_GetCategoriasMaterial?prmintActivo=${Activo}`, {
			headers: this.headerBasicAuthorization.get(ApiEnum.WS_LG)
		}).pipe(map(data => data));
	}
  SaveUpdateCategoriaMaterial(data) {
    return this.httpClient.post(`${environment.api.WS_LG.url}/CategoriaMaterial/LG_SaveUpdateCategoriasMaterial`, data, {
        headers: this.headerBasicAuthorization.get(ApiEnum.WS_LG)
    }).pipe( map( data => data ));
  }
  EnableDisableCategoriaMaterial(categoriaMaterial: number, Estado: any) {
    return this.httpClient.post(`${environment.api.WS_LG.url}/CategoriaMaterial/LG_EnableDisableCategoriaMaterial`,
      { idCategoriaMaterial: categoriaMaterial, Activo: Estado },
      { headers: this.headerBasicAuthorization.get(ApiEnum.WS_LG) }
      ).pipe( map( data => data ));

  }
  DeleteCategoriaMaterial(CategoriaMaterial:number) {
    return this.httpClient.post(`${environment.api.WS_LG.url}/CategoriaMaterial/LG_DeleteCategoriaMaterial`,
    {idCategoriaMaterial: CategoriaMaterial},
    { headers: this.headerBasicAuthorization.get(ApiEnum.WS_LG) }
    ).pipe( map( data => data ));
}

}
