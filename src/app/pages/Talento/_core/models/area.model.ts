import { BaseModel } from '../../../../_metronic/shared/crud-table/models/base.model';

export interface Area extends BaseModel {
  idArea: number;
  idEmpresa: number;
  nombreEmpresa: string;
  nombreArea: string;
  descripcion: string;
  activo: any;
}
