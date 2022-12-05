import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HeaderBasicAuthorizationService } from 'src/app/Shared/services/header-basic-authorization.service';
import { ApiEnum } from 'src/app/Shared/enums/api.enum';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SubcategoriaService {

  constructor(private httpClient: HttpClient,
    private headerBasicAuthorization: HeaderBasicAuthorizationService,
  ) {

  }

  GetSubcategoria(idCategoria) {
    return this.httpClient.get(`${environment.api.WS_LG.url}/SubcategoriaMaterial/LG_GetSubcategoriasMaterial?idCategoria=${idCategoria}`, {
      headers: this.headerBasicAuthorization.get(ApiEnum.WS_LG)
    }).pipe(map(data => data));
  }
  SaveUpdateSubcategoria(data) {
    return this.httpClient.post(`${environment.api.WS_LG.url}/SubcategoriaMaterial/LG_SaveUpdateSubcategoriaMaterial`, data, {
      headers: this.headerBasicAuthorization.get(ApiEnum.WS_LG)
    }).pipe(map(data => data));
  }

  EnableDisableSubcategoria(idSubcategoria: number, estado: any) {
    return this.httpClient.post(`${environment.api.WS_LG.url}/SubcategoriaMaterial/LG_EnableDisableSubcategoriaMaterial`,
      { idSubcategoriaMaterial: idSubcategoria, estado: estado },
      { headers: this.headerBasicAuthorization.get(ApiEnum.WS_LG) }
    ).pipe(map(data => data));
  }
  DeleteSubcategoria(idSubcategoria: number) {
    return this.httpClient.post(`${environment.api.WS_LG.url}/SubcategoriaMaterial/LG_DeleteSubcategoriaMaterial`,
    { idSubcategoriaMaterial: idSubcategoria}, {
      headers: this.headerBasicAuthorization.get(ApiEnum.WS_LG)
    }).pipe(map(data => data));
  }


}
