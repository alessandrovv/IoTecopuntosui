import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { exhaustMap, map, catchError } from "rxjs/operators";
import { environment } from "../../../../../environments/environment";
import { HeaderBasicAuthorizationService } from "../../../../Shared/services/header-basic-authorization.service";
import { ApiEnum } from "../../../../Shared/enums/api.enum";

@Injectable({
  providedIn: "root",
})
export class NotaAlmacenService {
  constructor(
    private httpClient: HttpClient,
    private headerBasicAuthorization: HeaderBasicAuthorizationService
  ) {}

  GetNotasAlmacen(fechaInicio, fechaFin, estado, tipoNota) {
    return this.httpClient
      .get(
        `${environment.api.WS_LG.url}/NotaAlmacen/LG_GetNotasAlmacen?FechaInicio=${fechaInicio}&FechaFin=${fechaFin}&Estado=${estado}&TipoNota=${tipoNota}`,
        {
          headers: this.headerBasicAuthorization.get(ApiEnum.WS_LG),
        }
      )
      .pipe(map((data) => data));
  }

  GetEstadoNotaAlmacen() {
    return this.httpClient
      .get(`${environment.api.WS_LG.url}/NotaAlmacen/LG_GetEstadoNotaAlmacen`, {
        headers: this.headerBasicAuthorization.get(ApiEnum.WS_LG),
      })
      .pipe(map((data) => data));
  }

  GetTipoNotas() {
    return this.httpClient
      .get(`${environment.api.WS_LG.url}/NotaAlmacen/LG_GetTipoNotas`, {
        headers: this.headerBasicAuthorization.get(ApiEnum.WS_LG),
      })
      .pipe(map((data) => data));
  }

  GetTipoOperacionesEntrada() {
    return this.httpClient
      .get(
        `${environment.api.WS_LG.url}/NotaAlmacen/LG_GetTipoOperacionesEntrada`,
        {
          headers: this.headerBasicAuthorization.get(ApiEnum.WS_LG),
        }
      )
      .pipe(map((data) => data));
  }

  GetTipoOperacionesSalida() {
    return this.httpClient
      .get(
        `${environment.api.WS_LG.url}/NotaAlmacen/LG_GetTipoOperacionesSalida`,
        {
          headers: this.headerBasicAuthorization.get(ApiEnum.WS_LG),
        }
      )
      .pipe(map((data) => data));
  }

  GetTipoDocumentoEntrada() {
    return this.httpClient
      .get(
        `${environment.api.WS_LG.url}/NotaAlmacen/LG_GetTipoDocumentoEntrada`,
        {
          headers: this.headerBasicAuthorization.get(ApiEnum.WS_LG),
        }
      )
      .pipe(map((data) => data));
  }

  GetTipoDocumentoSalida() {
    return this.httpClient
      .get(
        `${environment.api.WS_LG.url}/NotaAlmacen/LG_GetTipoDocumentoSalida`,
        {
          headers: this.headerBasicAuthorization.get(ApiEnum.WS_LG),
        }
      )
      .pipe(map((data) => data));
  }

  GetOrdenCompraByCorrelativo(correlativo, anio) {
    return this.httpClient
      .get(
        `${environment.api.WS_LG.url}/NotaAlmacen/LG_GetOrdenCompraByCorrelativo?Correlativo=${correlativo}&Anio=${anio}`,
        {
          headers: this.headerBasicAuthorization.get(ApiEnum.WS_LG),
        }
      )
      .pipe(map((data) => data));
  }

  GetPeriodos() {
    return this.httpClient
      .get(`${environment.api.WS_LG.url}/NotaAlmacen/LG_GetPeriodos`, {
        headers: this.headerBasicAuthorization.get(ApiEnum.WS_LG),
      })
      .pipe(map((data) => data));
  }

  SaveUpdateNotaAlmacen(datos) {
    return this.httpClient
      .post(
        `${environment.api.WS_LG.url}/NotaAlmacen/LG_SaveUpdateNotaAlmacen`,
        datos,
        {
          headers: this.headerBasicAuthorization.get(ApiEnum.WS_LG),
        }
      )
      .pipe(map((data) => data));
  }

  GetMateriales(categoria, subcategoria, clase, establecimiento) {
    return this.httpClient
      .get(
        `${environment.api.WS_LG.url}/NotaAlmacen/LG_GetMateriales?Categoria=${categoria}&Subcategoria=${subcategoria}&Clase=${clase}&Establecimiento=${establecimiento}`,
        {
          headers: this.headerBasicAuthorization.get(ApiEnum.WS_LG),
        }
      )
      .pipe(map((data) => data));
  }

  AnularNotaEntrada(idNotaAlmacen) {
    return this.httpClient
      .get(
        `${environment.api.WS_LG.url}/NotaAlmacen/LG_AnularNotaAlmacen?NotaAlmacen=${idNotaAlmacen}`,
        {
          headers: this.headerBasicAuthorization.get(ApiEnum.WS_LG),
        }
      )
      .pipe(map((data) => data));
  }

  GetDatosNotaAlmacen(idNotaAlmacen) {
    return this.httpClient
      .get(
        `${environment.api.WS_LG.url}/NotaAlmacen/LG_GetDatosNotaAlmacen?NotaAlmacen=${idNotaAlmacen}`,
        {
          headers: this.headerBasicAuthorization.get(ApiEnum.WS_LG),
        }
      )
      .pipe(map((data) => data));
  }

  GetOrdenCompra(idOrdenCompra) {
    return this.httpClient
      .get(
        `${environment.api.WS_LG.url}/NotaAlmacen/LG_GetOrdenCompra?OrdenCompra=${idOrdenCompra}`,
        {
          headers: this.headerBasicAuthorization.get(ApiEnum.WS_LG),
        }
      )
      .pipe(map((data) => data));
  }

  GetPVByCorrelativo(correlativo, anio, establecimiento) {
    return this.httpClient
      .get(
        `${environment.api.WS_LG.url}/NotaAlmacen/LG_GetPVByCorrelativo?Correlativo=${correlativo}&Anio=${anio}&Establecimiento=${establecimiento}`,
        {
          headers: this.headerBasicAuthorization.get(ApiEnum.WS_LG),
        }
      )
      .pipe(map((data) => data));
  }

  GetPVDetalleByCorrelativo(pedidoVenta, establecimiento) {
    return this.httpClient
      .get(
        `${environment.api.WS_LG.url}/NotaAlmacen/LG_GetPVDetalleByCorrelativo?PedidoVenta=${pedidoVenta}&Establecimiento=${establecimiento}`,
        {
          headers: this.headerBasicAuthorization.get(ApiEnum.WS_LG),
        }
      )
      .pipe(map((data) => data));
  }
}
