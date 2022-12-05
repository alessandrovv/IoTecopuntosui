import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { InlineSVGModule } from 'ng-inline-svg';
// import { CustomersComponent } from './customers/customers.component';
// import { ProductsComponent } from './products/products.component';
// import { CRUDTableModule } from '../../_metronic/shared/crud-table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDatepickerModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

import { CRUDTableModule } from '../../../_metronic/shared/crud-table/crud-table.module';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { NgSelectModule } from '@ng-select/ng-select';
import { ProcessRoutingModule } from './process-routing.module';
import { ProcessComponent } from './process.component';
import { ComisionVentasComponent } from './comision-ventas/comision-ventas.component';

@NgModule({
  declarations: [
    // CustomersComponent,
    // ProductsComponent,
    ProcessComponent,
		ComisionVentasComponent,
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
    ProcessRoutingModule,
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
  ]
})
export class ProcessModule {}
