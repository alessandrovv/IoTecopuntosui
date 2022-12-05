import { BaseModel } from '../../../../_metronic/shared/crud-table/models/base.model';

export interface PlanContrato extends BaseModel {
  idPlanContrato: number;
  idEmpresa: number;  
  nombreEmpresa: string;  
  nombre: string;
  descripcion: string;
  idClienteExterno: number;
  nombreCliente: string;
  idMonto: string;
  monto: number;
  activo: any  
}
