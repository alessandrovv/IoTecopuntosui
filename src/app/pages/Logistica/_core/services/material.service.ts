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
export class MaterialService {

  constructor(
    private httpClient: HttpClient,
		private headerBasicAuthorization: HeaderBasicAuthorizationService,
  ) { }

  SaveUpdateMaterial(data){
    return this.httpClient.post(`${environment.api.WS_LG.url}/Material/LG_SaveUpdateMaterial`,data,{
      headers:this.headerBasicAuthorization.get(ApiEnum.WS_LG)
    }).pipe(map(data=>data));
  }

  DeleteDisabledMaterial(idMaterial,Tipo,Estado){
    return this.httpClient.post(`${environment.api.WS_LG.url}/Material/LG_DeleteDisabledMaterial`,{idMaterial,Tipo,Estado},{
      headers:this.headerBasicAuthorization.get(ApiEnum.WS_LG)
    }).pipe(map(data=>data));
  }

  GetDataMaterial(idMaterial){
    return this.httpClient.get(`${environment.api.WS_LG.url}/Material/LG_GetMaterial?idMaterial=${idMaterial}`,{
      headers:this.headerBasicAuthorization.get(ApiEnum.WS_LG)
    }).pipe(map(data=>data));
  }

  GetTiposExistencias(){
    return this.httpClient.get(`${environment.api.WS_LG.url}/Material/LG_GetTiposExistencias`,{
      headers:this.headerBasicAuthorization.get(ApiEnum.WS_LG)
    }).pipe(map(data=>data));
  }

  GetUnidadesMedida(){
    return this.httpClient.get(`${environment.api.WS_LG.url}/Material/LG_GetUnidadesMedida`,{
      headers:this.headerBasicAuthorization.get(ApiEnum.WS_LG)
    }).pipe(map(data=>data));
  }

  GetMoneda(){
    return this.httpClient.get(`${environment.api.WS_LG.url}/Material/LG_GetMoneda`,{
      headers:this.headerBasicAuthorization.get(ApiEnum.WS_LG)
    }).pipe(map(data=>data));
  }

  GetCategorias(){
    return this.httpClient.get(`${environment.api.WS_LG.url}/Material/LG_GetCategorias`,{
      headers:this.headerBasicAuthorization.get(ApiEnum.WS_LG)
    }).pipe(map(data=>data));
  }

  GetSubcategorias(categoria){
    return this.httpClient.get(`${environment.api.WS_LG.url}/Material/LG_GetSubcategorias?idCategoria=${categoria}`,{
      headers:this.headerBasicAuthorization.get(ApiEnum.WS_LG)
    }).pipe(map(data=>data));
  }

  GetClases(subcategoria){
    return this.httpClient.get(`${environment.api.WS_LG.url}/Material/LG_GetClases?idSubcategoria=${subcategoria}`,{
      headers:this.headerBasicAuthorization.get(ApiEnum.WS_LG)
    }).pipe(map(data=>data));
  }

  GetMateriales(subcategoria,clase){
    return this.httpClient.get(`${environment.api.WS_LG.url}/Material/LG_GetMaterialesList?idSubcategoria=${subcategoria}&idClase=${clase}`,{
      headers:this.headerBasicAuthorization.get(ApiEnum.WS_LG)
    }).pipe(map(data=>data));
  }
}
