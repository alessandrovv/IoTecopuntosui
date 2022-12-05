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
export class UsuarioService {

  constructor(
    private httpClient: HttpClient,
    private headerBasicAuthorization: HeaderBasicAuthorizationService,
  ) {
  }

  public GetUsuarios(Activo) {
    return this.httpClient.get(`${environment.api.WS_IT.url}/Usuario/IT_GetUsuarios?prmintActivo=${Activo}`,{
				headers: this.headerBasicAuthorization.get(ApiEnum.WS_IT)
		}).pipe( map( data => data ));
  }

  
  public SaveUpdateUsuario(data: any) {
    return this.httpClient.post(`${environment.api.WS_IT.url}/Usuario/IT_SaveUpdateUsuario`,
    data,
    { headers: this.headerBasicAuthorization.get(ApiEnum.WS_IT) }
    ).pipe( map( data => data ));
  }

  public EnableDisableUsuario(Usuario: number, Estado: any) {
    return this.httpClient.post(`${environment.api.WS_IT.url}/Usuario/IT_EnableDisableUsuario`,
      { prmintIdUsuario: Usuario, prmbitActivo: Estado },
      { headers: this.headerBasicAuthorization.get(ApiEnum.WS_IT) }
      ).pipe( map( data => data ));
  }

  public DeleteUsuario(Usuario: number) {
    return this.httpClient.post(`${environment.api.WS_IT.url}/Usuario/IT_DeleteUsuario`,
      {prmintIdUsuario: Usuario},
      { headers: this.headerBasicAuthorization.get(ApiEnum.WS_IT) }
      ).pipe( map( data => data ));
  }

  public ResetPasswordUsuario(Usuario: number, DocIdentidad: string) {
    return this.httpClient.post(`${environment.api.WS_IT.url}/Usuario/IT_ResetPasswordUsuario`,
      { prmintIdUsuario: Usuario, prmstrDocumentoIdentidad: DocIdentidad },
      { headers: this.headerBasicAuthorization.get(ApiEnum.WS_IT) }
      ).pipe( map( data => data ));
  }

  public GetListarRoles() {
    return this.httpClient.get(`${environment.api.WS_IT.url}/Permiso/IT_GetListarRoles`,{
				headers: this.headerBasicAuthorization.get(ApiEnum.WS_IT)
		}).pipe( map( data => data ));
  }

  // Control inicio y cierre de sesion
  public RegistrarCerrarSesion(){
    return this.httpClient.get(`${environment.api.WS_IT.url}/Seguridad/SC_RegistrarCerrarSesion`,
      { headers: this.headerBasicAuthorization.get(ApiEnum.WS_IT) }
      ).pipe( map( data => data ));
  }

  public GetUsuariosConectados(){
    return this.httpClient.get(`${environment.api.WS_IT.url}/Seguridad/SC_GetUsuariosConectados`,
      { headers: this.headerBasicAuthorization.get(ApiEnum.WS_IT) }
      ).pipe( map( data => data ));
  }
  
  public GetHistorialConexiones(Trabajador: number){
    return this.httpClient.get(`${environment.api.WS_IT.url}/Seguridad/SC_GetHistorialConexiones?prmintIdTrabajador=${Trabajador}`,
      { headers: this.headerBasicAuthorization.get(ApiEnum.WS_IT) }
      ).pipe( map( data => data ));
  }
  
  public ForzarCerrarSesionUsuario(Usuario: number,Trabajador: number){
    return this.httpClient.get(`${environment.api.WS_IT.url}/Seguridad/SC_ForzarCerrarSesionUsuario?prmintIdUsuario=${Usuario}&prmintIdTrabajador=${Trabajador}`,
      { headers: this.headerBasicAuthorization.get(ApiEnum.WS_IT) }
      ).pipe( map( data => data ));
  }
  
  public LimpiarRestricciones(){
    return this.httpClient.get(`${environment.api.WS_IT.url}/Seguridad/SC_LimpiarRestricciones`,
      { headers: this.headerBasicAuthorization.get(ApiEnum.WS_IT) }
      ).pipe( map( data => data ));
  }

  //Asignar Usuario y Roles
  public GetEmpresasUsuario(Usuario: number){
    return this.httpClient.get(`${environment.api.WS_IT.url}/Usuario/IT_GetEmpresasUsuario?prmintidUsuario=${Usuario}`,
      { headers: this.headerBasicAuthorization.get(ApiEnum.WS_IT) }
      ).pipe( map( data => data ));
  }
  public GetRolesUsuario(Usuario: number){
    return this.httpClient.get(`${environment.api.WS_IT.url}/Usuario/IT_GetRolesUsuario?prmintidUsuario=${Usuario}`,
      { headers: this.headerBasicAuthorization.get(ApiEnum.WS_IT) }
      ).pipe( map( data => data ));
  }

  SaveUpdateRoleUsuario(Usuario: number, Rol: number, Estado: any) {
    return this.httpClient.post(`${environment.api.WS_IT.url}/Usuario/IT_SaveUpdateRolUsuario`, { IdUsuario: Usuario,IdRol: Rol,  Activo: Estado }, {
        headers: this.headerBasicAuthorization.get(ApiEnum.WS_IT)
    }).pipe( map( data => data ));
  }
  SaveUpdateEmpresaUsuario(Usuario: number,Empresa: number, Estado: any) {
    return this.httpClient.post(`${environment.api.WS_IT.url}/Usuario/IT_SaveUpdateEmpresaUsuario`, { IdUsuario: Usuario,IdEmpresa: Empresa,  Activoo: Estado }, {
        headers: this.headerBasicAuthorization.get(ApiEnum.WS_IT)
    }).pipe( map( data => data ));
  }
  SaveUpdateEmpresaRolUsuario(data: any) {
    return this.httpClient.post(`${environment.api.WS_IT.url}/Usuario/IT_SaveUpdateEmpresaRolUsuario`, data, {
        headers: this.headerBasicAuthorization.get(ApiEnum.WS_IT)
    }).pipe( map( data => data ));
  }
}
