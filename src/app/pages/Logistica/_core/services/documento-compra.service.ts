import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { exhaustMap, map, catchError } from "rxjs/operators";
import { environment } from "../../../../../environments/environment";
import { HeaderBasicAuthorizationService } from "../../../../Shared/services/header-basic-authorization.service";
import { ApiEnum } from "../../../../Shared/enums/api.enum";

@Injectable({
  providedIn: "root",
})
export class DocumentoCompraService {
  constructor(
    private httpClient: HttpClient,
    private headerBasicAuthorization: HeaderBasicAuthorizationService
  ) {}

  GetIgv(anio) {
    return this.httpClient.get(`${environment.api.WS_LG.url}/OrdenCompra/LG_GetIgv?anio=${anio}`,{
      headers: this.headerBasicAuthorization.get(ApiEnum.WS_LG)
    }).pipe( map( data => data ));
  }

  GetDocumentosCompra(fechaInicio, fechaFin, estado, proveedor) {
    return this.httpClient.get(`${environment.api.WS_LG.url}/DocumentoCompra/LG_GetDocumentosCompra?FechaInicio=${fechaInicio}&FechaFin=${fechaFin}&Estado=${estado}&Proveedor=${proveedor}`,{
      headers: this.headerBasicAuthorization.get(ApiEnum.WS_LG)
    }).pipe( map( data => data ));
  }

  GetEstadoDocumentoCompra() {
    return this.httpClient.get(`${environment.api.WS_LG.url}/DocumentoCompra/LG_GetEstadoDocumentoCompra`,{
      headers: this.headerBasicAuthorization.get(ApiEnum.WS_LG)
    }).pipe( map( data => data ));
  }

  OrdenCompraToDocumentoCompra() {
    return this.httpClient.get(`${environment.api.WS_LG.url}/DocumentoCompra/LG_OrdenCompraToDocumentoCompra`,{
      headers: this.headerBasicAuthorization.get(ApiEnum.WS_LG)
    }).pipe( map( data => data ));
  }

  SaveUpdateDocumentoCompra(datos) {
    return this.httpClient.post(`${environment.api.WS_LG.url}/DocumentoCompra/LG_SaveUpdateDocumentoCompra`, datos, {
      headers:this.headerBasicAuthorization.get(ApiEnum.WS_LG)
    }).pipe( map(data => data ) );
  }

  GetDatosDocumentoCompra(DocumentoCompra) {
    return this.httpClient.get(`${environment.api.WS_LG.url}/DocumentoCompra/LG_GetDatosDocumentoCompra?DocumentoCompra=${DocumentoCompra}`,{
      headers: this.headerBasicAuthorization.get(ApiEnum.WS_LG)
    }).pipe( map( data => data ));
  }

  GetUltimasComprasDC(proveedor, documentoCompra) {
    return this.httpClient.get(`${environment.api.WS_LG.url}/DocumentoCompra/LG_GetUltimasComprasDC?Proveedor=${proveedor}&DocumentoCompra=${documentoCompra}`,{
      headers: this.headerBasicAuthorization.get(ApiEnum.WS_LG)
    }).pipe( map( data => data ));
  }

  CambiarEstadoDocumentoCompra(DocumentoCompra, Estado) {
    return this.httpClient.get(`${environment.api.WS_LG.url}/DocumentoCompra/LG_CambiarEstadoDC?DocumentoCompra=${DocumentoCompra}&Estado=${Estado}`,{
      headers: this.headerBasicAuthorization.get(ApiEnum.WS_LG)
    }).pipe( map( data => data ));
  }

  GetOCenDC(idOrdenCompra) {
    return this.httpClient.get(`${environment.api.WS_LG.url}/DocumentoCompra/LG_GetOCenDC?OrdenCompra=${idOrdenCompra}`,{
      headers: this.headerBasicAuthorization.get(ApiEnum.WS_LG)
    }).pipe( map( data => data ));
  }

  GetMateriales(categoria, subcategoria, clase, establecimiento) {
    return this.httpClient.get(`${environment.api.SalesApi.url}/PedidoVenta/SL_GetMateriales?Categoria=${categoria}&Subcategoria=${subcategoria}&Clase=${clase}&Establecimiento=${establecimiento}`, {
        headers: this.headerBasicAuthorization.get(ApiEnum.SalesApi),
      }).pipe(map((data) => data));
  }
}
