import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { InlineSVGModule } from 'ng-inline-svg';
// import { CustomersComponent } from './customers/customers.component';
// import { ProductsComponent } from './products/products.component';
// import { CRUDTableModule } from '../../_metronic/shared/crud-table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDatepickerModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';


import { MastersRoutingModule } from './masters-routing.module';
import { MastersComponent } from './masters.component';
import { CRUDTableModule } from '../../../_metronic/shared/crud-table/crud-table.module';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { NgSelectModule } from '@ng-select/ng-select';
import { EsquemaComisionesComponent } from './esquema-comisiones/esquema-comisiones.component';
import { SaveUpdateEsquemaComisionesModalComponent } from './esquema-comisiones/save-update-esquema-comisiones-modal/save-update-esquema-comisiones-modal.component';
import { PlanContratoComponent } from './plan-contrato/plan-contrato.component';
import { SaveUpdatePlanContratoModalComponent } from './plan-contrato/save-update-plan-contrato-modal/save-update-plan-contrato-modal.component';
import { TasaCambioComponent } from './tasa-cambio/tasa-cambio.component';
import { SaveUpdateTasaCambioComponent } from './tasa-cambio/save-update-tasa-cambio/save-update-tasa-cambio.component';
import { BancoComponent } from './banco/banco.component';
import { SaveUpdateBancoComponent } from './banco/save-update-banco/save-update-banco.component';

@NgModule({
  declarations: [
    // CustomersComponent,
    // ProductsComponent,
    MastersComponent,
		EsquemaComisionesComponent,
		SaveUpdateEsquemaComisionesModalComponent,
		PlanContratoComponent,
		SaveUpdatePlanContratoModalComponent,
		TasaCambioComponent,
		SaveUpdateTasaCambioComponent,
		BancoComponent,
		SaveUpdateBancoComponent,
    // DeleteCustomerModalComponent,
    // DeleteCustomersModalComponent,
    // FetchCustomersModalComponent,
    // UpdateCustomersStatusModalComponent,
    // EditCustomerModalComponent,
    // DeleteProductModalComponent,
    // DeleteProductsModalComponent,
    // UpdateProductsStatusModalComponent,
    // FetchProductsModalComponent,
    // ProductEditComponent,
    // RemarksComponent,
    // SpecificationsComponent,
    // DeleteRemarkModalComponent,
    // DeleteRemarksModalComponent,
    // FetchRemarksModalComponent,
    // DeleteSpecModalComponent,
    // DeleteSpecsModalComponent,
    // FetchSpecsModalComponent,
    // EditRemarkModalComponent,
    // EditSpecModalComponent,
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
		SaveUpdateEsquemaComisionesModalComponent,
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
export class MastersModule {}
