import { Injectable, OnDestroy, Inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { exhaustMap, map, catchError } from "rxjs/operators";
import { Router } from "@angular/router";
import { ApiEnum } from "src/app/Shared/enums/api.enum";
import { HeaderBasicAuthorizationService } from "src/app/Shared/services/header-basic-authorization.service";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class PedidoVentaService {
  constructor(
    private httpClient: HttpClient,
    private headerBasicAuthorization: HeaderBasicAuthorizationService
  ) { }

  GetEstadosPedidoVenta() {
    return this.httpClient.get(`${environment.api.SalesApi.url}/PedidoVenta/SL_GetEstadosPedidoVenta`, {
      headers: this.headerBasicAuthorization.get(ApiEnum.SalesApi)
    }).pipe(map(data => data));
  }

  GetPedidosVenta(desde, hasta, estado, cliente, trabajador) {
    return this.httpClient.get(`${environment.api.SalesApi.url}/PedidoVenta/SL_GetPedidosVenta?Desde=${desde}&Hasta=${hasta}&Estado=${estado}&Cliente=${cliente}&Trabajador=${trabajador}`, {
      headers: this.headerBasicAuthorization.get(ApiEnum.SalesApi)
    }).pipe(map(data => data));
  }

  GetEstadosPedidoVentaDespacho() {
    return this.httpClient.get(`${environment.api.SalesApi.url}/PedidoVenta/SL_GetEstadosPedidoVentaDespacho`, {
      headers: this.headerBasicAuthorization.get(ApiEnum.SalesApi)
    }).pipe(map(data => data));
  }


  GetPedidosVentaDespacho(desde, hasta, establecimiento, estado) {
    return this.httpClient.get(`${environment.api.SalesApi.url}/PedidoVenta/SL_GetPedidosVentaDespacho?Desde=${desde}&Hasta=${hasta}
    &Establecimiento=${establecimiento}&Estado=${estado}`, {
      headers: this.headerBasicAuthorization.get(ApiEnum.SalesApi)
    }).pipe(map(data => data));
  }

  UpdatePedidoVentaDespacho(id) {
    return this.httpClient.post(`${environment.api.SalesApi.url}/PedidoVenta/SL_UpdatePedidoVentaDespacho`, {
      idPedidoVenta: id
    }, {
      headers: this.headerBasicAuthorization.get(ApiEnum.SalesApi)
    }).pipe(map(data => data));
  }

  SaveUpdateNotaSalida(data) {
    return this.httpClient.post(`${environment.api.SalesApi.url}/PedidoVenta/SL_SaveUpdateNotaSalida`, data, {
      headers: this.headerBasicAuthorization.get(ApiEnum.SalesApi)
    }).pipe(map(data => data));
  }

  DeletePedidoVentaDespacho(id) {
    return this.httpClient.post(`${environment.api.SalesApi.url}/PedidoVenta/SL_DeletePedidoVentaDespacho`, {
      idPedidoVenta: id
    }, {
      headers: this.headerBasicAuthorization.get(ApiEnum.SalesApi)
    }).pipe(map(data => data));
  }

  GetTasaCambio(idTipoMoneda, fecha) {
    return this.httpClient.get(`${environment.api.SalesApi.url}/PedidoVenta/SL_GetTasaCambio?MonedaDestino=${idTipoMoneda}&fecha=${fecha}`, {
      headers: this.headerBasicAuthorization.get(ApiEnum.SalesApi)
    }).pipe(map(data => data));
  }

  GetIgv(anio) {
    return this.httpClient.get(`${environment.api.SalesApi.url}/PedidoVenta/SL_GetIgv?anio=${anio}`, {
      headers: this.headerBasicAuthorization.get(ApiEnum.SalesApi)
    }).pipe(map(data => data));
  }

  GetClientes() {
    return this.httpClient.get(`${environment.api.SalesApi.url}/PedidoVenta/SL_GetClientes`, {
      headers: this.headerBasicAuthorization.get(ApiEnum.SalesApi)
    }).pipe(map(data => data));
  }

  GetTipoPrecios() {
    return this.httpClient.get(`${environment.api.SalesApi.url}/PedidoVenta/SL_GetTipoPrecio`, {
      headers: this.headerBasicAuthorization.get(ApiEnum.SalesApi)
    }).pipe(map(data => data));
  }

  GetSucursales(cliente) {
    return this.httpClient.get(`${environment.api.SalesApi.url}/PedidoVenta/SL_GetSucursales?Cliente=${cliente}`, {
      headers: this.headerBasicAuthorization.get(ApiEnum.SalesApi)
    }).pipe(map(data => data));
  }

  GetTipoDocumentos() {
    return this.httpClient.get(`${environment.api.SalesApi.url}/PedidoVenta/SL_GetTipoDocumentos`, {
      headers: this.headerBasicAuthorization.get(ApiEnum.SalesApi)
    }).pipe(map(data => data));
  }

  GetFormasPago() {
    return this.httpClient.get(`${environment.api.SalesApi.url}/PedidoVenta/SL_GetFormasPago`, {
      headers: this.headerBasicAuthorization.get(ApiEnum.SalesApi)
    }).pipe(map(data => data));
  }

  GetEstablecimientos() {
    return this.httpClient.get(`${environment.api.SalesApi.url}/PedidoVenta/SL_GetEstablecimientos`, {
      headers: this.headerBasicAuthorization.get(ApiEnum.SalesApi)
    }).pipe(map(data => data));
  }

  GetMateriales(categoria, subcategoria, clase, establecimiento) {
    return this.httpClient.get(`${environment.api.SalesApi.url}/PedidoVenta/SL_GetMateriales?Categoria=${categoria}&Subcategoria=${subcategoria}&Clase=${clase}&Establecimiento=${establecimiento}`, {
      headers: this.headerBasicAuthorization.get(ApiEnum.SalesApi),
    }).pipe(map((data) => data));
  }

  SaveUpdatePedidoVenta(data) {
    return this.httpClient.post(`${environment.api.SalesApi.url}/PedidoVenta/SL_SaveUpdatePedidoVenta`, data, {
      headers: this.headerBasicAuthorization.get(ApiEnum.SalesApi)
    }).pipe(map(data => data));
  }

  GetPedidoVentaById(pedidoVenta) {
    return this.httpClient.get(`${environment.api.SalesApi.url}/PedidoVenta/SL_GetPedidoVentaById?PedidoVenta=${pedidoVenta}`, {
      headers: this.headerBasicAuthorization.get(ApiEnum.SalesApi),
    }).pipe(map((data) => data));
  }

  GetDocNotasPedidoVenta(pedidoVenta) {
    return this.httpClient.get(`${environment.api.SalesApi.url}/PedidoVenta/SL_GetDocNotasPedidoVenta?PedidoVenta=${pedidoVenta}`, {
      headers: this.headerBasicAuthorization.get(ApiEnum.SalesApi),
    }).pipe(map((data) => data));
  }

  AnularPedidoVenta(pedidoVenta) {
    return this.httpClient.get(`${environment.api.SalesApi.url}/PedidoVenta/SL_AnularPedidoVenta?PedidoVenta=${pedidoVenta}`, {
      headers: this.headerBasicAuthorization.get(ApiEnum.SalesApi),
    }).pipe(map((data) => data));
  }

  CerrarPedidoVenta(pedidoVenta) {
    return this.httpClient.get(`${environment.api.SalesApi.url}/PedidoVenta/SL_CerrarPedidoVenta?PedidoVenta=${pedidoVenta}`, {
      headers: this.headerBasicAuthorization.get(ApiEnum.SalesApi),
    }).pipe(map((data) => data));
  }

  GetDataCliente(cliente) {
    return this.httpClient.get(`${environment.api.SalesApi.url}/PedidoVenta/SL_GetDataCliente?Cliente=${cliente}`, {
      headers: this.headerBasicAuthorization.get(ApiEnum.SalesApi),
    }).pipe(map((data) => data));
  }

  SaveUpdateTasaCambio(data) {
    return this.httpClient.post(`${environment.api.SalesApi.url}/PedidoVenta/LG_SaveUpdateTasaCambio`, data, {
      headers: this.headerBasicAuthorization.get(ApiEnum.SalesApi)
    }).pipe(map(data => data));
  }
}
