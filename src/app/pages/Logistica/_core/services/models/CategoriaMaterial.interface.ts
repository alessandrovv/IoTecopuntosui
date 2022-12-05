import { BaseModel } from '../../../../../_metronic/shared/crud-table/models/base.model';
export interface CategoriaMaterial extends BaseModel {
    idCategoriaMaterial: number;
    descripcion: string;
    nombre: string;
    activo: any  
}
