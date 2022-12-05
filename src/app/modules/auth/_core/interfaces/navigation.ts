export interface Navigation {
    Codigo: string;
    Icono: string;
    Nivel: number;
    Nombre: string;
    Orden: number;
    SubNavegacion: Array<Navigation>;
    Tipo: number;
    TipoSubNavegacion: number;
    Url: string;
    VisibleNavegacion: boolean;
    Opcion: number;
    Vista: number;
    Accion: number;
    Permiso: number;
    Checked: boolean;
}