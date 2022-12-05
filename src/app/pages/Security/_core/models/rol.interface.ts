import { BaseModel } from '../../../../_metronic/shared/crud-table/models/base.model';

export interface Rol extends BaseModel {
    idRol: number;
    descripcion: string;
    nombre: string;
    activo: any  
}
