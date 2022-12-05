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


@NgModule({
  declarations: [
    // CustomersComponent,
    // ProductsComponent,
    MastersComponent,
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
