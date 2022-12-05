import { BaseModel } from '../../../../_metronic/shared/crud-table/models/base.model';
export interface TipoVehiculo extends BaseModel {
    idTipoVehiculo: number;
    descripcion: string;
    nombre: string;
    activo: any  
}
export interface GetCaracteristicaVehiculo extends BaseModel {
    idCaracteristicaVehiculo: number;
    descripcion: string;
    nombre: string;
    activo: any  
}
