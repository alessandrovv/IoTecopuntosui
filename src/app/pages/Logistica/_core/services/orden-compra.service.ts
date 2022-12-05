import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { exhaustMap, map, catchError } from "rxjs/operators";
import { environment } from "../../../../../environments/environment";
import { HeaderBasicAuthorizationService } from "../../../../Shared/services/header-basic-authorization.service";
import { ApiEnum } from "../../../../Shared/enums/api.enum";

@Injectable({
  providedIn: "root",
})
export class OrdenCompraService {
  constructor(
    private httpClient: HttpClient,
    private headerBasicAuthorization: HeaderBasicAuthorizationService
  ) {}

  GetIgv(anio) {
    return this.httpClient.get(`${environment.api.WS_LG.url}/OrdenCompra/LG_GetIgv?anio=${anio}`,{
        headers: this.headerBasicAuthorization.get(ApiEnum.WS_LG)
    }).pipe( map( data => data ));
  }

  SaveUpdateOrdenCompra(data) {
    return this.httpClient.post(`${environment.api.WS_LG.url}/OrdenCompra/LG_SaveUpdateOrdenCompra`,data, {
      headers:this.headerBasicAuthorization.get(ApiEnum.WS_LG)
    }).pipe( map( data => data ) );
  }

  SaveUpdateTasaCambio(data) {
    return this.httpClient.post(`${environment.api.WS_LG.url}/OrdenCompra/LG_SaveUpdateTasaCambio`,data, {
      headers:this.headerBasicAuthorization.get(ApiEnum.WS_LG)
    }).pipe( map( data => data ) );
  }

  GetDatosOrdenCompra(OrdenCompra) {
    return this.httpClient.get(`${environment.api.WS_LG.url}/OrdenCompra/LG_GetDatosOrdenCompra?OrdenCompra=${OrdenCompra}`,{
      headers:this.headerBasicAuthorization.get(ApiEnum.WS_LG)
    }).pipe( map( data => data ) );
  }

  GetEstadoOrdenCompra() {
    return this.httpClient.get(`${environment.api.WS_LG.url}/OrdenCompra/LG_GetEstadoOrdenCompra`,{
        headers: this.headerBasicAuthorization.get(ApiEnum.WS_LG)
    }).pipe( map( data => data ));
  }

  GetTipoDocumentos() {
    return this.httpClient.get(`${environment.api.WS_LG.url}/OrdenCompra/LG_GetTipoDocumentos`, {
      headers: this.headerBasicAuthorization.get(ApiEnum.WS_LG)
    }).pipe( map( data => data));
  }

  GetEstablecimientos() {
    return this.httpClient.get(`${environment.api.WS_LG.url}/OrdenCompra/LG_GetEstablecimientos`, {
      headers: this.headerBasicAuthorization.get(ApiEnum.WS_LG)
    }).pipe( map( data => data ) );
  }

  GetFormasPago() {
    return this.httpClient.get(`${environment.api.WS_LG.url}/OrdenCompra/LG_GetFormasPago`, {
      headers: this.headerBasicAuthorization.get(ApiEnum.WS_LG)
    }).pipe( map( data => data ) );
  }

  GetTasaCambio(idTipoMoneda, fecha) {
    return this.httpClient.get(`${environment.api.WS_LG.url}/OrdenCompra/LG_GetTasaCambio?MonedaDestino=${idTipoMoneda}&fecha=${fecha}`, {
      headers: this.headerBasicAuthorization.get(ApiEnum.WS_LG)
    }).pipe( map( data => data ) );
  }

  GetListaOrdenCompra(fechaInicio, fechaFin, estado, proveedor) {
    return this.httpClient.get(`${environment.api.WS_LG.url}/OrdenCompra/LG_GetListaOrdenCompra?FechaInicio=${fechaInicio}&FechaFin=${fechaFin}&Estado=${estado}&Proveedor=${proveedor}`, {
      headers: this.headerBasicAuthorization.get(ApiEnum.WS_LG)
    }).pipe( map( data => data ) );
  }

  GetUltimasCompras(Proveedor, OrdenCompra) {
    return this.httpClient.get(`${environment.api.WS_LG.url}/OrdenCompra/LG_GetUltimasComprasOrdenCompra?Proveedor=${Proveedor}&OrdenCompra=${OrdenCompra}`,{
      headers: this.headerBasicAuthorization.get(ApiEnum.WS_LG)
    }).pipe( map( data => data ) );
  }

  CambiarEstadoOrdenCompra(OrdenCompra, Estado) {
    return this.httpClient.get(`${environment.api.WS_LG.url}/OrdenCompra/LG_CambiarEstadoOrdenCompra?OrdenCompra=${OrdenCompra}&Estado=${Estado}`,{
      headers: this.headerBasicAuthorization.get(ApiEnum.WS_LG)
    }).pipe( map( data => data ) );
  }

  AnularOrdenCompra(OrdenCompra) {
    return this.httpClient.get(`${environment.api.WS_LG.url}/OrdenCompra/LG_AnularOrdenCompra?OrdenCompra=${OrdenCompra}`,{
      headers: this.headerBasicAuthorization.get(ApiEnum.WS_LG)
    }).pipe( map( data => data ) );
  }

  CerrarOrdenCompra(OrdenCompra) {
    return this.httpClient.get(`${environment.api.WS_LG.url}/OrdenCompra/LG_CerrarOrdenCompra?OrdenCompra=${OrdenCompra}`,{
      headers: this.headerBasicAuthorization.get(ApiEnum.WS_LG)
    }).pipe( map( data => data ) );
  }

  GetMateriales(categoria, subcategoria, clase, establecimiento) {
    return this.httpClient.get(`${environment.api.WS_LG.url}/OrdenCompra/LG_GetMateriales?Categoria=${categoria}&Subcategoria=${subcategoria}&Clase=${clase}&Establecimiento=${establecimiento}`, {
        headers: this.headerBasicAuthorization.get(ApiEnum.WS_LG),
      }).pipe(map((data) => data));
  }
}
