import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MastersRoutingModule } from './masters-routing.module';
import { MastersComponent } from './masters.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { NgbModalModule, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { InlineSVGModule } from 'ng-inline-svg';
import { CRUDTableModule } from 'src/app/_metronic/shared/crud-table';
import { CaracteristicasVehiculoComponent } from './caracteristicas-vehiculo/caracteristicas-vehiculo.component';
import { SaveUpdateCaracteristicasVehiculoComponent } from './caracteristicas-vehiculo/save-update-caracteristicas-vehiculo/save-update-caracteristicas-vehiculo.component';
import { PuntosTransporteComponent } from './puntos-transporte/puntos-transporte.component';
import { SaveUpdatePuntosTransporteComponent } from './puntos-transporte/save-update-puntos-transporte/save-update-puntos-transporte.component';
import { RutaComponent } from './ruta/ruta.component';
import { SaveUpdateRutaComponent } from './ruta/save-update-ruta/save-update-ruta.component';
import { TipoVehiculoComponent } from './tipo-vehiculo/tipo-vehiculo.component';
import { SaveUpdateTipovehiculoComponent } from './tipo-vehiculo/save-update-tipovehiculo/save-update-tipovehiculo.component';
//import { UpdateTipovehiculoComponent } from './tipo-vehiculo/update-tipovehiculo/update-tipovehiculo.component';
import { EliminarTipovehiculoComponent } from './tipo-vehiculo/eliminar-tipovehiculo/eliminar-tipovehiculo.component';
import { VehiculosComponent } from './vehiculos/vehiculos.component';
import { SaveUpdateVehiculoComponent } from './vehiculos/save-update-vehiculo/save-update-vehiculo.component';
import { SaveUpdateNeumaticosModalComponent } from './vehiculos/save-update-neumaticos-modal/save-update-neumaticos-modal.component';
import { SaveUpdateDocumentosModalComponent } from './vehiculos/save-update-documentos-modal/save-update-documentos-modal.component';
import { TarifaComponent } from './tarifa/tarifa.component';
import { SaveUpdateTarifaComponent } from './tarifa/save-update-tarifa/save-update-tarifa.component';


@NgModule({
  declarations: [
    MastersComponent,
    CaracteristicasVehiculoComponent,
    SaveUpdateCaracteristicasVehiculoComponent,
    PuntosTransporteComponent,
    SaveUpdatePuntosTransporteComponent,
    RutaComponent,
    SaveUpdateRutaComponent,
    TipoVehiculoComponent,
    SaveUpdateTipovehiculoComponent,
    //UpdateTipovehiculoComponent,
    EliminarTipovehiculoComponent,
    VehiculosComponent,
    SaveUpdateVehiculoComponent,
    SaveUpdateNeumaticosModalComponent,
    SaveUpdateDocumentosModalComponent,
    TarifaComponent,
    SaveUpdateTarifaComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    MastersRoutingModule,
    FormsModule,
    NgSelectModule,
    ReactiveFormsModule,
    InlineSVGModule,
    CRUDTableModule,
    NgbModalModule,
    NgbDatepickerModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatIconModule,
  ],
  entryComponents: [
    // DeleteCustomersModalComponent,
    // UpdateCustomersStatusModalComponent,
    // FetchCustomersModalComponent,
    // EditCustomerModalComponent,
    // DeleteProductModalComponent,
    // DeleteProductsModalComponent,
    // UpdateProductsStatusModalComponent,
    // FetchProductsModalComponent,
    // DeleteRemarkModalComponent,
    // DeleteRemarksModalComponent,
    // FetchRemarksModalComponent,
    // DeleteSpecModalComponent,
    // DeleteSpecsModalComponent,
    // FetchSpecsModalComponent,
    // EditRemarkModalComponent,
    // EditSpecModalComponent
  ]
})
export class MastersModule { }


