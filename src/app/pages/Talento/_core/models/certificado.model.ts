import { BaseModel } from '../../../../_metronic/shared/crud-table/models/base.model';

export interface Certificado extends BaseModel {
  idCertificado: number;
  idEmpresa: number;
  idClienteExterno: number;
  nombreEmpresa: string;
  nombreCliente: string;
  codigo: string;
  nombreCertificado: string;
  activo: any  
}
