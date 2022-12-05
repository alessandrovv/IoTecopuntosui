import { Injectable, OnDestroy, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { exhaustMap, map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ApiEnum } from 'src/app/Shared/enums/api.enum';
import { HeaderBasicAuthorizationService } from 'src/app/Shared/services/header-basic-authorization.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PermisoService {

  constructor(
    private httpClient: HttpClient,
    private headerBasicAuthorization: HeaderBasicAuthorizationService,
  ) {
  }

  // public GetUsuarios(Activo) {
  //   return this.httpClient.get(`${environment.api.WS_IT.url}/Usuario/IT_GetUsuarios?prmintActivo=${Activo}`,{
	// 			headers: this.headerBasicAuthorization.get(ApiEnum.WS_IT)
	// 	}).pipe( map( data => data ));
  // }

  public obtenerNavegacionPorRol(Rol: number) {
    return this.httpClient.get(`${environment.api.WS_IT.url}/Permiso/IT_ObtenerNavegacionPorRol?Rol=${Rol}`,
      { headers: this.headerBasicAuthorization.get(ApiEnum.WS_IT) })
      .pipe(map(response => response));
  }

  // public guardarPermiso(Rol: number) {
  //   return this.httpClient.get(`${environment.api.WS_IT.url}/Permiso/IT_ObtenerNavegacionPorRol?Rol=${Rol}`,
  //     { headers: this.headerBasicAuthorization.get(ApiEnum.WS_IT) })
  //     .pipe(map(response => response));
  // }

  public guardarPermiso(Permiso: number, Opcion: number, Vista: number, Accion: number, Rol: number) {
    return this.httpClient.post(`${environment.api.WS_IT.url}/Permiso/Guardar`, {
      Permiso: Permiso,
      Opcion: Opcion,
      Vista: Vista,
      Accion: Accion,
      Rol: Rol,
    },
      { headers: this.headerBasicAuthorization.get(ApiEnum.WS_IT) })
      .pipe(map(response => response[0]));
  }


  
 
}
