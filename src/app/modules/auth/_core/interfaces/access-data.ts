
export interface AccessData {
	empresa: string; 
    IdSociedad: string;
	unidadOrganizativa: string;
	DesUnidadOrganizativa: string;
	CentroCosto: string;
	desPosicion: string;
	Login: string;
	IdUsuario: Int16Array;
	tipoUsuario: string;
	Nombre: string;
	email: string;
	trabajador: string;
	fechaIngreso: string;
	tipoClave: string;
	diasCambioClave: Int16Array;
	transcurrido: Int16Array;
	accesoOpcion: boolean;
	accesoSistema: boolean;
	autenticado: boolean;
	configuracion: Int16Array;

	rol: string;
	dRol: string;
	accessToken: string;
	refreshToken: string;
	roles: any;

	cookie: string;
	Token: string;
}
